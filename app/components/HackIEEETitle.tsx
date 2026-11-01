'use client';

/**
 * HackIEEETitle — 3D letter-by-letter reveal of the HackIEEE wordmark. Single file, drop-in.
 *
 *   npm i three @types/three
 *   import HackIEEETitle from '@/components/HackIEEETitle';
 *   <HackIEEETitle surface="champagne" sides="black" depth="deep" bevel="round" />
 *
 * What it does
 *   Each letter is an extruded, bevelled 3D block that stays at its wordmark position and turns 90°
 *   on its own vertical axis, from right-side profile to front-facing, all letters in sync.
 *   It then resolves into crisp flat vector text (`ending="artwork"`) or stays 3D (`ending="hold"`).
 *   The background is fully transparent: place it over any section, image or video.
 *
 * Letterforms
 *   Dune Rise by Fontswan (SIL Open Font License 1.1). Outlines are embedded below (exact font curves,
 *   overlaps merged), set as "HACKieee": in Dune Rise the lowercase i and e are the serifed I and the
 *   barred E. Letter positions match the reference wordmark. The .otf is NOT needed at runtime.
 *
 * Sizing: fills its parent's width and keeps the wordmark's aspect ratio. Size it with the parent
 * or `className` / `style` (e.g. width: min(90vw, 1100px)).
 */

import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from 'react';
import * as THREE from 'three';

/* ------------------------------------------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------------------------------------- */

export type Surface =
  | 'paper' | 'satin' | 'ceramic' | 'champagne' | 'chrome' | 'gold' | 'rose' | 'pearl' | 'obsidian';
export type Sides = 'match' | 'darker' | 'black';
export type Depth = 'thin' | 'standard' | 'deep';
export type Bevel = 'sharp' | 'soft' | 'round';
export type Order = 'unison' | 'right-to-left' | 'left-to-right';
export type Ending = 'artwork' | 'hold';
export type Trigger = 'mount' | 'inView';

