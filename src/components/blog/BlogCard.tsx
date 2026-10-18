import { ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { BlogPostSummary } from "@/types/blog";

interface BlogCardProps {
  post: BlogPostSummary;
  featured?: boolean;
}

function formatPublishedDate(
  publishedAt: string | null,
): string | null {
  if (!publishedAt) {
    return null;
  }

  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

export default function BlogCard({
  post,
  featured = false,
}: BlogCardProps) {
  const publishedDate = formatPublishedDate(
    post.publishedAt,
  );

  const category = post.category?.trim();
  const excerpt =
    post.excerpt?.trim() ||
    "Read the complete article for ideas, inspiration and practical tips from BookFarmVilla.";

  const coverImageUrl = post.coverImageUrl?.trim();
  const coverImageAlt =
    post.coverImageAlt?.trim() || post.title;

  const articleHref = `/blogs/${encodeURIComponent(
    post.slug,
  )}`;

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        featured
          ? "grid min-h-[460px] md:min-h-[360px] md:grid-cols-2"
          : "flex h-full flex-col"
      }`}
    >
      <Link
        href={articleHref}
        className="absolute inset-0 z-10 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAD45] focus-visible:ring-inset"
        aria-label={`Read ${post.title}`}
      />

      <div
        className={`relative overflow-hidden bg-gradient-to-br from-green-50 via-[#F8FAFC] to-green-100 ${
          featured
            ? "min-h-[240px] md:min-h-full"
            : "aspect-[16/10]"
        }`}
      >
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={coverImageAlt}
            fill
            unoptimized
            sizes={
              featured
                ? "(max-width: 767px) 100vw, 50vw"
                : "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 px-6 text-center text-[#1E8A32]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
              <BookOpen size={26} aria-hidden="true" />
            </span>

            <span className="text-xs font-semibold uppercase tracking-[0.18em]">
              BookFarmVilla
            </span>
          </div>
        )}

        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-[#2EAD45] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            Featured Story
          </span>
        )}
      </div>

      <div
        className={`flex flex-1 flex-col ${
          featured
            ? "justify-center p-6 sm:p-8 lg:p-10"
            : "p-5 sm:p-6"
        }`}
      >
        {(category || publishedDate) && (
          <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {category && (
              <span className="font-semibold uppercase tracking-wider text-[#1E8A32]">
                {category}
              </span>
            )}

            {category && publishedDate && (
              <span
                className="text-gray-300"
                aria-hidden="true"
              >
                •
              </span>
            )}

            {publishedDate && (
              <time
                dateTime={post.publishedAt ?? undefined}
                className="text-gray-500"
              >
                {publishedDate}
              </time>
            )}
          </div>
        )}

        {featured ? (
          <h2 className="text-2xl font-bold leading-tight text-[#0F172A] sm:text-3xl lg:text-4xl">
            {post.title}
          </h2>
        ) : (
          <h3 className="line-clamp-2 text-xl font-bold leading-snug text-[#0F172A]">
            {post.title}
          </h3>
        )}

        <p
          className={`mt-3 leading-7 text-gray-600 ${
            featured
              ? "line-clamp-3 text-sm sm:text-base"
              : "line-clamp-3 text-sm"
          }`}
        >
          {excerpt}
        </p>

        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1E8A32]">
          Read Article

          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}