"use client";

/* MorphSlider — from React Bits (reactbits.dev), ported to TypeScript.
   Local changes: controlled `activeIndex` / `onIndexChange`, jump straight to
   any slide (the original dots only stepped ±1), requests made mid-morph are
   queued, WebGL starts only when the slider nears the viewport and stops
   rendering while it is offscreen, and the palette follows the site theme. */

import { useCallback, useEffect, useRef, useState } from "react";
import { Mesh, Program, Renderer, Texture, Triangle } from "ogl";
import type { OGLRenderingContext } from "ogl";
import { gsap } from "gsap";

import "./MorphSlider.css";

const TRANSITIONS = { melt: 0, ripple: 1, shear: 2, swirl: 3 } as const;
export type MorphTransition = keyof typeof TRANSITIONS;
export type MorphItem = { image: string; caption?: string };

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D tCurrent;
uniform sampler2D tNext;
uniform vec2 uResolution;
uniform vec2 uCurrentSize;
uniform vec2 uNextSize;
uniform float uProgress;
uniform float uDir;
uniform int uMode;
uniform float uIntensity;
uniform float uScale;
uniform float uAberration;
uniform float uDrift;
uniform float uTime;
uniform float uReduce;
uniform vec2 uPointer;
uniform vec3 uOverlay;

varying vec2 vUv;

const float PI = 3.14159265359;

float hash11(float p) {
  p = fract(p * 0.1031);
  p *= p + 33.33;
  p *= p + p;
  return fract(p);
}

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

mat2 rot(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, -s, s, c);
}

vec2 coverUV(vec2 uv, vec2 res, vec2 img) {
  float rA = res.x / max(res.y, 1.0);
  float iA = img.x / max(img.y, 1.0);
  vec2 s = vec2(1.0);
  float ratio = rA / max(iA, 0.0001);
  if (ratio > 1.0) {
    s.y = 1.0 / ratio;
  } else {
    s.x = ratio;
  }
  return (uv - 0.5) * s + 0.5;
}

