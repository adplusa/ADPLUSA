"use client";

import React, { useEffect, useRef, useState } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import "./about.css";
import Image from "next/image";
import gsap from "gsap";
import PageScripts from "../Components/PageScripts";

export default function AboutClient({ data }) {
    const textRef = useRef(null);
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

    return (
        <div>
            <Header />

            <div className="about-container">
                <div className="about-content">
                    {/* Hero Section */}
                    <div className="home-about">
                        <div className="about-us">
                            {data.allowLightHeading && (
                                <h2>{data.allowLightHeading}</h2>
                            )}

                            <div className="about-us-top">
                                <div className="about-us-top-left">
                                    {data.allowUsHeading && (
                                        <h1>{data.allowUsHeading}</h1>
                                    )}
                                </div>

                                <div className="about-us-top-right">
                                    {data.allowRightHeading && (
                                        <h1>{data.allowRightHeading}</h1>
                                    )}

                                    {data.paragraph && (
                                        <div
                                            className="about-paragraph"
                                            dangerouslySetInnerHTML={{
                                                __html: data.paragraph,
                                            }}
                                        />
                                    )}

                                    {data.anchorLinks?.length > 0 && (
                                        <span className="four-p">
                                            {data.anchorLinks.map((link, idx) => (
                                                <a href={`#${link.targetId}`} key={idx}>
                                                    {link.label}
                                                </a>
                                            ))}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Sections */}
                    {data.sections?.length > 0 && (
                        <div className="about-sections">
                            {data.sections.map((section, idx) => (
                                <div
                                    className={`about-section-row ${
                                        idx % 2 === 0 ? "section-left" : "section-right"
                                    }`}
                                    key={section.sectionId || idx}
                                    id={section.sectionId?.replace(/^#/, "")}
                                >
                                    <div className="section-content-box">
                                        <h1>{section.title}</h1>
                                        <div
                                            className="section-body"
                                            dangerouslySetInnerHTML={{
                                                __html: section.body,
                                            }}
                                        />
                                    </div>

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

            <div className="enquire">
                <button onClick={() => setShowForm(true)}>Enquire Now</button>
            </div>

            {showForm && (
                <div className="enquiry-overlay" onClick={() => setShowForm(false)}>
                    <div className="enquiry-container" onClick={(e) => e.stopPropagation()}>
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
                                <input type="text" placeholder="Mobile No." className="form-input" />
                                <select className="form-input">
                                    <option>Select Type</option>
                                    <option>General</option>
                                    <option>Support</option>
                                    <option>Sales</option>
                                </select>
                                <textarea placeholder="Query" className="form-input" rows="3" />
                                <button type="submit" className="submit-button">Submit</button>
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

            <PageScripts customHeadTags={data?.customHeadTags} pageId="about" />
        </div>
    );
}
