import DOMPurify from "dompurify";

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

const allowedAttributes = ["alt", "href", "rel", "src", "style", "target"];
let styleHookInstalled = false;

function sanitizeStyleAttribute(value: string): string {
  return value
    .split(";")
    .map((declaration) => declaration.split(/:(.*)/, 2))
    .filter(([property, rawValue]) => {
      const normalizedProperty = property?.trim().toLowerCase();
      const normalizedValue = rawValue?.trim() ?? "";
      if (normalizedProperty === "font-size") {
        return /^\d+(?:\.\d+)?(?:px|rem|em|%)$/i.test(normalizedValue);
      }
      if (normalizedProperty === "color") {
        return /^(?:#[\da-f]{3,8}|[a-z]{1,24}|(?:rgb|hsl)a?\([\d.% ,/-]+\))$/i.test(
          normalizedValue,
        );
      }
      return false;
    })
    .map(([property, value]) => `${property.trim().toLowerCase()}: ${value.trim()}`)
    .join("; ");
}

export function sanitizeBlogHtml(html: string): string {
  if (typeof window === "undefined") return "";

  if (!styleHookInstalled) {
    DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
      if (data.attrName === "style") {
        data.attrValue = sanitizeStyleAttribute(data.attrValue);
        data.keepAttr = data.attrValue.length > 0;
      }
    });
    styleHookInstalled = true;
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOW_DATA_ATTR: false,
  });
}
