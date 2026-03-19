"use client";

import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";

export interface NavbarContent {
  logo: string;
  logoFull: string;
  logoImage?: string;
  links: { href: string; label: string }[];
  ctaLabel: string;
  ctaHref: string;
}

const DEFAULT: NavbarContent = {
  logo: "CD",
  logoFull: "OCDA",
  links: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/programs", label: "Programs" },
    { href: "/projects", label: "Projects" },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/contact", label: "Contact" },
  ],
  ctaLabel: "Donate Now",
  ctaHref: "/get-involved",
};

export default function Navbar({ data }: { data: NavbarContent | null }) {
  const d = data ?? DEFAULT;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Always use page routes regardless of db data
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/programs", label: "Programs" },
    { href: "/projects", label: "Projects" },
    { href: "/get-involved", label: "Get Involved" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={clsx(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "bg-white shadow-sm py-3" : "bg-white/95 backdrop-blur-sm py-4"
      )}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-6 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-2.5" aria-label="OCDA Home">
          {d.logoImage ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={d.logoImage} alt={d.logoFull} className="h-9 w-auto object-contain flex-shrink-0" />
          ) : (
            <>
              <span className="h-9 w-9 rounded-lg bg-forest-800 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-display font-bold text-sm">{d.logo}</span>
              </span>
              <div className="leading-tight">
                <p className="font-display font-bold text-gray-900 text-base leading-none">{d.logoFull}</p>
                <p className="text-gray-500 text-xs leading-none mt-0.5">Community Development</p>
              </div>
            </>
          )}
        </Link>

        <ul className="hidden md:flex items-center gap-7" role="list">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "text-sm font-medium transition-colors duration-200",
                  isActive(href)
                    ? "text-gold-600 font-semibold"
                    : "text-gray-600 hover:text-forest-800"
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/get-involved"
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-600 text-white text-sm font-semibold hover:bg-gold-700 transition-colors duration-200 shadow-sm"
        >
          <Heart className="h-3.5 w-3.5" />
          {d.ctaLabel}
        </Link>

        <button
          className="md:hidden p-2 text-gray-600 hover:text-forest-800 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={clsx(
          "md:hidden transition-all duration-300 overflow-hidden border-t border-gray-100 bg-white",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
        aria-hidden={!open}
      >
        <ul className="flex flex-col px-6 py-4 gap-1" role="list">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block py-2.5 text-sm font-medium transition-colors border-b border-gray-50",
                  isActive(href)
                    ? "text-gold-600 font-semibold"
                    : "text-gray-600 hover:text-forest-800"
                )}
                tabIndex={open ? 0 : -1}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-3">
            <Link
              href="/get-involved"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-600 text-white text-sm font-semibold"
              tabIndex={open ? 0 : -1}
            >
              <Heart className="h-3.5 w-3.5" />
              {d.ctaLabel}
            </Link>
          </li>
        </ul>
      </div>
    </motion.header>
  );
}
