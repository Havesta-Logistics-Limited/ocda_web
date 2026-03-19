"use client";

import { ChevronDown, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export interface HeroContent {
  badge: string;
  headline: string;
  headlineAccent: string;
  typingTexts: string[];
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  backgroundImage?: string;
  backgroundVideo?: string;
}

const DEFAULT: HeroContent = {
  badge: "Transforming Communities Since 2010",
  headline: "Building Stronger",
  headlineAccent: "Communities Together",
  typingTexts: ["Community Growth.", "Empowering Youth.", "Building Infrastructure.", "Preserving Heritage."],
  description:
    "We empower Nigerian communities through sustainable development programs in education, healthcare, and economic empowerment. Join us in creating lasting change.",
  primaryCta: { label: "Our Programs →", href: "/programs" },
  secondaryCta: { label: "Get Involved", href: "/get-involved" },
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero({ data }: { data: HeroContent | null }) {
  const d = data ?? DEFAULT;

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
      style={{ background: "linear-gradient(135deg, #052e16 0%, #14532d 35%, #166534 60%, #15803d 80%, #1a7a3c 100%)" }}
    >
      {d.backgroundVideo ? (
        <>
          <video
            src={d.backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-forest-950/70" aria-hidden="true" />
        </>
      ) : d.backgroundImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.backgroundImage} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-forest-950/70" aria-hidden="true" />
        </>
      ) : null}

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }} aria-hidden="true" />

      {/* Animated decorative circles */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none" aria-hidden="true">
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: 0.3, ease }} className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full border border-white/10" />
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: 0.5, ease }} className="absolute top-1/3 right-1/3 w-48 h-48 rounded-full border border-white/10" />
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: 0.7, ease }} className="absolute bottom-1/4 right-1/5 w-32 h-32 rounded-full border border-white/10" />
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.4 }} className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-white/5" style={{ transform: "translate(30%, -30%)" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-semibold mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold-400 flex-shrink-0" />
          {d.badge}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.3, ease }}
          className="font-display font-extrabold leading-tight mb-6"
        >
          <span className="text-white text-5xl md:text-6xl lg:text-8xl block">{d.headline}</span>
          <motion.span
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.5, ease }}
            className="text-gold-400 text-5xl md:text-6xl lg:text-8xl block"
          >
            {d.headlineAccent}
          </motion.span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease }}
          className="text-white/85 text-lg md:text-xl font-medium leading-relaxed mb-10 max-w-2xl"
        >
          {d.description}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link href="/programs" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gold-600 text-white text-sm font-bold hover:bg-gold-700 transition-colors duration-200 shadow-lg">
              Our Programs <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Link href="/get-involved" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-transparent text-white text-sm font-bold border-2 border-white/60 hover:border-white hover:bg-white/10 transition-all duration-200">
              <Users className="h-4 w-4" /> Get Involved
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 hover:text-white/80 transition-colors animate-float"
        aria-label="Scroll down"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.a>
    </section>
  );
}
