"use client";

import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./enquiry.css";

export default function Page() {
  const [open, setOpen] = useState(false);
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // {type:"ok"|"err", msg:string}

  // tiny helper
  const v = (n) =>
    (formRef.current?.elements?.namedItem(n)?.value || "").trim();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSending(true);

    // simple validations (optional – remove if your template marks fields required)
    if (!v("name"))
      return (
        setSending(false),
        setStatus({ type: "err", msg: "Please enter your name." })
      );
    if (!v("email"))
      return (
        setSending(false),
        setStatus({ type: "err", msg: "Please enter your email." })
      );
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email")))
      return (
        setSending(false),
        setStatus({ type: "err", msg: "Enter a valid email." })
      );
    if (!v("phone"))
      return (
        setSending(false),
        setStatus({ type: "err", msg: "Please enter your phone number." })
      );

    // honeypot
    if (v("website")) {
      setSending(false);
      setStatus({ type: "ok", msg: "Thanks!" });
      return;
    }

    // helpful metadata for your template
    const submitted_at = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: true,
    });
    const year = String(new Date().getFullYear());
    // write to hidden inputs (so EmailJS can read them)
    formRef.current.querySelector('[name="submitted_at"]').value = submitted_at;
    formRef.current.querySelector('[name="year"]').value = year;

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        formRef.current,
        { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY }
      );

      formRef.current?.reset();
      setStatus({
        type: "ok",
        msg: "Message sent! We’ll get back to you shortly.",
      });
      setOpen(false); // close after success (remove if you prefer to keep it open)
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus({ type: "err", msg: "Could not send. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Right-side vertical tab */}
      <button className="enquiry-tab" onClick={() => setOpen(true)}>
        Enquire Now
      </button>

      {/* Overlay (no blur, just a faint dim) */}
      <div
        className={`enquiry-overlay ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      >
        {/* Slide-in wrapper */}
        <aside
          className={`enquiry-panel ${open ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card UI same as your 3rd screenshot */}
          <div className="enquiry-card">
            <div className="enquiry-card-head">
              <h3>Quick Query</h3>
              <button
                type="button"
                className="close-btn"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <p className="enquiry-subtitle">
              If you have any queries, we will be pleased to assist you.
            </p>

            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="enquiry-form"
            >
              <input name="name" placeholder="Name" className="form-input" />
              <input
                name="phone"
                placeholder="Mobile No."
                className="form-input"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="form-input"
              />

              <select name="service" className="form-input" defaultValue="">
                <option value="" disabled>
                  Select Type
                </option>
                <option>General</option>
                <option>Support</option>
                <option>Sales</option>
              </select>

              <textarea
                name="message"
                placeholder="Query"
                rows="3"
                className="form-input"
              />

              {/* Honeypot + metadata */}
              <input
                type="text"
                name="website"
                className="hp"
                tabIndex={-1}
                autoComplete="off"
              />
              <input type="hidden" name="submitted_at" />
              <input type="hidden" name="year" />

              <button
                type="submit"
                className="submit-button"
                disabled={sending}
              >
                {sending ? "Sending…" : "Submit"}
              </button>

              {status && (
                <p className={`msg ${status.type === "ok" ? "ok" : "err"}`}>
                  {status.msg}
                </p>
              )}
            </form>
          </div>
        </aside>
      </div>
    </>
  );
}
