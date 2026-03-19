"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Heart, Sprout, Users, Briefcase } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export interface ServicesContent {
  sectionLabel?: string;
  headline?: string;
  services?: { title: string; description: string; icon?: string }[];
}

const PROGRAM_ICONS = [BookOpen, Heart, Users, Sprout, Briefcase];

const DEFAULT_PROGRAMS = [
  { title: "Education Initiative", description: "Providing access to quality education for children and adults across underserved communities, with scholarships and school infrastructure.", category: "Education", color: "#2563eb" },
  { title: "Healthcare Outreach", description: "Mobile clinics, health screenings, and medical outreach programs serving remote and underserved communities throughout Nigeria.", category: "Healthcare", color: "#dc2626" },
  { title: "Women Empowerment", description: "Skills training, microfinance, and mentorship programs designed to economically empower women and promote gender equality.", category: "Empowerment", color: "#7c3aed" },
  { title: "Youth Development", description: "Leadership training, vocational skills, and entrepreneurship programs for Nigerian youth to build a better future.", category: "Youth", color: "#0d9488" },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function ProgramsPreview({ data }: { data: ServicesContent | null }) {
  const programs = data?.services ?? DEFAULT_PROGRAMS;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 px-6 bg-forest-800" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">WHAT WE DO</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white leading-tight">Our Core Programs</h2>
          </div>
          <motion.div whileHover={{ scale: 1.04, y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <Link href="/programs" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/40 text-white text-sm font-semibold hover:border-white hover:bg-white/10 transition-all duration-200 self-start md:self-auto">
              View All Programs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {programs.map((program: any, i: number) => {
            const Icon = PROGRAM_ICONS[i % PROGRAM_ICONS.length];
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 36, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease } },
                }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="rounded-xl overflow-hidden border border-white/10 bg-white/10 hover:bg-white/15 transition-colors duration-300 flex flex-col"
              >
                {/* Image area */}
                <div className="relative overflow-hidden" style={{ height: "200px", background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)" }}>
                  {(program as any).image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={(program as any).image} alt={program.title} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-forest-950/60 to-transparent" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icon className="h-16 w-16 text-white/20" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-forest-950/60 to-transparent" />
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-4">
                    <div className="h-10 w-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-gold-300" />
                    </div>
                    <h3 className="font-display font-bold text-white text-base mb-2">{program.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{program.description}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <Link href="/programs" className="inline-flex items-center gap-1.5 text-gold-300 text-xs font-semibold hover:text-gold-200 transition-colors">
                      Learn more <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
