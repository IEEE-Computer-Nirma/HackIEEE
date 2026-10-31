"use client";

import { useEffect, useRef } from "react";
import { THEME_EVENT } from "./ThemeSwitch";
import { IEEE_CS_FALLBACK_POINTS } from "./ieeeCsLogoPoints";

type ParticleColor = "gold" | "amber" | "ember" | "copper" | "sand" | "ibad";
type AnimationState = "INITIAL" | "FORMING" | "HOLDING" | "DISPERSING" | "SETTLED";

interface SpiceParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  hasTarget: boolean; // True if part of the logo formation; false if ambient surround dust
  size: number;
  colorType: ParticleColor;
  baseAlpha: number;
  shimmerSpeed: number;
  shimmerPhase: number;
  isFragment: boolean;
  formDelay: number; // 0 to 1 stagger factor for organic convergence
  drag: number;
  excitation: number;
}

interface Shockwave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

interface Flare {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

// Module-level guard: ensures the transformation sequence plays ONLY ONCE per page load
let hasCompletedSequence = false;

export default function SpiceMelange() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    const host = canvas.parentElement;
    if (!ctx || !host) return;

    // Listen on section so pointer interactions work across the whole About area
    const input: HTMLElement = host.closest("section, main") ?? host;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReduced = reduceMq.matches;

    const onReduceChange = (e: MediaQueryListEvent) => {
      isReduced = e.matches;
    };
    reduceMq.addEventListener("change", onReduceChange);

    // Color definitions for Day vs Night Arrakis theme
    let isDay = document.documentElement.dataset.theme === "day";

    const getColors = (day: boolean) => {
      if (day) {
        return {
          gold: "205, 135, 30",
          amber: "196, 80, 27",
          ember: "168, 65, 15",
          copper: "140, 58, 12",
          sand: "135, 95, 45",
          ibad: "35, 145, 175",
        };
      }
      return {
        gold: "255, 204, 60",
        amber: "226, 130, 47",
        ember: "196, 80, 27",
        copper: "184, 93, 25",
        sand: "248, 207, 150",
        ibad: "99, 203, 230",
      };
    };

    let colors = getColors(isDay);

    const onThemeChange = () => {
      isDay = document.documentElement.dataset.theme === "day";
      colors = getColors(isDay);
    };
    window.addEventListener(THEME_EVENT, onThemeChange);

    let W = 0;
    let H = 0;
    let dpr = 1;

    // State machine: INITIAL → FORMING → HOLDING → DISPERSING → SETTLED
    let animState: AnimationState = hasCompletedSequence ? "SETTLED" : "INITIAL";
    let stateStartTime = performance.now();

    // Stored normalized logo points [nx, ny] (0.0 to 1.0)
    let logoPoints: [number, number][] = IEEE_CS_FALLBACK_POINTS;
    let isMaskReady = false;

    // Particles array
    let particles: SpiceParticle[] = [];
    const shockwaves: Shockwave[] = [];
    const flares: Flare[] = [];

