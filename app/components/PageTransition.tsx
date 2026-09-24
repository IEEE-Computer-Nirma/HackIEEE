"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

type Phase = "idle" | "covering" | "waiting" | "revealing";

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const veilRef = useRef<HTMLDivElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);

  const phaseRef = useRef<Phase>("idle");
  const pendingRef = useRef<string | null>(null);
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealRef = useRef<(() => void) | null>(null);
  const pulseRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const veil = veilRef.current;
    const mark = markRef.current;
    if (!root || !veil || !mark) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const push = router.push as (href: string) => void;

    const settle = () => {
      phaseRef.current = "idle";
      pendingRef.current = null;
      root.classList.remove("is-active");
    };

    const reveal = () => {
      phaseRef.current = "revealing";
      pulseRef.current?.kill();
      pulseRef.current = null;

      const timeline = gsap.timeline({ onComplete: settle });
      timeline
        .to(mark, { opacity: 0, scale: 1.15, duration: 0.4, ease: "power2.in" }, 0)
        .to(veil, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0.15);

      const main = document.querySelector("main");
      if (main) {
        timeline.fromTo(
          main,
          { y: 36 },
          { y: 0, duration: 0.95, ease: "power3.out", clearProps: "transform" },
          0.2
        );
      }
    };

    revealRef.current = reveal;

    const cover = (href: string) => {
      phaseRef.current = "covering";
      pendingRef.current = href;
      root.classList.add("is-active");

      gsap.set(veil, { opacity: 0 });
      gsap.set(mark, { opacity: 0, scale: 0.7 });

      gsap
        .timeline({
          onComplete: () => {
            phaseRef.current = "waiting";
            pulseRef.current = gsap.to(mark, {
              scale: 1.04,
              duration: 1.1,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
            window.scrollTo(0, 0);
            push(href);

            failsafeRef.current = setTimeout(() => {
              if (phaseRef.current === "waiting") reveal();
            }, 4000);
          },
        })
        .to(veil, { opacity: 1, duration: 0.45, ease: "power2.out" })
        .to(mark, { opacity: 1, scale: 1, duration: 0.55, ease: "power3.out" }, "-=0.25");
    };

    const onCapture = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.dataset.noTransition !== undefined) return;

      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      if (reduced.matches) return;
      if (phaseRef.current !== "idle") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      cover(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onCapture, true);
    return () => {
      document.removeEventListener("click", onCapture, true);
      pulseRef.current?.kill();
      revealRef.current = null;
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
    };
  }, [router]);

  useEffect(() => {
    if (phaseRef.current !== "waiting") return;
    if (failsafeRef.current) clearTimeout(failsafeRef.current);
    const id = setTimeout(() => revealRef.current?.(), 160);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div ref={rootRef} className="page-curtain" aria-hidden="true">
      <div ref={veilRef} className="page-curtain__veil" />
      <div ref={markRef} className="page-curtain__mark">
        <div className="page-curtain__orbit" />
        <div className="eclipse page-curtain__planet" />
        <span className="page-curtain__label">HACKIEEE</span>
      </div>
    </div>
  );
}
