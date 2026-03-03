"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCMSApiUrl } from "@/lib/cms-client";
import ServiceClient from "./ServiceClient";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Link from "next/link";
import Loading from "@/app/Components/Loading/page";

export default function ServicePage() {
    const params = useParams();
    const slug = params?.slug;
    const [service, setService] = useState(null);
    const [otherServices, setOtherServices] = useState([]);
    const [contactData, setContactData] = useState(null);
    const [homepageData, setHomepageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const [serviceRes, servicesRes, contactRes, homepageRes] =
                    await Promise.all([
                        fetch(`${cmsUrl}/api/public/services/${slug}`, {
                            cache: "no-store",
                        }),
                        fetch(`${cmsUrl}/api/public/services`, {
                            cache: "no-store",
                        }),
                        fetch(`${cmsUrl}/api/public/contact`, {
                            cache: "no-store",
                        }),
                        fetch(`${cmsUrl}/api/public/homepage`, {
                            cache: "no-store",
                        }),
                    ]);

                if (!serviceRes.ok) {
                    setNotFound(true);
                    return;
                }

                const serviceResult = await serviceRes.json();
                const servicesResult = await servicesRes.json();
                const contactResult = await contactRes.json();
                const homepageResult = await homepageRes.json();

                if (serviceResult.success) {
                    setService(serviceResult.data);
                }
                if (servicesResult.success) {
                    const others = servicesResult.data.filter(
                        (s) => s.slug !== slug
                    );
                    setOtherServices(others);
                }
                if (contactResult.success) {
                    setContactData(contactResult.data);
                }
                if (homepageResult.success) {
                    setHomepageData(homepageResult.data);
                }
            } catch (error) {
                console.error("Error fetching service:", error);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return <Loading text="Loading" fullScreen={true} />;
    }

    if (notFound || !service) {
        return (
            <div className="service-detail-container">
                <Header />
                <div style={{ padding: "150px 20px", textAlign: "center" }}>
                    <h1>Service Not Found</h1>
                    <p>
                        The service you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link
                        href="/mainservice"
                        style={{ color: "blue", textDecoration: "underline" }}
                    >
                        ← Back to Services
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <ServiceClient
            service={service}
            otherServices={otherServices}
            slug={slug}
            contactData={contactData}
            homepageData={homepageData}
        />
    );
}
