"use client";
import Image from "next/image";
import styles from "./page.css";
import Header from "./Components/Header/page";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { gsap, CSSPlugin, Expo } from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";
import "swiper/css/pagination";
import { FaTrophy, FaUsers, FaStar, FaChartLine } from "react-icons/fa";
import Footer from "./Components/Footer/page";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import urlFor from "./helpers/sanity";
import { getFileAsset } from "@sanity/asset-utils";
import { Fragment } from "react";

gsap.registerPlugin(CSSPlugin);

const images = ["/process-img.jpg", "/process-img2.jpg", "/process-img3.jpg"];

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  // const [currentSlideHeroBanner, setCurrentSlideHeroBanner] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isLeftHalf, setIsLeftHalf] = useState(true);
  const [showCustomCursor, setShowCustomCursor] = useState(false);
  const [cursorPosSecond, setCursorPosSecond] = useState({ x: 0, y: 0 });
  const [renderCursorPos, setRenderCursorPos] = useState({ x: 0, y: 0 });
  const [slides, setSlides] = useState([]);
  const [slidesDarkMode, setSlidesDarkMode] = useState([]);
  const [currentSlideHeroBanner, setCurrentSlideHeroBanner] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageSrc, setImageSrc] = useState(images[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [homepageData, setHomepageData] = useState(null);
  const [index, setIndex] = useState(0);
  const [logo, setLogo] = useState("/red-logo.png");
  const textRef = useRef(null);
  const textRefs = useRef([]);
  const [open, setOpen] = useState(null);
  const [testSliderContent, setTextSliderContent] = useState(false);
  const [videos, setVideos] = useState({
    peopleVideo: null,
    serviceVideo: null,
  });
  const [bgImage, setBgImage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const updateMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };

    updateMode(); // Initial check

    const observer = new MutationObserver(() => {
      updateMode(); // Update on any body class change
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect(); // Cleanup
  }, []);

  // Keen Slider
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
        instanceRef.current = slider;
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 4000);
        }
        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  // Reveal Animation Intro
  const revealAnimation = () => {
    const t1 = gsap.timeline({
      onComplete: () => setLoading(false),
    });

    t1.to(".count", { opacity: 0, duration: 0.1 })
      .to(".progress-bar-two", { opacity: 0, duration: 0.1 })

      // Split open the top and bottom covers
      .to(".follow-top", { height: "50vh", ease: "expo.inOut", duration: 0.4 })
      .to(
        ".follow-bottom",
        { height: "50vh", ease: "expo.inOut", duration: 0.4 },
        "-=0.4"
      )

      // Show the logo (keep it visible)
      .fromTo(
        ".logo",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, ease: "expo.inOut", duration: 0.4 }
      )

      // Ensure main content appears after logo
      .set(".main-content", { opacity: 1 });

    // ✅ Removed:
    // - Logo fade out
    // - follow-top/follow-bottom shrink
    // - loader-container fade out & removal
  };

  // Home Sanity Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const homepageData = await client.fetch('*[_type == "homepage"]');

        const resolveVideo = (ref) => {
          if (!ref) return null;
          return getFileAsset(
            { _ref: ref },
            {
              projectId: "5ippxm43",
              dataset: "production",
            }
          ).url;
        };
        setVideos({
          peopleVideo: resolveVideo(homepageData[0]?.peopleVideo?.asset?._ref),
          serviceVideo: resolveVideo(
            homepageData[0]?.serviceCirclVideo?.asset?._ref
          ),
        });

        console.log(homepageData);

        // Set the fetched data into the state
        setHomepageData(homepageData);
        // ✅ Set CMS-based slides here

        setSlides(homepageData?.[0]?.slides || []);
        setSlidesDarkMode(homepageData?.[0]?.slidesDarkMode || []);
      } catch (error) {
        console.error("Error fetching data from Sanity:", error);
      }
    };

    fetchData();
  }, []);

  // MetaData
  useEffect(() => {
    if (!homepageData || homepageData.length === 0) return;

    const pageData = homepageData[0]; // Extract the object from the array

    document.title = pageData.seoTitle;

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", pageData.seoDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Learn about our mission and team";
      document.head.appendChild(meta);
    }
  }, [homepageData]);

  // Process Steps Image
  useEffect(() => {
    // Only run this effect on screens <= 768px
    if (window.innerWidth >= 768) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % images.length;
          setImageSrc(images[newIndex]);
          setActiveIndex(newIndex); // ✅ update active card too
          return newIndex;
        });
      }, 4000);

      return () => clearInterval(interval);
    }
  }, []); // Empty dependency so it only runs on mount

  const handleImageChange = (newIndex) => {
    setImageSrc(images[newIndex]);
    setActiveIndex(newIndex);
    setIndex(newIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => (prev < 100 ? prev + 5 : 100));
    }, 14);

    if (counter === 100) {
      clearInterval(interval);
      revealAnimation();
    }

    return () => clearInterval(interval);
  }, [counter]);

  const toggle = (index) => {
    setOpen(open === index ? null : index);
  };

  const icons = [
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
    "/HUSLOGO_WHITE.AVIF",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % icons.length); // Loop back to the first icon when it reaches the last
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [icons.length]);

  useEffect(() => {
    textRefs.current.forEach((el, index) => {
      if (el) {
        const splitText = new SplitType(el, { type: "chars" });

        gsap.from(splitText.chars, {
          opacity: 0,
          yPercent: 100,
          duration: 0.2,
          ease: "power2.out",
          stagger: 0.05, // Adds a delay between each character
          scrollTrigger: {
            trigger: el,
            start: "top 80%", // Adjust for when it should start
            toggleActions: "play none none none",
          },
        });
      }
    });
  }, []);

  useEffect(() => {
    gsap.to(textRef.current, {
      rotation: 360,
      transformOrigin: "center",
      repeat: -1,
      duration: 8,
      ease: "linear",
    });
  }, []);

  const upwardHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /// For HeroBanner Slider Buttons
  const prevSlide = () => {
    setCurrentSlideHeroBanner(
      (prev) => (prev - 1 + slides.length) % slides.length
    );
  };

  const nextSlide = () => {
    setCurrentSlideHeroBanner((prev) => (prev + 1) % slides.length);
  };

  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const leftHalf = x < bounds.width / 2;

    setCursorPos({ x, y });
    setIsLeftHalf(leftHalf);

    console.log({ x, y }, "isLeftHalf:", leftHalf);
  };

  const handleMouseEnter = () => setShowCustomCursor(true);
  const handleMouseLeave = () => setShowCustomCursor(false);

  const handleClick = () => {
    if (isLeftHalf) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  useEffect(() => {
    let animationFrame;

    const lerp = (a, b, n) => a + (b - a) * n;

    const animate = () => {
      setRenderCursorPos((prev) => ({
        x: lerp(prev.x, cursorPos.x, 0.1), // adjust 0.1 for speed (lower = smoother/slower)
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

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="main-content">
        {loading ? (
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
                src="/white-logo.png"
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
                  backgroundImage: bgImage ? `url(${bgImage})` : "none",
                }}
              >
                <div className="overlay"></div>
              </div>
              {!isDarkMode && (
                <div
                  className={"animation-slider light-banner"}
                  {...(isDesktop && {
                    onMouseMove: handleMouseMove,
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onClick: () => {
                      isLeftHalf ? prevSlide() : nextSlide();
                    },
                  })}
                >
                  <div
                    className="animation-slider-df"
                    style={{
                      transform: `translateX(-${currentSlideHeroBanner * 100}%)`,
                    }}
                  >
                    {slides.map(
                      (slide, index) =>
                        slide?.image?.asset && (
                          <div
                            key={index}
                            className="animate-back-img"
                            style={{
                              backgroundImage: `url(${urlFor(slide.image.asset).url()})`,
                              backgroundSize: "contain",
                            }}
                            aria-label={slide.image?.alt || "Slide Image"}
                          ></div>
                        )
                    )}
                  </div>

                  {/* Custom Cursor Only on Desktop */}
                  {isDesktop && showCustomCursor && (
                    <div
                      className={`custom-cursor ${isLeftHalf ? "left-btn" : "right-btn"}`}
                      style={{
                        left: `${renderCursorPos.x}px`,
                        top: `${renderCursorPos.y}px`,
                        transform: "translate(-50%, -50%)",
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
                        className={`dot ${index === currentSlideHeroBanner ? "active" : ""}`}
                        onClick={() => setCurrentSlideHeroBanner(index)}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
              {isDarkMode && (
                <div
                  className={"animation-slider dark-banner"}
                  {...(isDesktop && {
                    onMouseMove: handleMouseMove,
                    onMouseEnter: handleMouseEnter,
                    onMouseLeave: handleMouseLeave,
                    onClick: () => {
                      isLeftHalf ? prevSlide() : nextSlide();
                    },
                  })}
                >
                  <div
                    className="animation-slider-df"
                    style={{
                      transform: `translateX(-${currentSlideHeroBanner * 100}%)`,
                    }}
                  >
                    {slidesDarkMode.map(
                      (slide, index) =>
                        slide?.image?.asset && (
                          <div
                            key={index}
                            className="animate-back-img"
                            style={{
                              backgroundImage: `url(${urlFor(slide.image.asset).url()})`,
                              backgroundSize: "contain",
                            }}
                            aria-label={slide.image?.alt || "Slide Image"}
                          ></div>
                        )
                    )}
                  </div>

                  {isDesktop && showCustomCursor && (
                    <div
                      className={`custom-cursor ${isLeftHalf ? "left-btn" : "right-btn"}`}
                      style={{
                        left: `${renderCursorPos.x}px`,
                        top: `${renderCursorPos.y}px`,
                        transform: "translate(-50%, -50%)",
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

                  <div className="slider-dots">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentSlideHeroBanner ? "active" : ""}`}
                        onClick={() => setCurrentSlideHeroBanner(index)}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
              <div className="feature-section">
                <div className="feature-section-df">
                  <div className="feature-box">
                    <h1>{homepageData[0].trustIconsHeading}</h1>
                    <div className="features-name">
                      {homepageData[0]?.serviceRelatedIcon?.map(
                        (related, index) =>
                          related?.serviceRelatedImg?.asset && (
                            <div key={index} className="service-related-item">
                              <Image
                                src={urlFor(related.serviceRelatedImg).url()}
                                alt={
                                  related.serviceRelatedName || "Service Icon"
                                }
                                width={70}
                                height={70}
                                unoptimized
                                priority
                              />
                              <p>{related.serviceRelatedNumber}</p>
                              <h3>{related.serviceRelatedName}</h3>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>
                <div className="achievements-container">
                  <div className="achievements-grid">
                    {homepageData[0]?.achievements?.map((item, index) => (
                      <div className="achievement-card" key={index}>
                        <div className="achievement-content">
                          <div className="achievement-text-home">
                            <span>
                              <h3>{item.title}</h3>
                            </span>
                            <span className="achievement-numbers">
                              <p>{item.number}</p>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="home_services">
                <h1>{homepageData[0].serviceHeading}</h1>
                <div className="home_services_box">
                  {homepageData[0].serviceBox?.map(
                    (service, index) =>
                      service?.serviceBoxImg?.asset && (
                        <Link href={service.boxUrl} key={index}>
                          <div className="service-box-home">
                            <div className="service-image">
                              <Image
                                src={urlFor(service.serviceBoxImg).url()}
                                alt={service.serviceBoxTitle}
                                width={400}
                                height={200}
                                unoptimized
                              />
                            </div>
                            <h2>{service.serviceBoxTitle}</h2>
                          </div>
                        </Link>
                      )
                  )}
                </div>

                <Link className="service-cta-wrap" href={"/mainservice"}>
                  <button className="service-cta">
                    {homepageData[0].home_services_cta}
                  </button>
                </Link>
              </div>
              <div className="technology-we-use">
                <h1>Technologies We Use</h1>
                <div className="technology-grid">
                  {homepageData[0]?.technologyImgs?.length > 0 ? (
                    homepageData[0].technologyImgs.map((img, index) =>
                      img?.technologyImage?.asset ? (
                        <span key={index}>
                          <Image
                            src={urlFor(img.technologyImage).url()}
                            width={500}
                            height={500}
                            alt="Technology image"
                            unoptimized
                          />
                        </span>
                      ) : null
                    )
                  ) : (
                    <p>No images available</p>
                  )}
                </div>
              </div>
              <section className="rto-section">
                <div className="background-process-img"></div>
                <h2 className="heading">
                  {homepageData[0].workingProcessHeading}
                </h2>
                <p className="subheading">
                  {homepageData[0].workingProcessSubHeading}
                </p>

                <div className="content">
                  <div className="left">
                    {homepageData[0]?.processSteps
                      ?.filter((step) => step.stepTitle && step.stepText)
                      .map((step, idx) => (
                        <div
                          key={idx}
                          className={`card ${idx === activeIndex ? "active" : ""}`}
                          onClick={() => handleImageChange(idx)}
                        >
                          <div className="number">{idx + 1}</div>
                          <div>
                            <h3 className="card-title">{step.stepTitle}</h3>
                            <p className="card-text-home">{step.stepText}</p>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className="right">
                    {homepageData[0]?.processSteps?.[activeIndex]?.stepImage
                      ?.asset && (
                      <Image
                        src={urlFor(
                          homepageData[0].processSteps[activeIndex].stepImage
                        ).url()}
                        alt={
                          homepageData[0].processSteps[activeIndex]
                            ?.stepTitle || "Step Image"
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
                    <h1>{homepageData[0]?.sliderTextOne}</h1>
                    {homepageData[0]?.sliderImage && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                    <h1>{homepageData[0]?.sliderTextTwo}</h1>
                    {homepageData[0]?.sliderImage && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                    <h1>{homepageData[0]?.sliderTextThree}</h1>
                    {homepageData[0]?.sliderImage && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                    <h1>{homepageData[0]?.sliderTextFour}</h1>
                    {homepageData[0]?.sliderImage && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                    <h1>{homepageData[0]?.sliderTextFive}</h1>
                    {homepageData[0]?.sliderImage && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                  </div>

                  {/* Duplicate set for seamless loop */}
                  <div className="marquee-item">
                    <h1>{homepageData[0]?.sliderTextOne}</h1>
                    {homepageData[0]?.sliderImage?.asset && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                    <h1>{homepageData[0]?.sliderTextTwo}</h1>
                    {homepageData[0]?.sliderImage?.asset && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                    <h1>{homepageData[0]?.sliderTextThree}</h1>
                    {homepageData[0]?.sliderImage?.asset && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                    <h1>{homepageData[0]?.sliderTextFour}</h1>
                    {homepageData[0]?.sliderImage?.asset && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                    <h1>{homepageData[0]?.sliderTextFive}</h1>
                    {homepageData[0]?.sliderImage?.asset && (
                      <Image
                        src={urlFor(homepageData[0].sliderImage).url()}
                        alt="Slider Icon"
                        width="30"
                        height="30"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="home-about">
                <div className="about-us">
                  <h2>{homepageData[0].allowLightHeading}</h2>
                  <div className="about-us-top">
                    <div className="about-us-top-left">
                      <h1>{homepageData[0].allowUsHeading}</h1>
                    </div>
                    <div className="about-us-top-right">
                      <h1>{homepageData[0].allowRightHeading}</h1>

                      <PortableText value={homepageData[0].paragraph} />
                    </div>
                  </div>
                  <div className="who-we-are-btn">
                    <Link href="/about">
                      <button>
                        <span>{homepageData[0].ctaButton}</span>
                      </button>
                    </Link>
                  </div>
                </div>

                <div className="about-us-video-image">
                  <div className="about-us-img">
                    {homepageData[0]?.peoplImageOne?.asset && (
                      <Image
                        src={urlFor(homepageData[0].peoplImageOne).url()}
                        width={500}
                        height={500}
                        alt="People image one"
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
                        style={{ width: "100%", height: "auto" }}
                      />
                    )}

                    {homepageData?.[0]?.peoplImageTwo?.asset && (
                      <Image
                        src={urlFor(homepageData[0].peoplImageTwo).url()}
                        width={500}
                        height={500}
                        alt="People image"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="about-us-video-text">
                    <h1>{homepageData[0].peopleText}</h1>
                  </div>
                </div>
              </div>
              <div className="reviews-section">
                <div className="navigation-wrapper">
                  <button
                    className="prev-button"
                    onClick={() => instanceRef.current?.prev()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-left"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                      />
                    </svg>
                  </button>

                  <div ref={sliderRef} className="keen-slider">
                    {homepageData[0]?.whyWorkWithUs?.map((slide, idx) => (
                      <div
                        key={idx}
                        className={`keen-slider__slide number-slide${idx + 1}`}
                      >
                        <section className="why-work">
                          <div className="content-two">
                            <div className="text">
                              <h3>{slide.title}</h3>
                              {/* {slide.features?.map((feature, fidx) => (
                                <div key={fidx} className="feature">
                                  <div className="icon">{feature.icon}</div>
                                  <div className="info">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                  </div>
                                </div>
                              ))} */}
                              <p>
                                Ar. Abhishek Aggarwal, an award-winning
                                architect from New Delhi, is the founder of ADPL
                                Consulting LLC. With over 29 years of
                                experience, including nine years in the US, he
                                blends global insights with local understanding.
                                He created ADPL as a collaborative space for
                                creative architectural talent to thrive.
                              </p>
                              <br />
                              <p>
                                His expertise covers Architecture, Interior
                                Design, and Consulting Engineering. Inspired by
                                his travels, Abhishek designs spaces that are
                                original, functional, and contextually relevant.
                                Known for his passion and forward-thinking
                                approach, he creates timeless, meaningful
                                designs
                              </p>
                              <br />
                              <h5>
                                <b>Abhishek Aggarwal</b>
                              </h5>
                              <p className="author-p">
                                B.Arch, M.Arch, MCA, AlIA, MCRP, FIIV
                              </p>
                              <br />
                              <h5>
                                <b>Partner</b>
                              </h5>
                              <p className="author-p">
                                ADPL Consulting LLC, USA
                              </p>
                            </div>

                            <div className="image-wrapper">
                              <div className="background">
                                {slide?.image?.asset && (
                                  <Image
                                    src={urlFor(slide.image).url()}
                                    alt="Why Work Image"
                                    width={500}
                                    height={400}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    ))}
                  </div>

                  <button
                    className="next-button"
                    onClick={() => instanceRef.current?.next()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-arrow-right"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <section className="contact-us">
                <div className="contact-container-two">
                  <div className="contact-us-df">
                    <div className="contact-left">
                      {homepageData[0]?.contactUsSectionImg?.asset && (
                        <Image
                          src={urlFor(
                            homepageData[0].contactUsSectionImg
                          ).url()}
                          width={500}
                          height={500}
                          alt="footer-img"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="contact-right">
                      <h1>{homepageData[0]?.contactUsTitle}</h1>

                      <div className="contact-form">
                        <div className="form-fields">
                          <label htmlFor="fname">Name</label>
                          <input
                            type="text"
                            name="firstName"
                            id="fname"
                            placeholder="Your name"
                          />
                        </div>
                        <div className="form-fields">
                          <label htmlFor="email">Email</label>
                          <input
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Your Email"
                          />
                        </div>
                        <div className="form-fields">
                          <label htmlFor="phone">Phone no</label>
                          <input
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="Your Phone Number"
                          />
                        </div>
                        <div className="form-fields">
                          <label htmlFor="service">Services</label>
                          <input
                            type="text"
                            name="service"
                            id="service"
                            placeholder="Select Service"
                          />
                        </div>
                      </div>
                      <div className="contact-btn">
                        <span>
                          <button>{homepageData[0]?.contactUsButton}</button>
                        </span>
                      </div>
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

            <div className="enquire">
              <button>Enquire Now</button>
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
          </div>
        )}
      </div>
    </>
  );
}
