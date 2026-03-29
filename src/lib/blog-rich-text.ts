export type BlogSectionType = "bullet_list" | "heading" | "heading_3" | "heading_4" | "heading_5" | "image" | "paragraph" | "quote";

export type BlogImagePayload = {
  alt: string;
  caption: string;
  src: string;
};

export type BlogSectionShape = {
  body: string;
  section_type: string;
  sort_order: number;
};

export type BlogRenderBlock = {
  body: string;
  image: BlogImagePayload | null;
  items: string[];
  type: BlogSectionType;
};

function getBlockSignature(block: BlogRenderBlock) {
  if (block.type === "image") {
    return `${block.type}|${block.image?.src ?? ""}|${block.image?.alt ?? ""}|${block.image?.caption ?? ""}`;
  }

  if (block.type === "bullet_list") {
    return `${block.type}|${block.items.join("\n")}`;
  }

  return `${block.type}|${block.body}`;
}

function createImagePayload(src: string, alt = "", caption = ""): BlogImagePayload {
  return {
    alt: alt.trim(),
    caption: caption.trim(),
    src: src.trim(),
  };
}

export function parseBlogImagePayload(value: string): BlogImagePayload | null {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  try {
    const parsed = JSON.parse(normalized) as Partial<BlogImagePayload>;
    if (typeof parsed?.src === "string" && parsed.src.trim()) {
      return createImagePayload(parsed.src, parsed.alt ?? "", parsed.caption ?? "");
    }
  } catch {
    // Fall through to legacy string parsing.
  }

  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
  const firstLine = lines[0] ?? "";
  const imageMatch = firstLine.match(/^!\[(.*?)\]\((.*?)\)$/);

  if (imageMatch?.[2]?.trim()) {
    const captionLine = lines.find((line, index) => index > 0 && /^::\s*/.test(line));
    return createImagePayload(imageMatch[2], imageMatch[1] ?? "", captionLine?.replace(/^::\s*/, "") ?? "");
  }

  if (/^(https?:\/\/|\/)/.test(firstLine)) {
    const altLine = lines[1]?.replace(/^alt:\s*/i, "") ?? "";
    const captionLine = lines.find((line, index) => index > 1 && /^caption:\s*/i.test(line));
    return createImagePayload(firstLine, altLine, captionLine?.replace(/^caption:\s*/i, "") ?? "");
  }

  return null;
}

function serializeBlogImagePayload(payload: BlogImagePayload) {
  return JSON.stringify(payload);
}

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

      const imagePayload = parseBlogImagePayload(lines.join("\n"));

      if (imagePayload?.src) {
        return {
          body: serializeBlogImagePayload(imagePayload),
          section_type: "image" as const,
          sort_order: index,
        };
      }

      if (/^#{2,}\s+/.test(firstLine)) {
        const hashCount = firstLine.match(/^#+/)?.[0].length ?? 2;
        const section_type = hashCount === 3 ? "heading_3" : hashCount === 4 ? "heading_4" : hashCount === 5 ? "heading_5" : "heading";
        return {
          body: firstLine.replace(/^#{2,}\s+/, "").trim(),
          section_type: section_type as BlogSectionType,
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
        case "heading_3":
          return `### ${content}`;
        case "heading_4":
          return `#### ${content}`;
        case "heading_5":
          return `##### ${content}`;
        case "image": {
          const image = parseBlogImagePayload(content);

          if (!image?.src) {
            return "";
          }

          return [`![${image.alt} ](${image.src})`.replace(" ](", "]("), image.caption ? `:: ${image.caption}` : ""]
            .filter(Boolean)
            .join("\n");
        }
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
  const normalized = sections
    .slice()
    .sort((left, right) => left.sort_order - right.sort_order)
    .map((section) => {
      const type = (["heading", "heading_3", "heading_4", "heading_5", "paragraph", "quote", "bullet_list", "image"].includes(section.section_type)
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
      const image = type === "image" ? parseBlogImagePayload(body) : null;

      return {
        body,
        image,
        items,
        type,
      };
    })
    .filter((section) => section.type === "image" ? Boolean(section.image?.src) : section.body.length > 0);

  const deduped: BlogRenderBlock[] = [];

  for (const block of normalized) {
    const previous = deduped[deduped.length - 1];

    if (!previous) {
      deduped.push(block);
      continue;
    }

    if (getBlockSignature(previous) === getBlockSignature(block)) {
      continue;
    }

    deduped.push(block);
  }

  return deduped;
}
