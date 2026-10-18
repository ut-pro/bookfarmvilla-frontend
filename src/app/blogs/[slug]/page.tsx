import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import BlogCta from "@/components/blog/BlogCta";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";
import { getPublishedBlogBySlug } from "@/lib/blog-api";
import {
  blogHtmlToPlainText,
  sanitizeBlogHtml,
} from "@/lib/blog-html";

const SITE_URL = "https://www.bookfarmvilla.com";

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getBlogPost = cache((slug: string) =>
  getPublishedBlogBySlug(slug),
);

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

function createMetaDescription(
  value: string,
  maximumLength = 160,
): string {
  const normalizedValue = value
    .replace(/\s+/g, " ")
    .trim();

  if (normalizedValue.length <= maximumLength) {
    return normalizedValue;
  }

  const shortenedValue = normalizedValue.slice(
    0,
    maximumLength - 1,
  );

  const lastSpaceIndex =
    shortenedValue.lastIndexOf(" ");

  return `${
    lastSpaceIndex > 0
      ? shortenedValue.slice(0, lastSpaceIndex)
      : shortenedValue
  }…`;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Blog Article Not Found | BookFarmVilla",
    };
  }

  const canonical = `/blogs/${encodeURIComponent(
    post.slug,
  )}`;

  const plainContent = blogHtmlToPlainText(
    post.content,
  );

  const description = createMetaDescription(
    post.seoDescription?.trim() ||
      post.excerpt?.trim() ||
      plainContent ||
      `Read ${post.title} on the BookFarmVilla Blog.`,
  );

  const title =
    post.seoTitle?.trim() ||
    `${post.title} | BookFarmVilla`;

  const socialImages = post.coverImageUrl?.trim()
    ? [
        {
          url: post.coverImageUrl.trim(),
          alt:
            post.coverImageAlt?.trim() ||
            post.title,
        },
      ]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      publishedTime:
        post.publishedAt ?? undefined,
      modifiedTime:
        post.modifiedAt || undefined,
      authors: [post.authorName],
      images: socialImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.coverImageUrl?.trim()
        ? [post.coverImageUrl.trim()]
        : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const publishedDate = formatPublishedDate(
    post.publishedAt,
  );

  const sanitizedContent = sanitizeBlogHtml(
    post.content,
  );

  const hasRichHtml =
    /<(?:a|blockquote|br|em|h[1-4]|img|li|ol|p|span|strong|u|ul)\b/i.test(
      sanitizedContent,
    );

  const plainContent = blogHtmlToPlainText(
    post.content,
  );

  const articleDescription =
    post.seoDescription?.trim() ||
    post.excerpt?.trim() ||
    createMetaDescription(plainContent);

  const articleUrl = `${SITE_URL}/blogs/${encodeURIComponent(
    post.slug,
  )}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: articleDescription,
    url: articleUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "BookFarmVilla",
      url: SITE_URL,
    },
    ...(post.coverImageUrl?.trim()
      ? {
          image: post.coverImageUrl.trim(),
        }
      : {}),
    ...(post.publishedAt
      ? {
          datePublished: post.publishedAt,
        }
      : {}),
    ...(post.modifiedAt
      ? {
          dateModified: post.modifiedAt,
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <Header />

      <main className="min-h-screen bg-white pb-16 pt-16 sm:pb-20 sm:pt-20">
        <article>
          {/* Article heading */}
          <header className="border-b border-gray-100 bg-gradient-to-br from-white via-green-50/50 to-[#EAF8ED]">
            <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
              <nav
                aria-label="Breadcrumb"
                className="mb-8"
              >
                <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                  <li>
                    <Link
                      href="/"
                      className="transition-colors hover:text-[#1E8A32]"
                    >
                      Home
                    </Link>
                  </li>

                  <li aria-hidden="true">/</li>

                  <li>
                    <Link
                      href="/blogs"
                      className="transition-colors hover:text-[#1E8A32]"
                    >
                      Blogs
                    </Link>
                  </li>

                  <li aria-hidden="true">/</li>

                  <li
                    className="max-w-full truncate font-medium text-gray-700"
                    aria-current="page"
                  >
                    {post.title}
                  </li>
                </ol>
              </nav>

              {(post.category?.trim() ||
                publishedDate) && (
                <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  {post.category?.trim() && (
                    <span className="font-semibold uppercase tracking-wider text-[#1E8A32]">
                      {post.category.trim()}
                    </span>
                  )}

                  {post.category?.trim() &&
                    publishedDate && (
                      <span
                        className="text-gray-300"
                        aria-hidden="true"
                      >
                        •
                      </span>
                    )}

                  {publishedDate && (
                    <time
                      dateTime={
                        post.publishedAt ??
                        undefined
                      }
                      className="text-gray-500"
                    >
                      {publishedDate}
                    </time>
                  )}
                </div>
              )}

              <h1 className="text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>

              {post.excerpt?.trim() && (
                <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
                  {post.excerpt.trim()}
                </p>
              )}

              <p className="mt-6 text-sm text-gray-500">
                By{" "}
                <span className="font-semibold text-[#0F172A]">
                  {post.authorName}
                </span>
              </p>
            </div>
          </header>

          {/* Cover image */}
          {post.coverImageUrl?.trim() && (
            <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12 lg:px-8 xl:px-0">
              <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-gray-100 shadow-sm sm:rounded-3xl">
                <Image
                  src={post.coverImageUrl.trim()}
                  alt={
                    post.coverImageAlt?.trim() ||
                    post.title
                  }
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 1279px) 100vw, 1152px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Article body */}
          <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            {hasRichHtml ? (
              <div
                className={
                  "break-words text-base leading-8 text-gray-700 " +
                  "[&_p]:my-5 " +
                  "[&_h1]:mb-5 [&_h1]:mt-10 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:text-[#0F172A] " +
                  "[&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-[#0F172A] " +
                  "[&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[#0F172A] " +
                  "[&_h4]:mb-3 [&_h4]:mt-7 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:text-[#0F172A] " +
                  "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 " +
                  "[&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 " +
                  "[&_li]:my-2 [&_li]:pl-1 " +
                  "[&_strong]:font-semibold [&_strong]:text-[#0F172A] " +
                  "[&_blockquote]:my-7 [&_blockquote]:border-l-4 [&_blockquote]:border-[#2EAD45] " +
                  "[&_blockquote]:bg-green-50 [&_blockquote]:py-3 [&_blockquote]:pl-5 [&_blockquote]:pr-4 " +
                  "[&_blockquote]:italic [&_blockquote]:text-gray-700 " +
                  "[&_a]:font-medium [&_a]:text-[#1E8A32] [&_a]:underline [&_a]:underline-offset-4 " +
                  "[&_img]:my-8 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl"
                }
                dangerouslySetInnerHTML={{
                  __html: sanitizedContent,
                }}
              />
            ) : (
              <p className="whitespace-pre-line break-words text-base leading-8 text-gray-700">
                {plainContent}
              </p>
            )}

            <div className="mt-12 border-t border-gray-100 pt-6">
              <Link
                href="/blogs"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1E8A32] transition-colors hover:text-[#2EAD45]"
              >
                <ArrowLeft
                  size={17}
                  aria-hidden="true"
                />
                Back to Blogs
              </Link>
            </div>
          </div>
        </article>

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
          <BlogCta />
        </div>
      </main>

      <Footer />
    </>
  );
}