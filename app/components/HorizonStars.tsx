"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const VERTEX_SHADER = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uPlanetCenter;
uniform float uPlanetRadius;
varying vec2 vUv;

// Exact hash from HorizonBloom
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Exact HorizonBloom starField algorithm with bloom glow & zero grain
vec3 starField(vec2 p) {
  vec3 c = vec3(0.0);
  vec3 uStarColor = vec3(0.984, 0.90, 0.78); // Pale Sand Champagne (#fbe2bd) from HorizonBloom

  for (int k = 0; k < 2; k++) {
    float scale = k == 0 ? 60.0 : 115.0;
    vec2 g = p * scale + float(k) * 17.3;
    vec2 id = floor(g);
    vec2 f = fract(g) - 0.5;
    float h = hash(id);
    vec2 offset = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;

    // Exact twinkle equation from HorizonBloom
    float twinkle = 0.55 + 0.45 * sin(uTime * (1.1 + 2.8 * hash(id + 1.3)) + h * 50.0);
    float b = pow(h, 16.0) * twinkle;
    float d = length(f - offset * 0.7);

    // Star point core + HorizonBloom Kawase bloom glow simulation
    float core = exp(-d * d * 300.0);
    float glow = exp(-d * 18.0) * 0.38;

    c += uStarColor * (core + glow) * b * (k == 0 ? 2.2 : 1.3);
  }
  return c;
}

void main() {
  // Screen coordinates centered at (0, 0) and aspect-ratio corrected matching HorizonBloom
  vec2 fragPx = vUv * uRes;
  vec2 screen = (fragPx - 0.5 * uRes) / uRes.y;

  // HorizonBloom gentle mouse parallax
  vec2 p = screen + uMouse * 0.035;

  // Exact pixel distance from center of planet in CSS pixels
  float distPx = length(fragPx - uPlanetCenter);

  // Clear all stars directly behind the planet disk (no overlapping stars on the planet)
  // Preserves unclipped natural planet edges with smooth transition
  float planetMask = smoothstep(uPlanetRadius * 0.96, uPlanetRadius * 1.02, distPx);

  vec3 stars = starField(p) * planetMask;
  vec3 bg = vec3(0.043, 0.035, 0.024); // #0b0906 obsidian base
  gl_FragColor = vec4(bg + stars, 1.0);
}
`;

interface HorizonStarsProps {
  className?: string;
  speed?: number;
}

export default function HorizonStars({ className = "", speed = 0.4 }: HorizonStarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getWidth = () => window.innerWidth || container.clientWidth || 1920;
    const getHeight = () => window.innerHeight || container.clientHeight || 1080;

    const getPlanetMetrics = () => {
      const el = document.getElementById("planet-disk");
      const w = getWidth();
      const h = getHeight();
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // In WebGL Y=0 is bottom, so WebGL Y = h - cy
        // In planet.jpg, the planet circle has diameter ~896px out of 1024px = 87.5%
        const radius = (rect.width * 0.875) / 2;
        return {
          center: new THREE.Vector2(cx, h - cy),
          radius,
        };
      }
      return {
        center: new THREE.Vector2(w / 2, h / 2),
        radius: Math.min(w, h) * 0.28,
      };
    };

    const initialMetrics = getPlanetMetrics();

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: false,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(getWidth(), getHeight());
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    // Scene & Orthographic Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Uniforms in CSS pixel coordinates (independent of devicePixelRatio)
    const uniforms = {
      uRes: {
        value: new THREE.Vector2(getWidth(), getHeight()),
      },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPlanetCenter: { value: initialMetrics.center },
      uPlanetRadius: { value: initialMetrics.radius },
    };

    // Fullscreen quad
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);

    // Mouse tracking for parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      targetMouseX = (e.clientX / w - 0.5) * 2;
      targetMouseY = -(e.clientY / h - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const width = getWidth();
      const height = getHeight();
      renderer.setSize(width, height);
      uniforms.uRes.value.set(width, height);
      const metrics = getPlanetMetrics();
      uniforms.uPlanetCenter.value.copy(metrics.center);
      uniforms.uPlanetRadius.value = metrics.radius;
    };
    window.addEventListener("resize", handleResize);

    // Animation loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (now - lastTime) / 1000;
      lastTime = now;

      // Update time uniform with speed multiplier
      uniforms.uTime.value += delta * speed;

      // Keep planet metrics updated in case of dynamic DOM reflow
      const metrics = getPlanetMetrics();
      uniforms.uPlanetCenter.value.copy(metrics.center);
      uniforms.uPlanetRadius.value = metrics.radius;

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;
      uniforms.uMouse.value.set(currentMouseX, currentMouseY);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [speed]);

  return <div ref={containerRef} className={`pointer-events-none select-none ${className}`} />;
}
