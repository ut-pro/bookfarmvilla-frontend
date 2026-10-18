import type { Metadata } from "next";
import Link from "next/link";

import BlogCard from "@/components/blog/BlogCard";
import BlogCta from "@/components/blog/BlogCta";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { getPublishedBlogs } from "@/lib/blog-api";

import type { BlogPageResponse } from "@/types/blog";

const SITE_URL = "https://www.bookfarmvilla.com";

const BLOG_PAGE_SIZE = 7;

interface BlogsPageProps {
  searchParams: Promise<{
    page?: string | string[];
  }>;
}

function getPageNumber(
  value: string | string[] | undefined,
): number {
  const normalizedValue = Array.isArray(value)
    ? value[0]
    : value;

  const parsedValue = Number(normalizedValue);

  if (
    !Number.isInteger(parsedValue) ||
    parsedValue < 1
  ) {
    return 1;
  }

  return parsedValue;
}

function getBlogPageHref(pageNumber: number): string {
  return pageNumber <= 1
    ? "/blogs"
    : `/blogs?page=${pageNumber}`;
}

function getVisiblePageNumbers(
  currentPage: number,
  totalPages: number,
): number[] {
  const maximumVisiblePages = 5;

  if (totalPages <= maximumVisiblePages) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1,
    );
  }

  const maximumStart =
    totalPages - maximumVisiblePages + 1;

  const startPage = Math.max(
    1,
    Math.min(
      currentPage - 2,
      maximumStart,
    ),
  );

  return Array.from(
    { length: maximumVisiblePages },
    (_, index) => startPage + index,
  );
}

export async function generateMetadata({
  searchParams,
}: BlogsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const currentPage = getPageNumber(
    resolvedSearchParams.page,
  );

  const canonical =
    currentPage > 1
      ? `/blogs?page=${currentPage}`
      : "/blogs";

  const title =
    currentPage > 1
      ? `BookFarmVilla Blog – Page ${currentPage}`
      : "BookFarmVilla Blog";

  const description =
    "Discover venue ideas, celebration guides and practical tips for planning birthdays, weddings, parties and memorable events across Delhi NCR.";

  return {
    title: `${title} | BookFarmVilla`,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title: `${title} | BookFarmVilla`,
      description,
      url: `${SITE_URL}${canonical}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | BookFarmVilla`,
      description,
    },
  };
}

