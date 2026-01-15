"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Loading from "../Components/Loading/page";
import "./about.css";
import Image from "next/image";
import gsap from "gsap";
import Head from "next/head";
import { getAbout } from "../../lib/cms-client";
import { injectHeadTags, removeHeadTags } from "../utils/headInjector";

const About = () => {
    const textRef = useRef(null);
    const [data, setData] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (!data) return;

        document.title = data.seoTitle || "About Us";

        const metaDesc = document.querySelector("meta[name='description']");
        if (metaDesc) {
            metaDesc.setAttribute(
                "content",
                data.seoDescription || "Learn about our mission and team"
            );
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content =
                data.seoDescription || "Learn about our mission and team";
            document.head.appendChild(meta);
        }

        // Inject Custom Head Tags
        if (data.customHeadTags) {
            injectHeadTags(data.customHeadTags, "about-custom-head");
        }

        // Cleanup: Remove about-specific custom head tags on unmount
        return () => {
            removeHeadTags("about-custom-head");
        };
    }, [data]);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const aboutPageData = await getAbout();
                console.log("Fetched About Page Data:", aboutPageData);
                setData(aboutPageData);
            } catch (error) {
                console.error("Error fetching aboutPage data from CMS:", error);
            }
        };

        fetchAboutData();
    }, []);

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

    if (!data) return <Loading text="Loading" fullScreen={true} />;

    return (
        <div>
            <Head>
                <title>{data.seoTitle || "About Us - My Website"}</title>
                <meta
                    name="description"
                    content={
                        data.seoDescription ||
                        "Learn more about our company and mission."
                    }
                />
                <meta name="robots" content="index, follow" />
                <meta
                    property="og:title"
                    content={data.seoTitle || "About Us - My Website"}
                />
                <meta
                    property="og:description"
                    content={
                        data.seoDescription ||
                        "Learn more about our company and mission."
                    }
                />
            </Head>
            <Header />

            <div className="about-container">
                <div className="about-content">
                    {/* Hero Section */}
                    <div className="home-about">
                        <div className="about-us">
                            {/* Large Background Text */}
                            {data.allowLightHeading && (
                                <h2>{data.allowLightHeading}</h2>
                            )}

                            <div className="about-us-top">
                                {/* Left Column - Main Heading */}
                                <div className="about-us-top-left">
                                    {data.allowUsHeading && (
                                        <h1>{data.allowUsHeading}</h1>
                                    )}
                                </div>

                                {/* Right Column - Content */}
                                <div className="about-us-top-right">
                                    {data.allowRightHeading && (
                                        <h1>{data.allowRightHeading}</h1>
                                    )}

                                    {/* Main Paragraph */}
                                    {data.paragraph && (
                                        <div
                                            className="about-paragraph"
                                            dangerouslySetInnerHTML={{
                                                __html: data.paragraph,
                                            }}
                                        />
                                    )}

                                    {/* Anchor Links */}
                                    {data.anchorLinks &&
                                        data.anchorLinks.length > 0 && (
                                            <span className="four-p">
                                                {data.anchorLinks.map(
                                                    (link, idx) => (
                                                        <a
                                                            href={`#${link.targetId}`}
                                                            key={idx}
                                                        >
                                                            {link.label}
                                                        </a>
                                                    )
                                                )}
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    {data.sections && data.sections.length > 0 && (
                        <div className="about-sections">
                            {data.sections.map((section, idx) => (
                                <div
                                    className={`about-section-row ${
                                        idx % 2 === 0
                                            ? "section-left"
                                            : "section-right"
                                    }`}
                                    key={section.sectionId || idx}
                                    id={section.sectionId?.replace(/^#/, "")}
                                >
                                    {/* Content Box */}
                                    <div className="section-content-box">
                                        <h1>{section.title}</h1>
                                        <div
                                            className="section-body"
                                            dangerouslySetInnerHTML={{
                                                __html: section.body,
                                            }}
                                        />
                                    </div>

                                    {/* Image */}
                                    {section?.image?.url && (
                                        <div className="section-image">
                                            <Image
                                                src={section.image.url}
                                                alt={`${section.title} image`}
                                                width={800}
                                                height={500}
                                                unoptimized
                                                priority
                                                style={{
                                                    objectFit: "cover",
                                                    width: "100%",
                                                    height: "auto",
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
                        src={"/whatsapp.png"}
                        width={40}
                        height={40}
                        alt="Whatsapp-img"
                        unoptimized
                    ></Image>
                </a>
            </div>

            {/* Enquire Button */}
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

            {/* Scroll to Top Button */}
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
};

export default About;
