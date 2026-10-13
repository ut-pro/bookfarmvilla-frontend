import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { propertyCategories } from "@/data/categories";

export default function CategorySection() {
  return (
    <section
      id="categories"
      className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20"
      aria-labelledby="category-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section heading */}
        <div className="mb-8 text-center sm:mb-10 lg:mb-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2EAD45] sm:mb-3 sm:text-sm">
            Browse by Category
          </p>

          <h2
            id="category-heading"
            className="font-semibold leading-tight text-[#0F172A]"
            style={{
              fontSize: "clamp(28px, 3vw, 36px)",
            }}
          >
            What are you looking for?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base">
            From lush green farmhouses to luxury villas and grand wedding
            venues — find the perfect space for every occasion.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {propertyCategories.map((category) => (
            <a
              key={category.type}
              href={category.sectionHref}
              className="group relative min-h-[330px] overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:min-h-[370px] lg:min-h-[420px]"
              aria-label={category.cta}
            >
              {/* Category image */}
              <Image
                src={category.image}
                alt={`${category.title} available on BookFarmVilla`}
                fill
                sizes="(max-width: 767px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Image gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t ${category.overlayClassName}`}
              />

              {/* Card content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 lg:p-8">
                <h3 className="mb-4 text-3xl font-bold text-white">
                  {category.title}
                </h3>

                {/* Category tags */}
                <div className="mb-4 flex flex-wrap gap-2 sm:mb-6">
                  {category.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/20 bg-white/20 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <span className="flex w-fit items-center gap-2 rounded-xl bg-[#2EAD45] px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-colors group-hover:bg-[#1E8A32] sm:px-6 sm:py-3">
                  {category.cta}

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}