import { getHomepage } from "@/lib/cms-client";
import HomeClient from "./HomeClient";
import Loading from "./Components/Loading/page";

/**
 * Server-side metadata generation for SEO
 * This runs on the server and provides proper SEO tags
 */
export async function generateMetadata() {
    const data = await getHomepage({ revalidate: 0 });

    return {
        title: data?.seoTitle || "ADPL Consulting",
        description: data?.seoDescription || "Learn about our mission and team",
        openGraph: {
            title: data?.seoTitle || "ADPL Consulting",
            description:
                data?.seoDescription || "Learn about our mission and team",
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

/**
 * Server Component - fetches data and passes to client
 */
export default async function HomePage() {
    const data = await getHomepage({ revalidate: 0 });

    if (!data) {
        return <Loading text="Loading" fullScreen={true} />;
    }

    return <HomeClient homepageData={data} />;
}
