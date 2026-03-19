"use client";

import { useEffect, useRef, useState } from "react";
import { Users, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { motion, useInView } from "framer-motion";

export interface StatsContent {
  sectionLabel: string;
  stats: { value: number; suffix: string; label: string; description: string }[];
}

const ICONS = [Users, MapPin, Briefcase, GraduationCap];

const DEFAULT: StatsContent = {
  sectionLabel: "OUR IMPACT",
  stats: [
    { value: 50000, suffix: "+", label: "Lives Impacted", description: "" },
    { value: 35, suffix: "", label: "Communities Served", description: "" },
    { value: 120, suffix: "+", label: "Projects Completed", description: "" },
    { value: 8500, suffix: "", label: "Students Supported", description: "" },
  ],
};

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [current, setCurrent] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 2000;
        const steps = 60;
        const stepTime = duration / steps;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const ease = 1 - Math.pow(1 - step / steps, 3);
          setCurrent(Math.round(target * ease));
          if (step >= steps) clearInterval(timer);
        }, stepTime);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-display font-bold text-4xl md:text-5xl text-gray-900 tabular-nums">
      {current.toLocaleString()}
      <span className="text-forest-700">{suffix}</span>
    </span>
  );
}

const ease = [0.22, 1, 0.36, 1] as const;

export default function Stats({ data }: { data: StatsContent | null }) {
  const d = data ?? DEFAULT;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="stats" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-14"
        >
          <p className="section-label mb-3">{d.sectionLabel}</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900">
            Creating Measurable Change
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {d.stats.map(({ value, suffix, label }, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={label}
                variants={{
                  hidden: { opacity: 0, y: 32, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease } },
                }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="card p-8 text-center"
              >
                <div className="icon-box-green mx-auto mb-5">
                  <Icon className="h-5 w-5" />
                </div>
                <AnimatedNumber target={value} suffix={suffix} />
                <p className="text-gray-500 text-sm font-medium mt-2">{label}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
