"use client";

import * as React from "react";
import { hierarchy, partition, type HierarchyRectangularNode } from "d3-hierarchy";
import { Compass, Info, MapPin, Building2, GraduationCap } from "lucide-react";
import { type Registration } from "./ParticipantTable";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SunburstDiagramProps {
  registrations: Registration[];
}

interface HierarchyDatum {
  name: string;
  category?: "root" | "state" | "college" | "branch";
  value?: number;
  children?: HierarchyDatum[];
}

const RING_COLORS: Record<string, string[]> = {
  state: ["#10b981", "#06b6d4", "#6366f1", "#a855f7", "#ec4899", "#f59e0b"],
  college: ["#059669", "#0891b2", "#4f46e5", "#9333ea", "#db2777", "#d97706"],
  branch: ["#047857", "#0e7490", "#4338ca", "#7e22ce", "#be185d", "#b45309"],
};

function describeArc(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  startAngle: number,
  endAngle: number
): string {
  // Clamp angle delta so it doesn't wrap around on full circles
  const delta = Math.min(2 * Math.PI - 0.0001, endAngle - startAngle);
  const sa = startAngle - Math.PI / 2;
  const ea = sa + delta;

  const x01 = cx + r0 * Math.cos(sa);
  const y01 = cy + r0 * Math.sin(sa);
  const x02 = cx + r1 * Math.cos(sa);
  const y02 = cy + r1 * Math.sin(sa);

  const x11 = cx + r1 * Math.cos(ea);
  const y11 = cy + r1 * Math.sin(ea);
  const x12 = cx + r0 * Math.cos(ea);
  const y12 = cy + r0 * Math.sin(ea);

  const largeArc = delta > Math.PI ? 1 : 0;

  return [
    `M ${x01} ${y01}`,
    `L ${x02} ${y02}`,
    `A ${r1} ${r1} 0 ${largeArc} 1 ${x11} ${y11}`,
    `L ${x12} ${y12}`,
    `A ${r0} ${r0} 0 ${largeArc} 0 ${x01} ${y01}`,
    "Z",
  ].join(" ");
}

