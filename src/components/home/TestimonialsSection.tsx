import Image from "next/image";
import { Check, Quote, Star } from "lucide-react";

import { mockTestimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  return (
    <section
      className="bg-[#F8FAFC] py-12 sm:py-16 lg:py-20"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section heading */}
        <div className="mb-8 text-center sm:mb-10 lg:mb-14">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2EAD45] sm:mb-3 sm:text-sm">
            Customer Reviews
          </p>

          <h2
            id="testimonials-heading"
            className="font-semibold leading-tight text-[#0F172A]"
            style={{
              fontSize: "clamp(28px, 3vw, 36px)",
            }}
          >
            What Our Guests Say
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base">
            Experiences from guests who found venues with assistance from
            BookFarmVilla.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="scrollbar-hide -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 scroll-px-4 sm:-mx-6 sm:gap-5 sm:px-6 sm:scroll-px-6 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
          {mockTestimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="group relative flex h-auto w-[84vw] min-w-[270px] max-w-[340px] flex-shrink-0 snap-start flex-col rounded-2xl bg-white p-5 shadow-md sm:p-7 md:w-auto md:min-w-0 md:max-w-none transition-shadow hover:shadow-lg"
            >
              {/* Decorative quote icon */}
              <Quote
                size={48}
                className="absolute right-6 top-6 text-[#2EAD45]/10 transition-colors group-hover:text-[#2EAD45]/20"
                aria-hidden="true"
              />

              {/* Star rating */}
              <div
                className="mb-4 flex gap-1"
                aria-label={`${testimonial.rating} out of 5 stars`}
              >
                {Array.from({
                  length: Math.round(testimonial.rating),
                }).map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className="fill-amber-400 text-amber-400"
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Review */}
              <blockquote className="relative z-10 mb-6 flex-1 text-sm leading-relaxed text-gray-600">
                “{testimonial.review}”
              </blockquote>

              {/* Event and property */}
              <div className="mb-5 inline-flex w-fit max-w-full items-center gap-1.5 rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#1E8A32]">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#2EAD45]" />

                <span className="line-clamp-1">
                  {testimonial.event} · {testimonial.propertyName}
                </span>
              </div>

              {/* Customer information */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                <Image
                  src={testimonial.avatarUrl}
                  alt={`${testimonial.name} from ${testimonial.location}`}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {testimonial.name}
                  </p>

                  <p className="text-xs text-gray-400">
                    {testimonial.location}
                  </p>
                </div>

                {/* Verified-style visual badge */}
                <div
                  className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#2EAD45]"
                  aria-label="Review checked by BookFarmVilla"
                  title="Review checked by BookFarmVilla"
                >
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    className="text-white"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
