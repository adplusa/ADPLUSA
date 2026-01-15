"use client";

import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import "./servicetwo.css";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

/**
 * Main Services Client Component
 * Receives data from server component and handles all interactivity
 */
export default function MainServiceClient({ services, homepageData }) {
    const textRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const carouselRef = useRef(null);
    const [showForm, setShowForm] = useState(false);

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

            {/* Banner Section - Use main-services banner */}
            {(() => {
                const mainService = services.find(s => s.slug === 'main-services');
                const bannerUrl = mainService?.bannerImage?.url || services[0]?.bannerImage?.url;
                return bannerUrl ? (
                    <section
                        className="schematic-section"
                        style={{
                            backgroundImage: `url(${bannerUrl})`,
                        }}
                    ></section>
                ) : null;
            })()}

            {/* Trust Icons Section */}
            {homepageData?.trustIcons?.length > 0 && (
                <div className="feature-section">
                    <div className="feature-section-df">
                        <div className="feature-box">
                            <h1>{homepageData.trustIconsHeading || "Why Choose Us"}</h1>
                            <div className="features-name">
                                {homepageData.trustIcons.map((icon, index) => (
                                    icon?.image?.url && (
                                        <div key={index} className="service-related-item">
                                            <Image
                                                src={icon.image.url}
                                                alt={icon.name || "Trust Icon"}
                                                width={70}
                                                height={70}
                                                unoptimized
                                                priority
                                            />
                                            <p>{icon.number}</p>
                                            <h3>{icon.name}</h3>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Services Grid - Display all services dynamically */}
            <div className="home_services_unique">
                <h1>{homepageData?.serviceHeading || "Our Services"}</h1>
                <div className="home_services_box_unique">
                    {services.filter(s => s.slug !== 'main-services').map((service, index) => (
                        <Link href={`/services/${service.slug}`} key={service._id || index}>
                            <div className="service-box-home-unique">
                                <div className="service-image-main-unique">
                                    {service.bannerImage?.url || service.image?.url ? (
                                        <Image
                                            src={service.bannerImage?.url || service.image?.url}
                                            alt={service.title || 'Service'}
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
                                                justifyContent: "center",
                                            }}
                                        >
                                            <p>No Image</p>
                                        </div>
                                    )}
                                </div>
                                <h2>{service.title}</h2>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Why Work With Us Section - Using main-services features */}
            {(() => {
                const mainService = services.find(s => s.slug === 'main-services');
                if (!mainService?.features?.length) return null;
                return (
                    <section className="why-work-main-service-page">
                        <div className="content-two-main-service-page">
                            <div className="text-main-service-page">
                                <h2>Why Work With Us?</h2>
                                {mainService.features.map((feature, idx) => (
                                    <div key={idx} className="feature-main-service-page">
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
                                            <h3>{feature.title}</h3>
                                            <p>{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="image-wrapper-main-service-page">
                                {mainService?.image?.url && (
                                    <Image
                                        src={mainService.image.url}
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
                <div className="enquiry-overlay" onClick={() => setShowForm(false)}>
                    <div
                        className="enquiry-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="enquiry-box">
                            <div className="close-icon" onClick={() => setShowForm(false)}>
                                ✕
                            </div>
                            <h2 className="title">Quick Query</h2>
                            <p className="subtitle">
                                If you have any queries, we will be pleased to assist you.
                            </p>
                            <form>
                                <input type="text" placeholder="Name" className="form-input" />
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
