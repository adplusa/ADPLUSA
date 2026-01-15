import { getProjects } from "@/lib/cms-client";
import ProjectsClient from "./ProjectsClient";
import Loading from "../Components/Loading/page";

/**
 * Server-side metadata generation for SEO
 * This runs on the server and provides proper SEO tags
 */
export async function generateMetadata() {
  return {
    title: "Our Projects | ADPL Consulting",
    description: "Explore our portfolio of completed projects at ADPL Consulting",
    openGraph: {
      title: "Our Projects | ADPL Consulting",
      description: "Explore our portfolio of completed projects at ADPL Consulting",
    },
    robots: {
      index: true,
      follow: true,
    },
    };
}

/**
 * Server Component - fetches data and passes to client
 * Requirements: 2.1
 */
export default async function ProjectsPage() {
  const projects = await getProjects({ revalidate: 60 });

  if (!projects) {
    return <Loading text="Loading Projects" fullScreen={true} />;
  }

  return <ProjectsClient projects={projects} />;
}
