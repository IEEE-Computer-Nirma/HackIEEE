"use client";

import { useEffect, useRef, useState } from "react";
import type { HackIEEETitleHandle } from "./HackIEEETitle";

// three.js stays out of the first bundle.
const loadTitle = () => import("./HackIEEETitle").then((m) => m.default);
type TitleComponent = Awaited<ReturnType<typeof loadTitle>>;

/* Calls back once the intro curtain (Intro.tsx) starts lifting — at once if
   there is none or it is already lifting. Returns a cleanup. */
function whenIntroDone(callback: () => void) {
  const intro = document.querySelector(".intro");
  if (!intro || intro.classList.contains("is-done")) {
    callback();
    return () => {};
  }
  const observer = new MutationObserver(() => {
    if (!intro.classList.contains("is-done")) return;
    observer.disconnect();
    callback();
  });
  observer.observe(intro, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

/* The hero wordmark as a 3D reveal: each letter turns from edge-on into place,
   then the whole word settles into the flat wordmark — 4s in all (timing lives
   in HackIEEETitle). On a first visit it waits for the intro to lift: it is
   mounted hidden underneath meanwhile, because its WebGL setup and shader
   compile take about a second, and replay() then starts the turn from edge-on
   exactly as the curtain rises. Purely visual; the <h1> carries the name. */
export default function HeroTitle() {
  const titleRef = useRef<HackIEEETitleHandle>(null);
  const [Title, setTitle] = useState<TitleComponent | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let introDone = false;
    void loadTitle().then((C) => {
      if (cancelled) return;
      setTitle(() => C);
      // No intro in the way (already lifted, or skipped): it plays as it mounts.
      if (introDone) setLive(true);
    });

    const stopWatching = whenIntroDone(() => {
      introDone = true;
      titleRef.current?.replay(); // no-op if the title hasn't loaded yet
      setLive(true);
    });
    return () => {
      cancelled = true;
      stopWatching();
    };
  }, []);

  return (
    <div className={`hero-title${live ? " is-live" : ""}`} aria-hidden="true">
      {Title && (
        <Title
          ref={titleRef}
          surface="champagne"
          sides="black"
          depth="standard"
          bevel="sharp"
          order="unison"
          sweep={true}
          rim={false}
          ending="artwork"
          color="#f6e6cb"
          trigger="mount"
        />
      )}
    </div>
  );
}
