"use client";

import { useId, useState } from "react";
import { ChevronDown, MessageCircle } from "lucide-react";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  title?: string;
  schemaType?: "FAQPage" | "Product" | "Service";
}

export default function FAQAccordion({
  items,
  title,
  schemaType = "FAQPage",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const id = useId();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": schemaType,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section aria-labelledby={title ? `${id}-heading` : undefined} className="mx-auto mt-12 w-full max-w-6xl sm:mt-16">
      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#159447]">Support & guidance</p>
          {title && <h2 id={`${id}-heading`} className="text-2xl font-extrabold tracking-tight text-[#102743] sm:text-3xl">{title}</h2>}
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Quick answers to help you plan your event with confidence.</p>
        </div>
        <div className="hidden items-center gap-2 text-sm font-medium text-slate-500 sm:flex"><MessageCircle size={17} className="text-[#159447]" aria-hidden="true" /> Here to make planning easier</div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_28px_rgba(16,39,67,0.045)]">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          const questionId = `${id}-question-${index}`;
          const answerId = `${id}-answer-${index}`;
          return (
            <article key={`${item.question}-${index}`} className={`relative border-b border-slate-100 last:border-b-0 ${isOpen ? "bg-[#F5FCF7]" : "bg-white"}`}>
              {isOpen && <span aria-hidden="true" className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-[#159447]" />}
              <h3 className="m-0">
                <button
                  id={questionId}
                  type="button"
                  onClick={() => setOpenIndex((current) => current === index ? null : index)}
                  className={`flex min-h-[62px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#159447] sm:px-7 ${isOpen ? "text-[#102743]" : "text-slate-800 hover:bg-slate-50"}`}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span className="text-sm font-bold leading-6 sm:text-base">{item.question}</span>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${isOpen ? "bg-emerald-100 text-[#159447]" : "bg-slate-50 text-slate-500"}`}>
                    <ChevronDown size={18} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} aria-hidden="true" />
                  </span>
                </button>
              </h3>
              <div
                id={answerId}
                role="region"
                aria-labelledby={questionId}
                aria-hidden={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="min-h-0 overflow-hidden">
                  <p className="px-5 pb-5 pr-12 text-sm leading-7 text-slate-600 sm:px-7 sm:pb-6 sm:pr-16 sm:text-base">{item.answer}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </section>
  );
}
