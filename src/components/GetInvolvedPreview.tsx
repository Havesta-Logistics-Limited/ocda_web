"use client";

import Link from "next/link";
import { Heart, Users, Briefcase, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export default function GetInvolvedPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const actions = [
    { icon: Heart, title: "Make a Donation", description: "Your financial support directly funds our community programs, from education to healthcare access.", href: "/get-involved", iconBg: "bg-gold-100", iconColor: "text-gold-600" },
    { icon: Users, title: "Volunteer With Us", description: "Contribute your time and skills to make a real difference in Nigerian communities.", href: "/get-involved", iconBg: "bg-teal-100", iconColor: "text-teal-600" },
    { icon: Briefcase, title: "Partner With Us", description: "Collaborate with OCDA through corporate partnerships, grants, or strategic alliances.", href: "/get-involved", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  ];

  return (
    <section className="py-24 px-6 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease }}
          className="max-w-2xl"
        >
          <p className="section-label mb-3">JOIN OUR MOVEMENT</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-5 leading-tight">Be Part of the Change</h2>
          <p className="text-gray-600 text-base leading-relaxed mb-8">
            Together, we can build stronger communities across Nigeria. Whether you donate, volunteer, or partner with us — every contribution matters and creates lasting impact.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link href="/get-involved" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 text-white text-sm font-semibold hover:bg-forest-900 transition-colors duration-200">
                <Heart className="h-4 w-4" /> Donate Now
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
              <Link href="/get-involved" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 text-sm font-semibold hover:border-forest-800 hover:text-forest-800 transition-all duration-200">
                <Users className="h-4 w-4" /> Volunteer
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 32, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease } },
                }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="card p-6 flex flex-col gap-4 md:col-span-1"
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${action.iconBg}`}>
                  <Icon className={`h-5 w-5 ${action.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-base mb-2">{action.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{action.description}</p>
                  <Link href={action.href} className="inline-flex items-center gap-1.5 text-forest-800 text-xs font-semibold hover:text-forest-900 transition-colors">
                    Get started <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </motion.div>
            );
          })}

          {/* Stat box */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 32, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease } },
            }}
            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
            className="bg-forest-800 rounded-xl p-6 flex flex-col items-center justify-center text-center md:col-span-1"
          >
            <p className="font-display font-bold text-4xl text-gold-400 mb-1">₦2.5B+</p>
            <p className="text-white/80 text-sm font-medium mb-2">Funds Mobilized</p>
            <p className="text-white/50 text-xs leading-relaxed">Supporting communities across Nigeria</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