export default async function BlogsPage({
  searchParams,
}: BlogsPageProps) {
  const resolvedSearchParams = await searchParams;
  const requestedPage = getPageNumber(
    resolvedSearchParams.page,
  );

  let blogPage: BlogPageResponse | null = null;
  let couldNotLoadBlogs = false;

  try {
    blogPage = await getPublishedBlogs({
      page: requestedPage - 1,
      size: BLOG_PAGE_SIZE,
    });
  } catch {
    couldNotLoadBlogs = true;
  }

  const posts = blogPage?.content ?? [];

  const currentPage =
    blogPage && blogPage.pageNumber >= 0
      ? blogPage.pageNumber + 1
      : requestedPage;

  const totalPages = Math.max(
    blogPage?.totalPages ?? 0,
    0,
  );

  const featuredPost =
    currentPage === 1
      ? posts[0]
      : undefined;

  const latestPosts = featuredPost
    ? posts.slice(1)
    : posts;

  const visiblePageNumbers =
    getVisiblePageNumbers(
      currentPage,
      totalPages,
    );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F8FAFC] pb-16 pt-16 sm:pb-20 sm:pt-20">
        {/* Blog hero */}
        <section className="border-b border-green-100 bg-gradient-to-br from-white via-green-50/60 to-[#EAF8ED]">
          <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20 xl:px-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1E8A32] sm:text-sm">
              Ideas &amp; Inspiration
            </p>

            <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight text-[#0F172A] sm:text-5xl lg:text-6xl">
              BookFarmVilla Blog
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">
              Discover venue ideas, celebration guides
              and practical tips for planning memorable
              events across Delhi NCR.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
          {couldNotLoadBlogs ? (
            <section
              className="py-20 text-center"
              aria-labelledby="blog-error-heading"
            >
              <h2
                id="blog-error-heading"
                className="text-2xl font-bold text-[#0F172A]"
              >
                We couldn&apos;t load the latest stories
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
                Please try again shortly. You can still
                explore BookFarmVilla properties in the
                meantime.
              </p>

              <Link
                href="/properties"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2EAD45] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32]"
              >
                Explore Properties
              </Link>
            </section>
          ) : posts.length === 0 ? (
            <section
              className="py-20 text-center"
              aria-labelledby="empty-blog-heading"
            >
              <h2
                id="empty-blog-heading"
                className="text-2xl font-bold text-[#0F172A]"
              >
                Stories are coming soon
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
                We&apos;re preparing venue guides,
                celebration ideas and planning tips for
                you.
              </p>

              <Link
                href="/properties"
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#2EAD45] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E8A32]"
              >
                Explore Properties
              </Link>
            </section>
          ) : (
            <>
              {featuredPost && (
                <section
                  className="py-12 sm:py-16"
                  aria-labelledby="featured-story-heading"
                >
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E8A32]">
                        Editor&apos;s Pick
                      </p>

                      <h2
                        id="featured-story-heading"
                        className="mt-2 text-2xl font-bold text-[#0F172A] sm:text-3xl"
                      >
                        Featured Story
                      </h2>
                    </div>
                  </div>

                  <BlogCard
                    post={featuredPost}
                    featured
                  />
                </section>
              )}

              {latestPosts.length > 0 && (
                <section
                  className={
                    featuredPost
                      ? "pb-12 sm:pb-16"
                      : "py-12 sm:py-16"
                  }
                  aria-labelledby="latest-stories-heading"
                >
                  <div className="mb-7">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1E8A32]">
                      Explore the Blog
                    </p>

                    <h2
                      id="latest-stories-heading"
                      className="mt-2 text-2xl font-bold text-[#0F172A] sm:text-3xl"
                    >
                      {currentPage > 1
                        ? `Latest Stories – Page ${currentPage}`
                        : "Latest Stories"}
                    </h2>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {latestPosts.map((post) => (
                      <BlogCard
                        key={post.id}
                        post={post}
                      />
                    ))}
                  </div>
                </section>
              )}

              {totalPages > 1 && (
                <nav
                  className="flex flex-wrap items-center justify-center gap-2 pb-12 sm:pb-16"
                  aria-label="Blog pagination"
                >
                  {currentPage > 1 ? (
                    <Link
                      href={getBlogPageHref(
                        currentPage - 1,
                      )}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-[#2EAD45] hover:text-[#1E8A32]"
                    >
                      Previous
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-full border border-gray-100 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400">
                      Previous
                    </span>
                  )}

                  {visiblePageNumbers.map(
                    (pageNumber) => {
                      const isCurrent =
                        pageNumber === currentPage;

                      return (
                        <Link
                          key={pageNumber}
                          href={getBlogPageHref(
                            pageNumber,
                          )}
                          aria-current={
                            isCurrent
                              ? "page"
                              : undefined
                          }
                          className={`inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors ${
                            isCurrent
                              ? "border-[#2EAD45] bg-[#2EAD45] text-white"
                              : "border-gray-200 bg-white text-gray-600 hover:border-[#2EAD45] hover:text-[#1E8A32]"
                          }`}
                        >
                          {pageNumber}
                        </Link>
                      );
                    },
                  )}

                  {currentPage < totalPages ? (
                    <Link
                      href={getBlogPageHref(
                        currentPage + 1,
                      )}
                      className="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:border-[#2EAD45] hover:text-[#1E8A32]"
                    >
                      Next
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-full border border-gray-100 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-400">
                      Next
                    </span>
                  )}
                </nav>
              )}

              <div className="pb-4 sm:pb-6">
                <BlogCta />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}