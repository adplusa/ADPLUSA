"use client";

import React, { useEffect, useRef } from "react";
import Header from "../Components/Header/page";
import "./project.css";
import Image from "next/image";
import Footer from "../Components/Footer/page";
import Link from "next/link";
import { gsap, CSSPlugin, Expo } from "gsap";

const page = () => {
  const textRef = useRef(null);

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
  return (
    <>
      <Header />
      <div className="project-container">
        <div className="project-content">
          <h1>Projects</h1>

          <hr id="project-hr" />

          <div className="project-img">
            {/* <div className="project-img-row-one">
              <Link href="/projects/project-internal-one">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img4.jpg"}
                      alt="project-img"
                      width={430}
                      height={600}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay"></span>
                  </span>
                  <h1>The Iconic Arrival</h1>
                </div>
              </Link>

              <Link href="/projects/project-internal-two">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img2.jpg"}
                      alt="project-img"
                      width={890}
                      height={600}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>PICAC Brunswick</h1>
                    </span>
                  </span>
                </div>
              </Link>
            </div>

            <div className="project-img-row-two">
              <Link href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img1.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>

              <Link href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img1.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>

              <Link href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img1.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>
            </div> */}

            <div className="project-img-row-three">
              <Link href="/projects/project-internal-one">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img3.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>

              <Link href="/projects/project-internal-two">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img3.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>

              <Link href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img3.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>
            </div>

            <div className="project-img-row-four">
              <Link href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img4.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>

              <Link href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img4.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>

              <Link href="#">
                <div className="project-images">
                  <span className="project-relative">
                    <Image
                      className="pr-img"
                      src={"/project-img4.jpg"}
                      alt="project-img"
                      width={0}
                      height={0}
                      unoptimized
                      priority
                    ></Image>
                    <span className="project-overlay">
                      <h1>Image Text</h1>
                    </span>
                  </span>
                </div>
              </Link>
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
    </>
  );
};

export default page;
