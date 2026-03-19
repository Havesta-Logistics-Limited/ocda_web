"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export interface AboutPreviewContent {
  sectionLabel?: string;
  headline?: string;
  headlineAccent?: string;
  description?: string;
  bullets?: { title: string; description: string }[];
  image?: string;
}

const DEFAULT: AboutPreviewContent = {
  sectionLabel: "WHO WE ARE",
  headline: "Empowering Communities,",
  headlineAccent: "Transforming Lives",
  description:
    "Founded in 2010, the Ojobeda Community Development Association (OCDA) has been at the forefront of grassroots community development across Nigeria. We work tirelessly to create sustainable programs that uplift communities and provide lasting solutions to social challenges.",
  bullets: [
    { title: "Our Mission", description: "To empower Nigerian communities through sustainable development, education, healthcare, and economic programs." },
    { title: "Our Vision", description: "A Nigeria where every community has access to quality education, healthcare, and economic opportunities." },
    { title: "Our Values", description: "Integrity, inclusivity, community ownership, and sustainability guide everything we do." },
  ],
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function AboutPreview({ data }: { data: AboutPreviewContent | null }) {
  const d = data ?? DEFAULT;
  const rawPillars = (d as any).pillars as { title: string; body: string }[] | undefined;
  const bullets = rawPillars && rawPillars.length > 0
    ? rawPillars.map((p) => ({ title: p.title, description: p.body }))
    : (d.bullets ?? DEFAULT.bullets!);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-6 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.75, ease }}
          >
            <p className="section-label mb-3">{d.sectionLabel ?? DEFAULT.sectionLabel}</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-6 leading-tight">
              {d.headline ?? DEFAULT.headline}{" "}
              <span className="text-forest-800">{d.headlineAccent ?? DEFAULT.headlineAccent}</span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {d.description ?? DEFAULT.description}
            </p>

            <div className="space-y-5 mb-10">
              {bullets.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12, ease }}
                  className="flex items-start gap-4"
                >
                  <span className="mt-0.5 flex-shrink-0 h-6 w-6 rounded-full bg-forest-800 flex items-center justify-center">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </span>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-0.5">{b.title}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.55, ease }}
              whileHover={{ scale: 1.03, y: -2 }}
              style={{ display: "inline-block" }}
            >
              <Link href="/about" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 text-white text-sm font-semibold hover:bg-forest-900 transition-colors duration-200">
                Learn More About Us <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease }}
            className="relative"
          >
            <div className="w-full rounded-2xl overflow-hidden" style={{ height: "420px", background: "linear-gradient(135deg, #166534 0%, #14532d 50%, #052e16 100%)" }}>
              {d.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.image} alt="About OCDA" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center gap-4 p-8">
                    <div className="h-24 w-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="font-display font-bold text-white text-3xl">CD</span>
                    </div>
                    <p className="text-white/60 text-sm text-center">Ojobeda Community Development Association</p>
                    <div className="flex gap-3 mt-4">
                      {[1, 2, 3].map((n) => (
                        <div key={n} className="h-16 w-16 rounded-xl bg-white/10 border border-white/15" />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg border border-gray-100 px-5 py-4"
            >
              <p className="font-display font-bold text-3xl text-forest-800">13+</p>
              <p className="text-gray-500 text-xs font-medium mt-0.5">Years of Impact</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6, ease }}
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3"
            >
              <p className="font-display font-bold text-2xl text-gold-600">50K+</p>
              <p className="text-gray-500 text-xs font-medium mt-0.5">Lives Impacted</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
