"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { PieChart as PieIcon, Radio, GraduationCap, Award } from "lucide-react";
import { type Registration } from "./ParticipantTable";
import { cn } from "@/lib/utils";

interface DemographicsDonutChartProps {
  registrations: Registration[];
}

type DemographicMode = "ieee" | "year" | "degree";

interface SliceData {
  name: string;
  value: number;
  color: string;
  percentage: string;
}

const PALETTE = [
  "#10b981", // emerald-500
  "#06b6d4", // cyan-500
  "#6366f1", // indigo-500
  "#a855f7", // purple-500
  "#f59e0b", // amber-500
  "#71717a", // zinc-500
];

export default function DemographicsDonutChart({
  registrations,
}: DemographicsDonutChartProps) {
  const [mode, setMode] = React.useState<DemographicMode>("ieee");
  const [activeSlice, setActiveSlice] = React.useState<SliceData | null>(null);

  const { data, totalCount } = React.useMemo(() => {
    const total = registrations.length;
    if (total === 0) return { data: [], totalCount: 0 };

    if (mode === "ieee") {
      let ieee = 0;
      let nonIeee = 0;
      let ieeeCs = 0;

      for (const r of registrations) {
        if (r.is_ieee_member) ieee++;
        else nonIeee++;
        if (r.is_ieee_cs_member) ieeeCs++;
      }

      const items: SliceData[] = [
        {
          name: "IEEE Members",
          value: ieee,
          color: "#10b981",
          percentage: ((ieee / total) * 100).toFixed(1),
        },
        {
          name: "Non-Members",
          value: nonIeee,
          color: "#52525b",
          percentage: ((nonIeee / total) * 100).toFixed(1),
        },
      ];

      if (ieeeCs > 0) {
        items.push({
          name: "IEEE CS Chapter",
          value: ieeeCs,
          color: "#06b6d4",
          percentage: ((ieeeCs / total) * 100).toFixed(1),
        });
      }

      return { data: items, totalCount: total };
    }

    if (mode === "year") {
      const counts = new Map<string, number>();
      for (const r of registrations) {
        const y = (r.year_of_study || "").trim() || "Unspecified";
        counts.set(y, (counts.get(y) || 0) + 1);
      }

      const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
      const items: SliceData[] = sorted.map(([name, count], idx) => ({
        name,
        value: count,
        color: PALETTE[idx % PALETTE.length],
        percentage: ((count / total) * 100).toFixed(1),
      }));

      return { data: items, totalCount: total };
    }

    // Degree distribution
    const counts = new Map<string, number>();
    for (const r of registrations) {
      const d = (r.degree || "").trim() || "Other";
      counts.set(d, (counts.get(d) || 0) + 1);
    }

    const sorted = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    const items: SliceData[] = sorted.map(([name, count], idx) => ({
      name,
      value: count,
      color: PALETTE[idx % PALETTE.length],
      percentage: ((count / total) * 100).toFixed(1),
    }));

    return { data: items, totalCount: total };
  }, [registrations, mode]);

  // Set default active slice when data changes
  React.useEffect(() => {
    if (data.length > 0) {
      setActiveSlice(data[0]);
    } else {
      setActiveSlice(null);
    }
  }, [data]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-sm space-y-4 flex flex-col justify-between">
      {/* ── Top Mode Switcher Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <PieIcon className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Demographics & Cohort Breakdown
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Compare attendee ratios across IEEE status, academic year, and degrees.
          </p>
        </div>

        {/* Mode Toggle Pills */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setMode("ieee")}
            className={cn(
              "px-2 sm:px-2.5 py-1 rounded-md font-medium transition-colors text-xs flex-1 sm:flex-initial flex items-center justify-center gap-1.5",
              mode === "ieee"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Radio className="h-3 w-3" />
            IEEE
          </button>
          <button
            onClick={() => setMode("year")}
            className={cn(
              "px-2 sm:px-2.5 py-1 rounded-md font-medium transition-colors text-xs flex-1 sm:flex-initial flex items-center justify-center gap-1.5",
              mode === "year"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <GraduationCap className="h-3 w-3" />
            Year
          </button>
          <button
            onClick={() => setMode("degree")}
            className={cn(
              "px-2 sm:px-2.5 py-1 rounded-md font-medium transition-colors text-xs flex-1 sm:flex-initial flex items-center justify-center gap-1.5",
              mode === "degree"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            )}
          >
            <Award className="h-3 w-3" />
            Degree
          </button>
        </div>
      </div>

      {/* ── Donut Chart Canvas & Legend ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left: Donut Circle with Center Badge */}
        <div className="relative h-[200px] sm:h-[220px] w-full flex items-center justify-center">
          {data.length === 0 ? (
            <div className="text-xs text-zinc-500">No demographic data available</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || payload.length === 0) return null;
                      const item = payload[0].payload as SliceData;
                      return (
                        <div className="rounded-lg border border-zinc-700 bg-zinc-950/95 p-2 shadow-xl backdrop-blur text-xs space-y-0.5">
                          <p className="font-semibold text-zinc-200">{item.name}</p>
                          <p className="text-zinc-400 font-mono">
                            {item.value} participants ({item.percentage}%)
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={86}
                    paddingAngle={3}
                    dataKey="value"
                    onClick={(_, index: number) => {
                      if (data[index]) setActiveSlice(data[index]);
                    }}
                    onMouseEnter={(_, index: number) => {
                      if (data[index]) setActiveSlice(data[index]);
                    }}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#18181b"
                        strokeWidth={2}
                        className="cursor-pointer transition-all hover:opacity-90"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Readout */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none text-center">
                {activeSlice ? (
                  <>
                    <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-zinc-100">
                      {activeSlice.percentage}%
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium truncate max-w-[90px] sm:max-w-[100px]" title={activeSlice.name}>
                      {activeSlice.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      ({activeSlice.value} / {totalCount})
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-lg sm:text-xl font-bold font-mono text-zinc-100">
                      {totalCount}
                    </span>
                    <span className="text-[10px] text-zinc-500">Attendees</span>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right: Demographic Legend Pills */}
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-1">
            Cohort Summary
          </p>
          <div className="space-y-1.5 max-h-[160px] sm:max-h-[190px] overflow-y-auto pr-1">
            {data.map((item) => {
              const isSelected = activeSlice?.name === item.name;
              return (
                <div
                  key={item.name}
                  onClick={() => setActiveSlice(item)}
                  onMouseEnter={() => setActiveSlice(item)}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all",
                    isSelected
                      ? "bg-zinc-800/80 border-zinc-700 text-zinc-100 shadow-sm"
                      : "bg-zinc-950/40 border-zinc-800/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  )}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono flex-shrink-0 ml-2">
                    <span className="text-zinc-200">{item.value}</span>
                    <span className="text-[10px] text-zinc-500">
                      ({item.percentage}%)
                    </span>
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