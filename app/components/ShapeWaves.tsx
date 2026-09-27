"use client";

import { useEffect, useRef } from "react";
import { THEME_EVENT } from "./ThemeSwitch";

/* Shape Waves — a grid of squares/circles/triangles whose size follows a
   drifting sine field, like wind moving over sand. Pointer/touch leaves
   ripples and a hot zone. Colours come from --wave / --wave-hot. */
export default function ShapeWaves({ cell = 15, className = "" }: { cell?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv?.getContext("2d");
    const host = cv?.parentElement;
    if (!cv || !ctx || !host) return;
    // Listen on the whole section so content above the canvas still drives it.
    const input: HTMLElement = host.closest("section, main") ?? host;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cssVar = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

    let W = 0, H = 0, cols = 0, rows = 0;
    let hash: number[] = [];
    let col = { base: "#6d5236", hot: "#e2822f" };
    let ripples: { x: number; y: number; t: number }[] = [];
    const mouse = { x: -999, y: -999, in: false };
    let last = { x: -999, y: -999 };
    let visible = false;
    let raf = 0;

    const readColors = () => {
      col = { base: cssVar("--wave") || col.base, hot: cssVar("--wave-hot") || col.hot };
    };

    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const r = host.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / cell);
      rows = Math.ceil(H / cell);
      hash = Array.from({ length: cols * rows }, () => Math.random());
    };

    const draw = (now: number) => {
      const t = reduce ? 4 : now / 1000;
      ctx.clearRect(0, 0, W, H);
      ripples = ripples.filter((r) => (now - r.t) / 1000 < 3);

      for (const pass of [0, 1]) {
        ctx.fillStyle = pass ? col.hot : col.base;
        for (let j = 0; j < rows; j++) {
          const y = j * cell + cell / 2;
          for (let i = 0; i < cols; i++) {
            const x = i * cell + cell / 2;
            const h = hash[j * cols + i];
            const u = (x * 0.8 + y * 0.5) / 170;

            let v = 1 - Math.abs(Math.sin(u + 0.9 * Math.sin(y / 230 + t * 0.22) + t * 0.32));
            for (const r of ripples) {
              const age = (now - r.t) / 1000;
              const d = Math.hypot(x - r.x, y - r.y);
              const rad = age * 420;
              v += Math.exp(-((d - rad) ** 2) / (2 * 55 * 55)) * Math.exp(-age * 1.3) * 0.9;
            }
            v = Math.min(1, v);

            const dm = Math.hypot(x - mouse.x, y - mouse.y);
            const hot = mouse.in && dm < 110 ? 1 - dm / 110 : 0;
            if (pass === 0 && hot > 0.25) continue;
            if (pass === 1 && hot <= 0.25) continue;

            const s = cell * (0.1 + 0.9 * Math.pow(v, 1.7)) * (1 + hot * 0.35);
            ctx.globalAlpha = 0.18 + 0.82 * v;

            const k = Math.floor(h * 3);
            if (k === 0) {
              ctx.fillRect(x - s / 2, y - s / 2, s, s);
            } else if (k === 1) {
              ctx.beginPath();
              ctx.arc(x, y, s / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.beginPath();
              ctx.moveTo(x, y - s / 2);
              ctx.lineTo(x + s / 2, y + s / 2);
              ctx.lineTo(x - s / 2, y + s / 2);
              ctx.closePath();
              ctx.fill();
            }
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      if (!reduce) raf = requestAnimationFrame(loop);
    };

    const local = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => {
      const p = local(e);
      mouse.x = p.x;
      mouse.y = p.y;
      mouse.in = true;
      if (Math.hypot(mouse.x - last.x, mouse.y - last.y) > 90 && !reduce) {
        ripples.push({ ...p, t: performance.now() });
        last = p;
      }
    };
    const onLeave = () => (mouse.in = false);
    const onDown = (e: PointerEvent) => ripples.push({ ...local(e), t: performance.now() });
    const onResize = () => {
      size();
      draw(performance.now());
    };
    const onTheme = () => {
      readColors();
      draw(performance.now());
    };

    input.addEventListener("pointermove", onMove);
    input.addEventListener("pointerleave", onLeave);
    input.addEventListener("pointerdown", onDown);
    window.addEventListener(THEME_EVENT, onTheme);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting));
    io.observe(host);

    readColors();
    size();
    draw(performance.now());
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      input.removeEventListener("pointermove", onMove);
      input.removeEventListener("pointerleave", onLeave);
      input.removeEventListener("pointerdown", onDown);
      window.removeEventListener(THEME_EVENT, onTheme);
      ro.disconnect();
      io.disconnect();
    };
  }, [cell]);

  return (
    <div className={`waves ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
