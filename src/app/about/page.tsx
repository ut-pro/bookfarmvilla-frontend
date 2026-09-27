import type { Metadata } from "next";
import Link from "next/link";

import {
  Building2,
  Camera,
  ClipboardCheck,
  Handshake,
  Headphones,
  Heart,
  House,
  ListChecks,
  MessageCircle,
  Palette,
  PartyPopper,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

import { CallbackProvider } from "@/components/callback/CallbackContext";
import CallbackModal from "@/components/callback/CallbackModal";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "About Us | BookFarmVilla",
  description:
    "Learn how BookFarmVilla makes venue and event-service discovery simple, convenient and hassle-free.",
};

interface InformationCard {
  icon: LucideIcon;
  title: string;
  description: string;
}

const offerings: InformationCard[] = [
  {
    icon: House,
    title: "Farmhouses",
    description:
      "Discover farmhouses suitable for parties, celebrations, family gatherings, weekend stays, and private events.",
  },
  {
    icon: Building2,
    title: "Villas",
    description:
      "Explore villas for group stays, celebrations, vacations, and special occasions.",
  },
  {
    icon: Heart,
    title: "Wedding Lawns",
    description:
      "Find spaces suitable for weddings, receptions, engagements, and other large celebrations.",
  },
  {
    icon: Camera,
    title: "Photography",
    description:
      "Discover photographers and photography services for weddings, parties, pre-wedding shoots, birthdays, and other memorable occasions.",
  },
  {
    icon: Headphones,
    title: "DJs & Entertainment",
    description:
      "Find DJs and entertainment services to create the right atmosphere for your celebration.",
  },
  {
    icon: UtensilsCrossed,
    title: "Catering",
    description:
      "Explore catering services for different types of events, gatherings, and celebrations.",
  },
  {
    icon: Palette,
    title: "Decorations",
    description:
      "Discover decoration services for weddings, birthdays, engagements, parties, corporate events, and other occasions.",
  },
];

const missionItems = [
  "Farmhouses",
  "Villas",
  "Wedding Lawns",
  "Photographers",
  "DJs",
  "Caterers",
  "Decorators",
  "Other event service providers",
];

const helpSteps: InformationCard[] = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Explore venues and event services based on your occasion and requirements.",
  },
  {
    icon: ClipboardCheck,
    title: "Explore",
    description:
      "Check available information, photographs, facilities, services, and other relevant details.",
  },
  {
    icon: MessageCircle,
    title: "Enquire",
    description:
      "Share your requirements with us and enquire about suitable venues or service providers.",
  },
  {
    icon: Handshake,
    title: "Connect",
    description:
      "Our team can help connect you with relevant venue partners and event service providers.",
  },
  {
    icon: PartyPopper,
    title: "Celebrate",
    description:
      "Once the required arrangements are confirmed, you can focus on enjoying your special occasion.",
  },
];

const reasons: InformationCard[] = [
  {
    icon: Sparkles,
    title: "Everything in One Place",
    description:
      "Discover venues and essential event services without having to search across multiple platforms.",
  },
  {
    icon: ListChecks,
    title: "Multiple Categories",
    description:
      "From Farmhouses and Wedding Lawns to Photography, Catering, DJ, and Decoration services, explore different requirements through one platform.",
  },
  {
    icon: Users,
    title: "Requirement-Based Assistance",
    description:
      "Every event is different. We aim to understand your requirements and help you explore relevant options.",
  },
  {
    icon: MessageCircle,
    title: "Simple Enquiry Process",
    description:
      "Our enquiry process is designed to make communication straightforward and convenient.",
  },
  {
    icon: ShieldCheck,
    title: "Customer-Focused Experience",
    description:
      "We aim to make venue and vendor discovery easier, clearer, and less time-consuming.",
  },
];

