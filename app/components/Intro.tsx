"use client";

import { useEffect, useRef, useState } from "react";
import { playIntroSfx, primeSound, releaseSound, unlockSound } from "./sound";

/* First-visit intro. Opens on a black "click to enter" gate: browsers only allow
   sound after a click, tap or key, so that gesture comes first. It starts the
   loading video (1x, in sync with its sound effect); when the video ends the
   curtain lifts on its own and the ambient music fades in. Clicking during the
   video skips to the lift. Hero animations are paused while .intro is up (see
   globals.css). Once per tab: sessionStorage survives a reload, a new tab
   starts empty. */
const KEY = "hackieee-intro";
const LIFT_MS = 1100; // matches the .intro transform transition
const START_TIMEOUT_MS = 4000; // slow network or unplayable video: show the site
const STALL_SLACK_MS = 1500;
// Keys that don't count as a user gesture for autoplay, or that mean something else.
const IGNORED_KEYS = new Set(["Escape", "Tab", "Shift", "Control", "Alt", "Meta", "CapsLock"]);

// Decided once per page load, so React's dev double-mount doesn't read our own write.
let shouldPlay: boolean | undefined;
function decide() {
  if (shouldPlay === undefined) {
    shouldPlay = false;
    try {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!sessionStorage.getItem(KEY) && !reduced) {
        sessionStorage.setItem(KEY, "1");
        shouldPlay = true;
      }
    } catch {}
  }
  return shouldPlay;
}

export default function Intro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const enterRef = useRef<HTMLButtonElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    const button = enterRef.current;
    if (!root || !video || !button) return;

    let cancelled = false;
    let liftTimer: number | undefined;
    const done = (instant = false) => {
      if (cancelled || root.classList.contains("is-done")) return;
      if (instant) root.classList.add("is-instant");
      root.classList.add("is-done");
      releaseSound();
      liftTimer = window.setTimeout(() => setGone(true), instant ? 0 : LIFT_MS);
    };

    if (!decide()) {
      done(true);
      return () => {
        cancelled = true;
        window.clearTimeout(liftTimer);
      };
    }

    primeSound();
    // Shown only now, so a skipped intro never flashes the prompt before hydration.
    button.classList.add("is-ready");
    button.tabIndex = 0;
    button.focus({ preventScroll: true });

    let started = false;
    let safety: number | undefined;
    const finish = () => done();
    const onPlaying = () => {
      video.dataset.playing = "";
      playIntroSfx();
      window.clearTimeout(safety);
      // A stall mid-play shouldn't trap anyone behind the overlay.
      safety = window.setTimeout(finish, video.duration * 1000 + STALL_SLACK_MS);
    };
    // Runs inside the click/tap/key: the first one enters, a second one skips.
    const enter = () => {
      if (started) return done();
      started = true;
      unlockSound();
      button.classList.remove("is-ready");
      button.tabIndex = -1;
      video.play().catch(finish);
      safety = window.setTimeout(finish, START_TIMEOUT_MS);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || IGNORED_KEYS.has(e.key)) return;
      e.preventDefault(); // Space/Enter would otherwise also click the focused button
      enter();
    };

    video.muted = true; // the sound effect is separate; React doesn't render the attribute
    video.addEventListener("playing", onPlaying, { once: true });
    video.addEventListener("ended", finish);
    root.addEventListener("click", enter);
    window.addEventListener("keydown", onKey);

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      window.clearTimeout(liftTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", finish);
      root.removeEventListener("click", enter);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="intro">
      <video
        ref={videoRef}
        className="intro__video"
        aria-hidden="true"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/loading-animation.webm" type='video/webm; codecs="vp9"' />
      </video>
      {/* The root's click handler does the entering; this is the visible,
          focusable affordance for it. */}
      <button ref={enterRef} type="button" className="intro__enter" tabIndex={-1}>
        <span className="intro__enter-pointer">Click to enter</span>
        <span className="intro__enter-touch">Tap to enter</span>
      </button>
    </div>
  );
}
