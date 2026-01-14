"use client";
import React, { useEffect, useState } from "react";
import "./header.css";
import Image from "next/image";
import Link from "next/link";
import { getGeneralSettings } from "@/lib/cms-client";

const DEFAULT_LOGO = "/n.png";

const Header = () => {
    const [logo, setLogo] = useState(DEFAULT_LOGO);
    const [logoAlt, setLogoAlt] = useState("ADPL Consulting Logo");
    const [isFixed, setIsFixed] = useState(false);
    const [navbarTop, setNavbarTop] = useState(0);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(true);

    const cancelHandler = () => {
        setMenuOpen(false);
    };

    const hamHandler = () => {
        setMenuOpen(true);
    };

    // Fetch logo from CMS
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getGeneralSettings();
                if (settings?.headerLogo?.url) {
                    setLogo(settings.headerLogo.url);
                    if (settings.headerLogo.alt) {
                        setLogoAlt(settings.headerLogo.alt);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch header settings:", error);
                // Fallback to default logo
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const navbar = document.getElementById("second-navbar");
        if (navbar) {
            setNavbarTop(navbar.offsetTop);
        }

        const handleScroll = () => {
            if (window.scrollY >= navbarTop) {
                setIsFixed(true);
            } else {
                setIsFixed(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [navbarTop]);

    return (
        <div className="header">
            {/* Desktop Header */}
            <div className="header-df desktop">
                <Link href="/">
                    <div className="flip-logo">
                        <span className="flip-container">
                            <Image
                                id="flip-one"
                                className="flip-front"
                                src={logo}
                                alt={logoAlt}
                                width={0}
                                height={0}
                                unoptimized
                            />
                        </span>
                    </div>
                </Link>

                <div className="header-right">
                    <div
                        id="second-navbar"
                        className={`second-navbar ${isFixed ? "fixed" : ""}`}
                    >
                        <ul>
                            <li>
                                <Link href="/">Home</Link>
                            </li>
                            <li>
                                <Link href="/about">About Us</Link>
                            </li>
                            <li>
                                <Link href="/mainservice">Services</Link>
                            </li>
                            <li>
                                <Link href="/projects">Projects</Link>
                            </li>
                            <li>
                                <Link href="/faq">FAQs</Link>
                            </li>
                            <li>
                                <Link href="/contact">Contact Us</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="header-df mobile">
                <button
                    id="ham"
                    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {menuOpen ? (
                        <svg
                            onClick={cancelHandler}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            className="bi bi-list"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                            />
                        </svg>
                    ) : (
                        <svg
                            onClick={hamHandler}
                            id="cancel"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-x"
                            viewBox="0 0 16 16"
                        >
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                        </svg>
                    )}
                </button>

                <div
                    id="second-navbar"
                    className={`second-navbar ${
                        isMobileMenuOpen ? "mobile-open" : ""
                    }`}
                >
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/about">About Us</Link>
                        </li>
                        <li>
                            <Link href="/mainservice">Services</Link>
                        </li>
                        <li>
                            <Link href="/projects">Projects</Link>
                        </li>
                        <li>
                            <Link href="/faq">FAQs</Link>
                        </li>
                        <li>
                            <Link href="/contact">Contact Us</Link>
                        </li>
                    </ul>
                </div>

                <Link href="/">
                    <div className="flip-logo">
                        <span className="flip-container">
                            <Image
                                id="flip-one"
                                className="flip-front"
                                src={logo}
                                alt={logoAlt}
                                width={0}
                                height={0}
                                unoptimized
                            />
                        </span>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Header;
