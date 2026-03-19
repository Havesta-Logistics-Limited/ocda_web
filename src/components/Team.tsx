"use client";

import { Heart, Users, Handshake, Mail, Phone, MapPin } from "lucide-react";

export interface TeamContent {
  sectionLabel: string;
  headline: string;
  members: { initials: string; name: string; title: string; bio: string; gradient: string }[];
}

const DEFAULT: TeamContent = {
  sectionLabel: "JOIN OUR MOVEMENT",
  headline: "Be Part of the Change",
  members: [
    { initials: "AO", name: "Alhaji Aminu Ojeda", title: "President", bio: "A seasoned community leader with over 20 years of public service experience in Kogi State.", gradient: "from-forest-700 to-forest-900" },
    { initials: "FO", name: "Mrs. Fatima Ogiri", title: "Vice President", bio: "Educator and women rights advocate committed to the empowerment of Ojobeda women and girls.", gradient: "from-gold-600 to-gold-800" },
    { initials: "IO", name: "Engr. Ibrahim Okpe", title: "Secretary General", bio: "Civil engineer coordinating all infrastructure projects and government liaison activities.", gradient: "from-forest-600 to-forest-800" },
    { initials: "AE", name: "Miss Adaeze Eze", title: "Director of Finance", bio: "Certified accountant ensuring transparent financial management of all association funds.", gradient: "from-forest-800 to-forest-950" },
  ],
};

export default function Team({ data }: { data: TeamContent | null }) {
  const d = data ?? DEFAULT;

  return (
    <section id="team" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: CTA copy */}
          <div>
            <p className="section-label mb-3">{d.sectionLabel}</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 leading-tight mb-5">
              {d.headline}
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Whether you donate, volunteer, or simply spread the word, your contribution makes a real
              difference in the lives of thousands of Nigerians. Together, we can build stronger, more
              resilient communities.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-800 text-white text-sm font-semibold hover:bg-forest-900 transition-colors shadow-sm"
              >
                <Heart className="h-4 w-4" />
                Donate Now
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 text-sm font-semibold hover:border-forest-800 hover:text-forest-800 transition-colors"
              >
                <Users className="h-4 w-4" />
                Volunteer
              </a>
            </div>
          </div>

          {/* Right: action cards + stat */}
          <div className="space-y-4">
            {[
              {
                icon: Heart,
                title: "Make a Donation",
                body: "Your financial support directly funds our community programs and initiatives.",
                color: "text-gold-600",
                bg: "bg-gold-50",
              },
              {
                icon: Users,
                title: "Volunteer With Us",
                body: "Share your skills and time to help transform communities.",
                color: "text-forest-700",
                bg: "bg-forest-50",
              },
              {
                icon: Handshake,
                title: "Partner With Us",
                body: "Join hands as a corporate or institutional partner.",
                color: "text-forest-700",
                bg: "bg-forest-50",
              },
            ].map(({ icon: Icon, title, body, color, bg }) => (
              <div key={title} className="card p-5 flex items-start gap-4">
                <div className={`${bg} ${color} h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}

            {/* Highlight stat */}
            <div className="rounded-xl bg-forest-800 p-6 text-white">
              <p className="font-display font-bold text-4xl mb-1">₦2.5B+</p>
              <p className="text-white/70 text-sm">Invested in community development since inception</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
