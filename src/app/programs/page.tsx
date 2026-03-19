import { Users } from "lucide-react";
import { getContent } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/AnimateIn";

export const revalidate = 60;

export const metadata = {
  title: "Our Programs — OCDA",
  description:
    "Explore OCDA's community programs: Women Empowerment, Education, Healthcare, Agriculture, and Youth Development across Nigeria.",
};

interface Program {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  beneficiaries: string;
  gradient: string;
}

interface ProgramsPageData {
  pageHero?: { label?: string; headline?: string; description?: string };
  programs?: Program[];
  statsSection?: {
    title?: string;
    description?: string;
    stats?: Array<{ value: string; label: string }>;
  };
}

const DEFAULT_PROGRAMS: Program[] = [
  { title: "Women Economic Empowerment", description: "Our flagship women's program provides micro-financing, business skills training, and mentorship to women entrepreneurs. We've helped establish over 200 women-owned businesses and cooperatives across Nigeria.", category: "Women Empowerment", categoryColor: "bg-purple-100 text-purple-700", beneficiaries: "5,200+", gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" },
  { title: "Education for All Initiative", description: "From scholarships to school infrastructure, our education program ensures every child has access to quality learning. We've built 12 classrooms, equipped 25 libraries, and sponsored thousands of students.", category: "Education", categoryColor: "bg-blue-100 text-blue-700", beneficiaries: "8,500+", gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" },
  { title: "Community Health Outreach", description: "Mobile clinics, immunization drives, maternal health programs, and health education bring essential medical care to underserved communities across 20+ states.", category: "Healthcare", categoryColor: "bg-red-100 text-red-700", beneficiaries: "15,000+", gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" },
  { title: "Sustainable Agriculture Program", description: "Modern farming techniques, access to quality inputs, irrigation support, and cooperative formation for smallholder farmers. We're building food security from the ground up.", category: "Agriculture", categoryColor: "bg-green-100 text-green-700", beneficiaries: "3,800+", gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" },
  { title: "Youth Skills Development", description: "Vocational training, digital literacy, entrepreneurship boot camps, and leadership programs for Nigerian youth aged 15–35. Building the next generation of community leaders.", category: "Youth Development", categoryColor: "bg-teal-100 text-teal-700", beneficiaries: "4,200+", gradient: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)" },
];

const DEFAULT_STATS = [
  { value: "6", label: "Active Programs" },
  { value: "35+", label: "Communities" },
  { value: "50K+", label: "Lives Impacted" },
  { value: "120+", label: "Projects" },
];

export default async function ProgramsPage() {
  const pageData = await getContent<ProgramsPageData>("programs_page");
  const d = pageData ?? {};
  const pageHero = d.pageHero ?? {};
  const programs = (d.programs && d.programs.length > 0) ? d.programs : DEFAULT_PROGRAMS;
  const statsSection = d.statsSection ?? {};
  const stats = (statsSection.stats && statsSection.stats.length > 0) ? statsSection.stats : DEFAULT_STATS;

  return (
    <main className="pt-[72px]">
      {/* Page Hero */}
      <section className="bg-forest-800 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <AnimateIn className="max-w-7xl mx-auto relative z-10">
          <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
            {pageHero.label ?? "OUR PROGRAMS"}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            {pageHero.headline ?? "Transforming Communities Through Action"}
          </h1>
          <p className="text-white/70 max-w-2xl text-base leading-relaxed">
            {pageHero.description ?? "Our evidence-based programs are designed to create lasting change — addressing root causes of poverty and inequality in Nigerian communities."}
          </p>
        </AnimateIn>
      </section>

      {/* Programs Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, i) => (
              <StaggerItem key={i} className={`card overflow-hidden flex flex-col ${i === 3 ? "lg:col-start-1" : ""}`}>
                <div className="relative overflow-hidden" style={{ height: "240px", background: program.gradient }}>
                  <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${program.categoryColor} bg-white`}>
                      {program.category}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-gray-900 text-lg mb-3">{program.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{program.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-display font-bold text-2xl text-gray-900">{program.beneficiaries}</p>
                        <p className="text-gray-400 text-xs">Beneficiaries</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />Active
                    </span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-10 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <ScaleIn className="bg-forest-800 rounded-2xl px-8 py-12 text-center">
            <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">OUR IMPACT</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
              {statsSection.title ?? "Together, We're Making a Difference"}
            </h2>
            <p className="text-white/60 text-sm mb-10 max-w-xl mx-auto">
              {statsSection.description ?? "Across Nigeria, our programs continue to transform communities and create opportunity for thousands of families every year."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="font-display font-bold text-3xl md:text-4xl text-gold-400 mb-1">{stat.value}</p>
                  <p className="text-white/70 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </ScaleIn>
        </div>
      </section>
    </main>
  );
}
