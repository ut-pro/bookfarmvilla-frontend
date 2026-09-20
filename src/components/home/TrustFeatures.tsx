import {
  Clock3,
  Headphones,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

interface TrustFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const trustFeatures: TrustFeature[] = [
  {
    icon: ShieldCheck,
    title: "Verified Properties",
    description: "Authentic, quality-focused listings",
  },
  {
    icon: Headphones,
    title: "Expert Assistance",
    description: "Guidance at every step",
  },
  {
    icon: Sparkles,
    title: "Curated Venues",
    description: "Handpicked property choices",
  },
  {
    icon: Clock3,
    title: "24x7 Support",
    description: "Always here to help",
  },
];

export default function TrustFeatures() {
  return (
    <section
      className="border-b border-gray-100 bg-white shadow-sm"
      aria-label="Why users trust BookFarmVilla"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-4">
          {trustFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group flex flex-col items-center gap-3 rounded-xl p-3 text-center transition-colors hover:bg-[#F8FAFC] sm:flex-row sm:gap-4 sm:p-4 sm:text-left"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] transition-colors group-hover:bg-[#2EAD45] sm:h-12 sm:w-12">
                  <Icon
                    size={22}
                    className="text-[#2EAD45] transition-colors group-hover:text-white"
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <h2 className="text-xs font-semibold text-[#0F172A] sm:text-sm">
                    {feature.title}
                  </h2>

                  <p className="mt-0.5 text-[11px] leading-4 text-gray-500 sm:text-xs">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}