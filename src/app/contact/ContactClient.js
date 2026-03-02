"use client";
import React, { useEffect, useRef } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Image from "next/image";
import PageScripts from "../Components/PageScripts";
import ContactForm from "../Components/ContactForm/page";
import gsap from "gsap";
import "./contact.css";

export default function ContactClient({ data }) {
    const textRef = useRef(null);

    const upwardHandler = () => window.scrollTo({ top: 0, behavior: "smooth" });

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

    const serviceOptions = data?.serviceOptions?.length > 0
        ? data.serviceOptions
        : [
            "Drafting to CAD (PDF to CAD)",
            "Permit Drawing and Documentation",
            "Working Drawing and Detailing",
            "3D Modelling, Rendering and Walkthrough",
            "360 Degree Views",
            "BIM Services",
            "Bill of Quantities (BOQ)",
            "MEP Drafting",
        ];

    return (
        <>
            <Header />

            <div className="contact-container">
                <div className="contact-form-section">
                    <ContactForm
                        title={data?.mainHeading || "Get in touch"}
                        description={data?.contactDescription}
                        buttonText={data?.contactButtonText || "Send Message"}
                        serviceOptions={serviceOptions}
                    />
                </div>

                <div className="contact-info-section">
                    <div className="map-container">
                        {data?.contactImage?.url && (
                            <Image
                                src={data.contactImage.url}
                                width={0}
                                height={0}
                                alt={data.contactImage.alt || "Contact Image"}
                                unoptimized
                                className="map-image"
                            />
                        )}
                    </div>
                </div>
            </div>

            <section className="for-map-wrapper">
                <div className="for-map-container">
                    <div className="for-map-left">
                        <h2 className="for-map-heading">
                            {data?.talkIdeasHeading || "Let's Talk Ideas"}
                        </h2>
                        <p className="for-map-description">
                            Connect with us to transform your ideas into
                            reality. Whether you&apos;re seeking expert advice,
                            have project inquiries, or are ready to begin, our
                            team is here to guide you every step of the way.
                        </p>

                        <div className="for-map-info">
                            <div className="for-map-item">
                                <span className="for-map-label">Address:</span>
                                <span className="for-map-value">
                                    {data.contactInfo?.address}
                                </span>
                            </div>
                            <div className="for-map-item">
                                <span className="for-map-label">Phone:</span>
                                <span className="for-map-value">
                                    {data.contactInfo?.phone}
                                </span>
                            </div>
                            <div className="for-map-item">
                                <span className="for-map-label">Email:</span>
                                <span className="for-map-value">
                                    {data.contactInfo?.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {data?.googleMapEmbedUrl && (
                        <div className="for-map-right">
                            <iframe
                                title="Google Map"
                                src={data.googleMapEmbedUrl}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    )}
                </div>
            </section>

            <section className="why-work">
                <div className="content-two">
                    <div className="text">
                        <h2>{data?.whyWorkWithUsHeading}</h2>
                        {data?.whyWorkWithUsItems?.map((item, idx) => (
                            <div className="feature" key={idx}>
                                {item.icon ? (
                                    item.icon.startsWith("bi") || item.icon.startsWith("fa-") ? (
                                        <i className={item.icon} style={{ fontSize: "24px", color: "currentColor", display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}></i>
                                    ) : (
                                        <span style={{ fontSize: "24px", lineHeight: "1", display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px" }}>{item.icon}</span>
                                    )
                                ) : (
                                    <svg
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
                                <div className="info">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="image-wrapper-contact">
                        <div className="background-contact">
                            {data?.rightImage?.url && (
                                <Image
                                    src={data.rightImage.url}
                                    alt={
                                        data.rightImage.alt || "Why Work Image"
                                    }
                                    width={500}
                                    height={400}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </section>

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
                customHeadTags={data?.customHeadTags}
                metaTags={data?.metaTags}
                pageId="contact"
            />
        </>
    );
}
