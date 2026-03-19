import { Globe, Eye, Lock, Users, Leaf, Heart } from "lucide-react";
import { getContent } from "@/lib/content";
import { AnimateIn, StaggerContainer, StaggerItem, ScaleIn } from "@/components/AnimateIn";

export const revalidate = 60;

export const metadata = {
  title: "About Us — OCDA",
  description:
    "Learn about the Ojobeda Community Development Association — our mission, vision, values, and the team driving change in Nigerian communities.",
};

interface TimelineItem { year: string; title: string; description: string; }
interface ValueItem { title: string; description: string; }
interface TeamMember { initials: string; name: string; title: string; bio: string; gradient: string; photo?: string; }

interface AboutPageData {
  pageHero?: { label?: string; headline?: string; description?: string };
  mission?: string;
  vision?: string;
  values?: ValueItem[];
  timeline?: TimelineItem[];
}

const DEFAULT_TIMELINE: TimelineItem[] = [
  { year: "2010", title: "Foundation", description: "OCDA was founded by community leaders in Ojobeda, Kogi State, with a vision to develop grassroots solutions to community challenges." },
  { year: "2013", title: "Healthcare Initiative Launch", description: "Launched our flagship mobile health clinic program, reaching over 5 communities in the first year with basic healthcare services." },
  { year: "2016", title: "National Expansion", description: "Expanded operations to 6 states across Nigeria, partnering with federal and state government agencies for broader impact." },
  { year: "2019", title: "Women Empowerment Program", description: "Established the Women Economic Empowerment program, providing micro-loans and skills training to over 1,000 women in Year 1." },
  { year: "2022", title: "Digital Inclusion Drive", description: "Introduced digital literacy programs and computer labs to 15 rural schools, bridging the technology gap for 3,000+ students." },
  { year: "2024", title: "Growing Impact", description: "Surpassed 50,000 lives impacted milestone, with active programs in 35+ communities and partnerships with 20+ national organizations." },
];

const DEFAULT_VALUES: ValueItem[] = [
  { title: "Integrity", description: "We operate with transparency and accountability in all our programs and financial dealings." },
  { title: "Community Ownership", description: "Communities are our partners — we build with them, not for them." },
  { title: "Sustainability", description: "Every program is designed for long-term impact and self-sufficiency." },
  { title: "Inclusivity", description: "We serve all community members regardless of religion, ethnicity, or gender." },
];

const VALUE_ICONS = [Lock, Users, Leaf, Heart];

const FALLBACK_TEAM: TeamMember[] = [
  { name: "Dr. Emmanuel Adeyemi", title: "Executive Director", bio: "With 20+ years in community development, Dr. Adeyemi leads OCDA's strategic vision and partnerships across Nigeria.", initials: "EA", gradient: "from-forest-700 to-forest-900" },
  { name: "Mrs. Fatima Bello", title: "Programs Director", bio: "Fatima oversees all community programs, ensuring impact, sustainability, and alignment with our core mission.", initials: "FB", gradient: "from-gold-600 to-gold-800" },
  { name: "Mr. Chukwuemeka Obi", title: "Head of Operations", bio: "Chukwuemeka manages field operations, volunteer coordination, and community engagement across our project sites.", initials: "CO", gradient: "from-forest-600 to-forest-800" },
];

export default async function AboutPage() {
  const [teamData, aboutPageData] = await Promise.all([
    getContent<{ members?: TeamMember[] }>("team"),
    getContent<AboutPageData>("about_page"),
  ]);

  const TEAM: TeamMember[] = (teamData?.members && teamData.members.length > 0) ? teamData.members : FALLBACK_TEAM;
  const d = aboutPageData ?? {};
  const pageHero = d.pageHero ?? {};
  const mission = d.mission ?? "To empower Nigerian communities through sustainable development programs that improve quality of life, provide access to education and healthcare, and foster economic independence — ensuring no community is left behind in Nigeria's progress.";
  const vision = d.vision ?? "A Nigeria where every community — urban and rural — has equal access to quality education, adequate healthcare, and sustainable economic opportunities; where communities are empowered to drive their own development and contribute to national growth.";
  const values = (d.values && d.values.length > 0) ? d.values : DEFAULT_VALUES;
  const timeline = (d.timeline && d.timeline.length > 0) ? d.timeline : DEFAULT_TIMELINE;

  return (
    <main className="pt-[72px]">
      {/* Page Hero */}
      <section className="bg-forest-800 py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <AnimateIn className="max-w-7xl mx-auto relative z-10">
          <p className="text-gold-400 text-xs font-semibold tracking-widest uppercase mb-3">
            {pageHero.label ?? "ABOUT US"}
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            {pageHero.headline ?? "Our Story of Community Impact"}
          </h1>
          <p className="text-white/70 max-w-2xl text-base leading-relaxed">
            {pageHero.description ?? "For over 13 years, OCDA has been dedicated to empowering Nigerian communities through sustainable development, healthcare, education, and economic opportunity."}
          </p>
        </AnimateIn>
      </section>

      {/* Mission / Vision */}
      <section className="py-20 px-6 bg-gray-50">
        <StaggerContainer className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <StaggerItem className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            <div className="h-12 w-12 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center mb-6">
              <Globe className="h-6 w-6 text-forest-800" />
            </div>
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">{mission}</p>
          </StaggerItem>
          <StaggerItem className="bg-forest-800 rounded-xl p-8">
            <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mb-6">
              <Eye className="h-6 w-6 text-gold-300" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white mb-4">Our Vision</h2>
            <p className="text-white/80 leading-relaxed">{vision}</p>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-14">
            <p className="section-label mb-3">OUR VALUES</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900">What Guides Us</h2>
          </AnimateIn>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <StaggerItem key={i} className="card p-6">
                  <div className="h-12 w-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-forest-800" />
                  </div>
                  <h3 className="font-display font-bold text-gray-900 text-base mb-2">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <AnimateIn className="text-center mb-14">
            <p className="section-label mb-3">OUR JOURNEY</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900">Milestones Along the Way</h2>
          </AnimateIn>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 -translate-x-1/2 hidden md:block" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <AnimateIn key={i} delay={i * 0.08} direction={i % 2 === 0 ? "left" : "right"} className={`relative flex flex-col md:flex-row gap-6 items-start md:items-center ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className={`flex-1 ${i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                    <div className="card p-5 inline-block w-full">
                      <p className="text-gold-600 font-display font-bold text-lg mb-1">{item.year}</p>
                      <h3 className="font-display font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 h-5 w-5 rounded-full bg-forest-800 border-4 border-white shadow-sm z-10" />
                  <div className="flex-1 hidden md:block" />
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <AnimateIn className="text-center mb-14">
            <p className="section-label mb-3">OUR TEAM</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900">Meet Our Leadership</h2>
          </AnimateIn>
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, i) => (
              <StaggerItem key={i} className="card overflow-hidden">
                <div className="relative overflow-hidden" style={{ height: "200px", background: "linear-gradient(135deg, #166534 0%, #14532d 60%, #052e16 100%)" }}>
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo} alt={member.name} className="w-full h-full object-contain bg-white" />
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-white/15 border-2 border-white/30 flex items-center justify-center">
                          <span className="font-display font-bold text-white text-2xl">
                            {member.initials || member.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-gray-900 text-base mb-1">{member.name}</h3>
                  <p className="text-gold-600 text-xs font-semibold tracking-wide uppercase mb-3">{member.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </main>
  );
}
