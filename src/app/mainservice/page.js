"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { getCMSApiUrl } from "@/lib/cms-client";
import MainServiceClient from "./MainServiceClient";
import Loading from "../Components/Loading/page";

export default function MainServicePage() {
    const [services, setServices] = useState([]);
    const [homepageData, setHomepageData] = useState(null);
    const [mainServicePageData, setMainServicePageData] = useState(null);
    const [contactData, setContactData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const observerTarget = useRef(null);

    const LIMIT = 20;

    const fetchServices = useCallback(
        async (page) => {
            try {
                const cmsUrl = getCMSApiUrl();
                const response = await fetch(
                    `${cmsUrl}/api/public/services?page=${page}&limit=${LIMIT}&t=${Date.now()}`,
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
                    if (page === 1) {
                        setServices(result.data);
                    } else {
                        setServices((prev) => [...prev, ...result.data]);
                    }
                    setHasNextPage(result.pagination?.hasNextPage || false);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        },
        []
    );

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const [servicesRes, homepageRes, mainServiceRes, contactRes] =
                    await Promise.all([
                        fetch(
                            `${cmsUrl}/api/public/services?page=1&limit=${LIMIT}&t=${Date.now()}`,
                            {
                                cache: "no-store",
                                headers: {
                                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                                    'Pragma': 'no-cache',
                                    'Expires': '0'
                                }
                            }
                        ),
                        fetch(`${cmsUrl}/api/public/homepage?t=${Date.now()}`, {
                            cache: "no-store",
                            headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                            }
                        }),
                        fetch(`${cmsUrl}/api/public/main-service-page?t=${Date.now()}`, {
                            cache: "no-store",
                            headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                            }
                        }),
                        fetch(`${cmsUrl}/api/public/contact?t=${Date.now()}`, {
                            cache: "no-store",
                            headers: {
                                'Cache-Control': 'no-cache, no-store, must-revalidate',
                                'Pragma': 'no-cache',
                                'Expires': '0'
                            }
                        }),
                    ]);

                if (
                    !servicesRes.ok ||
                    !homepageRes.ok ||
                    !mainServiceRes.ok ||
                    !contactRes.ok
                )
                    throw new Error("Failed to fetch data");

                const servicesResult = await servicesRes.json();
                const homepageResult = await homepageRes.json();
                const mainServiceResult = await mainServiceRes.json();
                const contactResult = await contactRes.json();

                if (servicesResult.success) {
                    setServices(servicesResult.data);
                    setHasNextPage(servicesResult.pagination?.hasNextPage || false);
                }
                if (homepageResult.success) {
                    setHomepageData(homepageResult.data);
                }
                if (mainServiceResult.success) {
                    setMainServicePageData(mainServiceResult.data);
                }
                if (contactResult.success) {
                    setContactData(contactResult.data);
                }
            } catch (error) {
                console.error("Error fetching services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasNextPage &&
                    !loadingMore &&
                    !loading
                ) {
                    setLoadingMore(true);
                    const nextPage = currentPage + 1;
                    setCurrentPage(nextPage);
                    fetchServices(nextPage).finally(() => setLoadingMore(false));
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [hasNextPage, loadingMore, loading, currentPage, fetchServices]);

    if (loading) {
        return <Loading text="Loading Services" fullScreen={true} />;
    }

    if (services.length === 0) {
        return <Loading text="Loading Services" fullScreen={true} />;
    }

    return (
        <>
            <MainServiceClient
                services={services}
                homepageData={homepageData}
                mainServicePageData={mainServicePageData}
                contactData={contactData}
            />
            <div ref={observerTarget} style={{ height: "20px", margin: "20px 0" }}>
                {loadingMore && <Loading text="Loading more services" fullScreen={false} />}
            </div>
        </>
    );
}
