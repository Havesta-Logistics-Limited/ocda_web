import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const SECTIONS: Record<string, unknown> = {
  navbar: {
    logo: "OCDA",
    logoFull: "Ojobeda CDA",
    links: [
      { href: "#about", label: "About" },
      { href: "#services", label: "Programs" },
      { href: "#stats", label: "Impact" },
      { href: "#team", label: "Leadership" },
      { href: "#contact", label: "Contact" },
    ],
    ctaLabel: "Join OCDA",
    ctaHref: "#contact",
  },

  hero: {
    badge: "Est. 2024 · Ojobeda, Kogi State",
    headline: "Ojobeda Community",
    headlineAccent: "Development Association",
    typingTexts: [
      "Community Growth.",
      "Empowering Youth.",
      "Building Infrastructure.",
      "Preserving Heritage.",
      "Uniting Our People.",
    ],
    description:
      "OCDA is dedicated to the sustainable development of Ojobeda community — empowering residents, improving infrastructure, and preserving our rich cultural heritage for future generations.",
    primaryCta: { label: "Our Programs", href: "#services" },
    secondaryCta: { label: "Join Us", href: "#contact" },
  },

  about: {
    sectionLabel: "WHO WE ARE",
    headline: "Rooted in Ojobeda,",
    headlineAccent: "Built for the Future",
    description:
      "OCDA was founded by passionate community members committed to driving positive change in Ojobeda. We work hand-in-hand with residents, government agencies, and stakeholders to create lasting impact across Kogi State.",
    pillars: [
      {
        title: "Community First",
        body: "Every decision we make puts the people of Ojobeda at the center. We listen, collaborate, and act in the best interest of our entire community.",
      },
      {
        title: "Transparent Governance",
        body: "All funds and initiatives are managed with full accountability. Regular reports ensure members and stakeholders are always informed.",
      },
      {
        title: "Sustainable Development",
        body: "Our projects are designed for long-term impact — from infrastructure that lasts generations to educational programs that open doors.",
      },
      {
        title: "Cultural Preservation",
        body: "We celebrate and protect the rich cultural heritage of Ojobeda while embracing progress and modern development.",
      },
    ],
  },

  services: {
    sectionLabel: "WHAT WE DO",
    headline: "Our Programs & Initiatives",
    services: [
      {
        tag: "01",
        title: "Infrastructure Development",
        summary: "Roads, bridges, and public facilities built to last.",
        detail:
          "From road rehabilitation to borehole projects and community halls, we coordinate and fund critical infrastructure that improves daily life in Ojobeda.",
      },
      {
        tag: "02",
        title: "Education Support",
        summary: "Scholarships, school supplies, and learning centres.",
        detail:
          "We run scholarship programs for outstanding students, donate learning materials to local schools, and are developing a community library and ICT center.",
      },
      {
        tag: "03",
        title: "Healthcare Initiatives",
        summary: "Free medical outreaches and health education.",
        detail:
          "Our health committee organizes regular free medical camps, distributes essential medicines, and advocates for improved healthcare facilities in the community.",
      },
      {
        tag: "04",
        title: "Economic Empowerment",
        summary: "Skills training and micro-financing for residents.",
        detail:
          "We provide vocational training in trades, agriculture, and technology, and operate a micro-finance scheme to help residents start and grow small businesses.",
      },
      {
        tag: "05",
        title: "Youth Development",
        summary: "Sports, mentorship, and leadership programs.",
        detail:
          "Our youth wing organizes sports tournaments, leadership summits, and mentorship programs connecting young people with successful Ojobeda indigenes in diaspora.",
      },
      {
        tag: "06",
        title: "Cultural Preservation",
        summary: "Festivals, history, and community identity.",
        detail:
          "We document oral histories, organize the annual Ojobeda Cultural Festival, and maintain a digital archive of our community heritage and traditions.",
      },
    ],
  },

  stats: {
    sectionLabel: "OUR IMPACT",
    stats: [
      { value: 500, suffix: "+", label: "Members", description: "Active registered members" },
      { value: 12, suffix: "", label: "Projects", description: "Completed this year" },
      { value: 200, suffix: "+", label: "Beneficiaries", description: "Families directly impacted" },
      { value: 5, suffix: "yrs", label: "In Service", description: "Years of dedication" },
    ],
  },

  team: {
    sectionLabel: "LEADERSHIP",
    headline: "The Executive Council",
    members: [
      {
        initials: "AO",
        name: "Alhaji Aminu Ojeda",
        title: "President",
        bio: "A seasoned community leader with over 20 years of public service experience in Kogi State.",
        gradient: "from-community to-gold",
      },
      {
        initials: "FO",
        name: "Mrs. Fatima Ogiri",
        title: "Vice President",
        bio: "Educator and women rights advocate committed to the empowerment of Ojobeda women and girls.",
        gradient: "from-gold to-purple",
      },
      {
        initials: "IO",
        name: "Engr. Ibrahim Okpe",
        title: "Secretary General",
        bio: "Civil engineer coordinating all infrastructure projects and government liaison activities.",
        gradient: "from-purple to-community",
      },
      {
        initials: "AE",
        name: "Miss Adaeze Eze",
        title: "Director of Finance",
        bio: "Certified accountant ensuring transparent financial management of all association funds.",
        gradient: "from-community to-purple",
      },
    ],
  },

  contact: {
    sectionLabel: "GET IN TOUCH",
    headline: "Contact Us",
    description:
      "Have a question, suggestion, or want to get involved? We would love to hear from you. Our team responds within 48 hours.",
    email: "info@ocda.ng",
    phone: "+234 800 000 0000",
    address: "Ojobeda Community, Kogi State, Nigeria",
  },

  footer: {
    description:
      "Ojobeda Community Development Association — building a stronger, more united community through development, empowerment, and cultural pride.",
    links: {
      Association: ["About Us", "Leadership", "Programs", "Impact"],
      "Get Involved": ["Membership", "Volunteer", "Donate", "Partner"],
      Resources: ["News", "Events", "Gallery", "Downloads"],
    },
    email: "info@ocda.ng",
    phone: "+234 800 000 0000",
    address: "Ojobeda, Kogi State, Nigeria",
  },
}

async function main() {
  console.log("Seeding database…")

  // Upsert site content
  for (const [section, data] of Object.entries(SECTIONS)) {
    await prisma.siteContent.upsert({
      where: { section },
      update: { data: JSON.stringify(data) },
      create: { section, data: JSON.stringify(data) },
    })
    console.log(`  ✓ ${section}`)
  }

  // Seed admin user
  const hashedPassword = await bcrypt.hash("Admin@OCDA2024!", 12)
  await prisma.adminUser.upsert({
    where: { email: "admin@ocda.ng" },
    update: {},
    create: {
      email: "admin@ocda.ng",
      password: hashedPassword,
      name: "OCDA Admin",
    },
  })
  console.log("  ✓ admin user (admin@ocda.ng)")

  console.log("Seeding complete!")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
