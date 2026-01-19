import { getServices, getHomepage, getMainServicePage, getContact } from "@/lib/cms-client";
import MainServiceClient from "./MainServiceClient";
import Loading from "../Components/Loading/page";

/**
 * Server-side metadata generation for SEO
 * Fetches CMS data and uses SEO values with fallbacks
 * Requirements: 1.3, 1.4, 1.5
 */
export async function generateMetadata() {
  const mainServicePageData = await getMainServicePage({ revalidate: 60 });

  const title = mainServicePageData?.seoTitle || "Services | ADPL Consulting";
  const description = mainServicePageData?.seoDescription || "Explore our comprehensive range of services at ADPL Consulting";

  // Generate meta tags from structured metaTags array
  const otherMeta = {};
  if (mainServicePageData?.metaTags?.length) {
    mainServicePageData.metaTags.forEach((tag) => {
      if (tag.name && tag.content) {
        otherMeta[tag.name] = tag.content;
      }
    });
  }

  return {
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
    other: Object.keys(otherMeta).length > 0 ? otherMeta : undefined,
  };
}

/**
 * Server Component - fetches data and passes to client
 * Requirements: 1.3, 1.4, 1.5, 3.1, 4.1, 6.1
 */
export default async function MainServicePage() {
  const [servicesData, homepageData, mainServicePageData, contactData] = await Promise.all([
    getServices({ revalidate: 60 }),
    getHomepage({ revalidate: 60 }),
    getMainServicePage({ revalidate: 60 }),
    getContact({ revalidate: 60 }),
  ]);

  if (!servicesData) {
    return <Loading text="Loading Services" fullScreen={true} />;
  }

  return (
    <MainServiceClient
      services={servicesData}
      homepageData={homepageData}
      mainServicePageData={mainServicePageData}
      contactData={contactData}
    />
  );
}
