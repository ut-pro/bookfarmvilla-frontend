"use client";

import { useEffect, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import { Color } from "@tiptap/extension-color";
import { Image } from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { StarterKit } from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";
import { sanitizeBlogHtml } from "@/lib/blog-html";

const FontSize = Extension.create({
  name: "fontSize",
  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
            renderHTML: (attributes: Record<string, unknown>) => {
              const size = attributes.fontSize;
              return typeof size === "string" ? { style: `font-size: ${size}` } : {};
            },
          },
        },
      },
    ];
  },
});

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  variant?: "full" | "description";
}

const buttonClass =
  "rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-violet-50 hover:text-violet-700 disabled:opacity-40";
const inputClass =
  "min-w-0 rounded-lg border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-violet-500";

function isWebUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function RichTextEditor({
  value,
  onChange,
  variant = "full",
}: RichTextEditorProps) {
  const showLinkAndImageControls = 
    variant === "full";

  const safeValue = useMemo(
    () => sanitizeBlogHtml(value),
    [value],
  );
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
        },
      }),
      TextStyle,
      Color,
      Image.configure({ allowBase64: false }),
      FontSize,
    ],
    content: safeValue,
    onUpdate: ({ editor: updatedEditor }) => {
      onChange(updatedEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-72 max-w-none px-4 py-3 text-gray-800 focus:outline-none " +
          "[&_p]:my-2 " +
          "[&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight " +
          "[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight " +
          "[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-xl [&_h3]:font-semibold " +
          "[&_h4]:mb-2 [&_h4]:mt-4 [&_h4]:text-lg [&_h4]:font-semibold " +
          "[&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 " +
          "[&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 " +
          "[&_li]:my-1 " +
          "[&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-violet-300 " +
          "[&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600",
      },
    },
  });

  useEffect(() => {
    if (
      editor &&
      !editor.isFocused &&
      editor.getHTML() !== safeValue
    ) {
      editor.commands.setContent(
        safeValue,
        { emitUpdate: false },
      );
    }
  }, [editor, safeValue]);

  const applyLink = () => {
    if (!editor) return;
    const url = linkUrl.trim();
    if (url && !isWebUrl(url)) return;
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  };

  const addImage = () => {
    const url = imageUrl.trim();
    if (!editor || !isWebUrl(url)) return;
    editor.chain().focus().setImage({ src: url }).run();
    setImageUrl("");
  };

  if (!editor) {
    return <div className="min-h-72 rounded-xl border border-gray-200 bg-gray-50" aria-label="Loading rich text editor" />;
  }

  return (
    <div className="rounded-xl border border-gray-200">
      <div className="sticky -top-5 z-20 flex flex-wrap items-center gap-2 rounded-t-xl border-b border-gray-200 bg-gray-50 p-3 shadow-sm">
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().toggleBold().run()} aria-label="Bold"><Bold size={16} /></button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().toggleItalic().run()} aria-label="Italic"><Italic size={16} /></button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().toggleUnderline().run()} aria-label="Underline"><Underline size={16} /></button>
        {([1, 2, 3, 4] as const).map((level) => {
          const HeadingIcon = [Heading1, Heading2, Heading3, Heading4][level - 1];
          return (
            <button
              key={level}
              type="button"
              className={buttonClass}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              aria-label={`Heading ${level}`}
            >
              <HeadingIcon size={16} />
            </button>
          );
        })}
        <select
          aria-label="Font size"
          defaultValue=""
          className={inputClass}
          onChange={(event) => {
            if (event.target.value) {
              editor.chain().focus().setMark("textStyle", { fontSize: event.target.value }).run();
            }
          }}
        >
          <option value="" disabled>Font size</option>
          <option value="12px">12 px</option>
          <option value="16px">16 px</option>
          <option value="20px">20 px</option>
          <option value="24px">24 px</option>
          <option value="32px">32 px</option>
        </select>
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-600">
          Color
          <input
            type="color"
            aria-label="Text color"
            className="h-5 w-6 cursor-pointer border-0 p-0"
            onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
          />
        </label>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().toggleBulletList().run()} aria-label="Bulleted list"><List size={16} /></button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().toggleOrderedList().run()} aria-label="Numbered list"><ListOrdered size={16} /></button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().toggleBlockquote().run()} aria-label="Blockquote"><Quote size={16} /></button>
        {showLinkAndImageControls && (
          <>
            <div className="flex items-center gap-1">
              <input
                value={linkUrl}
                onChange={(event) =>
                  setLinkUrl(event.target.value)
                }
                placeholder="https:// link"
                aria-label="Link URL"
                className={`${inputClass} w-40`}
              />

              <button
                type="button"
                className={buttonClass}
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={applyLink}
                aria-label={
                  linkUrl
                    ? "Add or update link"
                    : "Remove link"
                }
              >
                <Link2 size={16} />
              </button>

              <button
                type="button"
                className={buttonClass}
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={() => {
                  setLinkUrl("");
                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .unsetLink()
                    .run();
                }}
                aria-label="Remove link"
              >
                <Unlink size={16} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <input
                value={imageUrl}
                onChange={(event) =>
                  setImageUrl(event.target.value)
                }
                placeholder="https:// image URL"
                aria-label="Image URL"
                className={`${inputClass} w-44`}
              />

              <button
                type="button"
                className={buttonClass}
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={addImage}
                aria-label="Insert image"
              >
                <ImagePlus size={16} />
              </button>
            </div>
          </>
        )}
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} aria-label="Undo"><Undo2 size={16} /></button>
        <button type="button" className={buttonClass} onMouseDown={(event) => event.preventDefault()} onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} aria-label="Redo"><Redo2 size={16} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

