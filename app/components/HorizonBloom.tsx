"use client";

import React, {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useSyncExternalStore,
  CSSProperties,
  ReactNode,
} from "react";
import * as THREE from "three";

export interface HorizonBloomProps {
  colors?: [string, string];
  backgroundColor?: string;
  horizon?: number;
  curvature?: number;
  tilt?: number;
  sunPosition?: number;
  sunrise?: number;
  spread?: number;
  atmosphere?: number;
  thickness?: number;
  rim?: number;
  flare?: number;
  airglow?: number;
  clouds?: number;
  stars?: number;
  aurora?: number;
  autoAurora?: boolean;
  speed?: number;
  drift?: number;
  parallax?: number;
  bloom?: number;
  grain?: number;
  interactive?: boolean;
  intro?: boolean;
  paused?: boolean;
  dpr?: number;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface HorizonBloomHandle {
  bloom: (position?: number, strength?: number) => void;
  replay: () => void;
}

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
const num = (val: number | undefined, fallback: number) => (Number.isFinite(val) ? (val as number) : fallback);

const tempColor = new THREE.Color();
function parseColor(str: string): [number, number, number] | null {
  const t = str.trim().toLowerCase();
  if (!t || t === "transparent" || t === "none" || t === "auto") return null;
  try {
    tempColor.setStyle(t, THREE.SRGBColorSpace);
    return [tempColor.r, tempColor.g, tempColor.b];
  } catch {
    return null;
  }
}

const toLinear = (e: number) => (e <= 0.04045 ? e / 12.92 : Math.pow((e + 0.055) / 1.055, 2.4));
const toSrgb = (e: number) => (e <= 0.0031308 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - 0.055);

function srgbToOklab([r, g, b]: [number, number, number]): [number, number, number] {
  const a = toLinear(r),
    o = toLinear(g),
    n = toLinear(b);
  const i = Math.cbrt(0.4122214708 * a + 0.5363325363 * o + 0.0514459929 * n);
  const l = Math.cbrt(0.2119034982 * a + 0.6806995451 * o + 0.1073969566 * n);
  const u = Math.cbrt(0.0883024619 * a + 0.2817188376 * o + 0.6299787005 * n);
  return [
    0.2104542553 * i + 0.793617785 * l - 0.0040720468 * u,
    1.9779984951 * i - 2.428592205 * l + 0.4505937099 * u,
    0.0259040371 * i + 0.7827717662 * l - 0.808675766 * u,
  ];
}

function oklabToSrgb([L, a, b]: [number, number, number]): [number, number, number] {
  const o = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const n = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const i = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  return [
    clamp(toSrgb(4.0767416621 * o - 3.3077115913 * n + 0.2309699292 * i), 0, 1),
    clamp(toSrgb(-1.2684380046 * o + 2.6097574011 * n - 0.3413193965 * i), 0, 1),
    clamp(toSrgb(-0.0041960863 * o - 0.7034186147 * n + 1.707614701 * i), 0, 1),
  ];
}

const lerp3 = (
  e: [number, number, number],
  t: [number, number, number],
  r: number
): [number, number, number] => [
  e[0] + (t[0] - e[0]) * r,
  e[1] + (t[1] - e[1]) * r,
  e[2] + (t[2] - e[2]) * r,
];

const subscribeReducedMotion = (callback: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
};
const getReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const SCENE_FRAGMENT_SHADER = `
uniform vec2 uRes;
uniform float uTime;
uniform float uRoll;
uniform float uApex;
uniform float uRadius;
uniform float uSunArc;
uniform float uSpread;
uniform float uSunUp;
uniform float uAtmo;
uniform float uThick;
uniform float uRimGain;
uniform float uFlare;
uniform float uAirglow;
uniform float uClouds;
uniform float uStars;
uniform float uAuroraGain;
uniform vec4 uAuroras[8];
uniform float uInk;
uniform vec3 uRimColor;
uniform vec3 uInner;
uniform vec3 uMid;
uniform vec3 uOuter;
uniform vec3 uGlowColor;
uniform vec3 uSunColor;
uniform vec3 uStarColor;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

vec3 starField(vec2 p) {
  vec3 c = vec3(0.0);
  for (int k = 0; k < 2; k++) {
    float scale = k == 0 ? 70.0 : 130.0;
    vec2 g = p * scale + float(k) * 17.3;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash(id);
    vec2 offset = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float twinkle = 0.6 + 0.4 * sin(uTime * (1.0 + 3.0 * hash(id + 1.3)) + h * 50.0);
    float b = pow(h, 30.0) * twinkle;
    float d = length(f - offset * 0.7);
    c += uStarColor * b * exp(-d * d * 300.0) * (k == 0 ? 0.9 : 0.45);
  }
  return c;
}

void main() {
  vec2 frag = vUv * uRes;
  vec2 screen = (frag - 0.5 * uRes) / uRes.y;
  float cr = cos(uRoll);
  float sr = sin(uRoll);
  vec2 p = mat2(cr, -sr, sr, cr) * screen;
  float px = 1.0 / uRes.y;
  vec2 center = vec2(0.0, uApex - uRadius);
  vec2 q = p - center;
  float h = length(q) - uRadius;
  float arc = atan(q.x, q.y) * uRadius;
  float d = arc - uSunArc;
  float lit = exp(-d * d / (2.0 * uSpread * uSpread));
  float wide = exp(-d * d / (10.0 * uSpread * uSpread));
  float hot = exp(-d * d / (2.0 * 0.034 * 0.034));
  float halo = exp(-d * d / (2.0 * 0.17 * 0.17));
  float thick = uThick;
  float sunk = 1.0 - 0.8 * uInk;
  vec3 col = vec3(0.0);
  if (h > 0.0) {
    float rim = exp(-h / max(0.0012, px * 0.9));
    float inner = exp(-h / (0.007 * thick));
    float mid = exp(-h / (0.024 * thick));
    float outer = exp(-h / (0.07 * thick));
    col += lit * (rim * uRimColor * 2.2 * uRimGain + inner * uInner * 0.7 * uAtmo);
    col += wide * (mid * uMid * 0.2 + outer * uOuter * 0.055) * uAtmo;
    float layer = h - 0.042 * thick;
    float band = exp(-layer * layer / (0.00005 * thick * thick));
    if (uAirglow > 0.0 && band > 0.0001) {
      band *= 0.35 + 0.65 * fbm(vec2(arc * 9.0 - uTime * 0.04, uTime * 0.02));
      col += band * uGlowColor * 0.05 * (0.2 + 0.8 * wide) * uAirglow;
    }
    col += sunk * hot * uSunUp * (exp(-h / 0.003) * uSunColor * 4.0 + exp(-h / (0.016 * thick)) * uInner * 0.7);
    col += halo * uSunUp * (exp(-h / (0.045 * thick)) * uInner * 0.2 + exp(-h / (0.12 * thick)) * uMid * 0.06) * uAtmo;
    if (uStars > 0.0 && uInk < 0.5) col += starField(p) * smoothstep(0.04, 0.2, h) * (1.0 - 0.8 * wide) * uStars;
  } else {
    col += lit * exp(h / max(0.0008, px * 0.6)) * uRimColor * 1.1 * uRimGain;
    col += sunk * hot * uSunUp * exp(h / 0.005) * uMid * 0.3;
    if (uClouds > 0.0 && h > -0.12) {
      float tops = fbm(vec2(arc * 22.0 + uTime * 0.01, h * 160.0 + arc * 6.0));
      float catchLight = smoothstep(0.52, 0.78, tops) * exp(h / 0.018) * smoothstep(-0.12, -0.07, h) * lit;
      col += catchLight * mix(uMid, uInner, halo) * 0.14 * uClouds * uSunUp;
    }
  }
  vec2 sun = center + uRadius * vec2(sin(uSunArc / uRadius), cos(uSunArc / uRadius));
  float rs = length(p - sun);
  float crest = smoothstep(-0.0015, 0.0015, h);
  col += uSunUp * uSunUp * uFlare * sunk * (exp(-rs / 0.005) * uSunColor * 2.0 * crest + exp(-rs / 0.05) * uInner * 0.07);
  if (h > 0.0 && h < 0.42) {
    for (int i = 0; i < 8; i++) {
      vec4 aurora = uAuroras[i];
      if (aurora.z <= 0.0) continue;
      float age = aurora.y;
      float width = 0.09 + 0.12 * smoothstep(0.0, 2.5, age);
      float dc = arc - aurora.x;
      if (abs(dc) > width * 3.0) continue;
      float span = max(exp(-dc * dc / (2.0 * width * width)) - 0.0111, 0.0) / 0.9889;
      float envelope = smoothstep(0.0, 1.4, age) * (1.0 - smoothstep(2.6, 6.6, age)) * aurora.z;
      float drift = uTime * 0.03 + aurora.w;
      float fine = noise(vec2(arc * 140.0 + drift * 5.0, aurora.w + age * 0.15));
      float fold = noise(vec2(arc * 30.0 - drift * 2.0, aurora.w + 4.0));
      float rays = (0.2 + 0.8 * fine * fine) * (0.45 + 0.55 * fold);
      float reach = (0.04 + 0.08 * noise(vec2(arc * 46.0 + aurora.w * 3.0, drift * 0.5))) * (0.5 + 0.5 * smoothstep(0.0, 2.2, age));
      float base = 0.007 + 0.004 * fold;
      float lower = smoothstep(base * 0.4, base + 0.006, h);
      float y = max(h - base, 0.0);
      float body = exp(-y / reach) * (1.0 - smoothstep(0.12, 0.38, h));
      float glow = exp(-y / 0.02) * 0.2;
      vec3 tint = mix(uInner, uMid, smoothstep(0.0, 0.05, y));
      tint = mix(tint, uOuter, smoothstep(0.05, 0.16, y));
      col += span * lower * (body * rays + glow * (0.5 + 0.5 * fold)) * envelope * tint * 0.9 * uAuroraGain;
    }
  }
  if (uInk > 0.5) {
    float peak = max(col.r, max(col.g, col.b));
    float alpha = 1.0 - exp(-peak * 1.5);
    gl_FragColor = vec4(col / max(peak, 0.0001) * alpha, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

const DOWNSAMPLE_FRAGMENT_SHADER = `
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uThreshold;
varying vec2 vUv;
vec3 tap(vec2 d) {
  vec3 c = texture2D(uSource, vUv + d * uTexel).rgb;
  float peak = max(c.r, max(c.g, c.b));
  return c * (max(peak - uThreshold, 0.0) / max(peak, 0.0001));
}
void main() {
  vec3 a = tap(vec2(-2.0, 2.0));
  vec3 b = tap(vec2(0.0, 2.0));
  vec3 c = tap(vec2(2.0, 2.0));
  vec3 d = tap(vec2(-2.0, 0.0));
  vec3 e = tap(vec2(0.0, 0.0));
  vec3 f = tap(vec2(2.0, 0.0));
  vec3 g = tap(vec2(-2.0, -2.0));
  vec3 h = tap(vec2(0.0, -2.0));
  vec3 i = tap(vec2(2.0, -2.0));
  vec3 j = tap(vec2(-1.0, 1.0));
  vec3 k = tap(vec2(1.0, 1.0));
  vec3 l = tap(vec2(-1.0, -1.0));
  vec3 m = tap(vec2(1.0, -1.0));
  vec3 color = e * 0.125 + (a + c + g + i) * 0.03125 + (b + d + f + h) * 0.0625 + (j + k + l + m) * 0.125;
  gl_FragColor = vec4(color, 1.0);
}
`;

const UPSAMPLE_FRAGMENT_SHADER = `
uniform sampler2D uSource;
uniform vec2 uTexel;
varying vec2 vUv;
vec3 tap(vec2 d) { return texture2D(uSource, vUv + d * uTexel).rgb; }
void main() {
  vec3 color = tap(vec2(0.0)) * 4.0
    + (tap(vec2(-1.0, 0.0)) + tap(vec2(1.0, 0.0)) + tap(vec2(0.0, -1.0)) + tap(vec2(0.0, 1.0))) * 2.0
    + tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0));
  gl_FragColor = vec4(color / 16.0, 1.0);
}
`;

const COMPOSITE_FRAGMENT_SHADER = `
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform vec2 uResolution;
uniform float uBloomStrength;
uniform float uGrain;
uniform float uTime;
uniform float uInk;
varying vec2 vUv;