void main() {
  float p = clamp(uProgress, 0.0, 1.0);
  float env = sin(p * PI);

  vec2 uv = vUv;

  uv += vec2(sin(uTime * 0.25 + uv.y * 4.0), cos(uTime * 0.22 + uv.x * 4.0)) * uDrift * 0.008;
  uv = (uv - 0.5) * (1.0 - uDrift * 0.02 * sin(uTime * 0.4)) + 0.5;

  vec2 uvC = uv;
  vec2 uvN = uv;
  float m = smoothstep(0.0, 1.0, p);

  if (uReduce < 0.5) {
    if (uMode == 3) {
      vec2 c = uv - 0.5;
      float r = length(c);
      float ang = env * uIntensity * 3.5 * (1.0 - r);
      uvC = rot(ang) * c + 0.5;
      uvN = rot(-ang) * c + 0.5;
      m = smoothstep(0.0, 1.0, p);
    } else if (uMode == 1) {
      float d = distance(uv, uPointer);
      float ring = p * 1.6;
      float wave = sin((d - ring) * 30.0) * env;
      vec2 dir = normalize(uv - uPointer + 1e-4);
      vec2 disp = dir * wave * uIntensity * 0.25;
      uvC = uv + disp;
      uvN = uv + disp * 0.6;
      m = 1.0 - smoothstep(ring - 0.03, ring + 0.03, d);
    } else if (uMode == 2) {
      float slices = 14.0;
      float row = floor(uv.y * slices);
      float rnd = hash11(row);
      vec2 disp = vec2((rnd - 0.5) * env * uIntensity * 0.6, 0.0);
      uvC = uv + disp;
      uvN = uv + disp;
      float localX = uDir > 0.0 ? uv.x : 1.0 - uv.x;
      float th = p * 1.5 - 0.25 + (rnd - 0.5) * 0.25;
      m = 1.0 - smoothstep(th - 0.06, th + 0.06, localX);
    } else {
      float nn = fbm(uv * uScale + uTime * 0.03);
      float warp = fbm(uv * uScale * 1.7 - uTime * 0.02);
      vec2 g = vec2(nn, warp) - 0.5;
      uvC = uv + g * uIntensity * 0.5 * p;
      uvN = uv - g * uIntensity * 0.5 * (1.0 - p);
      m = smoothstep(nn - 0.15, nn + 0.15, p);
    }
  }

  vec2 sC = coverUV(uvC, uResolution, uCurrentSize);
  vec2 sN = coverUV(uvN, uResolution, uNextSize);

  float ca = uReduce < 0.5 ? uAberration * env * 0.03 : 0.0;

  vec3 colC = vec3(
    texture2D(tCurrent, sC + vec2(ca, 0.0)).r,
    texture2D(tCurrent, sC).g,
    texture2D(tCurrent, sC - vec2(ca, 0.0)).b
  );
  vec3 colN = vec3(
    texture2D(tNext, sN + vec2(ca, 0.0)).r,
    texture2D(tNext, sN).g,
    texture2D(tNext, sN - vec2(ca, 0.0)).b
  );

  vec3 col = mix(colC, colN, m);

  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col = mix(col, uOverlay, (1.0 - vig) * 0.28);

  gl_FragColor = vec4(col, 1.0);
}
`;

// Warm near-black placeholder while an image decodes.
function makeFallbackTexture(gl: OGLRenderingContext) {
  const size = 4;
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    data.set([26, 20, 14, 255], i * 4);
  }
  return new Texture(gl, { image: data, width: size, height: size, generateMipmaps: false });
}

function hexToRgb(hex: string): [number, number, number] {
  let h = (hex || "#000000").replace("#", "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

type EngineOptions = {
  transition: MorphTransition;
  duration: number;
  ease: string;
  intensity: number;
  scale: number;
  aberration: number;
  drift: number;
  overlayColor: string;
  loop: boolean;
};

class MorphEngine {
  private container: HTMLElement;
  private items: MorphItem[];
  private getOptions: () => EngineOptions;
  private onIndexChange: (i: number) => void;
  private reducedMotion: boolean;

  current: number;
  private animating = false;
  private dragging = false;
  private dragDir = 0;
  private shownIndex: number;
  private pending: number | null = null;
  private tween: gsap.core.Tween | null = null;
  private visible = true;
  private raf = 0;

  private renderer: Renderer;
  private gl: OGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private program: Program;
  private mesh: Mesh;
  private textures: Texture[];
  private sizes: [number, number][];
  private resizeObserver: ResizeObserver;

  constructor(
    container: HTMLElement,
    o: {
      items: MorphItem[];
      startIndex: number;
      reducedMotion: boolean;
      getOptions: () => EngineOptions;
      onIndexChange: (i: number) => void;
      dprCap: number;
    }
  ) {
    this.container = container;
    this.items = o.items;
    this.getOptions = o.getOptions;
    this.onIndexChange = o.onIndexChange;
    this.reducedMotion = o.reducedMotion;
    this.current = o.startIndex;
    this.shownIndex = o.startIndex;

    this.renderer = new Renderer({
      alpha: false,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, o.dprCap),
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0.1, 0.078, 0.055, 1);

    this.canvas = this.gl.canvas;
    this.canvas.className = "morph-slider-canvas";
    container.appendChild(this.canvas);

    this.textures = this.items.map(() => makeFallbackTexture(this.gl));
    this.sizes = this.items.map(() => [1, 1]);

    const opts = this.getOptions();
    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        tCurrent: { value: this.textures[this.current] },
        tNext: { value: this.textures[this.current] },
        uResolution: { value: [1, 1] },
        uCurrentSize: { value: this.sizes[this.current] },
        uNextSize: { value: this.sizes[this.current] },
        uProgress: { value: 0 },
        uDir: { value: 1 },
        uMode: { value: TRANSITIONS[opts.transition] ?? 0 },
        uIntensity: { value: opts.intensity },
        uScale: { value: opts.scale },
        uAberration: { value: opts.aberration },
        uDrift: { value: opts.drift },
        uTime: { value: 0 },
        uReduce: { value: this.reducedMotion ? 1 : 0 },
        uPointer: { value: [0.5, 0.5] },
        uOverlay: { value: hexToRgb(opts.overlayColor) },
      },
    });

    this.mesh = new Mesh(this.gl, { geometry: new Triangle(this.gl), program: this.program });

    this.canvas.addEventListener("webglcontextlost", this.onContextLost, false);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.resize();

    this.loadTextures();
    this.raf = requestAnimationFrame(this.loop);
  }

  private get u() {
    return this.program.uniforms;
  }

  private loadTextures() {
    this.items.forEach((item, index) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.src = item.image;
      img.onload = () => {
        const texture = new Texture(this.gl, { generateMipmaps: false });
        texture.image = img;
        this.textures[index] = texture;
        this.sizes[index] = [img.naturalWidth || 1, img.naturalHeight || 1];
        if (index === this.current) {
          this.u.tCurrent.value = texture;
          this.u.uCurrentSize.value = this.sizes[index];
        }
      };
    });
  }

  private resize() {
    const rect = this.container.getBoundingClientRect();
    this.renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1));
    this.u.uResolution.value = [this.gl.canvas.width, this.gl.canvas.height];
    if (!this.visible) this.renderer.render({ scene: this.mesh });
  }

  private syncOptions() {
    const opts = this.getOptions();
    this.u.uMode.value = TRANSITIONS[opts.transition] ?? 0;
    this.u.uIntensity.value = opts.intensity;
    this.u.uScale.value = opts.scale;
    this.u.uAberration.value = opts.aberration;
    this.u.uDrift.value = opts.drift;
    this.u.uOverlay.value = hexToRgb(opts.overlayColor);
  }

  private loop = (t: number) => {
    this.u.uTime.value = t * 0.001;
    if (!this.dragging && !this.animating) this.syncOptions();
    this.renderer.render({ scene: this.mesh });
    this.raf = this.visible ? requestAnimationFrame(this.loop) : 0;
  };

  /** Stop drawing frames while offscreen; resume when back. */
  setVisible(v: boolean) {
    if (v === this.visible) return;
    this.visible = v;
    if (v && !this.raf) this.raf = requestAnimationFrame(this.loop);
  }

  private wrap(i: number) {
    const n = this.items.length;
    return ((i % n) + n) % n;
  }

  private prepareNext(dir: number, target = this.wrap(this.current + dir)) {
    this.u.tCurrent.value = this.textures[this.current];
    this.u.uCurrentSize.value = this.sizes[this.current];
    this.u.tNext.value = this.textures[target];
    this.u.uNextSize.value = this.sizes[target];
    this.u.uDir.value = dir;
    return target;
  }

  goTo(dir: number) {
    const opts = this.getOptions();
    if (!opts.loop) {
      const raw = this.current + dir;
      if (raw < 0 || raw > this.items.length - 1) return;
    }
    this.goToIndex(this.wrap(this.current + dir), dir);
  }

  goToIndex(target: number, dir = target > this.current ? 1 : -1) {
    if (this.items.length < 2 || this.dragging) return;
    if (this.animating) {
      this.pending = target; // play it once the current morph lands
      return;
    }
    if (target === this.current) return;
    const opts = this.getOptions();
    this.syncOptions();
    this.prepareNext(dir, target);
    this.animating = true;
    this.announce(target);
    const duration = this.reducedMotion ? Math.min(opts.duration, 0.4) : opts.duration;
    this.tween = gsap.fromTo(
      this.u.uProgress,
      { value: 0 },
      { value: 1, duration, ease: opts.ease, onComplete: () => this.commit(target) }
    );
  }

  private announce(index: number) {
    if (index === this.shownIndex) return;
    this.shownIndex = index;
    this.onIndexChange(index);
  }

  private commit(target: number) {
    this.current = target;
    this.u.tCurrent.value = this.textures[target];
    this.u.uCurrentSize.value = this.sizes[target];
    this.u.uProgress.value = 0;
    this.animating = false;
    this.tween = null;
    this.announce(target);
    if (this.pending !== null) {
      const next = this.pending;
      this.pending = null;
      if (next !== this.current) this.goToIndex(next);
    }
  }

  next() {
    this.goTo(1);
  }

  prev() {
    this.goTo(-1);
  }

  setPointer(x: number, y: number) {
    this.u.uPointer.value = [x, y];
  }

  beginDrag() {
    if (this.animating || this.items.length < 2) return false;
    this.dragging = true;
    this.dragDir = 0;
    this.syncOptions();
    return true;
  }

  drag(ndx: number) {
    if (!this.dragging) return;
    const opts = this.getOptions();
    const dir = ndx < 0 ? 1 : -1;
    if (!opts.loop) {
      const raw = this.current + dir;
      if (raw < 0 || raw > this.items.length - 1) {
        this.u.uProgress.value = 0;
        return;
      }
    }
    if (dir !== this.dragDir) {
      this.dragDir = dir;
      this.prepareNext(dir);
    }
    const progress = Math.min(Math.abs(ndx), 1);
    this.u.uProgress.value = progress;
    this.announce(progress > 0.5 ? this.wrap(this.current + dir) : this.current);
  }

  endDrag() {
    if (!this.dragging) return;
    this.dragging = false;
    const p = this.u.uProgress.value as number;
    if (this.dragDir === 0) return;
    const target = this.wrap(this.current + this.dragDir);
    const duration = this.reducedMotion ? 0.3 : 0.5;
    this.animating = true;
    if (p > 0.4) {
      this.announce(target);
      this.tween = gsap.to(this.u.uProgress, {
        value: 1,
        duration,
        ease: "power2.out",
        onComplete: () => this.commit(target),
      });
    } else {
      this.announce(this.current);
      this.tween = gsap.to(this.u.uProgress, {
        value: 0,
        duration,
        ease: "power2.out",
        onComplete: () => {
          this.animating = false;
          this.tween = null;
        },
      });
    }
  }

  private onContextLost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(this.raf);
  };

  destroy() {
    cancelAnimationFrame(this.raf);
    this.tween?.kill();
    this.resizeObserver.disconnect();
    this.canvas.removeEventListener("webglcontextlost", this.onContextLost);
    this.textures.forEach((tex) => tex?.texture && this.gl.deleteTexture(tex.texture));
    if (this.program?.program) this.gl.deleteProgram(this.program.program);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.canvas.remove();
  }
}

type Props = {
  items: MorphItem[];
  startIndex?: number;
  /** Controlled slide index — changing it morphs to that slide. */
  activeIndex?: number;
  onIndexChange?: (index: number) => void;
  transition?: MorphTransition;
  duration?: number;
  ease?: string;
  intensity?: number;
  scale?: number;
  aberration?: number;
  drift?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  radius?: number;
  overlayColor?: string;
  showCaptions?: boolean;
  showControls?: boolean;
  showIndicators?: boolean;
  className?: string;
  label?: string;
};

export default function MorphSlider({
  items,
  startIndex = 0,
  activeIndex,
  onIndexChange,
  transition = "melt",
  duration = 1.1,
  ease = "power2.inOut",
  intensity = 0.55,
  scale = 2.4,
  aberration = 0.35,
  drift = 0.4,
  autoplay = false,
  autoplayDelay = 4,
  loop = true,
  radius = 16,
  overlayColor = "#000000",
  showCaptions = true,
  showControls = true,
  showIndicators = true,
  className = "",
  label = "Image morph slider",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<MorphEngine | null>(null);
  const [index, setIndex] = useState(startIndex);
  const [hovering, setHovering] = useState(false);
  const [near, setNear] = useState(false);

  const onIndexChangeRef = useRef(onIndexChange);
  const optsRef = useRef<EngineOptions>({ transition, duration, ease, intensity, scale, aberration, drift, overlayColor, loop });
  useEffect(() => {
    optsRef.current = { transition, duration, ease, intensity, scale, aberration, drift, overlayColor, loop };
    onIndexChangeRef.current = onIndexChange;
  });

  /* Defer WebGL until the slider is close to the viewport, then pause it offscreen. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        engineRef.current?.setVisible(e.isIntersecting);
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !containerRef.current) return;
    const engine = new MorphEngine(containerRef.current, {
      items,
      startIndex,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      dprCap: 2,
      getOptions: () => optsRef.current,
      onIndexChange: (i) => {
        setIndex(i);
        onIndexChangeRef.current?.(i);
      },
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [near, items, startIndex]);

  /* Controlled mode: follow activeIndex from the parent. */
  useEffect(() => {
    if (activeIndex === undefined) return;
    engineRef.current?.goToIndex(activeIndex);
  }, [activeIndex]);

  const handleNext = useCallback(() => engineRef.current?.next(), []);
  const handlePrev = useCallback(() => engineRef.current?.prev(), []);

  useEffect(() => {
    if (!autoplay || hovering) return;
    const id = setTimeout(() => engineRef.current?.next(), Math.max(autoplayDelay, 1) * 1000);
    return () => clearTimeout(id);
  }, [autoplay, autoplayDelay, hovering, index]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let width = 1;
    let active = false;

    const onDown = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      width = rect.width || 1;
      startX = e.clientX;
      engineRef.current?.setPointer((e.clientX - rect.left) / rect.width, 1 - (e.clientY - rect.top) / rect.height);
      active = engineRef.current?.beginDrag() ?? false;
      if (active) {
        try {
          el.setPointerCapture(e.pointerId);
        } catch {}
      }
    };
    const onMove = (e: PointerEvent) => {
      if (active) engineRef.current?.drag((e.clientX - startX) / width);
    };
    const onUp = () => {
      if (!active) return;
      active = false;
      engineRef.current?.endDrag();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  const hasCaptions = items.some((item) => item.caption);

  return (
    <div
      ref={rootRef}
      className={`morph-slider ${className}`.trim()}
      style={
        {
          borderRadius: `${radius}px`,
          "--ms-swap": `${(duration * 0.66).toFixed(3)}s`,
          "--ms-dot": `${(duration * 0.45).toFixed(3)}s`,
        } as React.CSSProperties
      }
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        ref={containerRef}
        className="morph-slider-stage"
        role="group"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onKeyDown={onKeyDown}
      />

      {showCaptions && hasCaptions && (
        <div className="morph-slider-caption" aria-live="polite">
          {items.map((item, i) =>
            item.caption ? (
              <span
                key={i}
                aria-hidden={i === index ? undefined : true}
                className={`morph-slider-caption-text ${i === index ? "is-active" : ""}`}
              >
                {item.caption}
              </span>
            ) : null
          )}
        </div>
      )}

      {showControls && (
        <div className="morph-slider-controls">
          <button type="button" className="morph-slider-btn" aria-label="Previous slide" onClick={handlePrev}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button type="button" className="morph-slider-btn" aria-label="Next slide" onClick={handleNext}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}

      {showIndicators && (
        <div className="morph-slider-indicators" role="tablist" aria-label="Slides">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Go to slide ${i + 1}`}
              className={`morph-slider-dot ${i === index ? "is-active" : ""}`}
              onClick={() => engineRef.current?.goToIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
