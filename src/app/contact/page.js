"use client";

import { useState, useEffect, useRef } from "react";
import "./contact.css";
import Header from "../Components/Header/page";
import Image from "next/image";
import Footer from "../Components/Footer/page";
import gsap from "gsap";

export default function ContactForm() {
  const textRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
    newsletter: false,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

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

  return (
    <>
      <Header />

      <div className="contact-container">
        <div className="contact-form-section">
          <h1 className="contact-title">Get in touch</h1>
          <div className="title-underline"></div>

          <form onSubmit={handleSubmit}>
            <div className="form-field">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Name"
              />
            </div>

            <div className="form-field">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
              />
            </div>

            <div className="form-field content-field">
              <input
                type="text"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Content"
              />
            </div>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
              />
              <label htmlFor="newsletter">
                I would like to receive the newsletter.
              </label>
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>

        <div className="contact-info-section">
          <p className="info-text">
            Borem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </p>

          <div className="map-container">
            <Image
              src="/banner-3.jpg"
              width={0}
              height={0}
              unoptimized
              alt="Location Map"
              className="map-image"
            ></Image>
          </div>

          <div className="contact-details">
            <div className="contact-detail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span>NYC, United States</span>
            </div>

            <div className="contact-detail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM12 3v10l3-3h6V3h-9z" />
              </svg>
              <span>00011122333</span>
            </div>

            <div className="contact-detail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
              >
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <span>somebody@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      <section className="why-work">
        <div className="content-two">
          {/* Text Section */}
          <div className="text">
            <h2>Why work with us?</h2>

            <div className="feature">
              <div className="icon">✔️</div>
              <div className="info">
                <h3>Cost Effective</h3>
                <p>
                  Hiring highly-skilled nearshore talent unlocks cost savings of
                  50% compared to US-based professionals
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">✔️</div>
              <div className="info">
                <h3>Flexible contracts</h3>
                <p>
                  You can choose your type of contract: full, part or flex and
                  switch between these options with no strings attached
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">✔️</div>
              <div className="info">
                <h3>HR department of your dreams</h3>
                <p>
                  Our pre-screening ensures we present only motivated candidates
                  aligned with your culture and an onboarding process in just 72
                  hours!
                </p>
              </div>
            </div>

            <div className="feature">
              <div className="icon">✔️</div>
              <div className="info">
                <h3>100% satisfaction guaranteed</h3>
                <p>
                  If you’re not satisfied, we’ll give your money back – no
                  questions asked
                </p>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="image-wrapper">
            <div className="background">
              <Image
                src="/service-img-5.webp"
                alt="Why Work With Us"
                width="500"
                height="400"
              />
            </div>
          </div>
        </div>
      </section>

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
    </>
  );
}
