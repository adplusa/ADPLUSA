"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import { client } from "@/sanity/lib/client";
import urlFor from "../helpers/sanity";
import "./serviceInternalTwo.css";
import Link from "next/link";

export const dynamic = "force-dynamic";

const ServicesPageTwo = () => {
  const [mainServiceData, setMainServiceData] = useState(null);

  const [data, setData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Drag states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [filteredServices, setFilteredServices] = useState([]);

  // Resize check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to top
  const upwardHandler = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(`*[_type == "servicesTwoPage"][0]`);
        setData(result);

        const homepage = await client.fetch(`*[_type == "homepage"][0]`);
        const currentPath = window.location.pathname;
        const others = homepage.serviceBox?.filter(
          (service) => service.boxUrl !== currentPath
        );
        setFilteredServices(others || []);

        const mainServiceData = await client.fetch(
          `*[_type == "serviceTwoPage"][0]`
        );
        setMainServiceData(mainServiceData);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    fetchData();
  }, []);

  // SEO
  useEffect(() => {
    if (!data) return;
    document.title = data.seoTitle;
    const meta = document.querySelector("meta[name='description']");
    if (meta) meta.content = data.seoDescription;
    else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content = data.seoDescription || "";
      document.head.appendChild(newMeta);
    }
  }, [data]);

  // Carousel total slides
  const totalSlides = filteredServices.length || 1;
  const slidesToShow = [...filteredServices, ...filteredServices];

  // Auto-play
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

  // Handle infinite loop
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

  // Get position helper
  const getPositionX = (e) => {
    return e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
  };

  // Drag handlers
  const handleDragStart = (e) => {
    if (e.type === "mousedown") {
      e.preventDefault();
    }

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

      // Calculate current position
      const slideWidth = isMobile ? 100 : 25;
      const currentTransform = -currentIndex * slideWidth;
      const dragOffset = (diff / slideRef.current.offsetWidth) * slideWidth;

      // Apply transform with drag offset
      slideRef.current.style.transform = `translateX(${currentTransform + dragOffset}%)`;
    },
    [isDragging, startX, currentIndex, isMobile]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !slideRef.current) return;

    setIsDragging(false);

    // Calculate drag distance
    const slideWidth = slideRef.current.offsetWidth;
    const dragThreshold = slideWidth * 0.2; // 20% of slide width

    // Get current transform value
    const transform = slideRef.current.style.transform;
    const currentTransform = transform.match(/-?\d+\.?\d*/);
    const currentPos = currentTransform ? parseFloat(currentTransform[0]) : 0;

    // Calculate expected position
    const expectedPos = -currentIndex * (isMobile ? 100 : 25);
    const dragDistance = currentPos - expectedPos;

    // Determine direction and update index
    let newIndex = currentIndex;

    if (Math.abs(dragDistance) > (isMobile ? 20 : 5)) {
      // Threshold in percentage
      if (dragDistance > 0 && currentIndex > 0) {
        // Dragged right, go to previous
        newIndex = currentIndex - 1;
      } else if (dragDistance < 0 && currentIndex < totalSlides - 1) {
        // Dragged left, go to next
        newIndex = currentIndex + 1;
      }
    }

    // Reset styles
    slideRef.current.style.transition = "transform 0.3s ease-out";
    slideRef.current.style.cursor = "grab";

    // Update index
    setCurrentIndex(newIndex);

    // Restart autoplay after delay
    setTimeout(() => {
      if (!isTransitioning) {
        startAutoPlay();
      }
    }, 300);
  }, [
    isDragging,
    currentIndex,
    totalSlides,
    isMobile,
    isTransitioning,
    startAutoPlay,
  ]);

  // Event listeners for drag
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

  // Prevent context menu on long press
  useEffect(() => {
    const preventContextMenu = (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    return () =>
      document.removeEventListener("contextmenu", preventContextMenu);
  }, [isDragging]);

  const pauseAutoPlay = () => stopAutoPlay();
  const resumeAutoPlay = () => {
    if (!isTransitioning && !isDragging) {
      startAutoPlay();
    }
  };

  if (!data) return <div>Loading Services Page Two...</div>;

  return (
    <>
      <Header />

      {data.serviceBannerImage?.asset && (
        <section
          className="service-container"
          style={{
            backgroundImage: `url(${urlFor(data.serviceBannerImage).url()})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      <section className="service-info">
        <div className="services-into-df">
          {data.servicesList?.map((service, i) => (
            <div key={i} className="service-info-df">
              <div className="service-left">
                <h1>{service.title}</h1>
                <p>{service.description}</p>
              </div>
              {service.image?.asset && (
                <div className="service-right">
                  <Image
                    src={urlFor(service.image).url()}
                    width={0}
                    height={0}
                    unoptimized
                    alt={service.title}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="key-container">
        <h1 className="key-heading">Key Activities and Outcomes</h1>
        <div className="key-cards-container">
          {data.keyActivities?.map((item, i) => (
            <div key={i} className="key-card">
              <div className="key-asterisk">*</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="why-work">
        <div className="content-two">
          <div className="text">
            <h2>Why Work With Us?</h2>
            {mainServiceData?.whyWorkWithUs?.features?.map((feature, idx) => (
              <div key={idx} className="feature-main-service-page">
                <svg
                  id="tick"
                  xmlns="http://www.w3.org/2000/svg"
                  // width="16"
                  // height="16"
                  fill="currentColor"
                  className="bi bi-check2"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0"></path>
                </svg>
                <div className="info-main-service-page">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="image-wrapper-main-service-page">
            {mainServiceData?.whyWorkWithUs?.image?.asset && (
              <Image
                src={urlFor(mainServiceData.whyWorkWithUs.image).url()}
                alt="Why Work Image"
                width={500}
                height={400}
              />
            )}
          </div>
        </div>
      </section>

      <div className="professionals-section-internals">
        <h1 className="professionals-heading-internals">
          Explore More Services
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
              WebkitUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
            }}
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            {slidesToShow.map((service, i) => (
              <Link key={i} id="redirection-service" href={service.boxUrl}>
                <div className="carousel-slide-internals">
                  <div className="professional-card-internals">
                    <div className="image-container-internals">
                      {service?.serviceBoxImg?.asset ? (
                        <Image
                          src={urlFor(service.serviceBoxImg).url()}
                          alt={service.serviceBoxTitle}
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
                    <h3 style={{ userSelect: "none" }}>
                      {service.serviceBoxTitle}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
          />
        </a>
      </div>

      <div className="enquire">
        <button onClick={() => setShowForm(true)}>Enquire Now</button>
      </div>
      {showForm && (
        <div className="enquiry-overlay" onClick={() => setShowForm(false)}>
          <div
            className="enquiry-container"
            onClick={(e) => e.stopPropagation()}
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
        >
          <path
            fillRule="evenodd"
            d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"
          />
        </svg>
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
    </>
  );
};

export default ServicesPageTwo;
