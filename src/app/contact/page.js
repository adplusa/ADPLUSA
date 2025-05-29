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
                placeholder="Name"
                required
              />
            </div>
            <div className="form-field">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-field">
              <input
                type="text"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Message"
                required
              />
            </div>
            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
        <div className="contact-info-section">
          <div className="map-container">
            <Image
              src="/banner-3.jpg"
              width={0}
              height={0}
              alt="Map"
              unoptimized
              className="map-image"
            />
          </div>
        </div>
      </div>

      <section className="for-map-wrapper">
        <div className="for-map-container">
          <div className="for-map-left">
            <h2 className="for-map-heading">Let’s Talk Ideas</h2>
            <p className="for-map-description">
              Connect with us to transform your ideas into reality. Whether
              youre seeking expert advice, have project inquiries, or are ready
              to begin, our team is here to guide you every step of the way.
            </p>

            <div className="for-map-info">
              <div className="for-map-item">
                <span className="for-map-label">Address:</span>
                <span className="for-map-value">
                  423 Argyll Ln, Schaumburg, Illinois, USA
                </span>
              </div>
              <div className="for-map-item">
                <span className="for-map-label">Phone:</span>
                <span className="for-map-value">+1 (224) 421-7671</span>
              </div>
              <div className="for-map-item">
                <span className="for-map-label">Email:</span>
                <span className="for-map-value">info@adplusa.com</span>
              </div>
            </div>
          </div>

          <div className="for-map-right">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2969.528336894264!2d-88.09820568455794!3d42.03336077920973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880fa385d6f88a8f%3A0x4f276c69f4b8efc!2s423%20Argyll%20Ln%2C%20Schaumburg%2C%20IL%2060173%2C%20USA!5e0!3m2!1sen!2sin!4v1689785104729!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

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
                src="/abhi.jpg"
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