export type HackIEEETitleProps = {
  /** 3D material while turning (and at rest with ending="hold"). Default "champagne". */
  surface?: Surface;
  /** Colour of the blocks' side walls. Default "match". */
  sides?: Sides;
  depth?: Depth;
  bevel?: Bevel;
  /** Key light travels from the side to the front during the turn. Default true. */
  sweep?: boolean;
  /** Warm back light that catches the bevels. Default true. */
  rim?: boolean;
  order?: Order;
  /** "artwork" = resolve to flat vector text in `color`. "hold" = stay in 3D. Default "artwork". */
  ending?: Ending;
  /** Flat text colour (final state). Default the wordmark cream #F3E4CA. */
  color?: string;
  /** "inView" plays when ~35% visible (once). "mount" plays immediately. Default "inView". */
  trigger?: Trigger;
  /** Replay when clicked. Default false. */
  replayOnClick?: boolean;
  /** Called once the reveal has fully finished. */
  onComplete?: () => void;
  /** Accessible name. Default "HackIEEE". */
  label?: string;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

export type HackIEEETitleHandle = { replay: () => void };

/* ------------------------------------------------------------------------------------------------
 * Wordmark data — Dune Rise glyph outlines (font units, y-up, cap height 800) + layout
 * ---------------------------------------------------------------------------------------------- */

type GlyphShape = { o: string; h: string[] };
type Glyph = { s: GlyphShape[]; b: [number, number, number, number] };

const GLYPHS: Record<string, Glyph> = {"H":{s:[{o:"M167.15 433.57L167.15 800L100 800L100 0L167.15 0L167.15 366.43L832.85 366.43L832.85 0L900 0L900 800L832.85 800L832.85 433.57L167.15 433.57Z",h:[]}],b:[100.0,0.0,900.0,800.0]},"A":{s:[{o:"M181.699 0L549.64 654.7L917 0L999 0L550 800L100 0L181.699 0Z",h:[]}],b:[100,0,999.0,800.0]},"C":{s:[{o:"M500 0L900 0L900 67.1504L500 67.1504C316.46 67.1504 167.15 216.46 167.15 400C167.15 583.54 316.46 732.85 500 732.85L900 732.85L900 800L500 800C279.09 800 100 620.91 100 400C100 179.09 279.09 0 500 0Z",h:[]}],b:[100,0.0,900.0,800.0]},"K":{s:[{o:"M167.14 271.1L167.14 800L100 800L100 0L167.14 0L167.14 183.36L372.521 356.13L795.86 0L900.16 0L424.67 400L900.16 800L795.86 800L167.14 271.1Z",h:[]}],b:[100.0,0.0,900.16,800]},"i":{s:[{o:"M301.22 800L99.7803 800L99.7803 732.85L166.93 732.85L166.93 67.1504L99.7803 67.1504L99.7803 0L301.22 0L301.22 67.1504L234.07 67.1504L234.07 732.85L301.22 732.85L301.22 800Z",h:[]}],b:[99.78,0.0,301.22,800.0]},"e":{s:[{o:"M500 0L900 0L900 67.1504L500 67.1504C327.79 67.1504 185.714 198.596 168.83 366.43L900 366.43L900 433.57L168.83 433.57C185.714 601.404 327.79 732.85 500 732.85L900 732.85L900 800L500 800C279.09 800 100 620.91 100 400C100 179.09 279.09 0 500 0Z",h:[]}],b:[100,0.0,900.0,800.0]}};
const WORD = ["H", "A", "C", "K", "i", "e", "e", "e"];
/** Glyph origin x per letter (font units), measured from the reference wordmark. */
const ORIGINS = [0, 1492, 2956, 4440, 5946, 6841, 8336, 9832];

const CAP = 800;
const PAD = 140; // room for bevels and the turn
const INK_MIN_X = Math.min(...WORD.map((ch, i) => ORIGINS[i] + GLYPHS[ch].b[0]));
const INK_MAX_X = Math.max(...WORD.map((ch, i) => ORIGINS[i] + GLYPHS[ch].b[2]));
const VB_X = INK_MIN_X - PAD;
const VB_W = INK_MAX_X - INK_MIN_X + PAD * 2;
const VB_H = CAP + PAD * 2;

/* ------------------------------------------------------------------------------------------------
 * Look recipes
 * ---------------------------------------------------------------------------------------------- */

type SurfaceSpec = {
  physical?: boolean; color: string; roughness: number; metalness: number; env: number;
  clearcoat?: number; clearcoatRoughness?: number; anisotropy?: number; iridescence?: number;
  sheen?: number; brushed?: boolean;
};

const SURFACES: Record<Surface, SurfaceSpec> = {
  paper:     { color: '#EACB94', roughness: 0.78, metalness: 0, env: 0.45 },
  satin:     { physical: true, color: '#EACB94', roughness: 0.42, metalness: 0, env: 0.8, clearcoat: 0.35, clearcoatRoughness: 0.35 },
  ceramic:   { physical: true, color: '#F0D6A6', roughness: 0.2, metalness: 0, env: 1.0, clearcoat: 1, clearcoatRoughness: 0.05 },
  champagne: { physical: true, color: '#E3C58E', roughness: 0.34, metalness: 1, env: 1.1, anisotropy: 0.75, brushed: true },
  chrome:    { physical: true, color: '#F2ECE2', roughness: 0.05, metalness: 1, env: 1.3 },
  gold:      { physical: true, color: '#E9B85C', roughness: 0.2, metalness: 1, env: 1.2 },
  rose:      { physical: true, color: '#D99A76', roughness: 0.26, metalness: 1, env: 1.2 },
  pearl:     { physical: true, color: '#F3E3C6', roughness: 0.3, metalness: 0, env: 1.0, clearcoat: 0.6, clearcoatRoughness: 0.1, iridescence: 1, sheen: 0.5 },
  obsidian:  { physical: true, color: '#3A342E', roughness: 0.1, metalness: 0.35, env: 1.9, clearcoat: 1, clearcoatRoughness: 0.04 }
};

// World units = font units / 100, so the cap height is 8.
const U = 100;
const DEPTHS: Record<Depth, number> = { thin: 0.45, standard: 0.9, deep: 1.9 };
const BEVELS: Record<Bevel, { on: boolean; t: number; s: number; seg: number }> = {
  sharp: { on: false, t: 0, s: 0, seg: 1 },
  soft: { on: true, t: 0.06, s: 0.05, seg: 3 },
  round: { on: true, t: 0.14, s: 0.12, seg: 6 }
};

// True orthographic camera — every letter is viewed dead-on, no perspective distortion.
const ORTHO_HALF_H = VB_H / U / 2;
const ORTHO_HALF_W = VB_W / U / 2;
const CAM_Z = 200; // far enough for depth + bevel clearance
const CAM_X = (VB_X + VB_W / 2) / U;
const CAM_Y = CAP / 2 / U;

// Timing (seconds)
const START_DELAY = 0.2;
const DUR = 2.8;
const STAGGER = 0.105;
const INK_HOLD = 0.2;
const INK_DUR = 0.8;

const KEY_END = new THREE.Vector3(1.1, 2.4, 9.5);
const KEY_START = new THREE.Vector3(9.0, 1.6, 1.2);

/* ------------------------------------------------------------------------------------------------
 * Helpers
 * ---------------------------------------------------------------------------------------------- */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (p1: number, p2: number) => 1 - 3 * p2 + 3 * p1;
  const B = (p1: number, p2: number) => 3 * p2 - 6 * p1;
  const C = (p1: number) => 3 * p1;
  const at = (t: number, p1: number, p2: number) => ((A(p1, p2) * t + B(p1, p2)) * t + C(p1)) * t;
  const slope = (t: number, p1: number, p2: number) => 3 * A(p1, p2) * t * t + 2 * B(p1, p2) * t + C(p1);
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = slope(t, x1, x2);
      if (Math.abs(d) < 1e-6) break;
      t -= (at(t, x1, x2) - x) / d;
    }
    return at(clamp(t, 0, 1), y1, y2);
  };
}
/** Slow, gentle start and a long soft landing. No overshoot. */
const easeReveal = cubicBezier(0.5, 0, 0.2, 1);

