"use client";
import Image from "next/image";
import styles from "./page.css";
import Header from "./Components/Header/page";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { gsap, CSSPlugin, Expo } from "gsap";
import SplitType from "split-type";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "swiper/css";
import "swiper/css/pagination";
import Footer from "./Components/Footer/page";
import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import urlFor from "./helpers/sanity";
import { getFileAsset } from "@sanity/asset-utils";

gsap.registerPlugin(CSSPlugin, ScrollTrigger);

const images = ["/process-img.jpg", "/process-img2.jpg", "/process-img3.jpg"];

export default function Home() {
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
  const [filteredServices, setFilteredServices] = useState([]);
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
  const [showIntro, setShowIntro] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Add this state to track if we should show animation
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const updateMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };
    updateMode();
    const observer = new MutationObserver(updateMode);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider(
    {
      loop: true,
    },
    [
      (slider) => {
        instanceRef.current = slider;
        let timeout;
        let mouseOver = false;

        const nextTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => slider.next(), 4000);
        };

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true;
            clearTimeout(timeout);
          });
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });

        slider.on("dragStarted", () => clearTimeout(timeout));
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  // Fetching CMS
  useEffect(() => {
    const fetchData = async () => {
      try {
        const homepageData = await client.fetch('*[_type == "homepage"]');
        const resolveVideo = (ref) =>
          ref
            ? getFileAsset(
                { _ref: ref },
                { projectId: "5ippxm43", dataset: "production" }
              ).url
            : null;

        setVideos({
          peopleVideo: resolveVideo(
            homepageData?.[0]?.peopleVideo?.asset?._ref
          ),
          serviceVideo: resolveVideo(
            homepageData?.[0]?.serviceCirclVideo?.asset?._ref
          ),
        });

        console.log(homepageData);

        setHomepageData(homepageData);
        setSlides(homepageData?.[0]?.slides || []);
        setSlidesDarkMode(homepageData?.[0]?.slidesDarkMode || []);
      } catch (error) {
        console.error("Error fetching data from Sanity:", error);
      }
    };

    fetchData();
  }, []);

  // Fixed localStorage check and intro logic
  useEffect(() => {
    // Check if we're on the client side
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
    if (!homepageData || !homepageData[0]) return;

    // If we shouldn't animate, just set loading to false
    if (!shouldAnimate) {
      setLoading(false);
      return;
    }

    // Start the counter animation
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(interval);
          // Start GSAP animation when counter reaches 100
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
    // Wait for DOM elements to be ready
    const checkAndAnimate = () => {
      const logo = document.querySelector(".logo");
      const followTop = document.querySelector(".follow-top");
      const followBottom = document.querySelector(".follow-bottom");

      if (!logo || !followTop || !followBottom) {
        // If elements aren't ready, try again in next frame
        requestAnimationFrame(checkAndAnimate);
        return;
      }

      // Create GSAP timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setLoading(false);
          console.log("Animation completed"); // Debug log
        },
      });

      // Animation sequence
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
          "-=0.4"
        )
        .fromTo(
          ".logo",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, ease: "expo.inOut", duration: 0.4 }
        )
        .set(".main-content", {
          opacity: 1,
        });
    };

    checkAndAnimate();
  };

  useEffect(() => {
    if (!homepageData || homepageData.length === 0) return;

    const pageData = homepageData?.[0];
    document.title = pageData?.seoTitle || "ADPL Consulting";

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        pageData?.seoDescription || "Learn about our mission and team"
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Learn about our mission and team";
      document.head.appendChild(meta);
    }
  }, [homepageData]);

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
  }, [[icons.length]]);

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

  const upwardHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
  };

  const handleMouseEnter = () => setShowCustomCursor(true);
  const handleMouseLeave = () => setShowCustomCursor(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.firstName.value.trim();
    const phone = form.phone.value.trim();

    let formErrors = {};

    if (!name) formErrors.firstName = "Name is required.";
    if (!phone) formErrors.phone = "Phone number is required.";

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      // proceed with form submission
      console.log("Form submitted");
    }
  };

  return (
    <>
      {!homepageData || !homepageData[0] ? (
        <div>Loading homepage content...</div>
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
                  className="logo" // ✅ required for animation target
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
                        className="bi bi-chevron-left"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                        />
                      </svg>
                    </button>

                    <div ref={sliderRef} className="keen-slider">
                      {homepageData?.[0]?.founderSlider?.map((slide, idx) => (
                        <div
                          key={slide._key || idx}
                          className={`keen-slider__slide number-slide${idx + 1}`}
                        >
                          <section className="why-work-home">
                            <div className="content-two">
                              <div className="text">
                                <h3>{slide.founderTitle}</h3>

                                {/* Render rich text content properly */}
                                {slide.founderDescription && (
                                  <div className="founder-description">
                                    <PortableText
                                      value={slide.founderDescription}
                                    />
                                  </div>
                                )}

                                {slide.founderDescriptionTwo && (
                                  <div className="founder-description-two">
                                    <PortableText
                                      value={slide.founderDescriptionTwo}
                                    />
                                  </div>
                                )}

                                <br />

                                <h5>
                                  <b>{slide.founderName}</b>
                                </h5>
                                <p className="author-p">
                                  {slide.founderAchievements}
                                </p>
                                <br />
                                <h5>
                                  <b>{slide.partnerLabel}</b>
                                </h5>
                                <p className="author-p">{slide.partner}</p>
                              </div>

                              <div className="image-wrapper-home">
                                <div className="background">
                                  {slide?.image?.asset && (
                                    <Image
                                      src={urlFor(slide.image).url()}
                                      alt={slide.founderTitle || "Slide Image"}
                                      width={400}
                                      height={300}
                                      priority={idx === 0}
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

                        <form
                          id="contactform"
                          className="contact-form"
                          onSubmit={handleSubmit}
                        >
                          <div className="form-fields">
                            <label htmlFor="fname">Name</label>
                            <input
                              type="text"
                              name="firstName"
                              id="fname"
                              placeholder="Your name"
                            />
                            {errors.firstName && (
                              <span className="error">{errors.firstName}</span>
                            )}
                          </div>

                          <div className="form-fields">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
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
                            {errors.phone && (
                              <span className="error">{errors.phone}</span>
                            )}
                          </div>

                          <div className="form-fields">
                            <label htmlFor="service">Services</label>
                            <select name="service" id="service" defaultValue="">
                              <option value="" disabled>
                                Select Service
                              </option>
                              <option>Drafting to CAD (PDF to CAD)</option>
                              <option>Permit Drawing and Documentation</option>
                              <option>Working Drawing and Detailing</option>
                              <option>
                                3D Modelling, Rendering and Walkthrough
                              </option>
                              <option>360 Degree Views</option>
                              <option>BIM Services</option>
                              <option>Bill of Quantities (BOQ)</option>
                              <option>MEP Drafting</option>
                            </select>
                          </div>

                          <div className="form-fields message">
                            <label htmlFor="message">Message</label>
                            <textarea
                              name="message"
                              id="message"
                              placeholder="Send Your Message"
                            ></textarea>
                          </div>
                        </form>
                        <div className="contact-btn">
                          <span>
                            <button type="submit" form="contactform">
                              {homepageData[0]?.contactUsButton}
                            </button>
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
                <button onClick={() => setShowForm(true)}>Enquire Now</button>
              </div>
              {showForm && (
                <div
                  className="enquiry-overlay"
                  onClick={() => setShowForm(false)}
                >
                  <div
                    className="enquiry-container"
                    onClick={(e) => e.stopPropagation()} // Prevent close on form click
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
                        If you have any queries, we will be pleased to assist
                        you.
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
      )}
    </>
  );
}
