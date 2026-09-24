import { getImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import Wordmark from "./Wordmark";
import SmoothLink from "./SmoothLink";

function Backdrop() {
  const common = { alt: "", sizes: "100vw", quality: 80 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, width: 1600, height: 900, src: "/hero/dunes-desktop.jpg" });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, width: 900, height: 1600, src: "/hero/dunes-mobile.jpg" });

  return (
    <picture>
      <source media="(min-aspect-ratio: 4/5)" srcSet={desktop} />
      <source srcSet={mobile} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes from getImageProps */}
      <img {...rest} fetchPriority="high" loading="eager" className="hero__img" />
    </picture>
  );
}

/* Hairline orbits, a comet trail and a few stars laid over the photo. */
function Decorations() {
  return (
    <svg className="hero__deco" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="trail" x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#f8cf96" stopOpacity="0" />
          <stop offset="0.7" stopColor="#f8cf96" stopOpacity="0.45" />
          <stop offset="1" stopColor="#f8cf96" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <ellipse cx="-40" cy="330" rx="290" ry="170" fill="none" stroke="#f8cf96" strokeOpacity="0.22" strokeWidth="1.2" transform="rotate(-18 -40 330)" />
      <path d="M1010 585 L1600 445" stroke="url(#trail)" strokeWidth="1.2" />
      <g fill="#fbe2bd">
        <path className="twinkle" style={{ "--d": "0s" } as React.CSSProperties} d="M1488 346 l3 26 l26 3 l-26 3 l-3 26 l-3 -26 l-26 -3 l26 -3z" />
        <circle className="twinkle" style={{ "--d": "1.2s" } as React.CSSProperties} cx="136" cy="318" r="2" />
        <circle className="twinkle" style={{ "--d": "2.4s" } as React.CSSProperties} cx="36" cy="240" r="1.4" />
        <circle className="twinkle" style={{ "--d": "3.1s" } as React.CSSProperties} cx="1420" cy="120" r="1.6" />
        <circle className="twinkle" style={{ "--d": "0.6s" } as React.CSSProperties} cx="560" cy="150" r="1.3" />
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="hero" aria-label="HackIEEE 2026">
      <Backdrop />
      <div className="hero__scrim" />
      <Decorations />

      <div className="hero__content">
        <div className="hero__lift flex w-full flex-col items-center">
          <h1 className="w-full">
            <span className="sr-only">HackIEEE</span>
            <Wordmark />
          </h1>

          <p className="hero__tagline rise mt-9 md:mt-10" style={{ "--d": "1100ms" } as React.CSSProperties}>
            Build, stage and ship code that feels considered, from first draft to launch.
          </p>

          <div
            className="rise mt-9 flex w-full flex-col items-center gap-3 min-[360px]:w-auto min-[360px]:flex-row md:mt-11 md:gap-5"
            style={{ "--d": "1350ms" } as React.CSSProperties}
          >
            <SmoothLink href="#tracks" className="btn btn-sand w-full min-[360px]:w-auto">
              See our tracks <ArrowRight size={18} strokeWidth={1.75} />
            </SmoothLink>
            <SmoothLink href="#timeline" className="btn btn-ghost w-full min-[360px]:w-auto">
              Timeline <ArrowRight size={18} strokeWidth={1.75} />
            </SmoothLink>
          </div>
        </div>
      </div>

      <div className="hero__rail" aria-hidden="true">
        <svg width="7" height="7" viewBox="0 0 7 7"><circle cx="3.5" cy="3.5" r="2.5" fill="currentColor" /></svg>
        <span />
        <svg width="12" height="9" viewBox="0 0 12 9"><path d="M0 0h12L6 9z" fill="currentColor" /></svg>
      </div>

      <p className="hero__corner hero__corner--l rise" style={{ "--d": "1600ms" } as React.CSSProperties}>
        Nirma
        <br />
        University
      </p>
      <p className="hero__corner hero__corner--r rise" style={{ "--d": "1600ms" } as React.CSSProperties}>
        2026
      </p>
    </section>
  );
}
