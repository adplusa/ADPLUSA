"use client";
import Image from "next/image";
import styles from "./page.css";
import Header from "./Components/Header/page";
import ContactForm from "./Components/ContactForm/page";
import Loading from "./Components/Loading/page";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { gsap, CSSPlugin, Expo } from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./Components/Footer/page";
import PageScripts from "./Components/PageScripts";
import "./contact/contact.css";

gsap.registerPlugin(CSSPlugin, ScrollTrigger);

const images = ["/process-img.jpg", "/process-img2.jpg", "/process-img3.jpg"];

export default function HomeClient({ homepageData: initialData }) {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [isLeftHalf, setIsLeftHalf] = useState(true);
    const [showCustomCursor, setShowCustomCursor] = useState(false);
    const [renderCursorPos, setRenderCursorPos] = useState({ x: 0, y: 0 });
    const [slides, setSlides] = useState(initialData?.slides || []);

    const [currentSlideHeroBanner, setCurrentSlideHeroBanner] = useState(0);
    const [isDesktop, setIsDesktop] = useState(false);
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageSrc, setImageSrc] = useState(images[0]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [homepageData, setHomepageData] = useState(initialData);
    const [index, setIndex] = useState(0);
    const textRef = useRef(null);
    const textRefs = useRef([]);
    const [open, setOpen] = useState(null);
    const [videos, setVideos] = useState({
        peopleVideo: initialData?.aboutVideo?.url || null,
        serviceVideo: null,
    });
    const [bgImage, setBgImage] = useState("");

    const [showIntro, setShowIntro] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showScrollUp, setShowScrollUp] = useState(false);

    // Contact Form Logic removed (using shared component)


    const [shouldAnimate, setShouldAnimate] = useState(false);

    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slides: {
            perView: 1,
            spacing: 0,
        },
        drag: true,
    });

    // Fixed localStorage check and intro logic
    useEffect(() => {
        if (typeof window === "undefined") return;

        const hasVisited = localStorage.getItem("hasVisited");

        if (!hasVisited) {
            localStorage.setItem("hasVisited", "true");
            setShowIntro(true);
            setShouldAnimate(true);
            setLoading(true);
        } else {
            setShowIntro(false);
            setShouldAnimate(false);
            setLoading(false);
        }
    }, []);

    // Fixed animation logic
    useEffect(() => {
        if (!homepageData) return;

        if (!shouldAnimate) {
            setLoading(false);
            return;
        }

        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev < 100) {
                    return prev + 1;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        startGSAPAnimation();
                    }, 100);
                    return 100;
                }
            });
        }, 5);

        return () => clearInterval(interval);
    }, [homepageData, shouldAnimate]);

    // Separate GSAP animation function
    const startGSAPAnimation = () => {
        const checkAndAnimate = () => {
            const logo = document.querySelector(".logo");
            const followTop = document.querySelector(".follow-top");
            const followBottom = document.querySelector(".follow-bottom");

            if (!logo || !followTop || !followBottom) {
                requestAnimationFrame(checkAndAnimate);
                return;
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    setLoading(false);
                },
            });

            tl.to(".count", {
                opacity: 0,
                duration: 0.1,
            })
                .to(".progress-bar-two", {
                    opacity: 0,
                    duration: 0.1,
                })
                .to(".follow-top", {
                    height: "50vh",
                    ease: "expo.inOut",
                    duration: 0.4,
                })
                .to(
                    ".follow-bottom",
                    {
                        height: "50vh",
                        ease: "expo.inOut",
                        duration: 0.4,
                    },
                    "-=0.4",
                )
                .fromTo(
                    ".logo",
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, ease: "expo.inOut", duration: 0.4 },
                )
                .set(".main-content", {
                    opacity: 1,
                });
        };

        checkAndAnimate();
    };

    useEffect(() => {
        if (window.innerWidth >= 768) {
            const interval = setInterval(() => {
                setIndex((prevIndex) => {
                    const newIndex = (prevIndex + 1) % images.length;
                    setImageSrc(images[newIndex]);
                    setActiveIndex(newIndex);
                    return newIndex;
                });
            }, 4000);

            return () => clearInterval(interval);
        }
    }, []);

    const handleImageChange = (newIndex) => {
        setImageSrc(images[newIndex]);
        setActiveIndex(newIndex);
        setIndex(newIndex);
    };

    const toggle = (index) => {
        setOpen(open === index ? null : index);
    };

    const icons = Array(6).fill("/HUSLOGO_WHITE.AVIF");

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % icons.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [icons.length]);

    useEffect(() => {
        textRefs.current.forEach((el) => {
            if (el) {
                const splitText = new SplitType(el, { type: "chars" });

                gsap.from(splitText.chars, {
                    opacity: 0,
                    yPercent: 100,
                    duration: 0.2,
                    ease: "power2.out",
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    },
                });
            }
        });
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

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop ||
                0;

            setShowScrollUp(scrollTop > 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const upwardHandler = () => {
        (
            window.scrollTo ||
            document.documentElement.scrollTo ||
            document.body.scrollTo
        )?.({
            top: 0,
            behavior: "smooth",
        });
    };

    const prevSlide = () => {
        setCurrentSlideHeroBanner(
            (prev) => (prev - 1 + slides.length) % slides.length,
        );
    };

    const nextSlide = () => {
        setCurrentSlideHeroBanner((prev) => (prev + 1) % slides.length);
    };

    // Auto-advance hero carousel every 4s; resets if user manually swipes
    useEffect(() => {
        if (!slides.length) return;
        const timer = setInterval(() => {
            setCurrentSlideHeroBanner((prev) => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length, currentSlideHeroBanner]);

    const handleMouseMove = (e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;
        const leftHalf = x < bounds.width / 2;
        setCursorPos({ x, y });
        setIsLeftHalf(leftHalf);
    };

    const handleMouseEnter = () => setShowCustomCursor(true);
    const handleMouseLeave = () => setShowCustomCursor(false);

    // Touch support for mobile hero carousel
    const touchStartXRef = useRef(null);

    const handleTouchStart = (e) => {
        touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartXRef.current === null) return;
        const delta = touchStartXRef.current - e.changedTouches[0].clientX;
        if (Math.abs(delta) > 40) {
            delta > 0 ? nextSlide() : prevSlide();
        }
        touchStartXRef.current = null;
    };

    useEffect(() => {
        let animationFrame;
        const lerp = (a, b, n) => a + (b - a) * n;

        const animate = () => {
            setRenderCursorPos((prev) => ({
                x: lerp(prev.x, cursorPos.x, 0.1),
                y: lerp(prev.y, cursorPos.y, 0.1),
            }));
            animationFrame = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, [cursorPos]);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth > 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    return (
        <>
            {!homepageData ? (
                <Loading text="Loading" fullScreen={true} />
            ) : (
                <div className="main-content">
                    {loading && shouldAnimate ? (
                        <div className="loader-container">
                            <div className="loading">
                                <p className="count">{counter}%</p>
                                <div
                                    className="progress-bar-two"
                                    style={{ width: `${counter}%` }}
                                ></div>
                            </div>
                            <div className="follow-container">
                                <div className="follow follow-top"></div>
                                <div className="follow follow-bottom"></div>
                            </div>
                            <div className="logo-container">
                                <Image
                                    className="logo"
                                    src={
                                        homepageData?.headerLogo?.url ||
                                        "/white-logo.png"
                                    }
                                    alt="logo"
                                    width={200}
                                    height={200}
                                    unoptimized
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="nav">
                            <div className="intro-container">
                                <Header />
                                <div
                                    className="hero-banner"
                                    style={{
                                        backgroundImage: bgImage
                                            ? `url(${bgImage})`
                                            : "none",
                                    }}
                                >
                                    <div className="overlay"></div>
                                </div>
                                <div
                                    className={"animation-slider light-banner"}
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                    {...(isDesktop && {
                                        onMouseMove: handleMouseMove,
                                        onMouseEnter: handleMouseEnter,
                                        onMouseLeave: handleMouseLeave,
                                        onClick: () => {
                                            isLeftHalf
                                                ? prevSlide()
                                                : nextSlide();
                                        },
                                    })}
                                >
                                    <div
                                        className="animation-slider-df"
                                        style={{
                                            transform: `translateX(-${currentSlideHeroBanner * 100
                                                }%)`,
                                        }}
                                    >
                                        {slides.map(
                                            (slide, index) =>
                                                slide?.image?.url && (
                                                    <div
                                                        key={index}
                                                        className="animate-back-img"
                                                        style={{
                                                            backgroundImage: `url(${slide.image.url})`,
                                                            backgroundSize:
                                                                "contain",
                                                        }}
                                                        aria-label={
                                                            slide.image?.alt ||
                                                            "Slide Image"
                                                        }
                                                    ></div>
                                                ),
                                        )}
                                    </div>

                                    {/* Custom Cursor Only on Desktop */}
                                    {isDesktop && showCustomCursor && (
                                        <div
                                            className={`custom-cursor ${isLeftHalf
                                                ? "left-btn"
                                                : "right-btn"
                                                }`}
                                            style={{
                                                left: `${renderCursorPos.x}px`,
                                                top: `${renderCursorPos.y}px`,
                                                transform:
                                                    "translate(-50%, -50%)",
                                            }}
                                        >
                                            <span>
                                                {isLeftHalf ? (
                                                    <svg
                                                        id="left-btn-hero"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-chevron-left"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        id="right-btn-hero"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        className="bi bi-chevron-right"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {/* Slider Dots Work on All Devices */}
                                    <div className="slider-dots">
                                        {slides.map((_, index) => (
                                            <button
                                                key={index}
                                                className={`dot ${index ===
                                                    currentSlideHeroBanner
                                                    ? "active"
                                                    : ""
                                                    }`}
                                                onClick={() =>
                                                    setCurrentSlideHeroBanner(
                                                        index,
                                                    )
                                                }
                                            ></button>
                                        ))}
                                    </div>
                                </div>

                                <div className="feature-section">
                                    <div className="feature-section-df">
                                        <div className="feature-box">
                                            <h1>
                                                {homepageData.trustIconsHeading}
                                            </h1>
                                            <div className="features-name">
                                                {homepageData.trustIcons?.map(
                                                    (icon, index) =>
                                                        icon?.image?.url && (
                                                            <div
                                                                key={index}
                                                                className="service-related-item"
                                                            >
                                                                <Image
                                                                    src={
                                                                        icon
                                                                            .image
                                                                            .url
                                                                    }
                                                                    alt={
                                                                        icon
                                                                            .image
                                                                            .alt ||
                                                                        icon.name ||
                                                                        "Trust icon"
                                                                    }
                                                                    width={70}
                                                                    height={70}
                                                                    unoptimized
                                                                    priority
                                                                />
                                                                <p>
                                                                    {
                                                                        icon.number
                                                                    }
                                                                </p>
                                                                <h3>
                                                                    {icon.name}
                                                                </h3>
                                                            </div>
                                                        ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="home_services">
                                    <h1>{homepageData.serviceHeading}</h1>
                                    <div className="home_services_box">
                                        {homepageData.serviceBoxes?.map(
                                            (service, index) =>
                                                service?.image?.url && (
                                                    <Link
                                                        href={
                                                            service.url ||
                                                            "/mainservice"
                                                        }
                                                        key={index}
                                                        className="home-service-link"
                                                    >
                                                        <div className="service-box-home">
                                                            <div className="service-image">
                                                                <Image
                                                                    src={
                                                                        service
                                                                            .image
                                                                            .url
                                                                    }
                                                                    alt={
                                                                        service.title ||
                                                                        "Service"
                                                                    }
                                                                    width={400}
                                                                    height={200}
                                                                    unoptimized
                                                                />
                                                            </div>
                                                            <h2>
                                                                {service.title}
                                                            </h2>
                                                        </div>
                                                    </Link>
                                                ),
                                        )}
                                    </div>
                                </div>

                                <div className="technology-we-use">
                                    <h1>
                                        {homepageData.technologyHeading ||
                                            "Technologies We Use"}
                                    </h1>
                                    <div className="technology-grid">
                                        {homepageData.technologyImages?.length >
                                            0 ? (
                                            homepageData.technologyImages.map(
                                                (tech, index) =>
                                                    tech?.image?.url ? (
                                                        <span key={index}>
                                                            <Image
                                                                src={
                                                                    tech.image
                                                                        .url
                                                                }
                                                                width={500}
                                                                height={500}
                                                                alt={
                                                                    tech.image
                                                                        .alt ||
                                                                    "Technology image"
                                                                }
                                                                unoptimized
                                                            />
                                                        </span>
                                                    ) : null,
                                            )
                                        ) : (
                                            <p>No image available</p>
                                        )}
                                    </div>
                                </div>

                                <section className="rto-section">
                                    <div className="background-process-img"></div>
                                    <h2 className="heading">
                                        {homepageData.workingProcessHeading}
                                    </h2>
                                    <p className="subheading">
                                        {homepageData.workingProcessSubHeading}
                                    </p>

                                    <div className="content">
                                        <div className="left">
                                            {homepageData.processSteps
                                                ?.filter(
                                                    (step) =>
                                                        step.title &&
                                                        step.description,
                                                )
                                                .map((step, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`card ${idx === activeIndex
                                                            ? "active"
                                                            : ""
                                                            }`}
                                                        onClick={() =>
                                                            handleImageChange(
                                                                idx,
                                                            )
                                                        }
                                                    >
                                                        <div className="number">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <h3 className="card-title">
                                                                {step.title}
                                                            </h3>
                                                            <p className="card-text-home">
                                                                {
                                                                    step.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                        <div className="right">
                                            {homepageData.processSteps?.[
                                                activeIndex
                                            ]?.image?.url && (
                                                    <Image
                                                        src={
                                                            homepageData
                                                                .processSteps[
                                                                activeIndex
                                                            ].image.url
                                                        }
                                                        alt={
                                                            homepageData
                                                                .processSteps[
                                                                activeIndex
                                                            ]?.title || "Step Image"
                                                        }
                                                        width={500}
                                                        height={500}
                                                        unoptimized
                                                    />
                                                )}
                                        </div>
                                    </div>
                                </section>

                                <div className="strip-text">
                                    <div className="marquee">
                                        {/* First set of items */}
                                        <div className="marquee-item">
                                            {homepageData.sliderTexts?.map(
                                                (text, idx) => (
                                                    <span key={idx}>
                                                        <h1>{text}</h1>
                                                    </span>
                                                ),
                                            )}
                                        </div>

                                        {/* Duplicate set for seamless loop */}
                                        <div className="marquee-item">
                                            {homepageData.sliderTexts?.map(
                                                (text, idx) => (
                                                    <span key={`dup-${idx}`}>
                                                        <h1>{text}</h1>
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="home-about">
                                    <div className="about-us">
                                        <h2>
                                            {homepageData.aboutLightHeading}
                                        </h2>
                                        <div className="about-us-top">
                                            <div className="about-us-top-left">
                                                <h1>
                                                    {
                                                        homepageData.aboutUsHeading
                                                    }
                                                </h1>
                                            </div>
                                            <div className="about-us-top-right">
                                                <h1>
                                                    {
                                                        homepageData.aboutRightHeading
                                                    }
                                                </h1>
                                                {/* aboutParagraph is now HTML string from CMS */}
                                                {homepageData.aboutParagraph && (
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: homepageData.aboutParagraph,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="who-we-are-btn">
                                            <Link href="/about">
                                                <button>
                                                    <span>
                                                        {
                                                            homepageData.aboutCtaButton
                                                        }
                                                    </span>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="about-us-video-image">
                                        <div className="about-us-img">
                                            {homepageData.aboutImages?.[0]
                                                ?.url && (
                                                    <Image
                                                        src={
                                                            homepageData
                                                                .aboutImages[0].url
                                                        }
                                                        width={500}
                                                        height={500}
                                                        alt={
                                                            homepageData
                                                                .aboutImages[0]
                                                                .alt ||
                                                            "People image one"
                                                        }
                                                        unoptimized
                                                    />
                                                )}

                                            {videos.peopleVideo && (
                                                <video
                                                    src={videos.peopleVideo}
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                    controls={false}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                    }}
                                                />
                                            )}

                                            {homepageData.aboutImages?.[1]
                                                ?.url && (
                                                    <Image
                                                        src={
                                                            homepageData
                                                                .aboutImages[1].url
                                                        }
                                                        width={500}
                                                        height={500}
                                                        alt={
                                                            homepageData
                                                                .aboutImages[1]
                                                                .alt ||
                                                            "People image two"
                                                        }
                                                        unoptimized
                                                    />
                                                )}
                                        </div>
                                        <div className="about-us-video-text">
                                            <h1>{homepageData.peopleText}</h1>
                                        </div>
                                    </div>
                                </div>

                                <div className="reviews-section">
                                    <div className="navigation-wrapper">
                                        <button
                                            className="prev-button"
                                            onClick={() =>
                                                instanceRef.current?.prev()
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-chevron-left"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                                                />
                                            </svg>
                                        </button>

                                        <div
                                            ref={sliderRef}
                                            className="keen-slider"
                                        >
                                            {homepageData.founderSlides?.map(
                                                (slide, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`keen-slider__slide number-slide${idx + 1
                                                            }`}
                                                    >
                                                        <section className="why-work-home">
                                                            <div className="content-two">
                                                                <div className="text">
                                                                    <h3>
                                                                        <b>
                                                                            {
                                                                                slide.name
                                                                            }
                                                                        </b>
                                                                    </h3>
                                                                    <h5 className="author-p" style={{ marginBottom: "5px" }}>
                                                                        {
                                                                            slide.achievements
                                                                        }
                                                                    </h5>

                                                                    {/* Render rich text content - now HTML string */}
                                                                    {slide.description && (
                                                                        <div
                                                                            className="founder-description"
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: slide.description,
                                                                            }}
                                                                        />
                                                                    )}

                                                                    {slide.descriptionTwo && (
                                                                        <div
                                                                            className="founder-description-two"
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: slide.descriptionTwo,
                                                                            }}
                                                                        />
                                                                    )}

                                                                    <br />

                                                                    <br />
                                                                    <h3>
                                                                        <b>
                                                                            {
                                                                                slide.partnerLabel
                                                                            }
                                                                        </b>
                                                                    </h3>
                                                                </div>

                                                                <div className="image-wrapper-home">
                                                                    <div className="background">
                                                                        {slide
                                                                            ?.image
                                                                            ?.url && (
                                                                                <Image
                                                                                    src={
                                                                                        slide
                                                                                            .image
                                                                                            .url
                                                                                    }
                                                                                    alt={
                                                                                        slide.title ||
                                                                                        "Slide Image"
                                                                                    }
                                                                                    width={
                                                                                        400
                                                                                    }
                                                                                    height={
                                                                                        300
                                                                                    }
                                                                                    priority={
                                                                                        idx ===
                                                                                        0
                                                                                    }
                                                                                />
                                                                            )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </section>
                                                    </div>
                                                ),
                                            )}
                                        </div>

                                        <button
                                            className="next-button"
                                            onClick={() =>
                                                instanceRef.current?.next()
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                className="bi bi-chevron-right"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <section className="contact-us">
                                    <div
                                        style={{
                                            maxWidth: "1200px",
                                            padding: "0 20px",
                                        }}
                                    >
                                        <div className="contact-container">
                                            <div className="contact-form-section">
                                                <ContactForm
                                                    title={
                                                        homepageData.contactTitle
                                                    }
                                                    buttonText={
                                                        homepageData.contactButton
                                                    }
                                                />
                                            </div>
                                            <div className="contact-info-section">
                                                {homepageData.contactImage
                                                    ?.url && (
                                                        <div className="map-container">
                                                            <img
                                                                src={
                                                                    homepageData
                                                                        .contactImage
                                                                        .url
                                                                }
                                                                alt={
                                                                    homepageData
                                                                        .contactImage
                                                                        .alt ||
                                                                    "contact"
                                                                }
                                                                className="map-image"
                                                            />
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                <Footer />
                            </div>

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

                            {showScrollUp && (
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
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Page-specific scripts from CMS - rendered safely via Next.js Script */}
            <PageScripts
                customHeadTags={homepageData?.customHeadTags}
                metaTags={homepageData?.metaTags}
                pageId="homepage"
            />
        </>
    );
}
