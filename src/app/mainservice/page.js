import { getServices, getHomepage } from "@/lib/cms-client";
import MainServiceClient from "./MainServiceClient";
import Loading from "../Components/Loading/page";

/**
 * Server-side metadata generation for SEO
 * This runs on the server and provides proper SEO tags
 */
export async function generateMetadata() {
  return {
    title: "Services | ADPL Consulting",
    description: "Explore our comprehensive range of services at ADPL Consulting",
    openGraph: {
      title: "Services | ADPL Consulting",
      description: "Explore our comprehensive range of services at ADPL Consulting",
    },
    robots: {
      index: true,
      follow: true,
    },
    };
}

/**
 * Server Component - fetches data and passes to client
 * Requirements: 3.1
 */
export default async function MainServicePage() {
  const [servicesData, homepageData] = await Promise.all([
    getServices({ revalidate: 60 }),
    getHomepage({ revalidate: 60 }),
  ]);

  if (!servicesData) {
    return <Loading text="Loading Services" fullScreen={true} />;
  }

  return (
      <MainServiceClient
        services={servicesData}
        homepageData={homepageData}
      />
    );
}
