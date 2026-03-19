import { getContent } from "@/lib/content";
import ProjectsClient from "./ProjectsClient";

export const revalidate = 60;

export const metadata = {
  title: "Our Projects — OCDA",
  description:
    "View OCDA's active and completed community projects across Nigeria — from water infrastructure to schools and healthcare facilities.",
};

export interface Project {
  id?: number;
  title: string;
  location: string;
  status: string;
  description: string;
  impact: string;
  date: string;
  budget: string;
  gradient: string;
}

export interface ProjectsPageData {
  pageHero?: { label?: string; headline?: string; description?: string };
  projects?: Project[];
}

export default async function ProjectsPage() {
  const data = await getContent<ProjectsPageData>("projects_page");
  return <ProjectsClient data={data ?? {}} />;
}
