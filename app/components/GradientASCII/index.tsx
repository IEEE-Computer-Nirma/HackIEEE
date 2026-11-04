"use client";

import dynamic from "next/dynamic";
import React from "react";

export interface GradientASCIIProps extends React.HTMLAttributes<HTMLDivElement> {
  colors?: string[];
  shape?: "horizon" | "pinch" | "rise" | "eclipse";
  characters?: string;
  cellSize?: number;
  density?: number;
  glyphOpacity?: number;
  glow?: number;
  depthOfField?: number;
  flicker?: number;
  softness?: number;
  scale?: number;
  flow?: number;
  speed?: number;
  gradientOpacity?: number;
  grain?: number;
  variation?: number;
  mouseInteraction?: boolean;
  scrambleRadius?: number;
  clickEffect?: "none" | "wave" | "burst";
  intro?: boolean;
  lightMode?: boolean;
  fontFamily?: string;
  dpr?: number;
  className?: string;
  style?: React.CSSProperties;
}

const GradientASCIIComponent = dynamic<any>(
  () => import("./GradientASCII"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-transparent" aria-hidden="true" />
    ),
  }
);

export default function GradientASCII(props: GradientASCIIProps) {
  return <GradientASCIIComponent {...props} />;
}
