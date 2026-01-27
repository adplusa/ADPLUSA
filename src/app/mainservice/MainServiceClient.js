"use client";

import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
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

    // Contact form state (Requirements: 6.1, 6.2, 6.3, 6.4)
    const contactFormRef = useRef(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formStatus, setFormStatus] = useState(null);

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

    // Contact form helper function to get field values flexibly
    const getFlexible = (preferredNames, fallbackRegex) => {
        const f = contactFormRef.current;
        if (!f) return "";

        for (const n of preferredNames) {
            const el = f.elements[n];
            if (el && typeof el.value === "string" && el.value.trim()) {
                return el.value.trim();
            }
        }

        const fields = Array.from(f.elements).filter(
            (el) =>
                (el.tagName === "INPUT" ||
                    el.tagName === "TEXTAREA" ||
                    el.tagName === "SELECT") &&
                typeof el.name === "string",
        );

        const candidate =
            fields.find((el) => fallbackRegex.test(el.name || "")) ||
            fields.find(
                (el) =>
                    typeof el.placeholder === "string" &&
                    fallbackRegex.test(el.placeholder),
            );

        return candidate && typeof candidate.value === "string"
            ? candidate.value.trim()
            : "";
    };

    // Contact form submit handler (Requirements: 6.3, 6.4)
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setFormStatus(null);
        setIsSubmitting(true);

        const formEl = contactFormRef.current;

        const nameVal = getFlexible(
            ["name", "firstName", "fullName", "fullname", "title"],
            /(name|full\s*name|title)/i,
        );
        const emailVal = getFlexible(
            ["email", "emailAddress"],
            /(email|e-mail)/i,
        );
        const phoneVal = getFlexible(
            ["phone", "mobile", "phoneNo", "phone_number"],
            /(phone|mobile|contact\s*number)/i,
        );
        const serviceVal = getFlexible(
            ["service", "services", "selectedService"],
            /(service|category|subject)/i,
        );
        const messageVal = getFlexible(
            ["message", "msg", "messages", "comment"],
            /(message|query|comments?|details)/i,
        );

        if (!nameVal) {
            setIsSubmitting(false);
            setFormStatus({ type: "err", msg: "Please enter your name." });
            return;
        }
        if (!emailVal) {
            setIsSubmitting(false);
            setFormStatus({ type: "err", msg: "Please enter your email." });
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
            setIsSubmitting(false);
            setFormStatus({ type: "err", msg: "Enter a valid email." });
            return;
        }
        if (!phoneVal) {
            setIsSubmitting(false);
            setFormStatus({
                type: "err",
                msg: "Please enter your phone number.",
            });
            return;
        }

        // Honeypot check
        const hp = formEl?.querySelector('[name="website"]')?.value;
        if (hp) {
            setIsSubmitting(false);
            setFormStatus({ type: "ok", msg: "Thanks!" });
            return;
        }

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: nameVal,
                    email: emailVal,
                    phone: phoneVal,
                    service: serviceVal,
                    message: messageVal,
                    website: hp,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.error || "Could not send. Please try again.",
                );
            }

            formEl?.reset();
            setFormStatus({
                type: "ok",
                msg:
                    result.message ||
                    "Message sent! We'll get back to you within 24-48 hours.",
            });
        } catch (err) {
            console.error("Contact form error:", err);
            setFormStatus({
                type: "err",
                msg: err?.message || "Could not send. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
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

                            <form
                                ref={contactFormRef}
                                onSubmit={handleContactSubmit}
                                className="main-service-contact-form"
                            >
                                {/* Name field */}
                                <div className="main-service-form-field">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name *"
                                        required
                                    />
                                </div>

                                {/* Email field */}
                                <div className="main-service-form-field">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email *"
                                        required
                                    />
                                </div>

                                {/* Phone field */}
                                <div className="main-service-form-field">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Your Phone *"
                                        required
                                    />
                                </div>

                                {/* Service selection - populated from services list */}
                                <div className="main-service-form-field">
                                    <select name="service">
                                        <option value="">
                                            Select a Service
                                        </option>
                                        {services
                                            .filter(
                                                (s) =>
                                                    s.slug !== "main-services",
                                            )
                                            .map((service, idx) => (
                                                <option
                                                    key={idx}
                                                    value={service.title}
                                                >
                                                    {service.title}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Message field */}
                                <div className="main-service-form-field">
                                    <textarea
                                        name="message"
                                        placeholder="Your Message"
                                        rows="4"
                                    ></textarea>
                                </div>

                                {/* Honeypot field for spam protection */}
                                <input
                                    type="text"
                                    name="website"
                                    style={{ display: "none" }}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />

                                <button
                                    type="submit"
                                    className="main-service-submit-button"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Sending..." : "Submit"}
                                </button>

                                {formStatus && (
                                    <p
                                        className={`main-service-form-status ${formStatus.type === "ok" ? "success" : "error"}`}
                                    >
                                        {formStatus.msg}
                                    </p>
                                )}
                            </form>
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
