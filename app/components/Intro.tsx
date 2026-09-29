"use client";

import { useEffect, useRef, useState } from "react";

/* First-visit intro: plays the loading video at 2x, fades out, then the hero
   choreography starts (hero animations are paused while .intro is up — see
   globals.css). Once per tab: sessionStorage survives a reload, a new tab
   starts empty. */
const KEY = "hackieee-intro";
const RATE = 2;
const FADE_MS = 800; // matches the .intro opacity transition
const START_TIMEOUT_MS = 4000; // slow network or unplayable video: show the site
const STALL_SLACK_MS = 1500;

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
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    let cancelled = false;
    let fadeTimer: number | undefined;
    const done = (instant = false) => {
      if (cancelled || (!instant && root.classList.contains("is-done"))) return;
      if (instant) root.classList.add("is-instant");
      root.classList.add("is-done");
      fadeTimer = window.setTimeout(() => setGone(true), instant ? 0 : FADE_MS);
    };

    if (!decide()) {
      done(true);
      return () => {
        cancelled = true;
        window.clearTimeout(fadeTimer);
      };
    }

    const finish = () => done();
    let safety = window.setTimeout(finish, START_TIMEOUT_MS);
    const onPlaying = () => {
      video.dataset.playing = "";
      window.clearTimeout(safety);
      // A stall mid-play shouldn't trap anyone behind the overlay either.
      safety = window.setTimeout(finish, (video.duration / RATE) * 1000 + STALL_SLACK_MS);
    };

    video.muted = true; // autoplay needs it, and React doesn't render the attribute
    video.defaultPlaybackRate = RATE;
    video.playbackRate = RATE;
    video.addEventListener("playing", onPlaying, { once: true });
    video.addEventListener("ended", finish);
    video.play().catch(finish);

    return () => {
      cancelled = true;
      window.clearTimeout(safety);
      window.clearTimeout(fadeTimer);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("ended", finish);
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={rootRef} className="intro" aria-hidden="true">
      <video
        ref={videoRef}
        className="intro__video"
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
      >
        <source src="/loading-animation.webm" type='video/webm; codecs="vp9"' />
      </video>
    </div>
  );
}
