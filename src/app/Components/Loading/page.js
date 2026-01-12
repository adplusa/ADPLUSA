"use client";

import "./loading.css";

/**
 * Reusable Loading Component
 * Lightweight, performant loading animation
 */
export default function Loading({ text = "Loading...", fullScreen = true }) {
  if (fullScreen) {
    return (
      <div className="loading-container-full">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p className="loading-text">{text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-container-inline">
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      {text && <p className="loading-text-small">{text}</p>}
    </div>
  );
}
