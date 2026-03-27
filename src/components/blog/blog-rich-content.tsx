/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";

import type { BlogRenderBlock } from "@/lib/blog-rich-text";

function renderInlineContent(value: string, keyPrefix: string): ReactNode[] {
  const lines = value.split("\n");

  return lines.flatMap((line, lineIndex) => {
    const nodes: ReactNode[] = [];
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = linkPattern.exec(line)) !== null) {
      const [fullMatch, label, href] = match;
      const start = match.index;

      if (start > lastIndex) {
        nodes.push(line.slice(lastIndex, start));
      }

      const isExternal = /^https?:\/\//i.test(href);

      nodes.push(
        <a
          key={`${keyPrefix}-link-${lineIndex}-${start}`}
          href={href}
          className="font-medium text-[#8a0917] underline decoration-[#FDD835] decoration-2 underline-offset-4 transition hover:text-[#690711]"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
        >
          {label}
        </a>,
      );

      lastIndex = start + fullMatch.length;
    }

    if (lastIndex < line.length) {
      nodes.push(line.slice(lastIndex));
    }

    if (lineIndex < lines.length - 1) {
      nodes.push(<br key={`${keyPrefix}-break-${lineIndex}`} />);
    }

    return nodes;
  });
}

export function BlogRichContent({ blocks }: { blocks: BlogRenderBlock[] }) {
  return (
    <div className="space-y-9">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const headingId =
            block.body
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "") || `section-${index + 1}`;

          return (
            <h2
              id={headingId}
              key={`${block.type}-${index}-${block.body}`}
              className="scroll-mt-28 font-sans text-[clamp(1.9rem,3.2vw,2.5rem)] font-medium tracking-[-0.03em] text-[#8a0917]"
            >
              {block.body}
            </h2>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={`${block.type}-${index}-${block.body}`}
              className="border-l-4 border-[#FDD835] bg-[#fff8e6] px-6 py-5 text-xl font-light italic leading-9 text-slate-700"
            >
              {renderInlineContent(block.body, `quote-${index}`)}
            </blockquote>
          );
        }

        if (block.type === "image" && block.image?.src) {
          return (
            <figure key={`${block.type}-${index}-${block.image.src}`} className="space-y-4 overflow-hidden rounded-3xl bg-slate-50 p-4">
              <img
                src={block.image.src}
                alt={block.image.alt || "Blog article image"}
                className="w-full rounded-3xl object-cover shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              />
              {block.image.caption ? (
                <figcaption className="px-2 text-sm italic leading-6 text-slate-500">
                  {renderInlineContent(block.image.caption, `caption-${index}`)}
                </figcaption>
              ) : null}
            </figure>
          );
        }

        if (block.type === "bullet_list") {
          return (
            <ul key={`${block.type}-${index}-${block.body}`} className="space-y-4 text-lg leading-8 text-slate-700">
              {block.items.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FDD835]" />
                  <span>{renderInlineContent(item, `bullet-${index}-${item}`)}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={`${block.type}-${index}-${block.body}`}
            className="whitespace-pre-line text-lg leading-8 text-slate-700"
          >
            {renderInlineContent(block.body, `paragraph-${index}`)}
          </p>
        );
      })}
    </div>
  );
}