/** Draws an absolute M/L/C/Q/Z path (font units) into a THREE path, mapped by `map`. */
function tracePath<T extends THREE.Path>(path: T, d: string, map: (x: number, y: number) => [number, number]): T {
  const tokens = d.match(/[MLCQZ]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  let i = 0;
  let cmd = '';
  const n = () => parseFloat(tokens[i++]);
  const pt = () => map(n(), n());
  while (i < tokens.length) {
    if (/[MLCQZ]/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === 'Z') { path.closePath(); continue; }
    if (cmd === 'M') { const [x, y] = pt(); path.moveTo(x, y); cmd = 'L'; }
    else if (cmd === 'L') { const [x, y] = pt(); path.lineTo(x, y); }
    else if (cmd === 'C') { const [a, b] = pt(); const [c, e] = pt(); const [x, y] = pt(); path.bezierCurveTo(a, b, c, e, x, y); }
    else if (cmd === 'Q') { const [a, b] = pt(); const [x, y] = pt(); path.quadraticCurveTo(a, b, x, y); }
    else i++;
  }
  return path;
}

/** Studio env: bright ceiling, two tall softboxes, dark floor. Reflections only; never drawn as background. */
function makeEnvironment(renderer: THREE.WebGLRenderer) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.45, '#d9d6d0');
  grad.addColorStop(0.55, '#8f8d88');
  grad.addColorStop(1, '#1b1a18');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 128);
  g.fillStyle = '#ffffff';
  g.fillRect(40, 4, 104, 26);
  g.fillStyle = '#fff6ea';
  g.fillRect(12, 22, 16, 58);
  g.fillRect(200, 26, 14, 50);
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  pmrem.dispose();
  tex.dispose();
  return env;
}

