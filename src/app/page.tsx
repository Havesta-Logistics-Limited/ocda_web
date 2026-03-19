import { getAllContent } from "@/lib/content";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import AboutPreview from "@/components/AboutPreview";
import ProgramsPreview from "@/components/ProgramsPreview";
import GetInvolvedPreview from "@/components/GetInvolvedPreview";
import type { HeroContent } from "@/components/Hero";
import type { StatsContent } from "@/components/Stats";

export const revalidate = 60;

export default async function Home() {
  const content = await getAllContent();
  return (
    <main>
      <Hero data={content.hero as HeroContent | null} />
      <Stats data={content.stats as StatsContent | null} />
      <AboutPreview data={content.about as any} />
      <ProgramsPreview data={content.services as any} />
      <GetInvolvedPreview />
    </main>
  );
}
