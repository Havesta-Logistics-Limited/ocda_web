"use client";

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export interface FooterContent {
  description: string;
  links: Record<string, string[]>;
  email: string;
  phone: string;
  address: string;
  logoText?: string;
  logoSubtext?: string;
  logoImage?: string;
}

const DEFAULT: FooterContent = {
  description: "Ojobeda Community Development Association — building a stronger, more united community through development, empowerment, and cultural pride.",
  links: {
    "Quick Links": ["Home", "About Us", "Programs", "Projects", "Get Involved", "Contact"],
    "Our Programs": ["Education Initiative", "Healthcare Outreach", "Women Empowerment", "Youth Development", "Agricultural Development"],
  },
  email: "info@ocda.ng",
  phone: "+234 801 234 5678",
  address: "15 Community Drive, Victoria Island, Lagos, Nigeria",
};

const QUICK_LINK_MAP: Record<string, string> = {
  Home: "/", "About Us": "/about", Programs: "/programs", Projects: "/projects", "Get Involved": "/get-involved", Contact: "/contact",
};

const SOCIAL_LABELS = ["Facebook", "Twitter", "Instagram", "LinkedIn"];
const SOCIAL_ICONS = [Facebook, Twitter, Instagram, Linkedin];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Footer({ data }: { data: FooterContent | null }) {
  const d = data ?? DEFAULT;
  const year = new Date().getFullYear();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.footer
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease }}
      className="bg-gray-900 text-gray-400"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
        >
          {/* Brand */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
            className="lg:col-span-1"
          >
            <div className="flex items-center gap-2.5 mb-5">
              {d.logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={d.logoImage} alt={d.logoText ?? "OCDA"} className="h-9 w-9 rounded-lg object-contain bg-forest-800 flex-shrink-0" />
              ) : (
                <span className="h-9 w-9 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-display font-bold text-sm">{(d.logoText ?? "OCDA").slice(0, 2).toUpperCase()}</span>
                </span>
              )}
              <div>
                <p className="font-display font-bold text-white text-base leading-none">{d.logoText ?? "OCDA"}</p>
                <p className="text-gray-500 text-xs leading-none mt-0.5">{d.logoSubtext ?? "Community Development"}</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">{d.description}</p>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="h-9 w-9 rounded-full border border-gray-700 hover:border-forest-600 bg-gray-800 hover:bg-forest-800 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200"
                  aria-label={SOCIAL_LABELS[i]}
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
            <h3 className="font-semibold text-white text-sm mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "About Us", "Programs", "Projects", "Get Involved", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={QUICK_LINK_MAP[item] ?? "/"} className="text-gray-500 text-sm hover:text-white transition-colors duration-200">{item}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Our Programs */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
            <h3 className="font-semibold text-white text-sm mb-5">Our Programs</h3>
            <ul className="space-y-3">
              {["Education Initiative", "Healthcare Outreach", "Women Empowerment", "Youth Development", "Agricultural Development"].map((item) => (
                <li key={item}>
                  <Link href="/programs" className="text-gray-500 text-sm hover:text-white transition-colors duration-200">{item}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
            <h3 className="font-semibold text-white text-sm mb-5">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-forest-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-500 text-sm">{d.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-forest-400 flex-shrink-0" />
                <a href={"tel:" + d.phone.replace(/\s/g, "")} className="text-gray-500 text-sm hover:text-white transition-colors">{d.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-forest-400 flex-shrink-0" />
                <a href={"mailto:" + d.email} className="text-gray-500 text-sm hover:text-white transition-colors">{d.email}</a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-gray-600 text-xs">© {year} Community Development Association of Nigeria. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs">
            <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
