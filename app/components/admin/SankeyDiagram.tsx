"use client";

import * as React from "react";
import {
  sankey,
  sankeyLinkHorizontal,
  type SankeyNode,
  type SankeyLink,
} from "d3-sankey";
import { Workflow, Info } from "lucide-react";
import { type Registration } from "./ParticipantTable";
import { cn } from "@/lib/utils";

interface SankeyDiagramProps {
  registrations: Registration[];
}

interface CustomNodeData {
  id: string;
  name: string;
  category: "college" | "branch" | "ieee";
  color: string;
}

interface CustomLinkData {
  source: number | CustomNode;
  target: number | CustomNode;
  value: number;
}

type CustomNode = SankeyNode<CustomNodeData, CustomLinkData>;
type CustomLink = SankeyLink<CustomNodeData, CustomLinkData>;

const COLLEGE_COLORS = ["#10b981", "#06b6d4", "#6366f1", "#a855f7", "#ec4899", "#71717a"];
const BRANCH_COLORS = ["#3b82f6", "#14b8a6", "#f59e0b", "#8b5cf6", "#64748b"];

function normalizeBranch(branchStr: string): string {
  const b = (branchStr || "").toLowerCase();
  if (b.includes("computer") || b.includes("cse") || b.includes("cs")) return "Computer Eng / CSE";
  if (b.includes("information") || b.includes("it")) return "Information Tech (IT)";
  if (b.includes("ai") || b.includes("data") || b.includes("ml")) return "AI & Data Science";
  if (b.includes("electronic") || b.includes("ec") || b.includes("ee") || b.includes("electr")) return "EC / Electrical";
  if (b.includes("mechanical") || b.includes("civil") || b.includes("chem")) return "Core Engineering";
  return "Other Specializations";
}

