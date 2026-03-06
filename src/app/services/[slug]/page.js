"use client";

import { useEffect, useState, useCallback } from "react";
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

    const fetchAllServices = useCallback(async () => {
        try {
            const cmsUrl = getCMSApiUrl();
            let allServices = [];
            let page = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                const response = await fetch(
                    `${cmsUrl}/api/public/services?page=${page}&limit=100&t=${Date.now()}`,
                    {
                        cache: "no-store",
                        headers: {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '0'
                        }
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch services");

                const result = await response.json();
                if (result.success) {
                    allServices = [...allServices, ...result.data];
                    hasNextPage = result.pagination?.hasNextPage || false;
                    page++;
                } else {
                    break;
                }
            }

            return allServices;
        } catch (error) {
            console.error("Error fetching all services:", error);
            return [];
        }
    }, []);

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const [serviceRes, allServicesData, contactRes, homepageRes] =
                    await Promise.all([
                        fetch(`${cmsUrl}/api/public/services/${slug}?t=${Date.now()}`, {
                            cache: "no-store",
                            headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                            }
                        }),
                        fetchAllServices(),
                        fetch(`${cmsUrl}/api/public/contact?t=${Date.now()}`, {
                            cache: "no-store",
                            headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                            }
                        }),
                        fetch(`${cmsUrl}/api/public/homepage?t=${Date.now()}`, {
                            cache: "no-store",
                            headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                            }
                        }),
                    ]);

                if (!serviceRes.ok) {
                    setNotFound(true);
                    return;
                }

                const serviceResult = await serviceRes.json();
                const contactResult = await contactRes.json();
                const homepageResult = await homepageRes.json();

                if (serviceResult.success) {
                    setService(serviceResult.data);
                    const others = allServicesData.filter(
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
    }, [slug, fetchAllServices]);

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
