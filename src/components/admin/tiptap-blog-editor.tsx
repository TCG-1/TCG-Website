"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Markdown → HTML (for loading stored content into Tiptap)          */
/* ------------------------------------------------------------------ */

/** Convert inline markdown (bold, links) to HTML within a text string */
function inlineToHtml(text: string): string {
  // Bold **text**
  let result = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Links [label](href)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  );
  return result;
}

export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) return "<p></p>";

  const blocks = markdown
    .replace(/\r\n/g, "\n")
    .trim()
    .split(/\n{2,}/);

  const htmlParts: string[] = [];

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const first = lines[0] ?? "";

    // Image: ![alt](src) optionally followed by :: caption
    const imgMatch = first.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imgMatch?.[2]) {
      htmlParts.push(`<img src="${imgMatch[2]}" alt="${imgMatch[1] ?? ""}" />`);
      continue;
    }

    // Headings ## through #####
    const headingMatch = first.match(/^(#{2,5})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length; // 2–5
      htmlParts.push(`<h${level}>${inlineToHtml(headingMatch[2])}</h${level}>`);
      continue;
    }

    // Blockquote (all lines start with >)
    if (lines.every((l) => /^>\s*/.test(l))) {
      const inner = lines.map((l) => l.replace(/^>\s*/, "").trim()).join("\n");
      htmlParts.push(`<blockquote><p>${inlineToHtml(inner)}</p></blockquote>`);
      continue;
    }

    // Bullet list (all lines start with - or *)
    if (lines.every((l) => /^[-*]\s+/.test(l))) {
      const items = lines
        .map((l) => `<li><p>${inlineToHtml(l.replace(/^[-*]\s+/, ""))}</p></li>`)
        .join("");
      htmlParts.push(`<ul>${items}</ul>`);
      continue;
    }

    // Default: paragraph (may be multi-line within one block)
    const combined = lines.map((l) => inlineToHtml(l)).join("<br />");
    htmlParts.push(`<p>${combined}</p>`);
  }

  return htmlParts.join("") || "<p></p>";
}

/* ------------------------------------------------------------------ */
/*  HTML → Markdown (for persisting Tiptap content)                   */
/* ------------------------------------------------------------------ */

function processInlineNodes(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? "";
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const childText = Array.from(el.childNodes).map(processInlineNodes).join("");

  switch (tag) {
    case "strong":
    case "b":
      return `**${childText}**`;
    case "em":
    case "i":
      return `*${childText}*`;
    case "u":
      return childText; // underline has no markdown — keep text
    case "a": {
      const href = el.getAttribute("href") ?? "";
      return `[${childText}](${href})`;
    }
    case "br":
      return "\n";
    case "code":
      return `\`${childText}\``;
    default:
      return childText;
  }
}

function processBlockNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").trim();
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();

  switch (tag) {
    case "h2":
      return `## ${processInlineContent(el)}`;
    case "h3":
      return `### ${processInlineContent(el)}`;
    case "h4":
      return `#### ${processInlineContent(el)}`;
    case "h5":
      return `##### ${processInlineContent(el)}`;
    case "blockquote": {
      const inner = Array.from(el.childNodes)
        .map((child) => {
          const childEl = child as HTMLElement;
          if (childEl.tagName?.toLowerCase() === "p") {
            return processInlineContent(childEl);
          }
          return processInlineNodes(child);
        })
        .join("\n")
        .trim();
      return inner
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    }
    case "ul": {
      const items = Array.from(el.querySelectorAll(":scope > li"));
      return items
        .map((li) => {
          const p = li.querySelector("p");
          const text = p ? processInlineContent(p) : processInlineContent(li as HTMLElement);
          return `- ${text}`;
        })
        .join("\n");
    }
    case "ol": {
      const items = Array.from(el.querySelectorAll(":scope > li"));
      return items
        .map((li, i) => {
          const p = li.querySelector("p");
          const text = p ? processInlineContent(p) : processInlineContent(li as HTMLElement);
          return `${i + 1}. ${text}`;
        })
        .join("\n");
    }
    case "img": {
      const src = el.getAttribute("src") ?? "";
      const alt = el.getAttribute("alt") ?? "";
      return `![${alt}](${src})`;
    }
    case "figure": {
      const img = el.querySelector("img");
      const figcaption = el.querySelector("figcaption");
      if (img) {
        const src = img.getAttribute("src") ?? "";
        const alt = img.getAttribute("alt") ?? "";
        const caption = figcaption?.textContent?.trim() ?? "";
        return [`![${alt}](${src})`, caption ? `:: ${caption}` : ""]
          .filter(Boolean)
          .join("\n");
      }
      return "";
    }
    case "p":
      return processInlineContent(el);
    case "hr":
      return "---";
    default:
      // Recurse for wrapper divs, etc.
      return Array.from(el.childNodes)
        .map(processBlockNode)
        .filter(Boolean)
        .join("\n\n");
  }
}

