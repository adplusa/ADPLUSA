"use client";

import React, { useEffect, useState } from "react";
import "./header.css";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getGeneralSettings } from "@/lib/cms-client";

const DEFAULT_LOGO = "/n.png";

const Header = ({
    initialLogo = null,
    initialLogoAlt = "ADPL Consulting Logo",
} = {}) => {
    const pathname = usePathname();

    const isActive = (path) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };
    // Read from sessionStorage first for instant display (no flash/delay on navigation)
    const [logo, setLogo] = useState(() => {
        if (initialLogo) return initialLogo;
        try {
            return sessionStorage.getItem("cms_header_logo") || null;
        } catch {
            return null;
        }
    });
    const [logoAlt, setLogoAlt] = useState(() => {
        if (initialLogoAlt !== "ADPL Consulting Logo") return initialLogoAlt;
        try {
            return (
                sessionStorage.getItem("cms_header_logo_alt") ||
                "ADPL Consulting Logo"
            );
        } catch {
            return "ADPL Consulting Logo";
        }
    });
    const [isFixed, setIsFixed] = useState(false);
    const [navbarTop, setNavbarTop] = useState(0);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    // Fetch from CMS only when sessionStorage has no cached logo
    useEffect(() => {
        if (logo) return; // Already have logo from sessionStorage or server prop, skip fetch
        const fetchSettings = async () => {
            try {
                const settings = await getGeneralSettings();
                if (settings?.headerLogo?.url) {
                    setLogo(settings.headerLogo.url);
                    const alt =
                        settings.headerLogo.alt || "ADPL Consulting Logo";
                    setLogoAlt(alt);
                    // Cache in sessionStorage for instant load on next page navigation
                    try {
                        sessionStorage.setItem(
                            "cms_header_logo",
                            settings.headerLogo.url,
                        );
                        sessionStorage.setItem("cms_header_logo_alt", alt);
                    } catch {
                        /* ignore storage errors */
                    }
                } else {
                    setLogo(DEFAULT_LOGO);
                }
            } catch (error) {
                console.error("Failed to fetch header settings:", error);
                setLogo(DEFAULT_LOGO);
            }
        };
        fetchSettings();
    }, [logo]);

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
                        <span
                            className="flip-container"
                            suppressHydrationWarning
                        >
                            {logo && (
                                <Image
                                    id="flip-one"
                                    className="flip-front"
                                    src={logo}
                                    alt={logoAlt}
                                    width={0}
                                    height={0}
                                    unoptimized
                                    priority
                                />
                            )}
                        </span>
                    </div>
                </Link>

                <div className="header-right">
                    <div
                        id="second-navbar"
                        className={`second-navbar ${isFixed ? "fixed" : ""}`}
                    >
                        <ul style={{ display: "flex", gap: "40px" }}>
                            <li>
                                <Link style={{ margin: 0 }} className={isActive('/') ? 'active-link' : ''} href="/">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link style={{ margin: 0 }} className={isActive('/about') ? 'active-link' : ''} href="/about">About Us</Link>
                            </li>
                            <li>
                                <Link style={{ margin: 0 }} className={isActive('/mainservice') ? 'active-link' : ''} href="/mainservice">Services</Link>
                            </li>
                            <li>
                                <Link style={{ margin: 0 }} className={isActive('/projects') ? 'active-link' : ''} href="/projects">Projects</Link>
                            </li>
                            <li>
                                <Link style={{ margin: 0 }} className={isActive('/faq') ? 'active-link' : ''} href="/faq">FAQs</Link>
                            </li>
                            <li>
                                <Link style={{ margin: 0 }} className={isActive('/contact') ? 'active-link' : ''} href="/contact">Contact Us</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="header-df mobile">
                <Link href="/">
                    <div className="flip-logo">
                        <span
                            className="flip-container"
                            suppressHydrationWarning
                        >
                            {logo && (
                                <Image
                                    id="flip-one"
                                    className="flip-front"
                                    src={logo}
                                    alt={logoAlt}
                                    width={0}
                                    height={0}
                                    unoptimized
                                    priority
                                />
                            )}
                        </span>
                    </div>
                </Link>

                <button id="ham" onClick={toggleMobileMenu}>
                    {!isMobileMenuOpen ? (
                        <svg
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
                            <Link className={isActive('/') ? 'active-link' : ''} href="/">Home</Link>
                        </li>
                        <li>
                            <Link className={isActive('/about') ? 'active-link' : ''} href="/about">About Us</Link>
                        </li>
                        <li>
                            <Link className={isActive('/mainservice') ? 'active-link' : ''} href="/mainservice">Services</Link>
                        </li>
                        <li>
                            <Link className={isActive('/projects') ? 'active-link' : ''} href="/projects">Projects</Link>
                        </li>
                        <li>
                            <Link className={isActive('/faq') ? 'active-link' : ''} href="/faq">FAQs</Link>
                        </li>
                        <li>
                            <Link className={isActive('/contact') ? 'active-link' : ''} href="/contact">Contact Us</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Header;
