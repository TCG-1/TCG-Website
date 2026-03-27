export type BlogSectionType = "bullet_list" | "heading" | "paragraph" | "quote";

export type BlogSectionShape = {
  body: string;
  section_type: string;
  sort_order: number;
};

export type BlogRenderBlock = {
  body: string;
  items: string[];
  type: BlogSectionType;
};

function normalizeLineBreaks(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function normalizeBlock(block: string) {
  return block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function serializeRichTextToSections(body: string) {
  return normalizeLineBreaks(body)
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((block, index) => {
      const lines = normalizeBlock(block);
      const firstLine = lines[0] ?? "";

      if (/^#{2,}\s+/.test(firstLine)) {
        return {
          body: firstLine.replace(/^#{2,}\s+/, "").trim(),
          section_type: "heading" as const,
          sort_order: index,
        };
      }

      if (lines.length > 0 && lines.every((line) => /^>\s+/.test(line))) {
        return {
          body: lines.map((line) => line.replace(/^>\s+/, "").trim()).join("\n"),
          section_type: "quote" as const,
          sort_order: index,
        };
      }

      if (lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line))) {
        return {
          body: lines.map((line) => line.replace(/^[-*]\s+/, "").trim()).join("\n"),
          section_type: "bullet_list" as const,
          sort_order: index,
        };
      }

      return {
        body: lines.join("\n"),
        section_type: "paragraph" as const,
        sort_order: index,
      };
    });
}

export function serializeSectionsToRichText(sections: BlogSectionShape[]) {
  return sections
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((section) => {
      const content = section.body.trim();

      switch (section.section_type) {
        case "heading":
          return `## ${content}`;
        case "quote":
          return content
            .split("\n")
            .map((line) => `> ${line.trim()}`)
            .join("\n");
        case "bullet_list":
          return content
            .split("\n")
            .map((line) => `- ${line.trim()}`)
            .join("\n");
        default:
          return content;
      }
    })
    .filter(Boolean)
    .join("\n\n");
}

export function normalizeBlogRenderBlocks(sections: BlogSectionShape[]): BlogRenderBlock[] {
  return sections
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((section) => {
      const type = (["heading", "paragraph", "quote", "bullet_list"].includes(section.section_type)
        ? section.section_type
        : "paragraph") as BlogSectionType;
      const body = section.body.trim();
      const items =
        type === "bullet_list"
          ? body
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
          : [];

      return {
        body,
        items,
        type,
      };
    })
    .filter((section) => section.body.length > 0);
}