export default function AboutPage() {
  return (
    <CallbackProvider>
      <Header />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[68vh] items-center overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&h=1000&fit=crop&auto=format')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/95 via-[#0F172A]/80 to-black/40" />

          <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-20 pt-36 lg:px-12">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#4CAF50]">
                About Us
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                One Occasion. Multiple Requirements.
                <span className="block text-[#4CAF50]">
                  One Simple Place to Start.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                BookFarmVilla is a one-stop platform designed to make venue
                and event service discovery simple, convenient, and
                hassle-free.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#categories"
                  className="rounded-xl bg-[#2EAD45] px-7 py-3.5 text-center font-semibold text-white transition-colors hover:bg-[#1E8A32]"
                >
                  Explore Venues
                </Link>
                <Link
                  href="/#contact"
                  className="rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-center font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-[#0F172A]"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About introduction */}
        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:px-12">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
                About BookFarmVilla
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-[#0F172A] md:text-4xl">
                Venue and Event-Service Discovery in One Place
              </h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-[#64748B]">
                <p>
                  Planning a celebration involves much more than finding a
                  venue. From selecting the right Farmhouse, Villa, or Wedding
                  Lawn to arranging Photography, DJ, Catering, and
                  Decorations, finding the right vendors can take a lot of
                  time and effort.
                </p>
                <p>
                  BookFarmVilla brings these requirements together on one
                  platform, helping you discover suitable venues and event
                  service providers for your special occasion.
                </p>
                <p>
                  Whether you are planning a wedding, birthday party,
                  engagement, corporate event, family gathering, private
                  celebration, or weekend getaway, BookFarmVilla helps you
                  explore options based on your requirements and connect with
                  relevant partners.
                </p>
              </div>
            </div>

            <div className="relative min-h-[440px] overflow-hidden rounded-3xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&h=900&fit=crop&auto=format')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md">
                <p className="font-semibold">
                  Find the Place. Plan the Experience.
                </p>
                <p className="mt-1 text-sm leading-6 text-white/75">
                  Venues and event services for your special occasion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto max-w-[1000px] px-6 text-center lg:px-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
              Our Story
            </p>
            <h2 className="text-3xl font-semibold text-[#0F172A] md:text-4xl">
              Event Planning Should Be Easier
            </h2>
            <div className="mt-7 space-y-5 text-left text-base leading-8 text-[#64748B] md:text-center">
              <p>
                BookFarmVilla was created with a simple idea — event planning
                should be easier.
              </p>
              <p>
                Finding a suitable venue is often just the beginning.
                Customers may need to separately search for photographers,
                DJs, caterers, decorators, and other event professionals.
              </p>
              <p>
                We wanted to make this process more organized by bringing
                different venue and event-service categories together on one
                platform.
              </p>
              <p>
                Our goal is to reduce the time and effort involved in planning
                an event while helping customers discover services that match
                their requirements.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
                What We Offer
              </p>
              <h2 className="text-3xl font-semibold text-[#0F172A] md:text-4xl">
                Venues and Services for Every Occasion
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map((offering) => {
                const Icon = offering.icon;
                return (
                  <article
                    key={offering.title}
                    className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCFCE7] transition-colors group-hover:bg-[#2EAD45]">
                      <Icon
                        size={23}
                        className="text-[#2EAD45] transition-colors group-hover:text-white"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-[#0F172A]">
                      {offering.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#64748B]">
                      {offering.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Vision and Mission */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-6 px-6 lg:grid-cols-2 lg:px-12">
            <article className="rounded-3xl bg-[#0F172A] p-8 text-white md:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2EAD45]/20">
                <Target size={24} className="text-[#4CAF50]" aria-hidden="true" />
              </div>
              <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#4CAF50]">
                Our Vision
              </p>
              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                Making Event Planning Simple
              </h2>
              <div className="mt-5 space-y-4 leading-7 text-gray-400">
                <p>
                  Our vision is to create a platform where customers can
                  discover the venue and services they need for their occasion
                  in one place.
                </p>
                <p>
                  We aim to make the process of finding venues and event
                  professionals more convenient, organized, and transparent.
                </p>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm md:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCFCE7]">
                <Sparkles size={24} className="text-[#2EAD45]" aria-hidden="true" />
              </div>
              <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
                Our Mission
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#0F172A] md:text-3xl">
                Connect Customers With Relevant Options
              </h2>
              <p className="mt-5 leading-7 text-[#64748B]">
                Our mission is to simplify event planning by connecting
                customers with relevant:
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {missionItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-[#64748B]"
                  >
                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-xs text-[#2EAD45]">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 leading-7 text-[#64748B]">
                We want customers to spend less time searching and more time
                focusing on their event and the people who matter to them.
              </p>
            </article>
          </div>
        </section>

        {/* How BookFarmVilla Helps */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
                How BookFarmVilla Helps
              </p>
              <h2 className="text-3xl font-semibold text-[#0F172A] md:text-4xl">
                From Discovery to Celebration
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {helpSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article
                    key={step.title}
                    className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <span className="absolute right-5 top-4 text-4xl font-bold text-[#F1F5F9]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DCFCE7]">
                      <Icon size={21} className="text-[#2EAD45]" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 font-semibold text-[#0F172A]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-[#64748B]">
                      {step.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose BookFarmVilla */}
        <section className="relative overflow-hidden bg-[#0F172A] py-20">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#4CAF50]">
                Why Choose BookFarmVilla?
              </p>
              <h2 className="text-3xl font-semibold text-white md:text-4xl">
                A Simpler Place to Start Planning
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {reasons.map((reason) => {
                const Icon = reason.icon;
                return (
                  <article
                    key={reason.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
                  >
                    <Icon size={23} className="text-[#4CAF50]" aria-hidden="true" />
                    <h3 className="mt-5 font-semibold text-white">
                      {reason.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-gray-400">
                      {reason.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-[1100px] px-6 text-center lg:px-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#2EAD45]">
              Our Commitment
            </p>
            <h2 className="text-3xl font-semibold text-[#0F172A] md:text-4xl">
              Planning Should Feel Exciting, Not Stressful
            </h2>
            <div className="mx-auto mt-7 max-w-4xl space-y-5 text-base leading-8 text-[#64748B]">
              <p>
                At BookFarmVilla, we believe that planning an event should be
                an exciting experience rather than a stressful one.
              </p>
              <p>
                We are committed to building a platform that makes it easier
                to discover the right venue, the right services, and the right
                people for your occasion.
              </p>
              <p>
                As we grow, we aim to expand our network of venues and event
                professionals while continuously improving the experience for
                both customers and our partners.
              </p>
            </div>
          </div>
        </section>

        {/* Final statement */}
        <section className="bg-[#F8FAFC] py-20">
          <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
            <div className="rounded-3xl bg-gradient-to-r from-[#1E8A32] via-[#2EAD45] to-[#4CAF50] px-6 py-14 text-center text-white md:px-12">
              <p className="text-sm font-semibold uppercase tracking-widest text-green-100">
                One occasion. Multiple requirements.
              </p>
              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                One simple place to start.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-green-100">
                BookFarmVilla — Find the Place. Plan the Experience.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/#categories"
                  className="rounded-xl bg-white px-7 py-3.5 font-semibold text-[#1E8A32]"
                >
                  Explore Venues
                </Link>
                <Link
                  href="/#contact"
                  className="rounded-xl border border-white/50 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CallbackModal />
    </CallbackProvider>
  );
}
