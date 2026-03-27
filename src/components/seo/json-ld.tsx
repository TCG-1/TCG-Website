type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

function stringifyJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: JsonLdProps) {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => (
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: stringifyJsonLd(item) }}
          key={`${item["@type"] ?? "jsonld"}-${index}`}
          type="application/ld+json"
        />
      ))}
    </>
  );
}
