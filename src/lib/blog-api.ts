import { API_BASE_URL } from "@/lib/api-config";

import type {
  BlogPageResponse,
  BlogPost,
  BlogPostSummary,
} from "@/types/blog";

interface GetPublishedBlogsOptions {
  category?: string;
  keyword?: string;
  page?: number;
  size?: number;
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBlogPostSummary(
  value: unknown,
): value is BlogPostSummary {
  return (
    isObject(value) &&
    typeof value.id === "string" &&
    typeof value.slug === "string" &&
    typeof value.title === "string" &&
    typeof value.authorName === "string"
  );
}

export async function getPublishedBlogs(
  {
    category,
    keyword,
    page = 0,
    size = 7,
  }: GetPublishedBlogsOptions = {},
  signal?: AbortSignal,
): Promise<BlogPageResponse> {
  const url = new URL("/api/v1/blogs", API_BASE_URL);

  url.searchParams.set("page", String(Math.max(0, page)));
  url.searchParams.set("size", String(Math.max(1, size)));
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("sortDirection", "desc");

  if (category?.trim()) {
    url.searchParams.set("category", category.trim());
  }

  if (keyword?.trim()) {
    url.searchParams.set("keyword", keyword.trim());
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  if (!response.ok) {
    throw new Error(
      `Blog API request failed with status ${response.status}.`,
    );
  }

  const data: unknown = await response.json();

  if (
    !isObject(data) ||
    !Array.isArray(data.content) ||
    !data.content.every(isBlogPostSummary)
  ) {
    throw new Error("Blog API returned an invalid response.");
  }

  return {
    content: data.content,
    pageNumber:
      typeof data.pageNumber === "number"
        ? data.pageNumber
        : page,
    pageSize:
      typeof data.pageSize === "number"
        ? data.pageSize
        : size,
    totalElements:
      typeof data.totalElements === "number"
        ? data.totalElements
        : data.content.length,
    totalPages:
      typeof data.totalPages === "number"
        ? data.totalPages
        : 1,
    last:
      typeof data.last === "boolean"
        ? data.last
        : true,
  };
}

export async function getPublishedBlogBySlug(
  blogSlug: string,
  signal?: AbortSignal,
): Promise<BlogPost | null> {
  const normalizedSlug = blogSlug.trim();

  if (!normalizedSlug) {
    return null;
  }

  const url = new URL(
    `/api/v1/blogs/${encodeURIComponent(normalizedSlug)}`,
    API_BASE_URL,
  );

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
    signal,
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Blog detail request failed with status ${response.status}.`,
    );
  }

  const data: unknown = await response.json();

  if (
    !isObject(data) ||
    typeof data.id !== "string" ||
    typeof data.slug !== "string" ||
    typeof data.title !== "string" ||
    typeof data.content !== "string" ||
    typeof data.authorName !== "string"
  ) {
    throw new Error(
      "Blog detail API returned an invalid response.",
    );
  }

  const blogPost = data as unknown as BlogPost;

  if (blogPost.status !== "PUBLISHED") {
    return null;
  }

  return blogPost;
}