export default function SunburstDiagram({ registrations }: SunburstDiagramProps) {
  const [hoveredNode, setHoveredNode] = React.useState<{
    name: string;
    category: string;
    value: number;
    percent: string;
  } | null>(null);

  const { rootNode, totalCount } = React.useMemo(() => {
    if (!registrations || registrations.length === 0) {
      return { rootNode: null, totalCount: 0 };
    }

    const total = registrations.length;

    // Grouping: State -> University -> Branch
    const tree: Record<string, Record<string, Record<string, number>>> = {};

    for (const r of registrations) {
      const stateName = (r.state || "").trim() || "Gujarat";
      const collegeName = (r.university || "").trim() || "Other Institutions";
      const branchName = (r.branch || "").trim() || "Engineering";

      if (!tree[stateName]) tree[stateName] = {};
      if (!tree[stateName][collegeName]) tree[stateName][collegeName] = {};
      tree[stateName][collegeName][branchName] =
        (tree[stateName][collegeName][branchName] || 0) + 1;
    }

    // Build hierarchy object
    const rawHierarchy: HierarchyDatum = {
      name: "HackIEEE 2027",
      category: "root",
      children: Object.entries(tree).map(([stName, colleges]) => ({
        name: stName,
        category: "state",
        children: Object.entries(colleges).map(([colName, branches]) => ({
          name: colName,
          category: "college",
          children: Object.entries(branches).map(([brName, count]) => ({
            name: brName,
            category: "branch",
            value: count,
          })),
        })),
      })),
    };

    const root = hierarchy(rawHierarchy)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const radius = 175;
    const p = partition<HierarchyDatum>().size([2 * Math.PI, radius])(root);

    return { rootNode: p, totalCount: total };
  }, [registrations]);

  const cx = 200;
  const cy = 200;
  const innerHole = 55;

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-sm space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Radial Cohort Hierarchy (Sunburst Diagram)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Radial multi-level drilldown: Center ➔ Ring 1 (State) ➔ Ring 2 (Institution) ➔ Ring 3 (Specialization).
          </p>
        </div>

        {/* Ring Legend Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>State</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-600" />
            <span>University</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
            <span>Branch</span>
          </div>
        </div>
      </div>

      {/* ── Sunburst Chart & Center Readout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
        {/* Left: SVG Radial Canvas */}
        <div className="lg:col-span-7 flex items-center justify-center relative min-h-[320px] sm:min-h-[400px]">
          {!rootNode ? (
            <div className="text-xs text-zinc-500">No hierarchy data available yet.</div>
          ) : (
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center mx-auto">
              <svg viewBox="0 0 400 400" className="w-full h-full select-none overflow-visible">
                <g>
                  {rootNode.descendants().map((d, idx) => {
                    // Skip root node from outer arcs
                    if (d.depth === 0) return null;

                    const r0 = innerHole + (d.depth - 1) * 38;
                    const r1 = r0 + 35;
                    const pathString = describeArc(cx, cy, r0, r1, d.x0, d.x1);

                    // Color determination
                    let color = "#3f3f46";
                    if (d.depth === 1) {
                      color = RING_COLORS.state[(idx) % RING_COLORS.state.length];
                    } else if (d.depth === 2) {
                      color = RING_COLORS.college[(idx) % RING_COLORS.college.length];
                    } else if (d.depth === 3) {
                      color = RING_COLORS.branch[(idx) % RING_COLORS.branch.length];
                    }

                    const categoryName =
                      d.depth === 1 ? "State" : d.depth === 2 ? "University" : "Specialization";

                    return (
                      <path
                        key={`arc-${idx}`}
                        d={pathString}
                        fill={color}
                        stroke="#18181b"
                        strokeWidth={1.5}
                        className="transition-all hover:opacity-90 cursor-pointer"
                        onClick={() => {
                          const val = d.value || 0;
                          setHoveredNode({
                            name: d.data.name,
                            category: categoryName,
                            value: val,
                            percent: ((val / totalCount) * 100).toFixed(1) + "%",
                          });
                        }}
                        onMouseEnter={() => {
                          const val = d.value || 0;
                          setHoveredNode({
                            name: d.data.name,
                            category: categoryName,
                            value: val,
                            percent: ((val / totalCount) * 100).toFixed(1) + "%",
                          });
                        }}
                        onMouseLeave={() => setHoveredNode(null)}
                      />
                    );
                  })}
                </g>
              </svg>

              {/* Center Readout Disc */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center"
              >
                <div className="h-[84px] w-[84px] sm:h-[96px] sm:w-[96px] rounded-full bg-zinc-950/95 border border-zinc-700/80 shadow-2xl flex flex-col items-center justify-center p-2 backdrop-blur">
                  {hoveredNode ? (
                    <>
                      <Badge variant="outline" className="text-[8px] px-1 py-0 border-zinc-700 text-cyan-400">
                        {hoveredNode.category}
                      </Badge>
                      <span className="text-xs font-bold text-zinc-100 truncate max-w-[76px] sm:max-w-[80px]" title={hoveredNode.name}>
                        {hoveredNode.name}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {hoveredNode.percent}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg sm:text-xl font-bold font-mono tracking-tight text-zinc-100">
                        {totalCount}
                      </span>
                      <span className="text-[9px] text-zinc-400 font-medium">
                        Attendees
                      </span>
                      <span className="text-[8px] text-zinc-500 font-mono">
                        Pan-India
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: State & University Drilldown Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800 space-y-1">
            <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-emerald-400" />
              Regional Spread
            </span>
            <p className="text-xs text-zinc-400">
              Outer rings expand proportionally to cohort registration volume. Move cursor over any arc to inspect hierarchical distribution.
            </p>
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-1">
              Top Geographic Roots
            </p>
            {rootNode &&
              rootNode.children?.slice(0, 5).map((stNode) => {
                const val = stNode.value || 0;
                const percent = ((val / totalCount) * 100).toFixed(1);
                return (
                  <div
                    key={stNode.data.name}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/80 text-xs hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 flex-shrink-0" />
                      <span className="font-medium text-zinc-200 truncate">
                        {stNode.data.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono flex-shrink-0">
                      <span className="text-zinc-300">{val}</span>
                      <span className="text-[11px] text-zinc-500">({percent}%)</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}