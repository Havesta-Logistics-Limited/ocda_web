"use client";

import { useState } from "react";
import { MapPin, Filter, Lightbulb, Calendar, Banknote } from "lucide-react";
import type { ProjectsPageData } from "./page";
import { AnimateIn, StaggerContainer, StaggerItem } from "@/components/AnimateIn";

const DEFAULT_PROJECTS = [
  { id: 1, title: "Community Water Project", location: "Sokoto State", status: "Ongoing", description: "Construction of boreholes, water purification systems, and distribution pipelines to provide clean, safe drinking water to rural communities in Sokoto State.", impact: "Clean water access for 5,000+ residents", date: "Mar 2024", budget: "₦35.0M", gradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)" },
  { id: 2, title: "Kano State Primary School Construction", location: "Kano State", status: "Ongoing", description: "Building a 6-classroom primary school with library, computer lab, and sanitation facilities to serve underserved communities in rural Kano State.", impact: "Will provide education access for 500+ children", date: "Jan 2024 – Aug 2024", budget: "₦45.0M", gradient: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" },
  { id: 3, title: "Mobile Health Clinic", location: "Warri, Delta State", status: "Ongoing", description: "A fleet of 3 fully equipped mobile health clinics providing primary healthcare, maternal care, and disease prevention across 10 Delta State communities.", impact: "Serving 10 communities with essential healthcare", date: "Feb 2024", budget: "₦28.0M", gradient: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)" },
  { id: 4, title: "Women Skills Training Center", location: "Ibadan, Oyo State", status: "Completed", description: "A state-of-the-art vocational training center offering courses in tailoring, catering, beauty services, and digital skills for women aged 18–45.", impact: "Trained 350 women in marketable skills", date: "Jun 2023 – Jan 2024", budget: "₦18.0M", gradient: "linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)" },
];

const FILTERS = ["All Projects", "Ongoing", "Completed", "Planned"];

export default function ProjectsClient({ data }: { data: ProjectsPageData }) {
  const [activeFilter, setActiveFilter] = useState("All Projects");

  const pageHero = data.pageHero ?? {};
  const projects = (data.projects && data.projects.length > 0) ? data.projects : DEFAULT_PROJECTS;

  const filtered = activeFilter === "All Projects" ? projects : projects.filter((p) => p.status === activeFilter);

  return (
    <main className="pt-[72px]">
      {/* Page Hero */}
      <section className="bg-forest-800 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <AnimateIn className="max-w-7xl mx-auto relative z-10">
          <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
            {pageHero.label ?? "OUR PROJECTS"}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            {pageHero.headline ?? "Real Impact on the Ground"}
          </h1>
          <p className="text-white/70 max-w-2xl text-base leading-relaxed">
            {pageHero.description ?? "From water infrastructure to education facilities and healthcare clinics — see the concrete work we're doing to transform communities across Nigeria."}
          </p>
        </AnimateIn>
      </section>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-[72px] z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mr-2">
            <Filter className="h-4 w-4" />Filter by Status:
          </div>
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${activeFilter === filter ? "bg-forest-800 text-white" : "text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-300"}`}
            >
              {filter}
            </button>
          ))}
          <span className="ml-auto text-gray-400 text-xs">{filtered.length} project{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Projects Grid */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map((project, idx) => (
              <StaggerItem key={project.id ?? idx} className="card flex flex-col sm:flex-row overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative sm:w-48 flex-shrink-0" style={{ minHeight: "200px", background: project.gradient }}>
                  <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${project.status === "Completed" ? "bg-green-500 text-white" : project.status === "Ongoing" ? "bg-blue-500 text-white" : "bg-gray-500 text-white"}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />{project.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-gray-900 text-base mb-2">{project.title}</h3>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <MapPin className="h-3.5 w-3.5" />{project.location}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{project.description}</p>
                  <div className="flex items-start gap-2 bg-gold-50 border border-gold-100 rounded-lg px-3 py-2.5 mb-4">
                    <Lightbulb className="h-4 w-4 text-gold-600 mt-0.5 flex-shrink-0" />
                    <p className="text-gold-700 text-xs font-semibold">{project.impact}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Calendar className="h-3.5 w-3.5" />{project.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-600 text-xs font-semibold">
                      <Banknote className="h-3.5 w-3.5 text-gray-400" />{project.budget}
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">No projects found for the selected filter.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
