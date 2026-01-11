"use client";
import React from "react";
import "./socialMedia.css";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Image from "next/image";

const socialLinks = {
  instagram: "https://www.instagram.com/yourprofile",
  facebook: "https://www.facebook.com/yourprofile",
  threads: "https://www.linkedin.com/in/yourprofile",
  whatsapp: "https://wa.me/919958856353",
  youtube: "https://www.youtube.com/@yourchannel",
};

const SocialLinksGrid = () => {
  return (
    <>
      <Header />
      <div className="social-links-grid-unique">
        {/* Instagram */}
        <div className="social-links-grid-unique__item">
          <a
            href="https://www.instagram.com/adplconsultingllc/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
              alt="Instagram"
              width={50}
              height={50}
            />
            <span>Instagram</span>
          </a>
        </div>

        {/* Facebook */}
        <div className="social-links-grid-unique__item">
          <a
            href="https://www.facebook.com/adplconsultingllcUSA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              width={50}
              height={50}
            />
            <span>Facebook</span>
          </a>
        </div>

        {/* Linkedin (formerly Threads placeholder) */}
        <div className="social-links-grid-unique__item">
          <a
            href="https://www.linkedin.com/company/adplconsultingllc/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/linkedin.png" alt="Linkedin" width={50} height={50} />
            <span>Linkedin</span>
          </a>
        </div>

        {/* WhatsApp */}
        <div className="social-links-grid-unique__item">
          <a
            href="https://api.whatsapp.com/send/?phone=919910085603&text=I+would+like+to+know+about+ADPL+Consulting+LLC+%21&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
              alt="WhatsApp"
              width={50}
              height={50}
            />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* YouTube (Local image) */}
        <div className="social-links-grid-unique__item">
          <a
            href="https://www.youtube.com/@adpl7168"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/youtube.webp" alt="YouTube" width={50} height={50} />
            <span>YouTube</span>
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SocialLinksGrid;