function processInlineContent(el: HTMLElement): string {
  return Array.from(el.childNodes).map(processInlineNodes).join("");
}

export function htmlToMarkdown(html: string): string {
  if (typeof window === "undefined") return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return "";

  const blocks: string[] = [];
  for (const child of Array.from(root.childNodes)) {
    const text = processBlockNode(child).trim();
    if (text) blocks.push(text);
  }

  return blocks.join("\n\n");
}

/* ------------------------------------------------------------------ */
/*  Toolbar component                                                  */
/* ------------------------------------------------------------------ */

type ToolbarProps = {
  editor: Editor | null;
};

function ToolbarDivider() {
  return <div className="mx-0.5 h-6 w-px bg-slate-200" />;
}

function ToolbarButton({
  active,
  children,
  disabled,
  onClick,
  title,
}: {
  active?: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm font-semibold transition ${
        active
          ? "bg-[#8a0917] text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      } disabled:cursor-not-allowed disabled:opacity-30`}
    >
      {children}
    </button>
  );
}

function EditorToolbarMenu({ editor }: ToolbarProps) {
  if (!editor) return null;

  function insertImage() {
    const url = window.prompt("Image URL", "https://");
    if (!url) return;
    const alt = window.prompt("Alt text (describe the image)", "") ?? "";
    editor!.chain().focus().setImage({ src: url, alt }).run();
  }

  function setLink() {
    if (editor!.isActive("link")) {
      editor!.chain().focus().unsetLink().run();
      return;
    }
    const href = window.prompt("Link URL", "https://");
    if (!href) return;
    editor!.chain().focus().extendMarkRange("link").setLink({ href }).run();
  }

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-black/5 bg-slate-50 px-3 py-2">
      {/* Text formatting */}
      <ToolbarButton
        title="Bold (Ctrl+B)"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <span className="font-black">B</span>
      </ToolbarButton>
      <ToolbarButton
        title="Italic (Ctrl+I)"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        title="Underline (Ctrl+U)"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton
        title="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        title="Heading 4"
        active={editor.isActive("heading", { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        H4
      </ToolbarButton>
      <ToolbarButton
        title="Heading 5"
        active={editor.isActive("heading", { level: 5 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      >
        H5
      </ToolbarButton>

      <ToolbarDivider />

      {/* Block types */}
      <ToolbarButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="3" cy="4" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="3" cy="8" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="3" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <line x1="7" y1="4" x2="14" y2="4" />
          <line x1="7" y1="8" x2="14" y2="8" />
          <line x1="7" y1="12" x2="14" y2="12" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        title="Ordered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <text x="1" y="6" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">1</text>
          <text x="1" y="10.5" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">2</text>
          <text x="1" y="15" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">3</text>
          <line x1="7" y1="4" x2="14" y2="4" />
          <line x1="7" y1="8" x2="14" y2="8" />
          <line x1="7" y1="12" x2="14" y2="12" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        title="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="3" x2="3" y2="13" />
          <line x1="7" y1="5" x2="14" y2="5" />
          <line x1="7" y1="8" x2="14" y2="8" />
          <line x1="7" y1="11" x2="11" y2="11" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Link & Image */}
      <ToolbarButton
        title={editor.isActive("link") ? "Remove link" : "Insert link"}
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6.5 9.5a3.5 3.5 0 0 0 5 0l2-2a3.5 3.5 0 0 0-5-5l-1 1" />
          <path d="M9.5 6.5a3.5 3.5 0 0 0-5 0l-2 2a3.5 3.5 0 0 0 5 5l1-1" />
        </svg>
      </ToolbarButton>
      <ToolbarButton title="Insert image" onClick={insertImage}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1.5" y="2.5" width="13" height="11" rx="2" />
          <circle cx="5" cy="6" r="1.5" />
          <path d="M14.5 10.5l-3-3-5 5" />
          <path d="M8.5 13.5l-3-3-4 4" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Horizontal rule */}
      <ToolbarButton
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="1" y1="8" x2="15" y2="8" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Undo / Redo */}
      <ToolbarButton
        title="Undo (Ctrl+Z)"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h7a4 4 0 0 1 0 8H8" />
          <path d="M6 3L3 6l3 3" />
        </svg>
      </ToolbarButton>
      <ToolbarButton
        title="Redo (Ctrl+Shift+Z)"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 6H6a4 4 0 0 0 0 8h2" />
          <path d="M10 3l3 3-3 3" />
        </svg>
      </ToolbarButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tiptap editor styles (injected via className on EditorContent)     */
/* ------------------------------------------------------------------ */

const EDITOR_CLASSES = [
  /* Base */
  "prose prose-slate max-w-none",
  /* Focus ring */
  "focus:outline-none",
  /* Headings */
  "[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#8a0917] [&_h2]:mt-6 [&_h2]:mb-3",
  "[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#8a0917] [&_h3]:mt-5 [&_h3]:mb-2",
  "[&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#8a0917] [&_h4]:mt-4 [&_h4]:mb-2",
  "[&_h5]:text-base [&_h5]:font-semibold [&_h5]:text-[#8a0917] [&_h5]:mt-3 [&_h5]:mb-1",
  /* Paragraphs */
  "[&_p]:text-base [&_p]:leading-7 [&_p]:text-slate-700 [&_p]:my-2",
  /* Links */
  "[&_a]:text-[#8a0917] [&_a]:underline [&_a]:decoration-[#FDD835] [&_a]:decoration-2 [&_a]:underline-offset-4",
  /* Blockquote */
  "[&_blockquote]:border-l-4 [&_blockquote]:border-[#8a0917] [&_blockquote]:bg-slate-50 [&_blockquote]:pl-5 [&_blockquote]:py-3 [&_blockquote]:pr-4 [&_blockquote]:rounded-r-xl [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-slate-600",
  /* Lists */
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:text-slate-700",
  "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:text-slate-700",
  "[&_li]:my-1 [&_li]:leading-7",
  /* Images */
  "[&_img]:rounded-2xl [&_img]:my-4 [&_img]:max-w-full [&_img]:shadow-md",
  /* HR */
  "[&_hr]:my-6 [&_hr]:border-slate-200",
  /* Strong */
  "[&_strong]:font-semibold [&_strong]:text-slate-900",
  /* Code */
  "[&_code]:bg-slate-100 [&_code]:text-[#8a0917] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-sm",
  /* Placeholder */
  "[&_.is-editor-empty:first-child::before]:text-slate-400 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:pointer-events-none",
].join(" ");

/* ------------------------------------------------------------------ */
/*  Main editor component                                              */
/* ------------------------------------------------------------------ */

type TiptapBlogEditorProps = {
  /** Initial markdown content (loaded once on mount / when key changes) */
  initialMarkdown: string;
  /** Called on every content change with the latest markdown string */
  onChange: (markdown: string) => void;
  /** Optional placeholder text */
  placeholder?: string;
};

export function TiptapBlogEditor({ initialMarkdown, onChange, placeholder }: TiptapBlogEditorProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4, 5] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noreferrer" },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Start writing your article here...",
      }),
      Underline,
    ],
    content: markdownToHtml(initialMarkdown),
    onUpdate({ editor: instance }) {
      const html = instance.getHTML();
      const md = htmlToMarkdown(html);
      onChangeRef.current(md);
    },
    editorProps: {
      attributes: {
        class: `min-h-[320px] rounded-2xl border border-black/5 bg-white px-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#8a0917]/20 transition ${EDITOR_CLASSES}`,
      },
    },
    immediatelyRender: false,
  });

  // Sync external content changes only when initialMarkdown identity changes (e.g. opening a different post)
  const prevMarkdownRef = useRef(initialMarkdown);
  useEffect(() => {
    if (initialMarkdown !== prevMarkdownRef.current && editor) {
      prevMarkdownRef.current = initialMarkdown;
      editor.commands.setContent(markdownToHtml(initialMarkdown));
    }
  }, [initialMarkdown, editor]);

  const getMarkdown = useCallback(() => {
    if (!editor) return "";
    return htmlToMarkdown(editor.getHTML());
  }, [editor]);

  return (
    <div className="grid gap-3">
      <EditorToolbarMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
