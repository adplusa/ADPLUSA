"use client";

import { useEffect, useState } from "react";
import { getCMSApiUrl } from "@/lib/cms-client";
import MainServiceClient from "./MainServiceClient";
import Loading from "../Components/Loading/page";

export default function MainServicePage() {
    const [services, setServices] = useState(null);
    const [homepageData, setHomepageData] = useState(null);
    const [mainServicePageData, setMainServicePageData] = useState(null);
    const [contactData, setContactData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cmsUrl = getCMSApiUrl();
                const [servicesRes, homepageRes, mainServiceRes, contactRes] =
                    await Promise.all([
                        fetch(`${cmsUrl}/api/public/services`, {
                            cache: "no-store",
                        }),
                        fetch(`${cmsUrl}/api/public/homepage`, {
                            cache: "no-store",
                        }),
                        fetch(`${cmsUrl}/api/public/main-service-page`, {
                            cache: "no-store",
                        }),
                        fetch(`${cmsUrl}/api/public/contact`, {
                            cache: "no-store",
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

        fetchData();
    }, []);

    if (loading) {
        return <Loading text="Loading Services" fullScreen={true} />;
    }

    if (!services) {
        return <Loading text="Loading Services" fullScreen={true} />;
    }

    return (
        <MainServiceClient
            services={services}
            homepageData={homepageData}
            mainServicePageData={mainServicePageData}
            contactData={contactData}
        />
    );
}
