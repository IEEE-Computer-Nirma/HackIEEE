"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Building2, Trophy, Medal } from "lucide-react";
import { type Registration } from "./ParticipantTable";
import { Badge } from "@/components/ui/badge";

interface TopCollegesChartProps {
  registrations: Registration[];
}

interface CollegeStat {
  rank: number;
  fullName: string;
  shortName: string;
  total: number;
  ieeeMembers: number;
  nonMembers: number;
  share: string;
}

export default function TopCollegesChart({
  registrations,
}: TopCollegesChartProps) {
  const collegeData = React.useMemo(() => {
    if (!registrations || registrations.length === 0) return [];

    const map = new Map<string, { total: number; ieee: number; nonIeee: number }>();

    for (const r of registrations) {
      const col = (r.university || "").trim();
      if (!col) continue;

      const existing = map.get(col) || { total: 0, ieee: 0, nonIeee: 0 };
      existing.total += 1;
      if (r.is_ieee_member) existing.ieee += 1;
      else existing.nonIeee += 1;

      map.set(col, existing);
    }

    const totalRegs = registrations.length;
    const sorted = Array.from(map.entries())
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10);

    return sorted.map(([name, stat], idx) => {
      // Shorten lengthy institution names for clean Y-axis labels
      let short = name;
      if (short.length > 28) {
        short = short.slice(0, 26) + "…";
      }

      return {
        rank: idx + 1,
        fullName: name,
        shortName: short,
        total: stat.total,
        ieeeMembers: stat.ieee,
        nonMembers: stat.nonIeee,
        share: ((stat.total / totalRegs) * 100).toFixed(1),
      };
    });
  }, [registrations]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-sm space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Top 10 Institutional Leaderboard
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Ranked universities by registration volume, split by IEEE affiliation.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
            <span>IEEE Members</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-zinc-600" />
            <span>Non-Members</span>
          </div>
        </div>
      </div>

      {/* ── Horizontal Bar Chart ── */}
      <div className="h-[320px] w-full pt-2">
        {collegeData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-1">
            <Building2 className="h-6 w-6 text-zinc-600" />
            <p className="text-xs">No college data available yet.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={collegeData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#27272a" }}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="shortName"
                stroke="#a1a1aa"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={170}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const item = payload[0].payload as CollegeStat;
                  return (
                    <div className="rounded-lg border border-zinc-700 bg-zinc-950/95 p-3 shadow-xl backdrop-blur text-xs space-y-1.5 font-sans min-w-[220px]">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                        <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                          <span className="text-amber-400 font-mono">#{item.rank}</span>
                          {item.fullName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span className="text-zinc-400">Total Participants:</span>
                        <strong className="font-mono text-zinc-100">
                          {item.total} ({item.share}%)
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-emerald-400">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          IEEE Members:
                        </span>
                        <strong className="font-mono">{item.ieeeMembers}</strong>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-zinc-500" />
                          Non-Members:
                        </span>
                        <strong className="font-mono text-zinc-200">{item.nonMembers}</strong>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="ieeeMembers"
                stackId="colleges"
                fill="#10b981"
                radius={[0, 0, 0, 0]}
                name="IEEE Members"
              />
              <Bar
                dataKey="nonMembers"
                stackId="colleges"
                fill="#52525b"
                radius={[0, 4, 4, 0]}
                name="Non-Members"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}