    // Pointer state for interactive cursor tracking in settled state
    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      vx: 0,
      vy: 0,
      speed: 0,
      inside: false,
    };

    // Calculate particle count based on viewport width
    const getParticleBudget = (width: number) => {
      if (width < 640) return { logoCount: 360, ambientCount: 50 }; // Mobile
      if (width < 1024) return { logoCount: 620, ambientCount: 90 }; // Tablet
      return { logoCount: 950, ambientCount: 140 }; // Desktop
    };

    // Calculate logo bounding box inside the About section canvas
    const getLogoBounds = () => {
      // 4:1 aspect ratio of the official IEEE Computer Society logo
      const maxW = Math.min(W * 0.78, Math.max(310, Math.min(W - 48, 800)));
      const logoW = maxW;
      const logoH = logoW * 0.25;
      const logoX = (W - logoW) / 2;
      // Positioned comfortably behind the upper About copy and overview stats
      const logoY = Math.min(Math.max(90, H * 0.15), 260);
      return { x: logoX, y: logoY, width: logoW, height: logoH };
    };

    // Assign particle destination coordinates from the sampled logo mask
    const assignTargetPositions = () => {
      if (logoPoints.length === 0 || particles.length === 0) return;
      const bounds = getLogoBounds();

      let targetIdx = 0;
      const step = logoPoints.length / Math.max(1, particles.filter((p) => p.hasTarget).length);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (!p.hasTarget) continue;

        const ptIndex = Math.min(Math.floor(targetIdx * step), logoPoints.length - 1);
        const [nx, ny] = logoPoints[ptIndex];
        targetIdx++;

        // Sub-pixel jitter for natural granular sand texture
        const jitterX = (Math.random() - 0.5) * (p.size * 0.6);
        const jitterY = (Math.random() - 0.5) * (p.size * 0.6);

        p.targetX = bounds.x + nx * bounds.width + jitterX;
        p.targetY = bounds.y + ny * bounds.height + jitterY;
      }
    };

    // Initialize all particles
    const initParticles = () => {
      const { logoCount, ambientCount } = getParticleBudget(W);
      const totalCount = logoCount + ambientCount;
      particles = [];

      for (let i = 0; i < totalCount; i++) {
        const hasTarget = i < logoCount;
        const colorRand = Math.random();
        let colorType: ParticleColor = "amber";
        if (colorRand < 0.4) colorType = "gold";
        else if (colorRand < 0.7) colorType = "amber";
        else if (colorRand < 0.85) colorType = "ember";
        else if (colorRand < 0.93) colorType = "copper";
        else if (colorRand < 0.97) colorType = "sand";
        else colorType = "ibad"; // Concentrated Ibad blue spark (~3%)

        // Tiny granular spice grain sizes: 1.0px to 2.4px
        const size = hasTarget ? 1.1 + Math.random() * 1.3 : 0.9 + Math.random() * 1.1;
        const isFragment = Math.random() < 0.07 || colorType === "ibad";

        // Random initial dispersed position across the section
        const x = Math.random() * (W || 1200);
        const y = Math.random() * (H || 800);

        particles.push({
          id: i,
          x,
          y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          startX: x,
          startY: y,
          targetX: x,
          targetY: y,
          hasTarget,
          size,
          colorType,
          baseAlpha: 0.55 + Math.random() * 0.4,
          shimmerSpeed: 0.02 + Math.random() * 0.035,
          shimmerPhase: Math.random() * Math.PI * 2,
          isFragment,
          formDelay: Math.random(), // Staggered arrival for organic dust convergence
          drag: 0.94 + Math.random() * 0.03,
          excitation: 0,
        });
      }

      assignTargetPositions();
    };

    // Asynchronously load the official IEEE Computer Society logo mask image
    const loadLogoMask = () => {
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        try {
          const offCanvas = document.createElement("canvas");
          const sampleW = 500;
          const sampleH = 125;
          offCanvas.width = sampleW;
          offCanvas.height = sampleH;
          const offCtx = offCanvas.getContext("2d", { willReadFrequently: true });

          if (offCtx) {
            offCtx.drawImage(img, 0, 0, sampleW, sampleH);
            const imgData = offCtx.getImageData(0, 0, sampleW, sampleH).data;
            const sampled: [number, number][] = [];

            for (let y = 0; y < sampleH; y++) {
              for (let x = 0; x < sampleW; x++) {
                const idx = (y * sampleW + x) * 4;
                // Sample pixels with significant alpha/luminance
                if (imgData[idx + 3] > 70) {
                  sampled.push([x / sampleW, y / sampleH]);
                }
              }
            }

            if (sampled.length > 300) {
              logoPoints = sampled;
              assignTargetPositions();
            }
          }
          isMaskReady = true;
        } catch {
          // Graceful fallback to precomputed vector points
          isMaskReady = true;
          assignTargetPositions();
        }
      };

      img.onerror = () => {
        // Fallback gracefully without error
        isMaskReady = true;
        assignTargetPositions();
      };

      img.src = "/organisers/ieee-cs-logo.svg";
    };

    // Canvas resize handling
    const resize = () => {
      const rect = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particles.length === 0) {
        initParticles();
      } else {
        assignTargetPositions();
      }
    };

    // Trigger the sudden organic dispersion of the IEEE CS logo
    const triggerDispersion = () => {
      const bounds = getLogoBounds();
      const centerX = bounds.x + bounds.width * 0.45;
      const centerY = bounds.y + bounds.height * 0.5;

      // Golden energy shockwave
      shockwaves.push({
        x: centerX,
        y: centerY,
        radius: 10,
        maxRadius: Math.min(W * 0.65, 420),
        speed: 7.0,
        alpha: 1.0,
      });

      // Central glowing spice flash
      flares.push({
        x: centerX,
        y: centerY,
        radius: bounds.height * 0.8,
        alpha: 0.95,
      });

      // Eject each particle outward with varied velocities and organic turbulence
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.5;

        // Distinct velocity classes for natural explosion dynamics
        const rand = Math.random();
        let speed = 2.0 + Math.random() * 3.5; // Majority: steady billowing dust
        if (rand < 0.22) {
          speed = 7.0 + Math.random() * 8.5; // High-velocity spark motes shooting far
        } else if (rand < 0.6) {
          speed = 4.0 + Math.random() * 4.0; // Mid-speed drifting embers
        }

        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.drag = 0.93 + Math.random() * 0.04;
        p.excitation = 1.0;
      }
    };

    // Pointer listeners
    const getLocalPos = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const { x, y } = getLocalPos(e);
      if (mouse.prevX < -1000) {
        mouse.prevX = x;
        mouse.prevY = y;
      } else {
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.vx = mouse.x - mouse.prevX;
      mouse.vy = mouse.y - mouse.prevY;
      mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      mouse.inside = true;
    };

    const onPointerLeave = () => {
      mouse.inside = false;
      mouse.speed = 0;
    };

    const onPointerDown = (e: PointerEvent) => {
      const { x, y } = getLocalPos(e);
      mouse.x = x;
      mouse.y = y;
      mouse.inside = true;

      // In settled state, clicks trigger a gentle spice burst
      if (animState === "SETTLED" && !isReduced) {
        shockwaves.push({
          x,
          y,
          radius: 5,
          maxRadius: 180,
          speed: 5.0,
          alpha: 0.75,
        });
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dist = Math.hypot(p.x - x, p.y - y);
          if (dist < 150 && dist > 1) {
            const push = (1 - dist / 150) * 5.0;
            p.vx += ((p.x - x) / dist) * push;
            p.vy += ((p.y - y) / dist) * push;
            p.excitation = 1.0;
          }
        }
      }
    };

    input.addEventListener("pointermove", onPointerMove, { passive: true });
    input.addEventListener("pointerleave", onPointerLeave, { passive: true });
    input.addEventListener("pointerdown", onPointerDown, { passive: true });

    let isVisible = false;
    let rafId = 0;
    let lastTime = performance.now();

    // ── Main Render & Animation Loop ─────────────────────────────
    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const t = now * 0.001;
      const stateElapsed = (now - stateStartTime) / 1000;

      ctx.clearRect(0, 0, W, H);

      // Reduced motion bypass
      if (isReduced) {
        animState = "SETTLED";
        hasCompletedSequence = true;
      }

      // ── State Machine Progression ─────────────────────────────
      if (animState === "INITIAL") {
        // Wait briefly for mask loading before starting convergence
        if (stateElapsed > 0.5 || isMaskReady) {
          animState = "FORMING";
          stateStartTime = now;
        }
      } else if (animState === "FORMING") {
        // Formation duration: 2.8 seconds
        if (stateElapsed >= 2.8) {
          animState = "HOLDING";
          stateStartTime = now;
        }
      } else if (animState === "HOLDING") {
        // Hold period: 2.5 seconds (within requested 2–3s)
        if (stateElapsed >= 2.5) {
          animState = "DISPERSING";
          stateStartTime = now;
          triggerDispersion();
        }
      } else if (animState === "DISPERSING") {
        // Dispersion duration: 2.5 seconds, then permanently SETTLED
        if (stateElapsed >= 2.5) {
          animState = "SETTLED";
          hasCompletedSequence = true; // Terminal state locked
        }
      }

      // ── Render Shockwaves ──────────────────────────────────────
      ctx.globalCompositeOperation = "lighter";
      for (let i = shockwaves.length - 1; i >= 0; i--) {
        const sw = shockwaves[i];
        sw.radius += sw.speed;
        sw.alpha *= 0.94;
        if (sw.alpha < 0.02 || sw.radius >= sw.maxRadius) {
          shockwaves.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
        ctx.lineWidth = Math.max(1, 3.0 * sw.alpha);
        ctx.strokeStyle = `rgba(${colors.gold}, ${sw.alpha * 0.75})`;
        ctx.stroke();
      }

      // ── Render Central Flares ──────────────────────────────────
      for (let i = flares.length - 1; i >= 0; i--) {
        const f = flares[i];
        f.alpha *= 0.92;
        f.radius += 1.2;
        if (f.alpha < 0.02) {
          flares.splice(i, 1);
          continue;
        }
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
        grad.addColorStop(0, `rgba(${colors.gold}, ${f.alpha * 0.5})`);
        grad.addColorStop(0.5, `rgba(${colors.amber}, ${f.alpha * 0.25})`);
        grad.addColorStop(1, `rgba(${colors.ember}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Particle Simulation by State ───────────────────────────
      const formProgress = Math.min(1.0, stateElapsed / 2.8);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // 1. Position & Motion updates per state
        if (animState === "INITIAL") {
          // Ambient initial drift
          p.x += p.vx;
          p.y += p.vy;
        } else if (animState === "FORMING") {
          if (p.hasTarget) {
            // Staggered convergence toward IEEE CS logo silhouette
            const delay = p.formDelay * 0.45;
            const progress = Math.max(0, Math.min(1, (formProgress - delay) / (1 - delay)));
            // Smooth easeInOut cubic
            const ease = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;

            // Swirl trajectory into target
            const swirl = (1 - ease) * Math.sin(ease * Math.PI) * 18;
            p.x = p.startX + (p.targetX - p.startX) * ease + Math.cos(p.id) * swirl;
            p.y = p.startY + (p.targetY - p.startY) * ease + Math.sin(p.id) * swirl;
          } else {
            // Surrounding fine dust drifts naturally around the logo
            p.x += p.vx * 0.8;
            p.y += p.vy * 0.8;
          }
        } else if (animState === "HOLDING") {
          if (p.hasTarget) {
            // Maintained in exact recognizable shape with subtle organic shimmer vibration
            const jitterAmount = 0.5;
            p.x = p.targetX + Math.sin(t * 3.2 + p.id * 0.8) * jitterAmount;
            p.y = p.targetY + Math.cos(t * 3.6 + p.id * 0.8) * jitterAmount;
          } else {
            p.x += p.vx * 0.5;
            p.y += p.vy * 0.5;
          }
        } else if (animState === "DISPERSING" || animState === "SETTLED") {
          // Physical dispersion and settling
          p.vx *= p.drag;
          p.vy *= p.drag;

          // Atmospheric Arrakis wind vector field
          const windAngle =
            Math.sin(p.y * 0.0025 + t * 0.28) * 1.4 + Math.cos(p.x * 0.002 + t * 0.2) * 0.9;
          const windForce = 0.06;
          p.vx += Math.cos(windAngle) * windForce + 0.02; // Gentle eastward drift
          p.vy += Math.sin(windAngle) * (windForce * 0.5) - 0.02; // Subtle convective updraft

          // Interactive pointer reactions in settled state
          if (mouse.inside && mouse.x > -500) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 180 && dist > 1) {
              const normX = dx / dist;
              const normY = dy / dist;
              const influence = (1 - dist / 180);
              p.excitation = Math.max(p.excitation, influence);

              if (dist > 50) {
                // Gentle pull + vortex swirl
                p.vx -= normX * influence * 0.22;
                p.vy -= normY * influence * 0.22;
                p.vx += -normY * influence * 0.25;
                p.vy += normX * influence * 0.25;
              } else {
                p.vx += normX * (1 - dist / 50) * 0.6;
                p.vy += normY * (1 - dist / 50) * 0.6;
              }
            }
          }

          p.excitation *= 0.96;
          p.x += p.vx * (dt * 60);
          p.y += p.vy * (dt * 60);

          // Boundary wrapping once scattered
          const pad = 25;
          if (p.x < -pad) p.x = W + pad;
          else if (p.x > W + pad) p.x = -pad;
          if (p.y < -pad) p.y = H + pad;
          else if (p.y > H + pad) p.y = -pad;
        }

        // 2. Shimmer & Optical Radiance
        p.shimmerPhase += p.shimmerSpeed * (1 + p.excitation * 1.5);
        const shimmer = Math.sin(p.shimmerPhase);
        let dynamicAlpha = p.baseAlpha * (0.7 + 0.3 * shimmer) * (1 + p.excitation * 0.4);

        // Boost brilliance during logo hold phase
        if (animState === "HOLDING" && p.hasTarget) {
          dynamicAlpha = Math.min(1.0, dynamicAlpha * 1.35);
        }

        // 3. Render tiny granular spice grain
        const rgb = colors[p.colorType];

        // Soft volumetric glow halo
        if (p.isFragment || animState === "HOLDING" || p.excitation > 0.4) {
          const glowRadius = p.size * (animState === "HOLDING" ? 2.4 : 2.0);
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
          grad.addColorStop(0, `rgba(${rgb}, ${dynamicAlpha * 0.6})`);
          grad.addColorStop(1, `rgba(${rgb}, 0)`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core grain
        ctx.fillStyle = `rgba(${rgb}, ${Math.min(1.0, dynamicAlpha)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";

      if (isVisible) {
        rafId = requestAnimationFrame(render);
      }
    };

    // Observers
    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(host);

    const io = new IntersectionObserver((entries) => {
      isVisible = entries[0]?.isIntersecting ?? false;
      if (isVisible) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(rafId);
      }
    });
    io.observe(host);

    loadLogoMask();
    resize();
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      input.removeEventListener("pointermove", onPointerMove);
      input.removeEventListener("pointerleave", onPointerLeave);
      input.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener(THEME_EVENT, onThemeChange);
      reduceMq.removeEventListener("change", onReduceChange);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className="spice-melange" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
