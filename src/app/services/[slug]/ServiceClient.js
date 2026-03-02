"use client";

import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from "react";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Image from "next/image";
import Link from "next/link";
import "./service-detail.css";
import PageScripts from "../../Components/PageScripts";
import {
    createServiceImageMap,
    getServiceGridImage,
} from "@/lib/service-image-mapper";

/**
 * Service Detail Client Component
 * Displays individual service details with Why Work With Us section
 * Requirements: 4.1, 4.2 - Display Why Work With Us section before Explore More Services carousel
 */
export default function ServiceClient({
    service,
    otherServices,
    slug,
    contactData,
    homepageData,
}) {
    const [showForm, setShowForm] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const slideRef = useRef(null);
    const intervalRef = useRef(null);

    // Create image map from homepage serviceBoxes for consistent images
    const serviceImageMap = useMemo(() => {
        return createServiceImageMap(homepageData?.serviceBoxes);
    }, [homepageData?.serviceBoxes]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const upwardHandler = () => window.scrollTo({ top: 0, behavior: "smooth" });

    const totalSlides = otherServices.length || 1;
    const slidesToShow =
        otherServices.length > 0 ? [...otherServices, ...otherServices] : [];

    const nextSlide = useCallback(() => {
        if (!isTransitioning && !isDragging)
            setCurrentIndex((prev) => prev + 1);
    }, [isTransitioning, isDragging]);

    const startAutoPlay = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(nextSlide, 3000);
    }, [nextSlide]);

    const stopAutoPlay = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (otherServices.length > 0 && !isDragging) startAutoPlay();
        return () => stopAutoPlay();
    }, [otherServices, startAutoPlay, stopAutoPlay, isDragging]);

    useEffect(() => {
        if (currentIndex >= totalSlides && totalSlides > 0) {
            setIsTransitioning(true);
            stopAutoPlay();
            const timer = setTimeout(() => {
                if (slideRef.current) {
                    slideRef.current.style.transition = "none";
                    setCurrentIndex(0);
                    requestAnimationFrame(() => {
                        if (slideRef.current) {
                            slideRef.current.style.transition =
                                "transform 0.5s ease-in-out";
                            setIsTransitioning(false);
                            if (!isDragging) startAutoPlay();
                        }
                    });
                }
            }, 500);
            return () => {
                clearTimeout(timer);
                setIsTransitioning(false);
            };
        }
    }, [currentIndex, totalSlides, stopAutoPlay, startAutoPlay, isDragging]);

    const getPositionX = (e) =>
        e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

    const handleDragStart = (e) => {
        if (e.type === "mousedown") e.preventDefault();
        setIsDragging(true);
        stopAutoPlay();
        setStartX(getPositionX(e));
        if (slideRef.current) {
            slideRef.current.style.transition = "none";
            slideRef.current.style.cursor = "grabbing";
        }
    };

    const handleDragMove = useCallback(
        (e) => {
            if (!isDragging || !slideRef.current) return;
            e.preventDefault();
            const diff = getPositionX(e) - startX;
            const slideWidth = isMobile ? 100 : 25;
            const currentTransform = -currentIndex * slideWidth;
            const dragOffset =
                (diff / slideRef.current.offsetWidth) * slideWidth;
            slideRef.current.style.transform = `translateX(${currentTransform + dragOffset}%)`;
        },
        [isDragging, startX, currentIndex, isMobile],
    );

    const handleDragEnd = useCallback(() => {
        if (!isDragging || !slideRef.current) return;
        setIsDragging(false);
        const transform = slideRef.current.style.transform;
        const currentTransform = transform.match(/-?\d+\.?\d*/);
        const currentPos = currentTransform
            ? parseFloat(currentTransform[0])
            : 0;
        const expectedPos = -currentIndex * (isMobile ? 100 : 25);
        const dragDistance = currentPos - expectedPos;

        let newIndex = currentIndex;
        if (Math.abs(dragDistance) > (isMobile ? 20 : 5)) {
            if (dragDistance > 0 && currentIndex > 0)
                newIndex = currentIndex - 1;
            else if (dragDistance < 0 && currentIndex < totalSlides - 1)
                newIndex = currentIndex + 1;
        }

        slideRef.current.style.transition = "transform 0.3s ease-out";
        slideRef.current.style.cursor = "grab";
        setCurrentIndex(newIndex);
        setTimeout(() => {
            if (!isTransitioning) startAutoPlay();
        }, 300);
    }, [
        isDragging,
        currentIndex,
        totalSlides,
        isMobile,
        isTransitioning,
        startAutoPlay,
    ]);

    useEffect(() => {
        if (isDragging) {
            const handleMouseMove = (e) => handleDragMove(e);
            const handleMouseUp = () => handleDragEnd();
            document.addEventListener("mousemove", handleMouseMove, {
                passive: false,
            });
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchmove", handleMouseMove, {
                passive: false,
            });
            document.addEventListener("touchend", handleMouseUp);
            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("touchmove", handleMouseMove);
                document.removeEventListener("touchend", handleMouseUp);
            };
        }
    }, [isDragging, handleDragMove, handleDragEnd]);

    const pauseAutoPlay = () => stopAutoPlay();
    const resumeAutoPlay = () => {
        if (!isTransitioning && !isDragging) startAutoPlay();
    };

    return (
        <div className="service-detail-container">
            <Header />

            {service.bannerImage?.url && (
                <section
                    className="service-banner"
                    style={{
                        backgroundImage: `url(${service.bannerImage.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
            )}

            <section className="service-info">
                <div className="services-into-df">
                    {service.servicesList?.map((item, i) => (
                        <div key={i} className="service-info-df">
                            <div className="service-left">
                                <h1>{item.title}</h1>
                                <p>{item.description}</p>
                                {item.link && (
                                    <div className="service-link-container">
                                        {item.isExternal ? (
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="service-link-btn"
                                            >
                                                Learn More →
                                            </a>
                                        ) : (
                                            <Link
                                                href={item.link}
                                                className="service-link-btn"
                                            >
                                                Learn More →
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                            {item.image?.url && (
                                <div className="service-right">
                                    <Image
                                        src={item.image.url}
                                        width={600}
                                        height={400}
                                        unoptimized
                                        alt={item.title || "Service Image"}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {service.keyActivities?.length > 0 && (
                <div className="key-container">
                    <h1 className="key-heading">Key Activities and Outcomes</h1>
                    <div className="key-cards-container">
                        {service.keyActivities.map((item, i) => (
                            <div className="key-card" key={i}>
                                <div className="key-asterisk">*</div>
                                <h3 className="key-card-title">{item.title}</h3>
                                <p className="key-card-description">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {service.features?.length > 0 && !service.keyActivities?.length && (
                <div className="key-container">
                    <h1 className="key-heading">Features</h1>
                    <div className="key-cards-container">
                        {service.features.map((feature, i) => (
                            <div className="key-card" key={i}>
                                <div className="key-asterisk">*</div>
                                <h3 className="key-card-title">
                                    {feature.title}
                                </h3>
                                <p className="key-card-description">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Why Work With Us Section - Requirements: 4.1, 4.2 */}
            {contactData?.whyWorkWithUsItems?.length > 0 && (
                <section className="why-work-main-service-page">
                    <div className="content-two-main-service-page">
                        <div className="text-main-service-page">
                            <h2>
                                {contactData?.whyWorkWithUsHeading ||
                                    "Why Work With Us?"}
                            </h2>
                            {contactData.whyWorkWithUsItems.map((item, idx) => (
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

                        {contactData?.rightImage?.url && (
                            <div className="image-wrapper-main-service-page">
                                <Image
                                    src={contactData.rightImage.url}
                                    alt={
                                        contactData.rightImage.alt ||
                                        "Why Work With Us"
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

            {otherServices.length > 0 && (
                <div className="professionals-section-internals">
                    <h1 className="professionals-heading-internals">
                        Explore More Services
                    </h1>
                    <div
                        className="carousel-container-internals"
                        onMouseEnter={pauseAutoPlay}
                        onMouseLeave={resumeAutoPlay}
                    >
                        <div
                            className="carousel-slides-internals"
                            ref={slideRef}
                            style={{
                                transform: `translateX(-${currentIndex * (isMobile ? 100 : 25)}%)`,
                                transition: isDragging
                                    ? "none"
                                    : "transform 0.5s ease-in-out",
                                cursor: isDragging ? "grabbing" : "grab",
                                userSelect: "none",
                            }}
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                        >
                            {slidesToShow.map((svc, i) => {
                                // Use the service image mapper for consistent images
                                const gridImage = getServiceGridImage(
                                    svc,
                                    serviceImageMap,
                                );

                                return (
                                    <Link
                                        key={i}
                                        href={`/services/${svc.slug}`}
                                        id="redirection-service"
                                    >
                                        <div className="carousel-slide-internals">
                                            <div className="professional-card-internals">
                                                <div className="image-container-internals">
                                                    {gridImage?.url ? (
                                                        <Image
                                                            src={gridImage.url}
                                                            alt={
                                                                gridImage.alt ||
                                                                svc.title
                                                            }
                                                            width={300}
                                                            height={200}
                                                            unoptimized
                                                            draggable={false}
                                                            style={{
                                                                pointerEvents:
                                                                    isDragging
                                                                        ? "none"
                                                                        : "auto",
                                                                userSelect:
                                                                    "none",
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: 300,
                                                                height: 200,
                                                                background:
                                                                    "#eee",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                userSelect:
                                                                    "none",
                                                            }}
                                                        >
                                                            <p>No Image</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <h3
                                                    style={{
                                                        userSelect: "none",
                                                    }}
                                                >
                                                    {svc.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            <div className="whatsapp">
                <a
                    className="btn-whatsapp-pulse"
                    target="_blank"
                    href="https://wa.me/919910085603/?text=I%20would%20like%20to%20know%20about%20ADPL%20Consulting%20LLC%20!"
                >
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                        width={40}
                        height={40}
                        alt="Whatsapp-img"
                    />
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
                                />
                                <button type="submit" className="submit-button">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

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

            <PageScripts
                customHeadTags={service?.customHeadTags}
                metaTags={service?.metaTags}
                pageId={`service-${slug}`}
            />
        </div>
    );
}
