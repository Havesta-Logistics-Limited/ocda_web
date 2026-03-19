"use client";

import { Target, Eye, Star } from "lucide-react";

export interface AboutContent {
  sectionLabel: string;
  headline: string;
  headlineAccent: string;
  description: string;
  pillars: { title: string; body: string }[];
}

const DEFAULT: AboutContent = {
  sectionLabel: "WHO WE ARE",
  headline: "Empowering Communities,",
  headlineAccent: "Transforming Lives",
  description:
    "Founded in 2010, the Community Development Association of Nigeria (CDAN) is dedicated to fostering sustainable development across Nigerian communities. We believe that every community has the potential to thrive when given the right resources, support, and opportunities.",
  pillars: [
    {
      title: "Our Mission",
      body: "To empower communities through sustainable development initiatives that promote education, healthcare, and economic growth.",
    },
    {
      title: "Our Vision",
      body: "A Nigeria where every community has access to quality education, healthcare, and economic opportunities.",
    },
    {
      title: "Our Values",
      body: "Integrity, community ownership, sustainability, and inclusive development guide everything we do.",
    },
  ],
};

const PILLAR_ICONS = [Target, Eye, Star];

export default function About({ data }: { data: AboutContent | null }) {
  const d = data ?? DEFAULT;

  return (
    <section id="about" className="py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            <p className="section-label mb-3">{d.sectionLabel}</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 leading-tight mb-5">
              {d.headline}{" "}
              <span className="text-forest-800">{d.headlineAccent}</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-10">
              {d.description}
            </p>

            <div className="space-y-7">
              {d.pillars.map(({ title, body }, i) => {
                const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
                return (
                  <div key={title} className="flex items-start gap-4">
                    <div className="icon-box-green flex-shrink-0 mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base mb-1">{title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: photo placeholder + stat overlay */}
          <div className="relative">
            {/* Photo area */}
            <div
              className="rounded-2xl overflow-hidden aspect-[4/3] w-full"
              style={{
                background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #4ade80 100%)",
              }}
            >
              {/* Decorative community illustration */}
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center text-white/60 p-8">
                  <div className="flex justify-center gap-3 mb-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 w-16 rounded-full bg-white/20 border-2 border-white/30" style={{ marginTop: i === 1 ? '-8px' : '0' }} />
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 mt-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 w-12 rounded-full bg-white/15 border-2 border-white/20" />
                    ))}
                  </div>
                  <p className="mt-6 text-white/50 text-sm">Community Photo</p>
                </div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-5 max-w-[180px]">
              <p className="font-display font-bold text-3xl text-forest-800">13+</p>
              <p className="text-gray-500 text-xs leading-snug mt-1">
                Years of dedicated community service across Nigeria
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
