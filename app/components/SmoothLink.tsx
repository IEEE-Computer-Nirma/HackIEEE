"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollToPlugin);
}

/* Scrolls smoothly to "#id" (or "/#id") when the target is on this page;
   otherwise behaves as a normal link so cross-page hashes still work. */
export function smoothScrollTo(target: string) {
  // "/#x" only means "this page" when we are already on the home page.
  if (target.startsWith("/") && window.location.pathname !== "/") return false;
  const id = target.replace(/^\//, "");
  if (id === "#" || id === "") {
    gsap.to(window, { duration: 1.2, scrollTo: { y: 0 }, ease: "power3.inOut" });
    window.history.pushState(null, "", window.location.pathname);
    return true;
  }
  if (!document.querySelector(id)) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.to(window, {
    duration: reduce ? 0 : 1.2,
    scrollTo: { y: id, offsetY: 0 },
    ease: "power3.inOut",
  });
  window.history.pushState(null, "", id);
  return true;
}

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function SmoothLink({ href, onClick, children, ...rest }: Props) {
  if (!href.includes("#")) {
    return (
      <Link href={href} onClick={onClick} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (smoothScrollTo(href)) e.preventDefault();
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