vec3 neutral(vec3 color) {
  const float start = 0.76;
  const float desaturation = 0.15;
  float x = min(color.r, min(color.g, color.b));
  float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
  color -= offset;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < start) return color;
  const float d = 1.0 - start;
  float next = 1.0 - d * d / (peak + d - start);
  color *= next / peak;
  float g = 1.0 - 1.0 / (desaturation * (peak - next) + 1.0);
  return mix(color, vec3(next), g);
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  float n = hash(gl_FragCoord.xy + fract(uTime * 13.0) * 911.0) - 0.5;
  if (uInk > 0.5) {
    vec4 scene = texture2D(uScene, vUv);
    float cover = clamp(scene.a, 0.0, 1.0);
    vec3 ink = scene.rgb / max(scene.a, 0.0001);
    vec3 color = mix(uBackground, ink, cover);
    color += n * uGrain * 0.05 * smoothstep(0.0, 0.05, cover);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    return;
  }
  vec2 c = vUv - 0.5;
  vec2 shift = c * 1.2 / uResolution.y;
  vec3 emission;
  emission.r = texture2D(uScene, vUv + shift).r;
  emission.g = texture2D(uScene, vUv).g;
  emission.b = texture2D(uScene, vUv - shift).b;
  emission += texture2D(uBloom, vUv).rgb * uBloomStrength;
  vec3 light = neutral(max(emission, 0.0));
  light = pow(light, vec3(1.0 / 2.2));
  vec3 color = 1.0 - (1.0 - uBackground) * (1.0 - light);
  float l = max(light.r, max(light.g, light.b));
  float mask = smoothstep(0.0, 0.04, l);
  color += n * uGrain * 0.1 * mask;
  color += (hash(gl_FragCoord.xy * 1.7) - 0.5) / 255.0 * mask;
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

