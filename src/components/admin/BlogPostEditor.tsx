"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  AdminApiError,
  createAdminBlogPost,
  fetchAdminBlogPost,
  updateAdminBlogPost,
} from "@/lib/admin-api";
import { sanitizeBlogHtml } from "@/lib/blog-html";
import type { AdminBlogPost, AdminBlogPostPayload } from "@/types/admin";

interface BlogPostEditorProps {
  postId: string | null;
}

interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  category: string;
  authorName: string;
  seoTitle: string;
  seoDescription: string;
}

const emptyFields: BlogPostFields = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  coverImageAlt: "",
  category: "",
  authorName: "",
  seoTitle: "",
  seoDescription: "",
};

function fieldsFromPost(post: AdminBlogPost): BlogPostFields {
  return {
    title: post.title ?? "",
    slug: post.slug ?? "",
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    coverImageUrl: post.coverImageUrl ?? "",
    coverImageAlt: post.coverImageAlt ?? "",
    category: post.category ?? "",
    authorName: post.authorName ?? "",
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
  };
}

function optional(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export default function BlogPostEditor({ postId }: BlogPostEditorProps) {
  const router = useRouter();
  const [fields, setFields] = useState<BlogPostFields>(emptyFields);
  const [post, setPost] = useState<AdminBlogPost | null>(null);
  const [loading, setLoading] = useState(Boolean(postId));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;
    const id = postId;
    let cancelled = false;
    async function loadPost() {
      setLoading(true);
      setError(null);
      try {
        const loadedPost = await fetchAdminBlogPost(id);
        if (cancelled) return;
        setPost(loadedPost);
        setFields(fieldsFromPost(loadedPost));
      } catch (loadError) {
        if (cancelled) return;
        setError(loadError instanceof AdminApiError ? loadError.message : "Could not load this blog post.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void loadPost();
    return () => { cancelled = true; };
  }, [postId]);

  const updateField = (field: keyof BlogPostFields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sanitizedContent = sanitizeBlogHtml(fields.content);
    const contentText = new DOMParser()
      .parseFromString(sanitizedContent, "text/html")
      .body.textContent?.trim();
    if (!contentText && !/<img\b/i.test(sanitizedContent)) {
      setError("Content is required.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);
    setFieldErrors({});

    const payload: AdminBlogPostPayload = {
      title: fields.title.trim(),
      slug: optional(fields.slug),
      excerpt: optional(fields.excerpt),
      content: sanitizedContent,
      coverImageUrl: optional(fields.coverImageUrl),
      coverImageAlt: optional(fields.coverImageAlt),
      category: optional(fields.category),
      authorName: fields.authorName.trim(),
      seoTitle: optional(fields.seoTitle),
      seoDescription: optional(fields.seoDescription),
    };

    try {
      const savedPost = postId
        ? await updateAdminBlogPost(postId, payload)
        : await createAdminBlogPost(payload);
      setPost(savedPost);
      setFields(fieldsFromPost(savedPost));
      if (!postId) {
        router.push(`/admin/blog/${encodeURIComponent(savedPost.id)}`);
      } else {
        setSuccess("Blog post saved.");
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this blog post.");
      if (saveError instanceof AdminApiError) setFieldErrors(saveError.fieldErrors ?? {});
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-500";

  if (loading) {
    return (
      <>
        <AdminHeader title="Edit Blog Post" />
        <main className="p-8 text-sm text-gray-400">Loading blog post…</main>
      </>
    );
  }

  if (postId && error && !post) {
    return (
      <>
        <AdminHeader title="Edit Blog Post" />
        <main className="p-8">
          <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
          <Link href="/admin/blog" className="mt-4 inline-block text-sm font-semibold text-violet-700 hover:underline">Back to Blog</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminHeader title={postId ? "Edit Blog Post" : "Create Blog Post"} />
      <main className="mx-auto max-w-5xl p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{postId ? "Edit Blog Post" : "Create Blog Post"}</h2>
            <p className="text-sm text-gray-500">Content is saved as sanitized HTML.</p>
          </div>
          <div className="flex items-center gap-3">
            {post && <StatusBadge status={post.status} />}
            <Link href="/admin/blog" className="text-sm font-semibold text-violet-700 hover:underline">Back to Blog</Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="blogTitle" className="block text-sm font-semibold text-gray-700">Title *</label>
              <input id="blogTitle" required maxLength={255} value={fields.title} onChange={(event) => updateField("title", event.target.value)} className={inputClass} />
              {fieldErrors.title && <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>}
            </div>
            <div>
              <label htmlFor="blogAuthor" className="block text-sm font-semibold text-gray-700">Author name *</label>
              <input id="blogAuthor" required maxLength={255} value={fields.authorName} onChange={(event) => updateField("authorName", event.target.value)} className={inputClass} />
              {fieldErrors.authorName && <p className="mt-1 text-sm text-red-600">{fieldErrors.authorName}</p>}
            </div>
            <div>
              <label htmlFor="blogCategory" className="block text-sm font-semibold text-gray-700">Category</label>
              <input id="blogCategory" maxLength={100} value={fields.category} onChange={(event) => updateField("category", event.target.value)} className={inputClass} />
              {fieldErrors.category && <p className="mt-1 text-sm text-red-600">{fieldErrors.category}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="blogExcerpt" className="block text-sm font-semibold text-gray-700">Excerpt</label>
            <textarea id="blogExcerpt" maxLength={500} rows={3} value={fields.excerpt} onChange={(event) => updateField("excerpt", event.target.value)} className={`${inputClass} resize-y`} />
            <p className="mt-1 text-right text-xs text-gray-400">{fields.excerpt.length}/500</p>
            {fieldErrors.excerpt && <p className="mt-1 text-sm text-red-600">{fieldErrors.excerpt}</p>}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="blogCoverUrl" className="block text-sm font-semibold text-gray-700">Cover image URL</label>
              <input id="blogCoverUrl" type="url" maxLength={1024} value={fields.coverImageUrl} onChange={(event) => updateField("coverImageUrl", event.target.value)} className={inputClass} />
              {fieldErrors.coverImageUrl && <p className="mt-1 text-sm text-red-600">{fieldErrors.coverImageUrl}</p>}
            </div>
            <div>
              <label htmlFor="blogCoverAlt" className="block text-sm font-semibold text-gray-700">Cover image alt text</label>
              <input id="blogCoverAlt" maxLength={255} value={fields.coverImageAlt} onChange={(event) => updateField("coverImageAlt", event.target.value)} className={inputClass} />
              {fieldErrors.coverImageAlt && <p className="mt-1 text-sm text-red-600">{fieldErrors.coverImageAlt}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="blogContent" className="mb-1 block text-sm font-semibold text-gray-700">Content *</label>
            <RichTextEditor value={fields.content} onChange={(content) => updateField("content", content)} />
            {fieldErrors.content && <p className="mt-1 text-sm text-red-600">{fieldErrors.content}</p>}
          </div>

          <fieldset className="space-y-4 rounded-xl border border-gray-100 p-4">
            <legend className="px-2 text-sm font-bold text-gray-800">SEO</legend>
            <div>
              <label htmlFor="blogSeoTitle" className="block text-sm font-semibold text-gray-700">SEO title</label>
              <input id="blogSeoTitle" maxLength={255} value={fields.seoTitle} onChange={(event) => updateField("seoTitle", event.target.value)} className={inputClass} />
              {fieldErrors.seoTitle && <p className="mt-1 text-sm text-red-600">{fieldErrors.seoTitle}</p>}
            </div>
            <div>
              <label htmlFor="blogSeoDescription" className="block text-sm font-semibold text-gray-700">SEO description</label>
              <textarea id="blogSeoDescription" maxLength={500} rows={2} value={fields.seoDescription} onChange={(event) => updateField("seoDescription", event.target.value)} className={`${inputClass} resize-y`} />
              {fieldErrors.seoDescription && <p className="mt-1 text-sm text-red-600">{fieldErrors.seoDescription}</p>}
            </div>
          </fieldset>

          {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
          {Object.entries(fieldErrors).filter(([key]) => !["title", "slug", "authorName", "category", "excerpt", "coverImageUrl", "coverImageAlt", "content", "seoTitle", "seoDescription"].includes(key)).map(([key, message]) => (
            <p key={key} className="text-sm text-red-600">{key}: {message}</p>
          ))}
          {success && <div role="status" className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
            <Link href="/admin/blog" className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</Link>
            <button type="submit" disabled={saving} className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60">{saving ? "Saving…" : postId ? "Save Changes" : "Create Post"}</button>
          </div>
        </form>
      </main>
    </>
  );
}
