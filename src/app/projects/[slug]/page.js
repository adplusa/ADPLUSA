"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Image from "next/image";
import Link from "next/link";
import { getProject, getProjects } from "@/lib/cms-client";
import Loading from "@/app/Components/Loading/page";
import "./project-detail.css";
import { injectHeadTags, removeHeadTags } from "../../utils/headInjector";

/**
 * Dynamic Project Detail Page
 * Fetches project by slug from the custom CMS
 * Requirements: 2.3, 2.5
 */
export default function ProjectDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [otherProjects, setOtherProjects] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [notFoundState, setNotFoundState] = useState(false);

    // Carousel state
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const slideRef = useRef(null);
    const intervalRef = useRef(null);

    // Check for mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Fetch project data from CMS
    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch the project by slug
                const projectData = await getProject(slug);

                if (!projectData) {
                    setNotFoundState(true);
                    setIsLoading(false);
                    return;
                }

                setProject(projectData);

                // Fetch other projects for the carousel
                const allProjects = await getProjects();
                if (allProjects) {
                    const others = allProjects.filter((p) => p.slug !== slug);
                    setOtherProjects(others);
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                setNotFoundState(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Handle SEO meta tags with proper cleanup
    useEffect(() => {
        if (!project || !slug) return;

        // Set SEO meta tags
        if (project.seoTitle) {
            document.title = project.seoTitle;
        } else if (project.title) {
            document.title = `${project.title} | ADPL Consulting`;
        }

        if (project.seoDescription) {
            let metaDesc = document.querySelector("meta[name='description']");
            if (metaDesc) {
                metaDesc.setAttribute("content", project.seoDescription);
            } else {
                metaDesc = document.createElement("meta");
                metaDesc.name = "description";
                metaDesc.content = project.seoDescription;
                document.head.appendChild(metaDesc);
            }
        }

        // Inject Custom Head Tags
        const headTagId = `project-custom-head-${slug}`;
        if (project.customHeadTags) {
            injectHeadTags(project.customHeadTags, headTagId);
        }

        // Cleanup: Remove project-specific custom head tags on unmount
        return () => {
            removeHeadTags(headTagId);
        };
    }, [project, slug]);

    // Scroll to top handler
    const upwardHandler = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Carousel logic
    const totalSlides = otherProjects.length || 1;
    const slidesToShow =
        otherProjects.length > 0 ? [...otherProjects, ...otherProjects] : [];

    const nextSlide = useCallback(() => {
        if (!isTransitioning && !isDragging) {
            setCurrentIndex((prev) => prev + 1);
        }
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
        if (otherProjects.length > 0 && !isDragging) {
            startAutoPlay();
        }
        return () => stopAutoPlay();
    }, [otherProjects, startAutoPlay, stopAutoPlay, isDragging]);

    // Infinite loop reset
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

    // Drag helpers
    const getPositionX = (e) =>
        e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

    const handleDragStart = (e) => {
        if (e.type === "mousedown") e.preventDefault();
        setIsDragging(true);
        stopAutoPlay();

        const x = getPositionX(e);
        setStartX(x);

        if (slideRef.current) {
            slideRef.current.style.transition = "none";
            slideRef.current.style.cursor = "grabbing";
        }
    };

    const handleDragMove = useCallback(
        (e) => {
            if (!isDragging || !slideRef.current) return;
            e.preventDefault();
            const x = getPositionX(e);
            const diff = x - startX;

            const slideWidth = isMobile ? 100 : 25;
            const currentTransform = -currentIndex * slideWidth;
            const dragOffset =
                (diff / slideRef.current.offsetWidth) * slideWidth;

            slideRef.current.style.transform = `translateX(${
                currentTransform + dragOffset
            }%)`;
        },
        [isDragging, startX, currentIndex, isMobile]
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
            if (dragDistance > 0 && currentIndex > 0) {
                newIndex = currentIndex - 1;
            } else if (dragDistance < 0 && currentIndex < totalSlides - 1) {
                newIndex = currentIndex + 1;
            }
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
            const handleTouchMove = (e) => handleDragMove(e);
            const handleTouchEnd = () => handleDragEnd();

            document.addEventListener("mousemove", handleMouseMove, {
                passive: false,
            });
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchmove", handleTouchMove, {
                passive: false,
            });
            document.addEventListener("touchend", handleTouchEnd);

            return () => {
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
                document.removeEventListener("touchmove", handleTouchMove);
                document.removeEventListener("touchend", handleTouchEnd);
            };
        }
    }, [isDragging, handleDragMove, handleDragEnd]);

    const pauseAutoPlay = () => stopAutoPlay();
    const resumeAutoPlay = () => {
        if (!isTransitioning && !isDragging) startAutoPlay();
    };

    // Loading state
    if (isLoading) {
        return <Loading text="Loading project..." />;
    }

    // 404 state
    if (notFoundState || !project) {
        return (
            <div className="internal-container">
                <Header />
                <div style={{ padding: "150px 20px", textAlign: "center" }}>
                    <h1>Project Not Found</h1>
                    <p>
                        The project you&apos;re looking for doesn&apos;t exist.
                    </p>
                    <Link
                        href="/projects"
                        style={{ color: "blue", textDecoration: "underline" }}
                    >
                        ← Back to Projects
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="internal-container">
            <Header />

            {/* Section One - Main Content */}
            <div className="internal-section-one">
                <div className="internal-section-one-top">
                    <h1>{project.title}</h1>

                    {(project.mainImage?.url || project.images?.[0]?.url) && (
                        <Image
                            src={
                                project.mainImage?.url ||
                                project.images?.[0]?.url
                            }
                            alt={
                                project.mainImage?.alt ||
                                project.images?.[0]?.alt ||
                                project.title
                            }
                            width={1200}
                            height={600}
                            unoptimized
                            priority
                        />
                    )}
                </div>

                <div className="internal-section-one-bottom">
                    <div className="internal-section-one-bottom-left">
                        {project.introText && <p>{project.introText}</p>}

                        {project.moreContent && (
                            <div
                                className={`load-content ${
                                    isExpanded ? "visible" : "hidden"
                                }`}
                                dangerouslySetInnerHTML={{
                                    __html: project.moreContent,
                                }}
                            />
                        )}
                    </div>

                    <div className="internal-section-one-bottom-right">
                        {project.projectDetails?.map((detail, idx) => (
                            <div
                                key={idx}
                                className={`load-content-li ${
                                    idx < 4
                                        ? "visible"
                                        : isExpanded
                                        ? "visible"
                                        : ""
                                }`}
                            >
                                <p>{detail?.label}</p>
                                <ul>
                                    {/* Handle both old format (items array) and new format (value string) */}
                                    {detail?.items?.map((item, itemIdx) => (
                                        <li key={itemIdx}>
                                            {item?.startsWith?.("http") ? (
                                                <a
                                                    href={item}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {item}
                                                </a>
                                            ) : (
                                                item
                                            )}
                                        </li>
                                    ))}
                                    {detail?.value && !detail?.items && (
                                        <li>
                                            {detail.value.startsWith?.(
                                                "http"
                                            ) ? (
                                                <a
                                                    href={detail.value}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {detail.value}
                                                </a>
                                            ) : (
                                                detail.value
                                            )}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {(project.moreContent ||
                    project.projectDetails?.length > 4) && (
                    <div
                        className="internal-section-one-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <button>
                            {isExpanded
                                ? "Less Information"
                                : "More Information"}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className={`bi ${
                                    isExpanded ? "bi-x-lg" : "bi-plus"
                                }`}
                                viewBox="0 0 16 16"
                            >
                                {isExpanded ? (
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                ) : (
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                )}
                            </svg>
                        </button>
                    </div>
                )}
                <hr id="internal-line" />
            </div>

            {/* Image Galleries */}
            {project.imageGalleries?.map((gallery, galleryIdx) => (
                <div key={galleryIdx} className="internal-section-two">
                    {/* Handle new format (images array) */}
                    {gallery.images?.length > 0 && (
                        <div className="internal-section-two-top-imgs">
                            {gallery.images.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img.url}
                                    alt={img.alt || `Project image ${idx + 1}`}
                                    width={600}
                                    height={400}
                                    unoptimized
                                />
                            ))}
                        </div>
                    )}

                    {/* Handle old format (topImages array) */}
                    {gallery.topImages?.length > 0 && (
                        <div className="internal-section-two-top-imgs">
                            {gallery.topImages.map((img, idx) => (
                                <Image
                                    key={idx}
                                    src={img.url}
                                    alt={img.alt || `Project image ${idx + 1}`}
                                    width={600}
                                    height={400}
                                    unoptimized
                                />
                            ))}
                        </div>
                    )}

                    {gallery.bottomImage?.url && (
                        <div className="internal-section-two-bottom">
                            <Image
                                src={gallery.bottomImage.url}
                                alt={gallery.bottomImage.alt || "Project image"}
                                width={1200}
                                height={600}
                                unoptimized
                            />
                        </div>
                    )}
                </div>
            ))}

            {/* Legacy images array support */}
            {project.images?.length > 0 && !project.imageGalleries?.length && (
                <div className="internal-section-two">
                    <div className="internal-section-two-top-imgs">
                        {project.images.map((img, idx) => (
                            <Image
                                key={idx}
                                src={img.url}
                                alt={img.alt || `Project image ${idx + 1}`}
                                width={600}
                                height={400}
                                unoptimized
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Explore More Projects Carousel */}
            {otherProjects.length > 0 && (
                <div className="professionals-section-internals">
                    <h1 className="professionals-heading-internals">
                        Explore More Projects
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
                                transform: `translateX(-${
                                    currentIndex * (isMobile ? 100 : 25)
                                }%)`,
                                transition: isDragging
                                    ? "none"
                                    : "transform 0.5s ease-in-out",
                                cursor: isDragging ? "grabbing" : "grab",
                                userSelect: "none",
                            }}
                            onMouseDown={handleDragStart}
                            onTouchStart={handleDragStart}
                        >
                            {slidesToShow.map((proj, i) => (
                                <Link
                                    key={i}
                                    href={`/projects/${proj.slug}`}
                                    id="redirection-service"
                                >
                                    <div className="carousel-slide-internals">
                                        <div
                                            className="professional-card-internals"
                                            id="project-caraousel"
                                        >
                                            <div className="image-container-internals">
                                                {proj.mainImage?.url ||
                                                proj.images?.[0]?.url ? (
                                                    <Image
                                                        src={
                                                            proj.mainImage
                                                                ?.url ||
                                                            proj.images?.[0]
                                                                ?.url
                                                        }
                                                        alt={
                                                            proj.mainImage
                                                                ?.alt ||
                                                            proj.images?.[0]
                                                                ?.alt ||
                                                            proj.title
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
                                                            userSelect: "none",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: 300,
                                                            height: 200,
                                                            background: "#eee",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            userSelect: "none",
                                                        }}
                                                    >
                                                        <p>No Image</p>
                                                    </div>
                                                )}
                                            </div>
                                            <h3 style={{ userSelect: "none" }}>
                                                {proj.title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
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
                        src="/whatsapp.png"
                        width={40}
                        height={40}
                        alt="Whatsapp-img"
                        unoptimized
                    />
                </a>
            </div>

            {/* Enquiry Button */}
            <div className="enquire">
                <button onClick={() => setShowForm(true)}>Enquire Now</button>
            </div>

            {/* Enquiry Form Modal */}
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

            {/* Scroll Up Button */}
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
        </div>
    );
}
