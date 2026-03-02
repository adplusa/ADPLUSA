"use client";

import { useRef, useState } from "react";
import "./enquiry.css";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
  const formRef = useRef(null);

  const v = (n) =>
    (formRef.current?.elements?.namedItem(n)?.value || "").trim();

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSending(true);

    // Validate
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

    // Honeypot
    if (v("website")) {
      setSending(false);
      setStatus({ type: "ok", msg: "Thanks!" });
      return;
    }

    // Simulate form submission (replace with your backend API call)
    try {
      const name = v("name");
      const emailId = v("email");
      const phone = v("phone");
      const service = v("service");
      const message = v("message");

      const htmlContent = `
        <h2>New Quick Inquiry from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${emailId}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Query:</strong> ${message}</p>
      `;

      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailId,
          htmlContent,
          countryCode: "N/A"
        }),
      });

      formRef.current?.reset();
      setStatus({
        type: "ok",
        msg: "Message sent! We'll get back to you shortly.",
      });
      setOpen(false);
    } catch (err) {
      setStatus({ type: "err", msg: "Could not send. Please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <button className="enquiry-tab" onClick={() => setOpen(true)}>
        Enquire Now
      </button>

      <div
        className={`enquiry-overlay ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      >
        <aside
          className={`enquiry-panel ${open ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
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
              noValidate
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

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                className="hp"
                tabIndex={-1}
                autoComplete="off"
              />

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
