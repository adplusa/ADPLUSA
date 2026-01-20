import { getProjects, getProjectsPage } from "@/lib/cms-client";
import ProjectsClient from "./ProjectsClient";
import Loading from "../Components/Loading/page";

/**
 * Default fallback values for SEO
 */
const DEFAULT_TITLE = "Our Projects | ADPL Consulting";
const DEFAULT_DESCRIPTION = "Explore our portfolio of completed projects at ADPL Consulting";

/**
 * Server-side metadata generation for SEO
 * Uses CMS-provided SEO values when available, falls back to defaults
 * Requirements: 2.1, 2.2, 2.3, 2.4, 8.2, 8.3
 */
export async function generateMetadata() {
  const pageData = await getProjectsPage({ revalidate: 60 });

  // Use CMS values if available, otherwise use defaults
  const title = pageData?.seoTitle || DEFAULT_TITLE;
  const description = pageData?.seoDescription || DEFAULT_DESCRIPTION;

  // Build metadata object
  const metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  // Generate meta tags from structured metaTags array
  if (pageData?.metaTags && pageData.metaTags.length > 0) {
    metadata.other = pageData.metaTags.reduce((acc, tag) => {
      if (tag.name && tag.content) {
        acc[tag.name] = tag.content;
      }
      return acc;
    }, {});
  }

  return metadata;
}

/**
 * Server Component - fetches data and passes to client
 * Requirements: 2.1, 8.2
 */
export default async function ProjectsPage() {
  // Fetch both projects and page configuration in parallel
  const [projects, pageData] = await Promise.all([
    getProjects({ revalidate: 60 }),
    getProjectsPage({ revalidate: 60 }),
  ]);

  if (!projects) {
    return <Loading text="Loading Projects" fullScreen={true} />;
  }

  return <ProjectsClient projects={projects} pageData={pageData} />;
}
