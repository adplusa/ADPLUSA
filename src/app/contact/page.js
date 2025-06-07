"use client";

import { useEffect, useRef, useState } from "react";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import urlFor from "../helpers/sanity";
import gsap from "gsap";
import "./contact.css";

const ContactPage = () => {
  const textRef = useRef(null);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const upwardHandler = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await client.fetch(`*[_type == "contactPage"][0]`);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch contact page data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return; // Prevent null error

    document.title = data.seoTitle;

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute("content", data.seoDescription);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "Learn about our mission and team";
      document.head.appendChild(meta);
    }
  }, [data]); // Re-run when `data` becomes available

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

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call or Sanity write logic here
  };

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <Header />

      <div className="contact-container">
        <div className="contact-form-section">
          <h1 className="contact-title">
            {data?.mainHeading || "Get in touch"}
          </h1>
          <div className="title-underline"></div>

          <form onSubmit={handleSubmit}>
            {data.formFields?.map((field, idx) => (
              <div className="form-field" key={idx}>
                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    placeholder={field.label}
                    required={field.required}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.label}
                    required={field.required}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}

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

      {/* Contact Info Section */}
      <section className="for-map-wrapper">
        <div className="for-map-container">
          <div className="for-map-left">
            <h2 className="for-map-heading">
              {data?.talkIdeasHeading || "Let’s Talk Ideas"}
            </h2>
            <p className="for-map-description">
              Connect with us to transform your ideas into reality. Whether
              you’re seeking expert advice, have project inquiries, or are ready
              to begin, our team is here to guide you every step of the way.
            </p>

            <div className="for-map-info">
              <div className="for-map-item">
                <span className="for-map-label">Address:</span>
                <span className="for-map-value">
                  {data.contactInfo?.address}
                </span>
              </div>
              <div className="for-map-item">
                <span className="for-map-label">Phone:</span>
                <span className="for-map-value">{data.contactInfo?.phone}</span>
              </div>
              <div className="for-map-item">
                <span className="for-map-label">Email:</span>
                <span className="for-map-value">{data.contactInfo?.email}</span>
              </div>
            </div>
          </div>

          {data?.googleMapEmbedUrl && (
            <div className="for-map-right">
              <iframe
                title="Google Map"
                src={data.googleMapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          )}
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="why-work">
        <div className="content-two">
          <div className="text">
            <h2>{data?.whyWorkWithUsHeading}</h2>
            {data?.whyWorkWithUsItems?.map((item, idx) => (
              <div className="feature" key={idx}>
                <div className="icon">{item.icon}</div>
                <div className="info">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="image-wrapper">
            <div className="background-contact">
              {data?.rightImage?.asset && (
                <Image
                  src={urlFor(data.rightImage).url()}
                  alt="Right Section Image"
                  width={500}
                  height={400}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp CTA */}
      {data?.whatsappNumber && (
        <div className="whatsapp">
          <a
            className="btn-whatsapp-pulse"
            target="_blank"
            rel="noopener noreferrer"
            href={`https://wa.me/${data.whatsappNumber}?text=${encodeURIComponent(
              data.whatsappText || ""
            )}`}
          >
            <Image
              src="/whatsapp.png"
              width={40}
              height={40}
              alt="WhatsApp"
              unoptimized
            />
          </a>
        </div>
      )}

      {/* Enquire Button */}
      <div className="enquire">
        <button>{data.enquiryButtonText || "Enquire Now"}</button>
      </div>

      {/* Upward Scroll */}
      {data.showScrollToTop && (
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
    </>
  );
};

export default ContactPage;
