"use client";

import { BookOpen, Heart, Wheat, Users, ArrowRight, Building2, Leaf } from "lucide-react";
import { useState } from "react";

export interface ServicesContent {
  sectionLabel: string;
  headline: string;
  services: { tag: string; title: string; summary: string; detail: string }[];
}

const SERVICE_ICONS = [BookOpen, Heart, Wheat, Users, Building2, Leaf];

const CARD_COLORS = [
  "from-forest-800 to-forest-700",
  "from-forest-700 to-forest-600",
  "from-gold-700 to-gold-600",
  "from-forest-800 to-forest-900",
  "from-forest-600 to-forest-700",
  "from-gold-600 to-gold-700",
];

const DEFAULT: ServicesContent = {
  sectionLabel: "WHAT WE DO",
  headline: "Our Core Programs",
  services: [
    {
      tag: "01",
      title: "Education Initiative",
      summary: "Providing quality education through school construction, teacher training, and scholarship programs.",
      detail: "We run scholarship programs for outstanding students, donate learning materials, and are developing a community library and ICT center.",
    },
    {
      tag: "02",
      title: "Healthcare Outreach",
      summary: "Bringing essential healthcare services to underserved communities through mobile clinics and health education.",
      detail: "Our health committee organizes free medical camps, distributes essential medicines, and advocates for improved healthcare facilities.",
    },
    {
      tag: "03",
      title: "Agricultural Development",
      summary: "Empowering farmers with modern techniques, seeds, and market access for sustainable livelihoods.",
      detail: "We provide vocational training in agriculture, connect farmers to markets, and supply modern equipment to increase food production.",
    },
    {
      tag: "04",
      title: "Women Empowerment",
      summary: "Supporting women through skills training, microfinance, and leadership development programs.",
      detail: "Our women's wing organizes vocational training, microfinance access, and mentorship connecting women with professionals.",
    },
    {
      tag: "05",
      title: "Youth Development",
      summary: "Sports, mentorship, and leadership programs for the next generation.",
      detail: "Our youth wing organizes sports tournaments, leadership summits, and mentorship programs connecting young people with successful indigenes in diaspora.",
    },
    {
      tag: "06",
      title: "Cultural Preservation",
      summary: "Festivals, history, and community identity programs.",
      detail: "We document oral histories, organize the annual Cultural Festival, and maintain a digital archive of community heritage.",
    },
  ],
};

export default function Services({ data }: { data: ServicesContent | null }) {
  const d = data ?? DEFAULT;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="services" className="py-20 px-6 bg-forest-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
              {d.sectionLabel}
            </p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
              {d.headline}
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/30 text-white text-sm font-medium hover:border-white hover:bg-white/10 transition-all duration-200 flex-shrink-0"
          >
            View All Programs
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {d.services.slice(0, 4).map(({ title, summary, detail }, i) => {
            const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
            return (
              <article
                key={title}
                className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-all duration-300 cursor-default group"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image area */}
                <div
                  className={`h-40 w-full bg-gradient-to-br ${CARD_COLORS[i]} flex items-center justify-center`}
                >
                  <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-white/70" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="icon-box-green mb-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-base mb-2">{title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {hovered === i ? detail : summary}
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