interface AuroraItem {
  arc: number;
  born: number;
  strength: number;
  seed: number;
  dying: number;
}

const HorizonBloom = forwardRef<HorizonBloomHandle, HorizonBloomProps>(function HorizonBloom(
  {
    colors = ["#FF9FFC", "#5227FF"],
    backgroundColor = "transparent",
    horizon = 0.72,
    curvature = 1,
    tilt = 0,
    sunPosition = 0.15,
    sunrise = 1,
    spread = 0.4,
    atmosphere = 1,
    thickness = 1,
    rim = 1,
    flare = 1,
    airglow = 0.5,
    clouds = 0.5,
    stars = 0.5,
    aurora = 1,
    autoAurora = false,
    speed = 0.5,
    drift = 0.5,
    parallax = 0.5,
    bloom = 0.5,
    grain = 0.25,
    interactive = true,
    intro = true,
    paused = false,
    dpr = 2,
    children,
    className,
    style,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<{
    sync: () => void;
    bloom: (pos?: number, strength?: number) => void;
    replay: () => void;
    destroy: () => void;
  } | null>(null);

  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false);

  const propsRef = useRef({
    colors,
    backgroundColor,
    horizon,
    curvature,
    tilt,
    sunPosition,
    sunrise,
    spread,
    atmosphere,
    thickness,
    rim,
    flare,
    airglow,
    clouds,
    stars,
    aurora,
    autoAurora,
    speed,
    drift,
    parallax,
    bloom,
    grain,
    interactive,
    intro,
    paused,
    dpr,
    reduced: reducedMotion,
  });

  useEffect(() => {
    propsRef.current = {
      colors,
      backgroundColor,
      horizon,
      curvature,
      tilt,
      sunPosition,
      sunrise,
      spread,
      atmosphere,
      thickness,
      rim,
      flare,
      airglow,
      clouds,
      stars,
      aurora,
      autoAurora,
      speed,
      drift,
      parallax,
      bloom,
      grain,
      interactive,
      intro,
      paused,
      dpr,
      reduced: reducedMotion,
    };
    instanceRef.current?.sync();
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvasMount = canvasMountRef.current;
    if (!container || !canvasMount) return;

    let renderer: THREE.WebGLRenderer;
    const doc = container.ownerDocument;
    const win = doc.defaultView ?? window;
    const canvas = doc.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    canvasMount.appendChild(canvas);
    renderer.autoClear = false;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    const quadGeometry = new THREE.PlaneGeometry(2, 2);
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(quadGeometry);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const makeColorVector = () => ({ value: new THREE.Vector3(1, 1, 1) });
    const auroraVectors = Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, 0, 0));

    const sceneMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uRoll: { value: 0 },
        uApex: { value: -0.22 },
        uRadius: { value: 2.4 },
        uSunArc: { value: 0.2 },
        uSpread: { value: 0.6 },
        uSunUp: { value: 1 },
        uAtmo: { value: 1 },
        uThick: { value: 1 },
        uRimGain: { value: 1 },
        uFlare: { value: 1 },
        uAirglow: { value: 0.5 },
        uClouds: { value: 0.5 },
        uStars: { value: 0.5 },
        uAuroraGain: { value: 1 },
        uAuroras: { value: auroraVectors },
        uInk: { value: 0 },
        uRimColor: makeColorVector(),
        uInner: makeColorVector(),
        uMid: makeColorVector(),
        uOuter: makeColorVector(),
        uGlowColor: makeColorVector(),
        uSunColor: makeColorVector(),
        uStarColor: makeColorVector(),
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: SCENE_FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
    });

    const createTarget = () =>
      new THREE.WebGLRenderTarget(1, 1, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        depthBuffer: false,
        stencilBuffer: false,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        generateMipmaps: false,
      });

    const sceneTarget = createTarget();
    const bloomPyramid = Array.from({ length: 5 }, createTarget);
    const backgroundColorVec = new THREE.Vector3(0.04, 0.04, 0.04);

    const downsampleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uSource: { value: null },
        uTexel: { value: new THREE.Vector2() },
        uThreshold: { value: 0 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: DOWNSAMPLE_FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
    });

    const upsampleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uSource: { value: null },
        uTexel: { value: new THREE.Vector2() },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: UPSAMPLE_FRAGMENT_SHADER,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const compositeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uScene: { value: sceneTarget.texture },
        uBloom: { value: bloomPyramid[0].texture },
        uBackground: { value: backgroundColorVec },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uBloomStrength: { value: 0.5 },
        uGrain: { value: 0.25 },
        uTime: { value: 0 },
        uInk: { value: 0 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: COMPOSITE_FRAGMENT_SHADER,
      depthTest: false,
      depthWrite: false,
    });

    let clientWidth = 0;
    let clientHeight = 0;
    let activeDpr = 1;
    let hasSize = false;
    let colorSignature = "";
    let isLightBg = false;
    let parsedBg: [number, number, number] = [0.04, 0.04, 0.04];
    let lastColorSync = -10;
    let simTime = 0;
    let wallTime = 0;
    let introStartTime = -1;
    let introProgress = 1;
    let rollTarget = 0;
    let rollCurrent = 0;
    let apexTarget = 0;
    let apexCurrent = 0;
    let nextAuroraTime = 4;
    let lcgSeed = 11;
    let animFrameId = 0;
    let lastFrameTimestamp = 0;
    let isIntersecting = false;
    let isDestroyed = false;
    let isContextLost = false;
    const auroras: AuroraItem[] = [];

    const random = () => {
      lcgSeed = (16807 * lcgSeed) % 2147483647;
      return (lcgSeed - 1) / 2147483646;
    };

    const setUniformColor = (uniformName: string, rgb: [number, number, number]) => {
      const u = sceneMaterial.uniforms[uniformName].value as THREE.Vector3;
      if (isLightBg) {
        u.set(rgb[0], rgb[1], rgb[2]);
      } else {
        u.set(toLinear(rgb[0]), toLinear(rgb[1]), toLinear(rgb[2]));
      }
    };

    const updateColors = () => {
      const p = propsRef.current;
      const detectedBg =
        parseColor(p.backgroundColor) ??
        (() => {
          let el: HTMLElement | null = container.parentElement;
          while (el) {
            const m = win.getComputedStyle(el).backgroundColor.match(/rgba?\(([^)]+)\)/);
            if (m) {
              const parts = m[1].split(",").map((v) => Number.parseFloat(v));
              if (parts.length < 4 || parts[3] > 0.05) {
                return [parts[0] / 255, parts[1] / 255, parts[2] / 255] as [number, number, number];
              }
            }
            el = el.parentElement;
          }
          return [0.04, 0.04, 0.04] as [number, number, number];
        })();

      parsedBg = detectedBg;
      const sig = [parsedBg.join(","), p.colors[0], p.colors[1]].join("|");
      if (sig === colorSignature) return;
      colorSignature = sig;

      isLightBg = 0.2126 * parsedBg[0] + 0.7152 * parsedBg[1] + 0.0722 * parsedBg[2] > 0.55;
      backgroundColorVec.set(parsedBg[0], parsedBg[1], parsedBg[2]);

      const c0 = srgbToOklab(parseColor(p.colors[0]) ?? [1, 0.62, 0.99]);
      const c1 = srgbToOklab(parseColor(p.colors[1]) ?? [0.32, 0.15, 1]);

      const boost = (color: [number, number, number], targetL: number): [number, number, number] => {
        const chroma = Math.hypot(color[1], color[2]);
        if (chroma < 0.02) return [0.8 * targetL, 0, 0];
        const scale = Math.max(1, 0.15 / chroma);
        return [targetL, color[1] * scale, color[2] * scale];
      };

      const midLab = lerp3(c0, c1, 0.55);
      const glowLab = lerp3(c0, c1, 0.35);
      const tint = (
        base: [number, number, number],
        minL: number,
        chromaScale: number
      ): [number, number, number] => [Math.max(base[0], minL), base[1] * chromaScale, base[2] * chromaScale];

      if (isLightBg) {
        setUniformColor("uRimColor", oklabToSrgb(boost(lerp3(c0, c1, 0.7), 0.42)));
        setUniformColor("uInner", oklabToSrgb(boost(c0, 0.62)));
        setUniformColor("uMid", oklabToSrgb(boost(midLab, 0.55)));
        setUniformColor("uOuter", oklabToSrgb(boost(c1, 0.5)));
        setUniformColor("uGlowColor", oklabToSrgb(boost(glowLab, 0.58)));
        setUniformColor("uSunColor", oklabToSrgb(boost(lerp3(c0, c1, 0.5), 0.48)));
        setUniformColor("uStarColor", oklabToSrgb(boost(c1, 0.5)));
      } else {
        setUniformColor("uRimColor", oklabToSrgb(tint(c0, 0.96, 0.22)));
        setUniformColor("uInner", oklabToSrgb(c0));
        setUniformColor("uMid", oklabToSrgb(midLab));
        setUniformColor("uOuter", oklabToSrgb(c1));
        setUniformColor("uGlowColor", oklabToSrgb(tint(glowLab, 0.78, 0.7)));
        setUniformColor("uSunColor", oklabToSrgb(tint(c0, 0.98, 0.12)));
        setUniformColor("uStarColor", oklabToSrgb(tint(c1, 0.93, 0.15)));
      }

      sceneMaterial.uniforms.uInk.value = isLightBg ? 1 : 0;
      compositeMaterial.uniforms.uInk.value = isLightBg ? 1 : 0;
    };

    const updateSize = () => {
      const p = propsRef.current;
      const w = Math.round(container.clientWidth);
      const h = Math.round(container.clientHeight);
      if (w < 2 || h < 2) {
        hasSize = false;
        return false;
      }

      const pixelRatio = Math.min(win.devicePixelRatio || 1, clamp(num(p.dpr, 2), 0.5, 3));
      if (hasSize && w === clientWidth && h === clientHeight && pixelRatio === activeDpr) {
        return false;
      }

      hasSize = true;
      clientWidth = w;
      clientHeight = h;
      activeDpr = pixelRatio;

      renderer.setPixelRatio(activeDpr);
      renderer.setSize(clientWidth, clientHeight, false);

      const renderW = Math.round(clientWidth * activeDpr);
      const renderH = Math.round(clientHeight * activeDpr);
      sceneTarget.setSize(renderW, renderH);

      let bw = renderW;
      let bh = renderH;
      for (const t of bloomPyramid) {
        bw = Math.max(1, Math.round(bw / 2));
        bh = Math.max(1, Math.round(bh / 2));
        t.setSize(bw, bh);
      }

      sceneMaterial.uniforms.uRes.value.set(renderW, renderH);
      compositeMaterial.uniforms.uResolution.value.set(renderW, renderH);
      return true;
    };

    const getRadius = () =>
      (2.4 / clamp(num(propsRef.current.curvature, 1), 0.08, 6)) *
      clamp(clientWidth / Math.max(clientHeight, 1) / 1.6, 0.42, 1);

    const getApex = () => 0.5 - clamp(num(propsRef.current.horizon, 0.72), 0.15, 1.1);

    const getSunArc = () => {
      const p = propsRef.current;
      const aspect = clientWidth / Math.max(clientHeight, 1);
      const sunOffset = clamp(num(p.sunPosition, 0.15), -1.2, 1.2) * aspect * 0.42;
      const rad = getRadius();
      const driftOffset = p.reduced ? 0 : 0.03 * clamp(num(p.drift, 0.5), 0, 2) * Math.sin(0.05 * simTime);
      return Math.asin(clamp(sunOffset / rad, -0.99, 0.99)) * rad + driftOffset;
    };

    const render = () => {
      if (!hasSize) return;
      const p = propsRef.current;

      if (performance.now() - lastColorSync > 1000) {
        lastColorSync = performance.now();
        updateColors();
      }

      // Update uniforms
      const u = sceneMaterial.uniforms;
      const baseTilt = (clamp(num(p.tilt, 0), -180, 180) * Math.PI) / 180;
      u.uTime.value = simTime;
      u.uRoll.value = baseTilt + rollCurrent;
      u.uApex.value = getApex() + apexCurrent;
      u.uRadius.value = getRadius();
      u.uSunArc.value = getSunArc();

      const spreadWidth = 0.08 + 1.1 * clamp(num(p.spread, 0.4), 0, 3);
      u.uSpread.value = 0.05 + (spreadWidth - 0.05) * (0.15 + 0.85 * introProgress);
      u.uSunUp.value = clamp(num(p.sunrise, 1), 0, 1.5) * (0.12 + 0.88 * introProgress);
      u.uAtmo.value = clamp(num(p.atmosphere, 1), 0, 3);
      u.uThick.value = clamp(num(p.thickness, 1), 0.3, 3);
      u.uRimGain.value = clamp(num(p.rim, 1), 0, 3);
      u.uFlare.value = clamp(num(p.flare, 1), 0, 3);
      u.uAirglow.value = clamp(num(p.airglow, 0.5), 0, 2);
      u.uClouds.value = clamp(num(p.clouds, 0.5), 0, 2);
      u.uStars.value = clamp(num(p.stars, 0.5), 0, 2);
      u.uAuroraGain.value = clamp(num(p.aurora, 1), 0, 3);

      for (let i = 0; i < 8; i++) {
        const item = auroras[i];
        if (item) {
          const fade = item.dying < 0 ? 1 : clamp(1 - (wallTime - item.dying) / 0.7, 0, 1);
          auroraVectors[i].set(item.arc, wallTime - item.born, item.strength * fade * fade, item.seed);
        } else {
          auroraVectors[i].set(0, 0, 0, 0);
        }
      }

      compositeMaterial.uniforms.uGrain.value = clamp(num(p.grain, 0.25), 0, 1);
      compositeMaterial.uniforms.uTime.value = simTime;

      sceneMaterial.blending = isLightBg ? THREE.NoBlending : THREE.NormalBlending;
      mesh.material = sceneMaterial;

      renderer.setRenderTarget(sceneTarget);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, camera);

      // Multi-pass Bloom Pyramid
      const bloomStrength = isLightBg ? 0 : clamp(num(p.bloom, 0.5), 0, 3);
      if (bloomStrength > 0.001) {
        let srcTarget = sceneTarget;
        mesh.material = downsampleMaterial;

        for (const target of bloomPyramid) {
          downsampleMaterial.uniforms.uThreshold.value = srcTarget === sceneTarget ? 0.45 : 0.0;
          downsampleMaterial.uniforms.uSource.value = srcTarget.texture;
          downsampleMaterial.uniforms.uTexel.value.set(1 / srcTarget.width, 1 / srcTarget.height);
          renderer.setRenderTarget(target);
          renderer.render(scene, camera);
          srcTarget = target;
        }

        mesh.material = upsampleMaterial;
        for (let i = bloomPyramid.length - 1; i > 0; i--) {
          upsampleMaterial.uniforms.uSource.value = bloomPyramid[i].texture;
          upsampleMaterial.uniforms.uTexel.value.set(1 / bloomPyramid[i].width, 1 / bloomPyramid[i].height);
          renderer.setRenderTarget(bloomPyramid[i - 1]);
          renderer.render(scene, camera);
        }
      }

      compositeMaterial.uniforms.uBloomStrength.value = bloomStrength;
      mesh.material = compositeMaterial;
      renderer.setRenderTarget(null);
      renderer.render(scene, camera);
    };

    const clientToArc = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return null;
      const p = propsRef.current;
      const nx = ((clientX - rect.left) / rect.width - 0.5) * (rect.width / rect.height);
      const ny = 0.5 - (clientY - rect.top) / rect.height;
      const roll = (clamp(num(p.tilt, 0), -180, 180) * Math.PI) / 180 + rollCurrent;
      const rx = Math.cos(roll) * nx - Math.sin(roll) * ny;
      const ry = Math.sin(roll) * nx + Math.cos(roll) * ny;
      const rad = getRadius();
      return Math.atan2(rx, ry - (getApex() + apexCurrent - rad)) * rad;
    };

    const spawnAurora = (arc: number, strength: number) => {
      const alive = auroras.filter((a) => a.dying < 0);
      if (alive.length >= 5) {
        alive[0].dying = wallTime;
      }
      if (auroras.length < 8) {
        auroras.push({
          arc,
          born: wallTime,
          strength,
          seed: 40 * random(),
          dying: -1,
        });
      }
    };

    const requestTick = () => {
      if (isDestroyed || isContextLost || !isIntersecting || animFrameId) return;
      animFrameId = requestAnimationFrame(animate);
    };

    const animate = (timestamp: number) => {
      animFrameId = 0;
      if (isDestroyed || isContextLost) return;

      const p = propsRef.current;
      const delta =
        lastFrameTimestamp && timestamp - lastFrameTimestamp < 100
          ? Math.min(Math.max((timestamp - lastFrameTimestamp) / 1000, 0), 0.05)
          : 1 / 60;
      lastFrameTimestamp = timestamp;

      const isRunning = !p.reduced && !p.paused;
      if (isRunning) {
        wallTime += delta;
        simTime += delta * clamp(num(p.speed, 0.5), 0, 3);
      }

      if (p.intro && !p.reduced) {
        if (introStartTime < 0) introStartTime = timestamp;
        const t = clamp((timestamp - introStartTime) / 6500, 0, 1);
        introProgress = t * t * (3 - 2 * t);
      } else {
        introProgress = 1;
      }

      const smoothFactor = p.reduced ? 1 : 1 - Math.exp(-delta / 0.55);
      rollCurrent += (rollTarget - rollCurrent) * smoothFactor;
      apexCurrent += (apexTarget - apexCurrent) * smoothFactor;

      for (let i = auroras.length - 1; i >= 0; i--) {
        if (wallTime - auroras[i].born > 6.7 || (auroras[i].dying >= 0 && wallTime - auroras[i].dying > 0.7)) {
          auroras.splice(i, 1);
        }
      }

      if (isRunning && p.autoAurora && clamp(num(p.aurora, 1), 0, 3) > 0 && wallTime >= nextAuroraTime) {
        const spreadW = 0.08 + 1.1 * clamp(num(p.spread, 0.4), 0, 3);
        spawnAurora(getSunArc() + (random() - 0.5) * spreadW * 2.4, 0.6 + 0.5 * random());
        nextAuroraTime = wallTime + 5 + 6 * random();
      }

      render();

      const hasMotion = Math.abs(rollTarget - rollCurrent) > 5e-5 || Math.abs(apexTarget - apexCurrent) > 5e-5;
      if ((isRunning || hasMotion || introProgress < 1) && !document.hidden) {
        animFrameId = requestAnimationFrame(animate);
      } else {
        lastFrameTimestamp = 0;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const p = propsRef.current;
      if (!p.interactive || p.reduced || e.pointerType === "touch") return;
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const parallaxFactor = clamp(num(p.parallax, 0.5), 0, 2);
      const nx = clamp((e.clientX - rect.left) / rect.width, 0, 1) - 0.5;
      const ny = clamp((e.clientY - rect.top) / rect.height, 0, 1) - 0.5;
      rollTarget = -(0.07 * nx) * parallaxFactor;
      apexTarget = -(0.05 * ny) * parallaxFactor;
      requestTick();
    };

    const handlePointerLeave = () => {
      rollTarget = 0;
      apexTarget = 0;
      requestTick();
    };

    let pointerDownState: { id: number; x: number; y: number; time: number } | null = null;

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownState = null;
      const p = propsRef.current;
      if (!p.interactive || p.reduced || p.paused || !e.isPrimary) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest?.("a, button, input, textarea, select, label, summary, [role=button], [contenteditable=true]")) {
        return;
      }
      pointerDownState = { id: e.pointerId, x: e.clientX, y: e.clientY, time: performance.now() };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const pt = pointerDownState;
      pointerDownState = null;
      if (
        !pt ||
        pt.id !== e.pointerId ||
        Math.hypot(e.clientX - pt.x, e.clientY - pt.y) > 10 ||
        performance.now() - pt.time > 500 ||
        clamp(num(propsRef.current.aurora, 1), 0, 3) <= 0
      ) {
        return;
      }
      const arc = clientToArc(e.clientX, e.clientY);
      if (arc !== null) {
        spawnAurora(arc, 1);
        requestTick();
      }
    };

    const handlePointerCancel = () => {
      pointerDownState = null;
    };

    const handleVisibilityChange = () => {
      lastFrameTimestamp = 0;
      requestTick();
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      isContextLost = true;
      cancelAnimationFrame(animFrameId);
      animFrameId = 0;
    };

    const handleContextRestored = () => {
      isContextLost = false;
      colorSignature = "";
      requestTick();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (updateSize()) {
        render();
        requestTick();
      }
    });

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        lastFrameTimestamp = 0;
        requestTick();
      },
      { rootMargin: "120px" }
    );

    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerCancel);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);

    resizeObserver.observe(container);
    intersectionObserver.observe(container);

    updateSize();
    updateColors();

    instanceRef.current = {
      sync: () => {
        lastColorSync = -10;
        updateSize();
        lastFrameTimestamp = 0;
        if (!animFrameId && isIntersecting) {
          render();
          requestTick();
        }
      },
      bloom: (pos?: number, strength?: number) => {
        if (propsRef.current.reduced) return;
        const rect = container.getBoundingClientRect();
        const arc = clientToArc(rect.left + clamp(pos ?? 0.5, 0, 1) * rect.width, rect.top + 0.5 * rect.height);
        if (arc !== null) {
          spawnAurora(arc, clamp(num(strength ?? 1, 1), 0, 3));
          requestTick();
        }
      },
      replay: () => {
        introStartTime = -1;
        introProgress = 0;
        lastFrameTimestamp = 0;
        requestTick();
      },
      destroy: () => {
        isDestroyed = true;
        cancelAnimationFrame(animFrameId);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();

        container.removeEventListener("pointermove", handlePointerMove);
        container.removeEventListener("pointerleave", handlePointerLeave);
        container.removeEventListener("pointerdown", handlePointerDown);
        container.removeEventListener("pointerup", handlePointerUp);
        container.removeEventListener("pointercancel", handlePointerCancel);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        canvas.removeEventListener("webglcontextlost", handleContextLost);
        canvas.removeEventListener("webglcontextrestored", handleContextRestored);

        quadGeometry.dispose();
        sceneMaterial.dispose();
        downsampleMaterial.dispose();
        upsampleMaterial.dispose();
        compositeMaterial.dispose();
        sceneTarget.dispose();
        for (const t of bloomPyramid) t.dispose();
        renderer.dispose();
        canvas.remove();
      },
    };

    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      bloom: (pos?: number, strength?: number) => instanceRef.current?.bloom(pos, strength),
      replay: () => instanceRef.current?.replay(),
    }),
    []
  );

  const cleanBg = backgroundColor.trim().toLowerCase();

  return (
    <div
      ref={containerRef}
      className={`relative isolate h-full min-h-[320px] w-full overflow-hidden ${className || ""}`}
      style={{
        backgroundColor: cleanBg === "transparent" || cleanBg === "" ? undefined : backgroundColor,
        touchAction: "pan-y",
        ...style,
      }}
    >
      <div ref={canvasMountRef} aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      {children ? <div style={{ position: "relative", zIndex: 1, height: "100%" }}>{children}</div> : null}
    </div>
  );
});

HorizonBloom.displayName = "HorizonBloom";

export default HorizonBloom;
