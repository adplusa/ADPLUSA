import { getAbout } from "../../lib/cms-client";
import AboutClient from "./AboutClient";
import Loading from "../Components/Loading/page";

/**
 * Server-side metadata generation for SEO
 * This runs on the server and provides proper SEO tags
 */
export async function generateMetadata() {
    const data = await getAbout({ revalidate: 0 });

    return {
        title: data?.seoTitle || "About Us | ADPL Consulting",
        description:
            data?.seoDescription ||
            "Learn about our mission and team at ADPL Consulting",
        openGraph: {
            title: data?.seoTitle || "About Us | ADPL Consulting",
            description:
                data?.seoDescription ||
                "Learn about our mission and team at ADPL Consulting",
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
export default async function AboutPage() {
    const data = await getAbout({ revalidate: 0 });

    if (!data) {
        return <Loading text="Loading" fullScreen={true} />;
    }

    return <AboutClient data={data} />;
}
