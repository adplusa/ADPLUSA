"use client";

import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import ContactForm from "../Components/ContactForm/page";
import "./servicetwo.css";
import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import {
    createServiceImageMap,
    getServiceGridImage,
} from "@/lib/service-image-mapper";

/**
 * Main Services Client Component
 * Receives data from server component and handles all interactivity
 * Requirements: 1.3, 3.1, 4.1, 6.1, 6.2, 6.3, 6.4
 */
export default function MainServiceClient({
    services,
    homepageData,
    mainServicePageData,
    contactData,
}) {
    const textRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const carouselRef = useRef(null);
    const [showForm, setShowForm] = useState(false);



    // Create image map from homepage serviceBoxes for consistent images between homepage and main services page
    const serviceImageMap = useMemo(() => {
        return createServiceImageMap(homepageData?.serviceBoxes);
    }, [homepageData?.serviceBoxes]);

    useEffect(() => {
        if (textRef.current) {
            gsap.to(textRef.current, {
                rotation: 360,
                transformOrigin: "center",
                repeat: -1,
                duration: 8,
                ease: "linear",
            });
        }
    }, []);

    const upwardHandler = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Infinite Carousel Logic
    const professionals = services || [];
    const allCards = [...professionals, ...professionals, ...professionals];
    const startIndex = professionals.length;

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    useEffect(() => {
        if (!carouselRef.current) return;

        if (activeIndex === allCards.length - professionals.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setActiveIndex(startIndex);
            }, 500);
        }

        if (activeIndex === 0) {
            setTimeout(() => {
                setIsTransitioning(false);
                setActiveIndex(allCards.length - professionals.length - 1);
            }, 500);
        }
    }, [activeIndex, allCards.length, professionals.length, startIndex]);

    const nextSlide = () => {
        setIsTransitioning(true);
        setActiveIndex((prev) => prev + 1);
    };



    return (
        <>
            <Header />

            {/* Banner Section - Use CMS main service page banner or fallback */}
            {(() => {
                // Use mainServicePageData banner if available, otherwise fallback to main-services service
                const bannerUrl =
                    mainServicePageData?.bannerImage?.url ||
                    services.find((s) => s.slug === "main-services")
                        ?.bannerImage?.url ||
                    services[0]?.bannerImage?.url;
                return bannerUrl ? (
                    <section
                        className="schematic-section"
                        style={{
                            backgroundImage: `url(${bannerUrl})`,
                        }}
                    ></section>
                ) : null;
            })()}

            {/* Trust Icons Section - Use CMS data with fallback to homepage */}
            {mainServicePageData?.showTrustIcons !== false &&
                homepageData?.trustIcons?.length > 0 && (
                    <div className="feature-section">
                        <div className="feature-section-df">
                            <div className="feature-box">
                                <h1>
                                    {mainServicePageData?.trustIconsHeading ||
                                        homepageData.trustIconsHeading ||
                                        "Why Choose Us"}
                                </h1>
                                <div className="features-name">
                                    {homepageData.trustIcons.map(
                                        (icon, index) =>
                                            icon?.image?.url && (
                                                <div
                                                    key={index}
                                                    className="service-related-item"
                                                >
                                                    <Image
                                                        src={icon.image.url}
                                                        alt={
                                                            icon.name ||
                                                            "Trust Icon"
                                                        }
                                                        width={70}
                                                        height={70}
                                                        unoptimized
                                                        priority
                                                    />
                                                    <p>{icon.number}</p>
                                                    <h3>{icon.name}</h3>
                                                </div>
                                            ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/* Services Grid - Use homepage images for consistency, with fallback to service images */}
            <div className="home_services_unique">
                <h1>
                    {mainServicePageData?.servicesHeading ||
                        homepageData?.serviceHeading ||
                        "Our Services"}
                </h1>
                <div className="home_services_box_unique">
                    {services
                        .filter((s) => s.slug !== "main-services")
                        .map((service, index) => {
                            // Get the appropriate image - prioritizes homepage images for consistency
                            const gridImage = getServiceGridImage(
                                service,
                                serviceImageMap,
                            );

                            return (
                                <Link
                                    href={`/services/${service.slug}`}
                                    key={service._id || index}
                                >
                                    <div className="service-box-home-unique">
                                        <div className="service-image-main-unique">
                                            {gridImage ? (
                                                <Image
                                                    src={gridImage.url}
                                                    alt={gridImage.alt}
                                                    width={400}
                                                    height={200}
                                                    unoptimized
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: 200,
                                                        background: "#eee",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <p>No Image</p>
                                                </div>
                                            )}
                                        </div>
                                        <h2>{service.title}</h2>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            </div>

            {/* Why Work With Us Section - Using CMS data with fallback to contact page (Requirement 4.1) */}
            {(() => {
                // Use mainServicePageData if available, otherwise fallback to contactData
                const showSection =
                    mainServicePageData?.showWhyWorkWithUs !== false;
                const whyWorkItems =
                    mainServicePageData?.whyWorkWithUsItems?.length > 0
                        ? mainServicePageData.whyWorkWithUsItems
                        : contactData?.whyWorkWithUsItems;
                const whyWorkHeading =
                    mainServicePageData?.whyWorkWithUsHeading ||
                    contactData?.whyWorkWithUsHeading ||
                    "Why Work With Us?";
                const whyWorkImage =
                    mainServicePageData?.whyWorkWithUsImage?.url ||
                    contactData?.rightImage?.url;

                if (!showSection || !whyWorkItems?.length) return null;

                return (
                    <section className="why-work-main-service-page">
                        <div className="content-two-main-service-page">
                            <div className="text-main-service-page">
                                <h2>{whyWorkHeading}</h2>
                                {whyWorkItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="feature-main-service-page"
                                    >
                                        {item.icon ? (
                                            item.icon.startsWith("bi") || item.icon.startsWith("fa-") ? (
                                                <i className={item.icon} style={{ fontSize: "24px", color: "currentColor", display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}></i>
                                            ) : (
                                                <span style={{ fontSize: "24px", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}>{item.icon}</span>
                                            )
                                        ) : (
                                            <svg
                                                id="tick"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                className="bi bi-check2"
                                                viewBox="0 0 16 16"
                                                width="24"
                                                height="24"
                                            >
                                                <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"></path>
                                            </svg>
                                        )}
                                        <div className="info-main-service-page">
                                            <h3>{item.title}</h3>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="image-wrapper-main-service-page">
                                {whyWorkImage && (
                                    <Image
                                        src={whyWorkImage}
                                        alt="Why Work With Us"
                                        width={500}
                                        height={400}
                                        unoptimized
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                );
            })()}

            {/* Contact Form Section - Requirements: 6.1, 6.2, 6.3, 6.4, 6.5 */}
            {mainServicePageData?.showContactForm !== false && (
                <section className="main-service-contact-section">
                    <div className="main-service-contact-container">
                        <div className="main-service-contact-form-wrapper">
                            <h2 className="main-service-contact-title">
                                {mainServicePageData?.contactFormHeading ||
                                    "Get in Touch"}
                            </h2>
                            {mainServicePageData?.contactFormSubheading && (
                                <p className="main-service-contact-subtitle">
                                    {mainServicePageData.contactFormSubheading}
                                </p>
                            )}
                            <div className="main-service-contact-underline"></div>

                            <ContactForm
                                title={mainServicePageData?.contactFormHeading || "Get in Touch"}
                                description={mainServicePageData?.contactFormSubheading || ""}
                                serviceOptions={services.filter(s => s.slug !== "main-services").map(s => s.title)}
                            />
                        </div>

                        {/* Contact image */}
                        {contactData?.contactImage?.url && (
                            <div className="main-service-contact-image">
                                <Image
                                    src={contactData.contactImage.url}
                                    alt={
                                        contactData.contactImage.alt ||
                                        "Contact Us"
                                    }
                                    width={500}
                                    height={400}
                                    unoptimized
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            <Footer />

            {/* WhatsApp Button */}
            <div className="whatsapp">
                <a
                    className="btn-whatsapp-pulse"
                    target="_blank"
                    href="https://wa.me/919910085603/?text=I%20would%20like%20to%20know%20about%20ADPL%20Consulting%20LLC%20!"
                >
                    <Image
                        src={"/whatsapp.png"}
                        width={40}
                        height={40}
                        alt="Whatsapp-img"
                        unoptimized
                    ></Image>
                </a>
            </div>

            <div className="enquire">
                <button onClick={() => setShowForm(true)}>Enquire Now</button>
            </div>
            {showForm && (
                <div
                    className="enquiry-overlay"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="enquiry-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="enquiry-box">
                            <div
                                className="close-icon"
                                onClick={() => setShowForm(false)}
                            >
                                ✕
                            </div>
                            <h2 className="title">Quick Query</h2>
                            <p className="subtitle">
                                If you have any queries, we will be pleased to
                                assist you.
                            </p>
                            <form>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="form-input"
                                />
                                <input
                                    type="text"
                                    placeholder="Mobile No."
                                    className="form-input"
                                />
                                <select className="form-input">
                                    <option>Select Type</option>
                                    <option>General</option>
                                    <option>Support</option>
                                    <option>Sales</option>
                                </select>
                                <textarea
                                    placeholder="Query"
                                    className="form-input"
                                    rows="3"
                                ></textarea>

                                <button type="submit" className="submit-button">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Upward Scroll Button */}
            <div className="upward" onClick={upwardHandler}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chevron-up"
                    viewBox="0 0 16 16"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
                    />
                </svg>
            </div>
        </>
    );
}