/** Horizontal hairline streaks as a roughness map: brushed-metal grain. */
function makeBrushedTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = 'rgb(150,150,150)';
  g.fillRect(0, 0, 256, 256);
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 900; i++) {
    const v = Math.floor(95 + rnd() * 120);
    g.fillStyle = `rgba(${v},${v},${v},${0.25 + rnd() * 0.5})`;
    g.fillRect(rnd() * 256 - 64, rnd() * 256, 40 + rnd() * 220, rnd() < 0.8 ? 1 : 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(0.11, 1.25);
  return t;
}

function makeMaterial(spec: SurfaceSpec, brushed: THREE.Texture | null) {
  const common = {
    color: new THREE.Color(spec.color),
    roughness: spec.roughness,
    metalness: spec.metalness,
    envMapIntensity: spec.env,
    roughnessMap: spec.brushed ? brushed : null
  };
  if (!spec.physical) return new THREE.MeshStandardMaterial(common);
  const m = new THREE.MeshPhysicalMaterial(common);
  if (spec.clearcoat) {
    m.clearcoat = spec.clearcoat;
    m.clearcoatRoughness = spec.clearcoatRoughness ?? 0.1;
  }
  if (spec.anisotropy) m.anisotropy = spec.anisotropy;
  if (spec.iridescence) {
    m.iridescence = spec.iridescence;
    m.iridescenceIOR = 1.3;
    m.iridescenceThicknessRange = [320, 820];
  }
  if (spec.sheen) {
    m.sheen = spec.sheen;
    m.sheenColor = new THREE.Color('#ffffff');
    m.sheenRoughness = 0.4;
  }
  return m;
}

function makeSideMaterial(front: THREE.MeshStandardMaterial, mode: Sides): THREE.MeshStandardMaterial {
  if (mode === 'black') {
    return new THREE.MeshStandardMaterial({ color: '#141311', roughness: 0.55, metalness: 0.3, envMapIntensity: 0.6 });
  }
  if (mode === 'darker') {
    const m = front.clone();
    m.color = front.color.clone().multiplyScalar(0.42);
    return m;
  }
  return front;
}

/* ------------------------------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------------------------- */

const HackIEEETitle = forwardRef<HackIEEETitleHandle, HackIEEETitleProps>(function HackIEEETitle(
  {
    surface = 'champagne',
    sides = 'match',
    depth = 'standard',
    bevel = 'soft',
    sweep = true,
    rim = true,
    order = 'unison',
    ending = 'artwork',
    color = '#F3E4CA',
    trigger = 'inView',
    replayOnClick = false,
    onComplete,
    label = 'HackIEEE',
    className,
    style,
    id
  },
  ref
) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flatRef = useRef<SVGSVGElement>(null);
  const replayRef = useRef<() => void>(() => {});
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useImperativeHandle(ref, () => ({ replay: () => replayRef.current() }), []);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const flat = flatRef.current;
    if (!stage || !canvas || !flat) return;

    const showFlat = (animate: boolean) => {
      canvas.style.visibility = 'hidden';
      flat.style.transition = animate ? 'opacity .5s ease-out .2s' : 'none';
      flat.style.opacity = '1';
    };

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      showFlat(true);
      replayRef.current = () => {};
      onCompleteRef.current?.();
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
    } catch {
      showFlat(true); // no WebGL: plain fade-in of the vector wordmark
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0); // transparent background
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const spec = SURFACES[surface];
    const D = DEPTHS[depth];
    const BV = BEVELS[bevel];
    const hold = ending === 'hold';

    const scene = new THREE.Scene(); // no scene.background: stays transparent
    const camera = new THREE.OrthographicCamera(
      -ORTHO_HALF_W, ORTHO_HALF_W,
      ORTHO_HALF_H, -ORTHO_HALF_H,
      0.1, CAM_Z * 3
    );
    camera.position.set(CAM_X, CAM_Y, CAM_Z);

    scene.environment = makeEnvironment(renderer);
    scene.environmentIntensity = 0.85;
    scene.add(new THREE.HemisphereLight('#ffffff', '#cfccc5', 0.5));
    const key = new THREE.DirectionalLight('#fffaf2', 2.6);
    key.position.copy(sweep ? KEY_START : KEY_END);
    scene.add(key);
    const fill = new THREE.DirectionalLight('#e8f0ff', 0.5);
    fill.position.set(-5, -2, 4);
    scene.add(fill);
    if (rim) {
      const rimL = new THREE.DirectionalLight('#ffe9c8', 3.2);
      rimL.position.set(-3, 3.5, -7);
      const rimR = new THREE.DirectionalLight('#ffe9c8', 2.0);
      rimR.position.set(5, -1, -6);
      scene.add(rimL, rimR);
    }

    const brushed = spec.brushed ? makeBrushedTexture() : null;
    const frontMat = makeMaterial(spec, brushed);
    const sideMat = makeSideMaterial(frontMat, sides);
    const materials = [frontMat, sideMat]; // ExtrudeGeometry groups: 0 = caps, 1 = side walls

    const endQ = new THREE.Quaternion();
    const pieces = WORD.map((ch, i) => {
      const g = GLYPHS[ch];
      const gcx = (g.b[0] + g.b[2]) / 2;
      const gcy = (g.b[1] + g.b[3]) / 2;
      const local = (x: number, y: number): [number, number] => [(x - gcx) / U, (y - gcy) / U];
      const shapes = g.s.map((sp) => {
        const shape = tracePath(new THREE.Shape(), sp.o, local);
        sp.h.forEach((hole) => shape.holes.push(tracePath(new THREE.Path(), hole, local)));
        return shape;
      });
      const geo = new THREE.ExtrudeGeometry(shapes, {
        depth: D,
        bevelEnabled: BV.on,
        bevelThickness: BV.t,
        bevelSize: BV.s,
        bevelOffset: -BV.s, // outer outline stays exactly the font's
        bevelSegments: BV.seg,
        curveSegments: 14
      });
      geo.translate(0, 0, -(D + BV.t)); // front face sits on z = 0
      const mesh = new THREE.Mesh(geo, materials);
      mesh.name = `letter-${i}-${ch}`;
      const x = (ORIGINS[i] + gcx) / U;
      mesh.position.set(x, gcy / U, 0); // fixed: never leaves its wordmark position
      scene.add(mesh);
      // Start turned 70° — dramatic reveal but uniform across all letters with ortho camera.
      const TILT = (70 * Math.PI) / 180;
      const startQ = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -TILT, 0));
      mesh.quaternion.copy(startQ);
      return { mesh, x, startQ, delay: START_DELAY };
    });

    if (order !== 'unison') {
      [...pieces]
        .sort((a, b) => (order === 'right-to-left' ? b.x - a.x : a.x - b.x))
        .forEach((p, i) => (p.delay = START_DELAY + i * STAGGER));
    }
    const total = Math.max(...pieces.map((p) => p.delay)) + DUR;
    const end = hold ? total + 0.1 : total + INK_HOLD + INK_DUR;

    const tmpQ = new THREE.Quaternion();
    let t0 = 0;
    let raf = 0;
    let running = false;
    let disposed = false;

    const frame = () => {
      if (disposed) return;
      const time = (performance.now() - t0) / 1000;
      for (const p of pieces) {
        const k = clamp((time - p.delay) / DUR, 0, 1);
        p.mesh.quaternion.copy(tmpQ.slerpQuaternions(p.startQ, endQ, easeReveal(k)));
      }
      if (sweep) key.position.lerpVectors(KEY_START, KEY_END, easeReveal(clamp((time - START_DELAY) / DUR, 0, 1)));
      if (!hold) flat.style.opacity = String(smootherstep(clamp((time - total - INK_HOLD) / INK_DUR, 0, 1)));
      renderer.render(scene, camera);

      if (time >= end) {
        running = false; // static from here on: zero GPU work while idle
        if (!hold) canvas.style.visibility = 'hidden';
        onCompleteRef.current?.();
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const play = () => {
      t0 = performance.now();
      canvas.style.visibility = 'visible';
      flat.style.transition = 'none';
      flat.style.opacity = '0';
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    replayRef.current = play;

    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      // Keep vertical extent fixed, adjust horizontal to match container aspect
      const aspect = w / h;
      camera.left = -ORTHO_HALF_H * aspect;
      camera.right = ORTHO_HALF_H * aspect;
      camera.top = ORTHO_HALF_H;
      camera.bottom = -ORTHO_HALF_H;
      camera.updateProjectionMatrix();
      if (!running) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(stage);
    resize();

    // Before it plays: letters sit edge-on (thin side profiles).
    canvas.style.visibility = 'visible';
    flat.style.opacity = '0';
    let io: IntersectionObserver | null = null;
    if (trigger === 'inView' && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            io?.disconnect();
            io = null;
            play();
          }
        },
        { threshold: 0.35 }
      );
      io.observe(stage);
    } else {
      play();
    }

    return () => {
      disposed = true;
      io?.disconnect();
      cancelAnimationFrame(raf);
      ro.disconnect();
      pieces.forEach((p) => p.mesh.geometry.dispose());
      frontMat.dispose();
      if (sideMat !== frontMat) sideMat.dispose();
      brushed?.dispose();
      scene.environment?.dispose();
      renderer.dispose();
    };
  }, [surface, sides, depth, bevel, sweep, rim, order, ending, trigger]);

  return (
    <div
      ref={stageRef}
      id={id}
      className={className}
      role="img"
      aria-label={label}
      onClick={replayOnClick ? () => replayRef.current() : undefined}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${VB_W} / ${VB_H}`,
        background: 'transparent',
        cursor: replayOnClick ? 'pointer' : undefined,
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', background: 'transparent' }}
      />
      <svg
        ref={flatRef}
        viewBox={`${VB_X} ${-PAD} ${VB_W} ${VB_H}`}
        aria-hidden="true"
        focusable="false"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, pointerEvents: 'none', overflow: 'visible' }}
      >
        <g fill={color}>
          {WORD.map((ch, i) => (
            <path
              key={i}
              transform={`translate(${ORIGINS[i]} ${CAP}) scale(1 -1)`}
              d={GLYPHS[ch].s.map((sp) => sp.o + sp.h.join('')).join('')}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

export default HackIEEETitle;
