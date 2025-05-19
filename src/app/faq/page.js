"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import "./faq.css";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import { client } from "../../sanity/lib/client";
import urlFor from "../helpers/sanity";

export default function FAQ() {
  const [faqData, setFaqData] = useState(null);
  const [openFaqs, setOpenFaqs] = useState({});

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const faqSection = await client.fetch('*[_type == "faqSection"]');
        setFaqData(faqSection);
        console.log(faqSection);
      } catch (err) {
        console.error("Failed to fetch FAQ data:", err);
      }
    };

    fetchFaq();
  }, []);

  const toggleFaq = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenFaqs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!faqData) return <div>Loading FAQs...</div>;

  return (
    <>
      <Header />

      <div className="faq-head">
        <h1>{faqData.title || "Frequently Asked Questions"}</h1>
        <hr />
      </div>

      <div className="faq-container">
        {faqData[0].categories?.map((category, categoryIndex) => (
          <section key={categoryIndex} className="faq-section">
            <h2 className="faq-title">{category.title}</h2>

            <div className="faq-description">
              <p>
                {category.description}{" "}
                <a href={category.chatLink || "/contact"} className="chat-link">
                  Chat to our friendly team
                </a>
                .
              </p>
            </div>

            <div
              className={`faq-content ${categoryIndex % 2 === 1 ? "reverse" : ""}`}
            >
              {/* FAQ Text */}
              <div className="faq-text-content">
                <div className="faq-items">
                  {category.faqs?.map((faq, faqIndex) => {
                    return (
                      <div key={faqIndex} className="faq-item">
                        <div
                          className="faq-question-container"
                          onClick={() => toggleFaq(categoryIndex, faqIndex)}
                        >
                          <div className="faq-icon">
                            <div className="icon-circle">
                              {/* {getIcon(faq.icon)} */}✅
                            </div>
                          </div>
                          <div className="faq-content-text">
                            <h3 className="faq-question-two">{faq.question}</h3>
                            <p className="faq-answer-two">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FAQ Image */}
              <div className="faq-image-container">
                <div className="image-wrapper-two">
                  {category.image && (
                    <Image
                      src={urlFor(category.image).url()}
                      alt={category.title}
                      width={500}
                      height={400}
                      className="faq-image"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </>
  );
}
