"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import "./faq.css";
import Header from "../Components/Header/page";
import Footer from "../Components/Footer/page";
import Loading from "../Components/Loading/page";
import { getFAQ } from "../../lib/cms-client";
import { Plus, Minus } from "lucide-react";
import { injectHeadTags, removeHeadTags } from "../utils/headInjector";

export default function FAQ() {
    const [faqData, setFaqData] = useState(null);
    const [openFaqs, setOpenFaqs] = useState({});
    const [showForm, setShowForm] = useState(false);

    const upwardHandler = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                const faqSection = await getFAQ();
                console.log("Fetched FAQ Data:", faqSection);
                setFaqData(faqSection);
            } catch (err) {
                console.error("Failed to fetch FAQ data:", err);
            }
        };

        fetchFaq();
    }, []);

    useEffect(() => {
        if (!faqData) return;

        document.title = faqData.seoTitle || "FAQ | ADPL Consulting";

        const metaDesc = document.querySelector("meta[name='description']");
        if (metaDesc) {
            metaDesc.setAttribute(
                "content",
                faqData.seoDescription || "Frequently Asked Questions"
            );
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content =
                faqData.seoDescription || "Frequently Asked Questions";
            document.head.appendChild(meta);
        }

        // Inject Custom Head Tags
        if (faqData.customHeadTags) {
            injectHeadTags(faqData.customHeadTags, "faq-custom-head");
        }

        // Cleanup: Remove faq-specific custom head tags on unmount
        return () => {
            removeHeadTags("faq-custom-head");
        };
    }, [faqData]);

    const toggleFaq = (categoryIndex, faqIndex) => {
        const key = `${categoryIndex}-${faqIndex}`;
        setOpenFaqs((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (!faqData) return <Loading text="Loading FAQs" fullScreen={true} />;

    return (
        <>
            <Header />

            <div className="faq-head">
                <h1>{faqData.title || "Frequently Asked Questions"}</h1>
                <hr />
            </div>

            <div className="faq-container">
                {faqData.categories?.map((category, categoryIndex) => (
                    <section key={categoryIndex} className="faq-section">
                        <h2 className="faq-title">{category.title}</h2>

                        <div className="faq-description">
                            <p>
                                {category.description}{" "}
                                <a
                                    href={category.chatLink || "/contact"}
                                    className="chat-link"
                                >
                                    Chat to our friendly team
                                </a>
                                .
                            </p>
                        </div>

                        <div
                            className={`faq-content ${
                                categoryIndex % 2 === 1 ? "reverse" : ""
                            }`}
                        >
                            <div className="faq-text-content">
                                {category.faqs?.map((faq, faqIndex) => {
                                    const isOpen =
                                        openFaqs[
                                            `${categoryIndex}-${faqIndex}`
                                        ];
                                    return (
                                        <div
                                            key={faqIndex}
                                            className="faq-item"
                                        >
                                            <div
                                                className="faq-question-container"
                                                onClick={() =>
                                                    toggleFaq(
                                                        categoryIndex,
                                                        faqIndex
                                                    )
                                                }
                                            >
                                                <div
                                                    className="faq-content-text"
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    {/* Icon that toggles between Plus and Minus */}
                                                    {isOpen ? (
                                                        <Minus size={20} />
                                                    ) : (
                                                        <Plus size={20} />
                                                    )}
                                                    <h3 className="faq-question-two">
                                                        {faq.question}
                                                    </h3>
                                                </div>
                                            </div>

                                            {/* Only show the answer if isOpen is true */}
                                            {isOpen && (
                                                <div
                                                    className={`faq-answer-container ${
                                                        isOpen ? "open" : ""
                                                    }`}
                                                >
                                                    <p
                                                        className="faq-answer-two"
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "start",
                                                            gap: "8px",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                padding:
                                                                    "0 10px",
                                                            }}
                                                        ></span>
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* FAQ Image - using direct URL from CMS */}
                            <div className="faq-image-container">
                                <div className="image-wrapper-two">
                                    {category?.image?.url && (
                                        <Image
                                            src={category.image.url}
                                            alt={category.title || "FAQ image"}
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
                <div
                    className="enquiry-overlay"
                    onClick={() => setShowForm(false)}
                >
                    <div
                        className="enquiry-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="enquiry-box">
                            <div
                                className="close-icon"
                                onClick={() => setShowForm(false)}
                            >
                                ✕
                            </div>
                            <h2 className="title">Quick Query</h2>
                            <p className="subtitle">
                                If you have any queries, we will be pleased to
                                assist you.
                            </p>
                            <form>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    className="form-input"
                                />
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

            <Footer />
        </>
    );
}
