import { getService, getServices, getContact } from "@/lib/cms-client";
import ServiceClient from "./ServiceClient";
import Loading from "@/app/Components/Loading/page";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Link from "next/link";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const service = await getService(slug, { revalidate: 60 });

    if (!service) {
        return {
            title: "Service Not Found | ADPL Consulting",
            description: "The requested service could not be found.",
        };
    }

    return {
        title: service.seoTitle || `${service.title} | ADPL Consulting`,
        description: service.seoDescription || service.description || `Learn about ${service.title} services at ADPL Consulting`,
        openGraph: {
            title: service.seoTitle || `${service.title} | ADPL Consulting`,
            description: service.seoDescription || service.description,
            images: service.bannerImage?.url ? [{ url: service.bannerImage.url }] : [],
        },
    };
}

export default async function ServicePage({ params }) {
    const { slug } = await params;
    // Fetch service, all services, and contact data for Why Work With Us section (Requirements: 4.1, 4.2)
    const [service, allServices, contactData] = await Promise.all([
        getService(slug, { revalidate: 60 }),
        getServices({ revalidate: 60 }),
        getContact({ revalidate: 60 }),
    ]);

    if (!service) {
        return (
            <div className="service-detail-container">
                <Header />
                <div style={{ padding: "150px 20px", textAlign: "center" }}>
                    <h1>Service Not Found</h1>
                    <p>The service you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/mainservice" style={{ color: "blue", textDecoration: "underline" }}>
                        ← Back to Services
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const otherServices = allServices?.filter((s) => s.slug !== slug) || [];

    return <ServiceClient service={service} otherServices={otherServices} slug={slug} contactData={contactData} />;
}
