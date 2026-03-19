"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

const INFO_CARDS = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["15 Community Drive,", "Victoria Island,", "Lagos, Nigeria"],
    iconBg: "bg-forest-50",
    iconColor: "text-forest-800",
    borderColor: "border-forest-100",
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+234 801 234 5678", "+234 802 345 6789"],
    iconBg: "bg-blue-50",
    iconColor: "text-blue-700",
    borderColor: "border-blue-100",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@ocda.ng", "volunteer@cdan.org.ng"],
    iconBg: "bg-gold-50",
    iconColor: "text-gold-700",
    borderColor: "border-gold-100",
  },
  {
    icon: Clock,
    title: "Working Hours",
    lines: ["Mon – Fri: 8am – 6pm", "Saturday: 9am – 2pm"],
    iconBg: "bg-purple-50",
    iconColor: "text-purple-700",
    borderColor: "border-purple-100",
  },
];

const SOCIAL_ICONS = [
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
];

export default function ContactClient() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="pt-[72px]">
      {/* Page Hero */}
      <section className="bg-forest-800 py-20 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
            CONTACT US
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-white/70 max-w-2xl text-base leading-relaxed">
            Have a question, want to partner, or need more information about our programs?
            Reach out to us — we&apos;re always happy to connect.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INFO_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className={`card p-6 border ${card.borderColor}`}>
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${card.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-base mb-3">
                  {card.title}
                </h3>
                <div className="space-y-1">
                  {card.lines.map((line, j) => (
                    <p key={j} className="text-gray-500 text-sm">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Fill out the form below and we&apos;ll get back to you within 24 hours.
            </p>

            {submitted ? (
              <div className="card p-8 text-center">
                <div className="h-16 w-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
                  <Send className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-display font-bold text-xl text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm">
                  Thank you for reaching out. Our team will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-800 text-white text-sm font-semibold hover:bg-forest-900 transition-colors shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Map + Social */}
          <div className="space-y-6">
            {/* Map placeholder */}
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                height: "300px",
                background: "linear-gradient(135deg, #166534 0%, #14532d 50%, #052e16 100%)",
              }}
            >
              <div
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* Grid lines */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="h-12 w-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-white font-semibold text-sm">Victoria Island, Lagos</p>
                  <p className="text-white/60 text-xs mt-1">15 Community Drive</p>
                </div>
              </div>
            </div>

            {/* Social card */}
            <div className="card p-6">
              <h3 className="font-display font-bold text-gray-900 text-base mb-2">
                Connect With Us
              </h3>
              <p className="text-gray-500 text-sm mb-5">
                Follow us on social media for updates on our programs and community stories.
              </p>
              <div className="flex gap-3">
                {SOCIAL_ICONS.map(({ icon: Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="h-10 w-10 rounded-full border-2 border-gray-200 hover:border-forest-600 hover:bg-forest-50 flex items-center justify-center text-gray-500 hover:text-forest-800 transition-all duration-200"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
