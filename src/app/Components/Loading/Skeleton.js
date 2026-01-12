"use client";

import "./loading.css";

/**
 * Skeleton loader for content placeholders
 */
export function Skeleton({ width = "100%", height = "20px", borderRadius = "4px", className = "" }) {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
}

/**
 * Card skeleton for service/project cards
 */
export function CardSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-skeleton">
          <Skeleton height="200px" borderRadius="8px 8px 0 0" />
          <div className="card-skeleton-content">
            <Skeleton width="70%" height="24px" />
            <Skeleton width="100%" height="16px" />
            <Skeleton width="85%" height="16px" />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Banner skeleton
 */
export function BannerSkeleton() {
  return <div className="banner-skeleton" />;
}
