"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Image from "next/image";
import Link from "next/link";
import "./project.css";

/**
 * Projects Client Component
 * Receives data from server component and handles all interactivity
 * Uses infinite scroll for loading more projects
 */
export default function ProjectsClient({ projects }) {
    const textRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loaderRef = useRef(null);

    // Map images array to mainImage for compatibility
    const data = (projects || []).map(item => ({
        ...item,
        mainImage: item.images?.[0] || null,
    })).filter(item => item.mainImage?.url);

    // Infinite scroll - load more when loader element is visible
    const loadMore = useCallback(() => {
        if (isLoadingMore || visibleCount >= data.length) return;

        setIsLoadingMore(true);
        setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 6, data.length));
            setIsLoadingMore(false);
        }, 300);
    }, [isLoadingMore, visibleCount, data.length]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isLoadingMore && visibleCount < data.length) {
                    loadMore();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [loadMore, isLoadingMore, visibleCount, data.length]);

    const upwardHandler = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (!data || data.length === 0) {
        return (
            <>
                <Header />
                <div className="project-container">
                    <div className="project-content">
                        <div className="project-heading">
                            <h1>Our Projects</h1>
                            <hr id="project-hr" />
                        </div>
                        <div style={{ padding: "50px", textAlign: "center" }}>
                            <p>No projects available at the moment.</p>
                        </div>
                    </div>
                    <Footer />
                </div>
            </>
        );
    }

    return (
        <>
            <Header />

            <div className="project-container">
                <div className="project-content">
                    <div className="project-heading">
                        <h1 ref={textRef}>Our Projects</h1>
                        <hr id="project-hr" />
                    </div>

                    {/* Project Grid */}
                    <div className="project-grid">
                        {data.slice(0, visibleCount).map((item, index) => (
                            <Link
                                href={item.slug ? `/projects/${item.slug}` : "#"}
                                key={item._id || index}
                                className="project-tile"
                            >
                                <div className="image-wrapper-pr">
                                    <Image
                                        src={item.mainImage?.url || "/placeholder.jpg"}
                                        alt={item.mainImage?.alt || item.title || "Project Image"}
                                        fill
                                        unoptimized
                                        priority={index < 6}
                                    />
                                </div>
                                <p className="image-title">{item.title}</p>
                            </Link>
                        ))}
                    </div>

                    {/* Infinite Scroll Loader */}
                    {visibleCount < data.length && (
                        <div
                            ref={loaderRef}
                            className="infinite-scroll-loader"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                padding: '30px 0',
                                width: '100%'
                            }}
                        >
                            {isLoadingMore && (
                                <div className="loading-spinner" style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid #f3f3f3',
                                    borderTop: '3px solid #333',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }} />
                            )}
                        </div>
                    )}
                </div>

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

                {/* Enquiry Form */}
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
        </>
    );
}