export default function SankeyDiagram({ registrations }: SankeyDiagramProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = React.useState({ width: 800, height: 380 });
  const [hoveredLink, setHoveredLink] = React.useState<{
    sourceName: string;
    targetName: string;
    value: number;
    percent: string;
  } | null>(null);

  // Resize listener
  React.useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setDimensions({
          width: Math.max(w, 500),
          height: 380,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const { layoutNodes, layoutLinks, totalCount } = React.useMemo(() => {
    if (!registrations || registrations.length === 0) {
      return { layoutNodes: [], layoutLinks: [], totalCount: 0 };
    }

    const total = registrations.length;

    // 1. Determine top colleges
    const collegeCounts = new Map<string, number>();
    for (const r of registrations) {
      const c = (r.university || "").trim() || "Unspecified";
      collegeCounts.set(c, (collegeCounts.get(c) || 0) + 1);
    }

    const sortedColleges = Array.from(collegeCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    const topCollegeNames = sortedColleges.slice(0, 5).map(([name]) => name);
    const hasOtherColleges = sortedColleges.length > 5;

    // Build node definitions
    const nodes: CustomNodeData[] = [];
    const nodeMap = new Map<string, number>();

    const addNode = (id: string, name: string, category: "college" | "branch" | "ieee", color: string) => {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, nodes.length);
        nodes.push({ id, name, category, color });
      }
      return nodeMap.get(id)!;
    };

    // Stage 0: Colleges
    topCollegeNames.forEach((col, idx) => {
      let displayName = col;
      if (displayName.length > 24) displayName = displayName.slice(0, 22) + "…";
      addNode(`col_${col}`, displayName, "college", COLLEGE_COLORS[idx % COLLEGE_COLORS.length]);
    });
    if (hasOtherColleges) {
      addNode("col_other", "Other Institutions", "college", "#71717a");
    }

    // Stage 1: Branches
    const branchCounts = new Map<string, number>();
    for (const r of registrations) {
      const normB = normalizeBranch(r.branch);
      branchCounts.set(normB, (branchCounts.get(normB) || 0) + 1);
    }
    const sortedBranches = Array.from(branchCounts.entries()).sort((a, b) => b[1] - a[1]);
    sortedBranches.forEach(([bName], idx) => {
      addNode(`br_${bName}`, bName, "branch", BRANCH_COLORS[idx % BRANCH_COLORS.length]);
    });

    // Stage 2: IEEE Affiliation
    addNode("ieee_member", "IEEE Member", "ieee", "#10b981");
    addNode("ieee_non", "Non-Member", "ieee", "#52525b");

    // Build links
    // Pair 1: College -> Branch
    // Pair 2: Branch -> IEEE Status
    const colToBranch = new Map<string, number>();
    const branchToIeee = new Map<string, number>();

    for (const r of registrations) {
      const col = (r.university || "").trim();
      const colId = topCollegeNames.includes(col) ? `col_${col}` : "col_other";
      const branchId = `br_${normalizeBranch(r.branch)}`;
      const ieeeId = r.is_ieee_member ? "ieee_member" : "ieee_non";

      const cbKey = `${colId}:::${branchId}`;
      colToBranch.set(cbKey, (colToBranch.get(cbKey) || 0) + 1);

      const biKey = `${branchId}:::${ieeeId}`;
      branchToIeee.set(biKey, (branchToIeee.get(biKey) || 0) + 1);
    }

    const links: CustomLinkData[] = [];

    colToBranch.forEach((val, key) => {
      const [src, tgt] = key.split(":::");
      const sIdx = nodeMap.get(src);
      const tIdx = nodeMap.get(tgt);
      if (sIdx !== undefined && tIdx !== undefined && val > 0) {
        links.push({ source: sIdx, target: tIdx, value: val });
      }
    });

    branchToIeee.forEach((val, key) => {
      const [src, tgt] = key.split(":::");
      const sIdx = nodeMap.get(src);
      const tIdx = nodeMap.get(tgt);
      if (sIdx !== undefined && tIdx !== undefined && val > 0) {
        links.push({ source: sIdx, target: tIdx, value: val });
      }
    });

    try {
      const sankeyGenerator = sankey<CustomNodeData, CustomLinkData>()
        .nodeWidth(14)
        .nodePadding(14)
        .extent([
          [10, 10],
          [dimensions.width - 10, dimensions.height - 20],
        ]);

      const result = sankeyGenerator({
        nodes: nodes.map((d) => ({ ...d })),
        links: links.map((d) => ({ ...d })),
      });

      return {
        layoutNodes: result.nodes,
        layoutLinks: result.links,
        totalCount: total,
      };
    } catch (err) {
      console.error("[Sankey] Layout generation error:", err);
      return { layoutNodes: [], layoutLinks: [], totalCount: total };
    }
  }, [registrations, dimensions]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-sm space-y-4">
      {/* ── Top Diagram Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Workflow className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Participant Flow Pipeline (Sankey Diagram)
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Trace how attendees flow from Universities ➔ Academic Specialization ➔ IEEE Affiliation.
          </p>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Colleges</span>
          </div>
          <span className="text-zinc-700">➔</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-400" />
            <span>Branches</span>
          </div>
          <span className="text-zinc-700">➔</span>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            <span>IEEE Status</span>
          </div>
        </div>
      </div>

      {/* ── Active Hover Readout Bar ── */}
      <div className="h-7 px-3 rounded-lg bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs font-mono">
        {hoveredLink ? (
          <div className="flex items-center gap-2 text-zinc-200">
            <span className="text-emerald-400 font-semibold">{hoveredLink.sourceName}</span>
            <span className="text-zinc-500">➔</span>
            <span className="text-blue-400 font-semibold">{hoveredLink.targetName}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300">
              <strong>{hoveredLink.value}</strong> attendees ({hoveredLink.percent} of cohort)
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
            <Info className="h-3.5 w-3.5 text-zinc-600" />
            <span>Hover over any ribbon or block to inspect flow distribution volume.</span>
          </div>
        )}
        <span className="text-zinc-500 text-[11px]">
          {totalCount} Total Registrations
        </span>
      </div>

      {/* ── Sankey SVG Canvas ── */}
      <div ref={containerRef} className="w-full overflow-x-auto pt-2">
        {layoutNodes.length === 0 ? (
          <div className="h-[320px] flex flex-col items-center justify-center text-zinc-500 text-xs">
            No participant flow data available yet.
          </div>
        ) : (
          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="select-none overflow-visible"
          >
            {/* Draw Links (Flow Ribbons) */}
            <g className="fill-none">
              {layoutLinks.map((link, idx) => {
                const pathData = sankeyLinkHorizontal()(link);
                const srcNode = link.source as CustomNode;
                const tgtNode = link.target as CustomNode;
                const color = srcNode.color || "#10b981";

                return (
                  <path
                    key={`link-${idx}`}
                    d={pathData || ""}
                    stroke={color}
                    strokeWidth={Math.max(1.5, link.width || 0)}
                    strokeOpacity={0.35}
                    className="transition-all hover:stroke-opacity-80 cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredLink({
                        sourceName: srcNode.name,
                        targetName: tgtNode.name,
                        value: link.value,
                        percent: ((link.value / totalCount) * 100).toFixed(1) + "%",
                      });
                    }}
                    onMouseLeave={() => setHoveredLink(null)}
                  />
                );
              })}
            </g>

            {/* Draw Nodes (Solid Blocks) */}
            <g>
              {layoutNodes.map((node, idx) => {
                const x0 = node.x0 ?? 0;
                const x1 = node.x1 ?? 0;
                const y0 = node.y0 ?? 0;
                const y1 = node.y1 ?? 0;
                const width = Math.max(10, x1 - x0);
                const height = Math.max(4, y1 - y0);
                const isRightSide = x0 > dimensions.width / 2;

                return (
                  <g key={`node-${idx}`} className="group cursor-default">
                    <rect
                      x={x0}
                      y={y0}
                      width={width}
                      height={height}
                      fill={node.color}
                      rx={3}
                      className="transition-opacity group-hover:opacity-90"
                    />
                    <text
                      x={isRightSide ? x0 - 8 : x1 + 8}
                      y={y0 + height / 2}
                      dy="0.35em"
                      textAnchor={isRightSide ? "end" : "start"}
                      fontSize={11}
                      className="fill-zinc-300 font-medium group-hover:fill-zinc-100 transition-colors pointer-events-none"
                    >
                      {node.name}{" "}
                      <tspan className="fill-zinc-500 font-mono text-[10px]">
                        ({node.value})
                      </tspan>
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        )}
      </div>
    </div>
  );
}