"use client";

import { useSyncExternalStore } from "react";

export const THEME_EVENT = "hackieee:theme";

const Sun = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const Moon = ({ className = "" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" className={className}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z" />
  </svg>
);

/* Squish Switch — night (default) ↔ day. The thumb position is driven by
   html[data-theme] in CSS, so it is correct before hydration. */
const subscribe = (cb: () => void) => {
  window.addEventListener(THEME_EVENT, cb);
  return () => window.removeEventListener(THEME_EVENT, cb);
};
const isDay = () => document.documentElement.dataset.theme === "day";

export default function ThemeSwitch() {
  const day = useSyncExternalStore(subscribe, isDay, () => false);

  const toggle = () => {
    const next = !day;
    const apply = () => {
      if (next) document.documentElement.dataset.theme = "day";
      else delete document.documentElement.dataset.theme;
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute("content", next ? "#efe3c8" : "#0b0906");
      window.dispatchEvent(new Event(THEME_EVENT));
    };
    try {
      localStorage.setItem("hackieee-theme", next ? "day" : "night");
    } catch {}

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce && "startViewTransition" in document) {
      document.startViewTransition(apply);
    } else {
      apply();
    }
  };

  return (
    <button
      type="button"
      className="squish"
      role="switch"
      aria-checked={day}
      aria-label="Day theme"
      onClick={toggle}
    >
      <Moon className="track-icon track-icon--l" />
      <Sun className="track-icon track-icon--r" />
      <span className="thumb">
        <Moon className="icon-moon" />
        <Sun className="icon-sun" />
      </span>
    </button>
  );
}
