import Image, { getImageProps } from "next/image";
import { ArrowRight } from "lucide-react";
import HeroTitle from "./HeroTitle";
import SmoothLink from "./SmoothLink";
import { showKiroCollaboration } from "../flags";

/* The Kiro logo exactly as supplied: its intrinsic size sets the aspect ratio,
   CSS sets only the height (.hero-collab__logo). */
const KIRO_LOGO = { src: "/collab/kiro-logo.svg", width: 1200, height: 1200 };

function Backdrop() {
  const common = { alt: "", sizes: "100vw", quality: 80 };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...common, width: 1600, height: 900, src: "/hero/dunes-desktop.webp" });
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({ ...common, width: 900, height: 1600, src: "/hero/dunes-mobile.webp" });

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
      <g fill="#fbe2bd">
        <circle className="twinkle" style={{ "--d": "1.2s" } as React.CSSProperties} cx="136" cy="318" r="2" />
        <circle className="twinkle" style={{ "--d": "2.4s" } as React.CSSProperties} cx="36" cy="240" r="1.4" />
        <circle className="twinkle" style={{ "--d": "3.1s" } as React.CSSProperties} cx="1420" cy="120" r="1.6" />
        <circle className="twinkle" style={{ "--d": "0.6s" } as React.CSSProperties} cx="560" cy="150" r="1.3" />
      </g>
    </svg>
  );
}

export default async function Hero() {
  let showCollaboration = false;
  if (process.env.SHOW_KIRO_COLLABORATION === "false") {
    showCollaboration = false;
  } else if (process.env.SHOW_KIRO_COLLABORATION === "true") {
    showCollaboration = true;
  } else {
    try {
      showCollaboration = Boolean(await showKiroCollaboration());
    } catch {
      showCollaboration = false;
    }
  }
  const currentYear = new Date().getFullYear();
  return (
    <section id="top" className="hero" aria-label={`hackieee ${currentYear}`}>
      <Backdrop />
      <div className="hero__scrim" />
      <Decorations />

      <div className="hero__content">
        <div className={`hero__lift flex w-full flex-col items-center ${!showCollaboration ? "-mt-8 md:-mt-14" : ""}`}>
          {showCollaboration && (
            /* Kiro stands alone: its own block, never beside another logo. */
          <div className="hero-collab rise" style={{ "--d": "200ms" } as React.CSSProperties}>
            <p className="hero-collab__label">In Collaboration With</p>
            <Image
              src={KIRO_LOGO.src}
              alt="Kiro"
              width={KIRO_LOGO.width}
              height={KIRO_LOGO.height}
              unoptimized
              loading="eager"
              className="hero-collab__logo"
            />
          </div>
          )}

          <h1 className="w-full">
            <span className="sr-only">hackieee</span>
            <HeroTitle />
          </h1>

          <p className="hero__tagline rise mt-9 md:mt-10" style={{ "--d": "1100ms" } as React.CSSProperties}>
            Build, stage and ship code that feels considered, from first draft to launch.
          </p>

          <div
            className="rise mt-9 flex w-full flex-col items-center gap-3 min-[360px]:w-auto min-[360px]:flex-row md:mt-11 md:gap-5"
            style={{ "--d": "1350ms" } as React.CSSProperties}
          >
            <SmoothLink href="#tracks" className="btn btn-sand w-full min-[360px]:w-auto">
              Tracks & Challenges <ArrowRight size={18} strokeWidth={1.75} />
            </SmoothLink>
            <SmoothLink href="#timeline" className="btn btn-ghost w-full min-[360px]:w-auto">
              Timeline <ArrowRight size={18} strokeWidth={1.75} />
            </SmoothLink>
          </div>
        </div>
      </div>



      <p className="hero__corner hero__corner--l rise" style={{ "--d": "1600ms" } as React.CSSProperties}>
        Nirma
        <br />
        University
      </p>
      <p className="hero__corner hero__corner--r rise" style={{ "--d": "1600ms" } as React.CSSProperties}>
        {currentYear}
      </p>
    </section>
  );
}
