import type { Metadata } from "next";
import "./globals.css";
import { getAllContent } from "@/lib/content";
import ConditionalShell from "@/components/ConditionalShell";
import type { NavbarContent } from "@/components/Navbar";
import type { FooterContent } from "@/components/Footer";

export const metadata: Metadata = {
  title: "OCDA — Ojobeda Community Development Association",
  description:
    "Ojobeda Community Development Association, Kogi State, Nigeria. Empowering residents, improving infrastructure, and preserving our rich cultural heritage.",
  keywords: ["OCDA", "Ojobeda", "Kogi State", "Nigeria", "community development", "NGO", "CDA"],
  authors: [{ name: "OCDA" }],
  robots: "index, follow",
  openGraph: {
    title: "OCDA — Ojobeda Community Development Association",
    description: "Building a stronger community through development, empowerment, and cultural pride.",
    type: "website",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const content = await getAllContent();
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <ConditionalShell
          navbarData={content.navbar as NavbarContent | null}
          footerData={content.footer as FooterContent | null}
        >
          {children}
        </ConditionalShell>
      </body>
    </html>
  );
}
