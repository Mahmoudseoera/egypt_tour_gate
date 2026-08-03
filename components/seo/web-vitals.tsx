"use client";

import { useReportWebVitals } from "next/web-vitals";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export default function WebVitalsReporter() {
  useReportWebVitals((metric) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "web_vitals",
      web_vital_name: metric.name,
      web_vital_id: metric.id,
      web_vital_value: metric.value,
      web_vital_rating: metric.rating,
      web_vital_navigation_type: metric.navigationType,
    });
  });

  return null;
}
