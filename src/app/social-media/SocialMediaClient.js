"use client";
import React from "react";
import "./socialMedia.css";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Image from "next/image";

export default function SocialMediaClient({ socialLinks = [] }) {
    const getPlatformIconUrl = (platform) => {
        switch (platform.toLowerCase()) {
            case 'instagram': return "https://cdn-icons-png.flaticon.com/512/174/174855.png";
            case 'facebook': return "https://cdn-icons-png.flaticon.com/512/733/733547.png";
            case 'linkedin': return "https://cdn-icons-png.flaticon.com/512/174/174857.png";
            case 'whatsapp': return "https://cdn-icons-png.flaticon.com/512/733/733585.png";
            case 'youtube': return "https://cdn-icons-png.flaticon.com/512/1384/1384060.png";
            case 'twitter': return "https://cdn-icons-png.flaticon.com/512/733/733579.png";
            case 'github': return "https://cdn-icons-png.flaticon.com/512/2111/2111432.png";
            default: return "https://cdn-icons-png.flaticon.com/512/8418/8418389.png"; // link icon
        }
    };

    return (
        <>
            <Header />
            <div className="social-links-grid-unique">
                {socialLinks.length > 0 ? (
                    socialLinks.map((link, idx) => (
                        <div key={idx} className="social-links-grid-unique__item">
                            <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={getPlatformIconUrl(link.platform)}
                                    alt={link.platform}
                                    width={50}
                                    height={50}
                                />
                                <span className="capitalize">{link.platform}</span>
                            </a>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center", width: "100%", padding: "50px", color: "#666" }}>
                        <p>No social media links provided. Add them in the CMS Contact settings.</p>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
