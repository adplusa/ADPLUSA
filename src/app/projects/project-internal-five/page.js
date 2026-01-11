"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import "./internal-five.css";
import urlFor from "@/app/helpers/sanity";
import Link from "next/link";

const InternalFive = () => {
  const [data, setData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // ✅ Carousel states
  const [filteredServices, setFilteredServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched = await client.fetch(
          `*[_type == "projectInternalPageFive"]`
        );
        setData(fetched);

        const homepage = await client.fetch(`*[_type == "projectPage"][0]`);
        const currentPath = window.location.pathname;
        const others = homepage.projects?.filter(
          (service) => service.link !== currentPath
        );
        setFilteredServices(others || []);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;
    const pageData = data[0];
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
  }, [data]);

  const upwardHandler = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Carousel logic
  const totalSlides = filteredServices.length || 1;
  const slidesToShow =
    filteredServices.length > 0
      ? [...filteredServices, ...filteredServices]
      : [];

  const nextSlide = useCallback(() => {
    if (!isTransitioning && !isDragging) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isTransitioning, isDragging]);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(nextSlide, 3000);
  }, [nextSlide]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (filteredServices.length > 0 && !isDragging) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [filteredServices, startAutoPlay, stopAutoPlay, isDragging]);

  useEffect(() => {
    if (currentIndex >= totalSlides && totalSlides > 0) {
      setIsTransitioning(true);
      stopAutoPlay();

      const timer = setTimeout(() => {
        if (slideRef.current) {
          slideRef.current.style.transition = "none";
          setCurrentIndex(0);

          requestAnimationFrame(() => {
            if (slideRef.current) {
              slideRef.current.style.transition = "transform 0.5s ease-in-out";
              setIsTransitioning(false);
              if (!isDragging) startAutoPlay();
            }
          });
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        setIsTransitioning(false);
      };
    }
  }, [currentIndex, totalSlides, stopAutoPlay, startAutoPlay, isDragging]);

  const getPositionX = (e) =>
    e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;

  const handleDragStart = (e) => {
    if (e.type === "mousedown") e.preventDefault();
    setIsDragging(true);
    stopAutoPlay();
    const x = getPositionX(e);
    setStartX(x);
    if (slideRef.current) {
      slideRef.current.style.transition = "none";
      slideRef.current.style.cursor = "grabbing";
    }
  };

  const handleDragMove = useCallback(
    (e) => {
      if (!isDragging || !slideRef.current) return;
      e.preventDefault();
      const x = getPositionX(e);
      const diff = x - startX;
      const slideWidth = isMobile ? 100 : 25;
      const currentTransform = -currentIndex * slideWidth;
      const dragOffset = (diff / slideRef.current.offsetWidth) * slideWidth;
      slideRef.current.style.transform = `translateX(${
        currentTransform + dragOffset
      }%)`;
    },
    [isDragging, startX, currentIndex, isMobile]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !slideRef.current) return;
    setIsDragging(false);

    const slideWidth = slideRef.current.offsetWidth;
    const transform = slideRef.current.style.transform;
    const currentTransform = transform.match(/-?\d+\.?\d*/);
    const currentPos = currentTransform ? parseFloat(currentTransform[0]) : 0;

    const expectedPos = -currentIndex * (isMobile ? 100 : 25);
    const dragDistance = currentPos - expectedPos;

    let newIndex = currentIndex;
    if (Math.abs(dragDistance) > (isMobile ? 20 : 5)) {
      if (dragDistance > 0 && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (dragDistance < 0 && currentIndex < totalSlides - 1) {
        newIndex = currentIndex + 1;
      }
    }

    slideRef.current.style.transition = "transform 0.3s ease-out";
    slideRef.current.style.cursor = "grab";

    setCurrentIndex(newIndex);

    setTimeout(() => {
      if (!isTransitioning) startAutoPlay();
    }, 300);
  }, [
    isDragging,
    currentIndex,
    totalSlides,
    isMobile,
    isTransitioning,
    startAutoPlay,
  ]);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleDragMove(e);
      const handleMouseUp = () => handleDragEnd();
      const handleTouchMove = (e) => handleDragMove(e);
      const handleTouchEnd = () => handleDragEnd();

      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  useEffect(() => {
    const preventContextMenu = (e) => {
      if (isDragging) e.preventDefault();
    };
    document.addEventListener("contextmenu", preventContextMenu);
    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);
  }, [isDragging]);

  const pauseAutoPlay = () => stopAutoPlay();
  const resumeAutoPlay = () => {
    if (!isTransitioning && !isDragging) startAutoPlay();
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="internal-container">
      <Header />
      <div className="internal-section-one">
        <div className="internal-section-one-top">
          <h1>{data?.[0]?.title}</h1>

          {(data?.[0]?.mainImage?.asset ||
            data?.[0]?.mainImageDarkMode?.asset) && (
            <Image
              src={
                isDarkMode && data[0]?.mainImageDarkMode?.asset
                  ? urlFor(data[0].mainImageDarkMode).url()
                  : urlFor(data[0].mainImage).url()
              }
              alt="Internal-img"
              width={1200}
              height={600}
              unoptimized
              priority
            />
          )}
        </div>

        <div className="internal-section-one-bottom">
          <div className="internal-section-one-bottom-left">
            <p>{data?.[0]?.introText}</p>

            {data?.[0]?.moreContent?.map((paragraph, idx) => (
              <p
                key={idx}
                className={`load-content ${isExpanded ? "visible" : "hidden"}`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="internal-section-one-bottom-right">
            {data?.[0]?.projectDetails?.map((detail, idx) => (
              <div
                key={idx}
                className={`load-content-li ${idx < 4 ? "visible" : isExpanded ? "visible" : ""}`}
              >
                <p>{detail?.label}</p>
                <ul>
                  {detail?.items?.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      {item?.startsWith?.("http") ? (
                        <a
                          href={item}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item}
                        </a>
                      ) : (
                        item
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="internal-section-one-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <button>
            {isExpanded ? "Less Information" : "More Information"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className={`bi ${isExpanded ? "bi-x-lg" : "bi-plus"}`}
              viewBox="0 0 16 16"
            >
              {isExpanded ? (
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              ) : (
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              )}
            </svg>
          </button>
        </div>
        <hr id="internal-line" />
      </div>

      {/* Section Two */}
      <div className="internal-section-two">
        <div className="internal-section-two-top-imgs">
          {data?.[0]?.projectImages?.topImages?.map((img, idx) => {
            const darkImg = data?.[0]?.projectImages?.topImagesDarkMode?.[idx];
            if (!img?.asset) return null;

            return (
              <Image
                key={idx}
                src={
                  isDarkMode && darkImg?.asset
                    ? urlFor(darkImg).url()
                    : urlFor(img).url()
                }
                alt={`Top image ${idx + 1}`}
                width={600}
                height={400}
                unoptimized
              />
            );
          })}
        </div>

        <div className="internal-section-two-bottom">
          {(isDarkMode
            ? data?.[0]?.projectImages?.bottomImageDarkMode?.asset
            : data?.[0]?.projectImages?.bottomImage?.asset) && (
            <Image
              src={
                isDarkMode && data[0]?.projectImages?.bottomImageDarkMode?.asset
                  ? urlFor(data[0].projectImages.bottomImageDarkMode).url()
                  : urlFor(data[0].projectImages.bottomImage).url()
              }
              alt="Bottom Image"
              width={1200}
              height={600}
              unoptimized
            />
          )}
        </div>
      </div>

      {/* Section Three */}
      <div className="internal-section-two">
        <div className="internal-section-two-top-imgs">
          {/* Top images with dark mode toggle */}
          {data?.[0]?.projectImagesTwo?.topImagesTwo?.map((img, idx) => {
            const darkImg =
              data?.[0]?.projectImagesTwo?.topImagesTwoDarkMode?.[idx];
            if (!img?.asset) return null;

            return (
              <Image
                key={idx}
                src={
                  isDarkMode && darkImg?.asset
                    ? urlFor(darkImg).url()
                    : urlFor(img).url()
                }
                alt={`Top image ${idx + 1}`}
                width={600}
                height={400}
                unoptimized
              />
            );
          })}
        </div>

        <div className="internal-section-two-bottom">
          {/* Bottom image with dark mode toggle */}
          {(isDarkMode
            ? data?.[0]?.projectImagesTwo?.bottomImageTwoDarkMode?.asset
            : data?.[0]?.projectImagesTwo?.bottomImageTwo?.asset) && (
            <Image
              src={
                isDarkMode &&
                data[0]?.projectImagesTwo?.bottomImageTwoDarkMode?.asset
                  ? urlFor(
                      data[0].projectImagesTwo.bottomImageTwoDarkMode
                    ).url()
                  : urlFor(data[0].projectImagesTwo.bottomImageTwo).url()
              }
              alt="Bottom Image"
              width={1200}
              height={600}
              unoptimized
            />
          )}
        </div>
      </div>

      <div className="professionals-section-internals">
        <h1 className="professionals-heading-internals">
          Explore More Projects
        </h1>
        <div
          className="carousel-container-internals"
          onMouseEnter={pauseAutoPlay}
          onMouseLeave={resumeAutoPlay}
        >
          <div
            className="carousel-slides-internals"
            ref={slideRef}
            style={{
              transform: `translateX(-${currentIndex * (isMobile ? 100 : 25)}%)`,
              transition: isDragging ? "none" : "transform 0.5s ease-in-out",
              cursor: isDragging ? "grabbing" : "grab",
              userSelect: "none",
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            {slidesToShow.map((service, i) =>
              service?.link ? (
                <Link key={i} href={service.link} id="redirection-service">
                  <div className="carousel-slide-internals">
                    <div
                      className="professional-card-internals"
                      id="project-caraousel"
                    >
                      <div className="image-container-internals">
                        {service?.image?.asset ? (
                          <Image
                            src={urlFor(service.image).url()}
                            alt={service.title}
                            width={300}
                            height={200}
                            unoptimized
                            draggable={false}
                            style={{
                              pointerEvents: isDragging ? "none" : "auto",
                              userSelect: "none",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 300,
                              height: 200,
                              background: "#eee",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              userSelect: "none",
                            }}
                          >
                            <p>No Image</p>
                          </div>
                        )}
                      </div>
                      <h3 style={{ userSelect: "none" }}>{service.title}</h3>
                    </div>
                  </div>
                </Link>
              ) : null
            )}
          </div>
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
        <div className="enquiry-overlay" onClick={() => setShowForm(false)}>
          <div
            className="enquiry-container"
            onClick={(e) => e.stopPropagation()} // Prevent close on form click
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
                <input type="text" placeholder="Name" className="form-input" />
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
  );
};

export default InternalFive;
