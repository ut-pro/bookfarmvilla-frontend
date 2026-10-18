export type BlogPostStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";

export interface BlogPostSummary {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  category: string | null;
  authorName: string;
  publishedAt: string | null;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
  status: BlogPostStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  modifiedAt: string;
}

export interface BlogPageResponse {
  content: BlogPostSummary[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}