import { getFAQ } from "../../lib/cms-client";
import FAQClient from "./FAQClient";
import Loading from "../Components/Loading/page";

export async function generateMetadata() {
    const data = await getFAQ({ revalidate: 60 });

    return {
        title: data?.seoTitle || "FAQ | ADPL Consulting",
        description: data?.seoDescription || "Frequently Asked Questions about ADPL Consulting services",
        openGraph: {
            title: data?.seoTitle || "FAQ | ADPL Consulting",
            description: data?.seoDescription || "Frequently Asked Questions about ADPL Consulting services",
        },
    };
}

export default async function FAQPage() {
    const data = await getFAQ({ revalidate: 60 });

    if (!data) {
        return <Loading text="Loading FAQs" fullScreen={true} />;
    }

    return <FAQClient faqData={data} />;
}
