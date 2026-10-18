import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "a",
  "blockquote",
  "br",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "img",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
];

const allowedAttributes = {
  "*": ["style"],
  a: ["href", "rel", "target"],
  img: ["alt", "src"],
};

const allowedStyles = {
  "*": {
    "font-size": [
      /^\d+(?:\.\d+)?(?:px|rem|em|%)$/i,
    ],
    color: [
      /^(?:#[\da-f]{3,8}|[a-z]{1,24}|(?:rgb|hsl)a?\([\d.% ,/-]+\))$/i,
    ],
  },
};

export function sanitizeBlogHtml(
  html: string,
): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedStyles,
    allowedSchemes: [
      "http",
      "https",
      "mailto",
      "tel",
    ],
    allowedSchemesByTag: {
      img: ["http", "https"],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attributes) => ({
        tagName,
        attribs:
          attributes.target === "_blank"
            ? {
                ...attributes,
                rel: "noopener noreferrer",
              }
            : attributes,
      }),
    },
  });
}

export function blogHtmlToPlainText(
  html: string,
): string {
  const sanitizedHtml = sanitizeBlogHtml(html);

  const htmlWithSpacing = sanitizedHtml
    .replace(/<br\s*\/?>/gi, " ")
    .replace(
      /<\/(?:blockquote|h[1-4]|li|ol|p|ul)>/gi,
      " ",
    );

  const textParts: string[] = [];

  sanitizeHtml(htmlWithSpacing, {
    allowedTags: [],
    allowedAttributes: {},
    textFilter: (text) => {
      textParts.push(text);
      return "";
    },
  });

  return textParts
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}
