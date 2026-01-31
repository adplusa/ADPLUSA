// Force rebuild
import { getContact } from "../../lib/cms-client";
import ContactClient from "./ContactClient";
import Loading from "../Components/Loading/page";

export async function generateMetadata() {
    const data = await getContact({ revalidate: 0 });

    return {
        title: data?.seoTitle || "Contact | ADPL Consulting",
        description:
            data?.seoDescription ||
            "Contact ADPL Consulting for your project needs",
        openGraph: {
            title: data?.seoTitle || "Contact | ADPL Consulting",
            description:
                data?.seoDescription ||
                "Contact ADPL Consulting for your project needs",
        },
    };
}

export default async function ContactPage() {
    const data = await getContact({ revalidate: 0 });

    if (!data) {
        return <Loading text="Loading" fullScreen={true} />;
    }

    return <ContactClient data={data} />;
}
