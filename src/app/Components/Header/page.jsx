"use client";
import React, { useEffect, useRef, useState } from "react";
import "./header.css";
import gsap from "gsap";
import Image from "next/image";

const Header = () => {
  const [logo, setLogo] = useState("/red-logo.png");
  const colorChangerHandle = () => {
    let element = document.body;
    element.classList.toggle("dark-mode");

    const div = document.querySelector(".rounder-div-changer");
    console.log("naveen");
    if (div.style.marginLeft === "40px") {
      div.style.marginLeft = "0px";
      div.style.backgroundColor = "#000";
    } else {
      div.style.marginLeft = "40px";
      div.style.backgroundColor = "#fff";
    }
  };

  useEffect(() => {
    const updateLogo = () => {
      setLogo(
        document.body.classList.contains("dark-mode")
          ? "/white-logo.png"
          : "/red-logo.png"
      );
    };

    // Run on mount
    updateLogo();

    // Observe for changes
    const observer = new MutationObserver(() => {
      updateLogo();
    });

    observer.observe(document.body, { attributes: true });

    return () => observer.disconnect(); // Cleanup observer
  }, []);

  return (
    <>
      <div className="header">
        <div className="header-df">
          <div className="logo">
            <Image
              src={logo}
              alt="logo"
              id="logo"
              width={0}
              height={0}
              unoptimized
            ></Image>
          </div>

          {/* <div className="flip-logo">
            <span>
              <Image
                id="flip-two"
                src={"/flip-two.png"}
                alt="logo"
                width={0}
                height={0}
                unoptimized
              ></Image>
            </span>
            <span>
              <Image
                id="flip-one"
                src={"/flip-one.png"}
                alt="logo"
                width={0}
                height={0}
                unoptimized
              ></Image>
            </span>
          </div> */}
          <div className="flip-logo">
            <span className="flip-container">
              <Image
                id="flip-one"
                className="flip-front"
                src={"/flip-one.png"}
                alt="logo"
                width={100}
                height={100}
                unoptimized
              />
              <Image
                id="flip-two"
                className="flip-back"
                src={"/flip-two.png"}
                alt="logo"
                width={100}
                height={100}
                unoptimized
              />
            </span>
          </div>

          <div className="menu-color">
            <div className="menu">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-list"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                />
              </svg>
            </div>
            <div className="color-changer">
              <h3>ON</h3>
              <div className="day-night">
                <div
                  className="rounder-div-changer dark-mode"
                  onClick={colorChangerHandle}
                ></div>
                <svg
                  id="night"
                  width="15"
                  transform="translate(-1,-0.5)"
                  viewBox="0 0 15 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask id="path-1-inside-1_20_11" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.70554 0.818501C8.59984 0.814513 8.4936 0.8125 8.38687 0.8125C4.00533 0.8125 0.453384 4.20471 0.453384 8.38921C0.453384 12.5737 4.00533 15.9659 8.38687 15.9659C10.8603 15.9659 13.0694 14.8849 14.5243 13.1906C10.2905 13.0309 6.90951 9.70247 6.90951 5.6199C6.90951 3.7976 7.58313 2.12556 8.70554 0.818501Z"
                    ></path>
                  </mask>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.70554 0.818501C8.59984 0.814513 8.4936 0.8125 8.38687 0.8125C4.00533 0.8125 0.453384 4.20471 0.453384 8.38921C0.453384 12.5737 4.00533 15.9659 8.38687 15.9659C10.8603 15.9659 13.0694 14.8849 14.5243 13.1906C10.2905 13.0309 6.90951 9.70247 6.90951 5.6199C6.90951 3.7976 7.58313 2.12556 8.70554 0.818501Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M8.70554 0.818501L9.86886 1.81748L11.9396 -0.593958L8.76335 -0.71379L8.70554 0.818501ZM14.5243 13.1906L15.6876 14.1896L17.7584 11.7781L14.5821 11.6583L14.5243 13.1906ZM8.38687 2.34588C8.47432 2.34588 8.56129 2.34753 8.64774 2.35079L8.76335 -0.71379C8.63839 -0.718505 8.51288 -0.720881 8.38687 -0.720881V2.34588ZM1.98677 8.38921C1.98677 5.1173 4.78493 2.34588 8.38687 2.34588V-0.720881C3.22572 -0.720881 -1.08 3.29212 -1.08 8.38921H1.98677ZM8.38687 14.4325C4.78493 14.4325 1.98677 11.6611 1.98677 8.38921H-1.08C-1.08 13.4863 3.22572 17.4993 8.38687 17.4993V14.4325ZM13.361 12.1916C12.1941 13.5504 10.4083 14.4325 8.38687 14.4325V17.4993C11.3123 17.4993 13.9446 16.2194 15.6876 14.1896L13.361 12.1916ZM14.5821 11.6583C11.1053 11.5271 8.44289 8.81285 8.44289 5.6199H5.37612C5.37612 10.5921 9.47572 14.5346 14.4665 14.7229L14.5821 11.6583ZM8.44289 5.6199C8.44289 4.18497 8.97128 2.86271 9.86886 1.81748L7.54223 -0.180477C6.19498 1.3884 5.37612 3.41022 5.37612 5.6199H8.44289Z"
                    fill="currentColor"
                    mask="url(#path-1-inside-1_20_11)"
                  ></path>
                </svg>

                <svg
                  id="sun"
                  width="17.5"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="8.91082"
                    cy="8.96563"
                    r="4.65117"
                    fill="currentColor"
                  ></circle>
                  <path
                    d="M8.91089 3.21496L8.91089 0.224609"
                    stroke="currentColor"
                    strokeWidth="1.30349"
                  ></path>
                  <path
                    d="M8.91089 17.7067L8.91089 14.7163"
                    stroke="currentColor"
                    strokeWidth="1.30349"
                  ></path>
                  <path
                    d="M14.6615 8.96582L17.6519 8.96582"
                    stroke="currentColor"
                    strokeWidth="1.30349"
                  ></path>
                  <path
                    d="M0.169923 8.96582L3.16028 8.96582"
                    stroke="currentColor"
                    strokeWidth="1.30349"
                  ></path>
                  <path
                    d="M4.84448 4.89917L2.72998 2.78467M15.0917 15.1464L12.9772 13.0319M12.9772 4.89917L15.0917 2.78467M2.72998 15.1464L4.84448 13.0319"
                    stroke="currentColor"
                    strokeWidth="1.30349"
                  ></path>
                </svg>
              </div>
              <h3>OFF</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
