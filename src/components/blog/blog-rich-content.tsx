import type { BlogRenderBlock } from "@/lib/blog-rich-text";

export function BlogRichContent({ blocks }: { blocks: BlogRenderBlock[] }) {
  return (
    <div className="space-y-8">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2 key={`${block.type}-${index}-${block.body}`} className="text-2xl font-semibold tracking-tight text-slate-950">
              {block.body}
            </h2>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote
              key={`${block.type}-${index}-${block.body}`}
              className="border-l-4 border-[#8a0917] bg-[#fff7f7] px-6 py-5 text-lg italic leading-8 text-slate-700"
            >
              {block.body}
            </blockquote>
          );
        }

        if (block.type === "bullet_list") {
          return (
            <ul key={`${block.type}-${index}-${block.body}`} className="space-y-3 pl-6 text-lg leading-8 text-slate-700">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={`${block.type}-${index}-${block.body}`}
            className="text-lg leading-8 text-slate-700 whitespace-pre-line"
          >
            {block.body}
          </p>
        );
      })}
    </div>
  );
}
