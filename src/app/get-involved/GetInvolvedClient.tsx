"use client";

import { useState } from "react";
import { Heart, Users, Briefcase, Building2, Send } from "lucide-react";
import type { GetInvolvedData } from "./page";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

const ICON_MAP = [Heart, Users, Briefcase];

const DEFAULT_FEATURE_CARDS = [
  { title: "Make a Donation", description: "Your financial contribution directly funds our programs in education, healthcare, women empowerment, and youth development across Nigeria." },
  { title: "Volunteer With Us", description: "Share your skills, time, and passion to support our field teams, events, and community outreach programs." },
  { title: "Partner With Us", description: "Corporate partnerships, foundation grants, and strategic alliances amplify our impact across communities." },
];

const DEFAULT_PRESET_AMOUNTS = ["5,000", "10,000", "25,000", "50,000", "100,000"];

export default function GetInvolvedClient({ data }: { data: GetInvolvedData }) {
  const [activeTab, setActiveTab] = useState<"donate" | "volunteer">("donate");
  const [selectedAmount, setSelectedAmount] = useState("25,000");
  const [customAmount, setCustomAmount] = useState("");

  const pageHero = data.pageHero ?? {};
  const featureCards = (data.featureCards && data.featureCards.length > 0) ? data.featureCards : DEFAULT_FEATURE_CARDS;
  const donate = data.donate ?? {};
  const volunteer = data.volunteer ?? {};
  const presetAmounts = (donate.presetAmounts && donate.presetAmounts.length > 0) ? donate.presetAmounts : DEFAULT_PRESET_AMOUNTS;

  return (
    <main className="pt-[72px]">
      {/* Page Hero */}
      <section className="bg-forest-800 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <AnimateIn className="max-w-7xl mx-auto relative z-10">
          <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
            {pageHero.label ?? "GET INVOLVED"}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            {pageHero.headline ?? "Join Us in Building Stronger Communities"}
          </h1>
          <p className="text-white/70 max-w-2xl text-base leading-relaxed">
            {pageHero.description ?? "Every action counts. Whether you donate, volunteer, or partner — you're making a real difference in the lives of thousands of Nigerians."}
          </p>
        </AnimateIn>
      </section>

      {/* Feature cards */}
      <section className="py-16 px-6 bg-gray-50">
        <StaggerContainer className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureCards.map((card, i) => {
            const Icon = ICON_MAP[i % ICON_MAP.length];
            const styles = [
              { iconBg: "bg-gold-100", iconColor: "text-gold-600" },
              { iconBg: "bg-teal-100", iconColor: "text-teal-600" },
              { iconBg: "bg-blue-100", iconColor: "text-blue-600" },
            ];
            const style = styles[i % styles.length];
            return (
              <StaggerItem key={i} className="card p-6">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${style.iconBg}`}>
                  <Icon className={`h-6 w-6 ${style.iconColor}`} />
                </div>
                <h3 className="font-display font-bold text-gray-900 text-base mb-3">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* Tab Section */}
      <section className="py-16 px-6 bg-white">
        <AnimateIn className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab("donate")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "donate" ? "bg-forest-800 text-white shadow-sm" : "bg-white border-2 border-gray-200 text-gray-600 hover:border-forest-800 hover:text-forest-800"}`}
            >
              <Heart className="h-4 w-4" />Donate
            </button>
            <button
              onClick={() => setActiveTab("volunteer")}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === "volunteer" ? "bg-forest-800 text-white shadow-sm" : "bg-white border-2 border-gray-200 text-gray-600 hover:border-forest-800 hover:text-forest-800"}`}
            >
              <Users className="h-4 w-4" />Volunteer
            </button>
          </div>

          {/* Donate Tab */}
          {activeTab === "donate" && (
            <div className="card p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">
                {donate.headline ?? "Make a Donation"}
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                {donate.description ?? "Your contribution directly supports our community programs across Nigeria. All donations are tax-deductible."}
              </p>

              {/* Amount selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Amount (₦)</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                  {presetAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                      className={`px-3 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all duration-150 ${selectedAmount === amount && !customAmount ? "bg-forest-800 border-forest-800 text-white" : "bg-white border-gray-200 text-gray-700 hover:border-forest-700 hover:text-forest-800"}`}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-2">Or Enter Custom Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₦</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(""); }}
                      placeholder="Enter amount in Naira"
                      className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Transfer Details */}
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4 text-forest-800" />
                  <h3 className="font-semibold text-gray-900 text-sm">Bank Transfer Details</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bank:</span>
                    <span className="font-semibold text-gray-900">{donate.bankName ?? "First Bank of Nigeria"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Name:</span>
                    <span className="font-semibold text-gray-900">{donate.accountName ?? "OCDA Nigeria"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Account Number:</span>
                    <span className="font-semibold text-gray-900 font-mono">{donate.accountNumber ?? "0123456789"}</span>
                  </div>
                </div>
              </div>

              <button className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold-600 text-white text-sm font-semibold hover:bg-gold-700 transition-colors shadow-sm">
                <Heart className="h-4 w-4" />Proceed to Donate
              </button>
            </div>
          )}

          {/* Volunteer Tab */}
          {activeTab === "volunteer" && (
            <div className="card p-8">
              <h2 className="font-display font-bold text-2xl text-gray-900 mb-2">
                {volunteer.headline ?? "Volunteer With Us"}
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                {volunteer.description ?? "Join our network of passionate volunteers making a difference across Nigeria. Fill out the form and our team will be in touch."}
              </p>
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); alert("Application submitted! We'll be in touch soon."); }}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input type="text" required placeholder="Enter your full name" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input type="email" required placeholder="your@email.com" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input type="tel" placeholder="+234 800 000 0000" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Skills / Expertise *</label>
                  <textarea required rows={4} placeholder="Tell us about your skills, experience, and how you'd like to contribute..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-forest-700 focus:outline-none transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-forest-800 text-white text-sm font-semibold hover:bg-forest-900 transition-colors shadow-sm">
                  <Send className="h-4 w-4" />Submit Application
                </button>
              </form>
            </div>
          )}
        </AnimateIn>
      </section>
    </main>
  );
}
