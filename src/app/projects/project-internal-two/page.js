"use client";
import React, { useState } from "react";
import Header from "@/app/Components/Header/page";
import Footer from "@/app/Components/Footer/page";
import Image from "next/image";
import "./internal-two.css";

const InternalOne = () => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const contentLoadHandler = () => {
    setIsContentVisible(!isContentVisible);
    document.getElementById("add").style.display = isContentVisible
      ? "flex"
      : "none";
    document.getElementById("less").style.display = isContentVisible
      ? "none"
      : "flex";
  };

  return (
    <div className="internal-container">
      <Header />
      <div className="internal-section-one">
        <div className="internal-section-one-top">
          <h1>PICAC Brunswick</h1>
          <Image
            src={"/picac-1.webp"}
            alt="Internal-img"
            width={0}
            height={0}
            unoptimized
            priority
          ></Image>
        </div>

        <div className="internal-section-one-bottom">
          <div className="internal-section-one-bottom-left">
            <p>
              PICAC Brunswick began with a vision to create something truly
              exceptional. We worked alongside the dedicated PICAC team to
              define an aspirational brief worthy of this groundbreaking
              project. The project, designed to create a new training facility
              for the Plumbing Industrial Climate Action Centre (PICAC) at their
              foundational Brunswick campus elevates the vocational school into
              a place for future learning while setting a new industry benchmark
              of excellence.
            </p>

            <p
              className={`load-content ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              Significant to this project in Brunswick is PICAC’s intention to
              establish the flagship industry training space for new sustainable
              technologies, including the burgeoning field of hydrogen. Training
              and research in hydrogen as a fundamental field of specialist
              plumbing is at the core of PICAC’s commitment to green
              technologies. The facility at Brunswick provides the
              infrastructure to train from rooftop through built form and into
              sub-surface installations, a feature unique to PICAC Brunswick and
              a major leap forward for plumbing training facilities throughout
              Australia.
            </p>

            <p
              className={`load-content ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              The architecture of the building has been carefully considered –
              discussions held with Traditional Owners are reflected in form and
              materiality, while the internal plan remains a functional space
              that is adaptable to PICAC’s dynamic education delivery needs.
            </p>

            <p
              className={`load-content ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              PICAC’s purpose and role as an industry leader and educator in
              water conservation and sustainable plumbing methods is put on
              display throughout the design, mixing visual cues with physical
              connection to water across the architecture and landscape design.
              These continuous reminders of PICAC’s championing efforts in
              environmental sustainability act as a storytelling mechanism to
              show the history of PICAC, as well as the history of the land it
              now stands on – representing the return of water and nature to the
              site and the beginning of healing for Country.
            </p>
          </div>

          <div className="internal-section-one-bottom-right">
            <div className="land">
              <p>Traditional Custodians of the Land</p>
              <ul>
                <li>Bunurong Boon</li>
                <li>Wurrung and</li>
                <li>Wurundjeri Woi</li>
                <li>Wurrung Peoples</li>
              </ul>
            </div>

            <div className="location">
              <p>Location</p>
              <ul>
                <li>Melbourne, Astralias</li>
              </ul>
            </div>

            <div className="status">
              <p>Status</p>
              <ul>
                <li>Completed 2023</li>
              </ul>
            </div>

            <div className="client">
              <p>Client</p>
              <ul>
                <li>Vicinity Group</li>
                <li>Chadstone Shopping</li>
                <li>Centre</li>
              </ul>
            </div>

            <div
              className={`architect load-content-li ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              <p>Architect</p>
              <ul>
                <li>Vicinity Group</li>
                <li>Chadstone Shopping</li>
                <li>Centre</li>
              </ul>
            </div>

            <div
              className={`base load-content-li ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              <p>Base Building Architecture</p>
              <ul>
                <li>
                  <a href="#">Vicinity Group</a>
                </li>
                <li>
                  <a href="#">Jackson Clements</a>
                </li>
                <li>
                  <a href="#">Burrows Architects</a>
                </li>
              </ul>
            </div>

            <div
              className={`landscape load-content-li ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              <p>Landscape Architect</p>
              <ul>
                <li>
                  <a href="#">LatStudios</a>
                </li>
              </ul>
            </div>

            <div
              className={`lighting load-content-li ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              <p>Lighting Design</p>
              <ul>
                <li>
                  <a href="#">ADP Consulting</a>
                </li>
              </ul>
            </div>

            <div
              className={`artist load-content-li ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              <p>Artist</p>
              <ul>
                <li>
                  <a href="#">Matthew Johnson</a>
                </li>
              </ul>
            </div>

            <div
              className={`facade load-content-li ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              <p>Facade Engineering</p>
              <ul>
                <li>
                  <a href="#">Inhabit</a>
                </li>
              </ul>
            </div>

            <div
              className={`dda load-content-li ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              <p>DDA Consultant</p>
              <ul>
                <li>
                  <a href="#">Architecture & Access</a>
                </li>
              </ul>
            </div>

            <div
              className={`structural load-content-li ${
                isContentVisible ? "visible" : "hidden"
              }`}
            >
              <p>Structural Engineering</p>
              <ul>
                <li>Mordue Engineering</li>
                <li>
                  <a href="#">Baigents</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          id="add"
          className="internal-section-one-btn"
          onClick={contentLoadHandler}
        >
          <button>
            More Information
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus"
              viewBox="0 0 16 16"
            >
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
          </button>
        </div>

        <div
          id="less"
          className="internal-section-one-btn"
          onClick={contentLoadHandler}
        >
          <button>
            Less Information
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-x-lg"
              viewBox="0 0 16 16"
            >
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
            </svg>
          </button>
        </div>
        <hr id="internal-line" />
      </div>

      <div className="internal-section-two">
        <div className="internal-section-two-top">
          <div className="internal-section-two-top-imgs" id="picak-two-img">
            <Image
              src={"/picak-2.gif"}
              width={0}
              height={0}
              alt="img"
              unoptimized
            ></Image>
            <Image
              src={"/picak-3.webp"}
              width={0}
              height={0}
              alt="img"
              unoptimized
            ></Image>
          </div>
        </div>
        <div className="internal-section-two-bottom">
          <Image
            src={"/picak-4.gif"}
            width={0}
            height={0}
            alt="img"
            unoptimized
          ></Image>
        </div>
      </div>

      <div className="internal-section-two">
        <div className="internal-section-two-top">
          <div className="internal-section-two-top-imgs">
            <Image
              src={"/first-internal-img-3.webp"}
              width={0}
              height={0}
              alt="img"
              unoptimized
            ></Image>

            <Image
              src={"/first-internal-img-1.webp"}
              width={0}
              height={0}
              alt="img"
              unoptimized
            ></Image>
          </div>
        </div>
        <div className="internal-section-two-bottom">
          <Image
            src={"/picak-5.webp"}
            width={0}
            height={0}
            alt="img"
            unoptimized
          ></Image>
        </div>
      </div>

      <span className="internal-three">
        <Image
          src={"/first-internal-img-2.webp"}
          width={0}
          height={0}
          alt="img"
          unoptimized
        ></Image>
        <Image
          src={"/first-internal-img-2.webp"}
          width={0}
          height={0}
          alt="img"
          unoptimized
        ></Image>
      </span>

      <Footer />
    </div>
  );
};

export default InternalOne;
