import {
  Clock3,
  ClipboardCheck,
  Headphones,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  iconClassName: string;
}

const features: Feature[] = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Active property listings are reviewed by our team before being shown to guests.",
    iconClassName: "bg-green-500/15 text-green-400",
  },
  {
    icon: Search,
    title: "Smarter Discovery",
    description:
      "Search venues by city, property type and guest capacity to find suitable options.",
    iconClassName: "bg-blue-500/15 text-blue-400",
  },
  {
    icon: Headphones,
    title: "Expert Guidance",
    description:
      "Connect with our booking experts for personalised assistance and property enquiries.",
    iconClassName: "bg-amber-500/15 text-amber-400",
  },
  {
    icon: ClipboardCheck,
    title: "Clear Property Details",
    description:
      "View important information including capacity, location, amenities and starting price.",
    iconClassName: "bg-purple-500/15 text-purple-400",
  },
  {
    icon: Clock3,
    title: "24x7 Support",
    description:
      "Reach out whenever you need help while discovering the right venue for your occasion.",
    iconClassName: "bg-rose-500/15 text-rose-400",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      className="relative overflow-hidden bg-[#0F172A] py-20"
      aria-labelledby="why-choose-us-heading"
    >
      {/* Background dotted pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Top-left green glow */}
      <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2EAD45]/10 blur-3xl" />

      {/* Bottom-right green glow */}
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-[#4CAF50]/10 blur-3xl" />

      {/* Section content */}
      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4CAF50]">
            Our Promise
          </p>

          <h2
            id="why-choose-us-heading"
            className="font-semibold leading-tight text-white"
            style={{
              fontSize: "clamp(28px, 3vw, 36px)",
            }}
          >
            Why Choose BookFarmVilla?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-gray-400">
            We make venue discovery easier by combining curated listings,
            useful property details and personalised expert assistance.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:bg-white/10"
              >
                <div
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconClassName}`}
                >
                  <Icon size={22} aria-hidden="true" />
                </div>

                <h3 className="mb-3 text-base font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}