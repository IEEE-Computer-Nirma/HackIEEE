"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Registration } from "./ParticipantTable";
import { cn } from "@/lib/utils";

interface RegistrationTrendChartProps {
  registrations: Registration[];
}

type TimeRange = "7d" | "14d" | "30d" | "all";

interface DataPoint {
  dateKey: string;
  displayDate: string;
  daily: number;
  cumulative: number;
}

export default function RegistrationTrendChart({
  registrations,
}: RegistrationTrendChartProps) {
  const [timeRange, setTimeRange] = React.useState<TimeRange>("all");

  const { chartData, peakDaily, rangeTotal } = React.useMemo(() => {
    if (!registrations || registrations.length === 0) {
      return { chartData: [], peakDaily: 0, rangeTotal: 0 };
    }

    // Sort registrations chronologically ascending
    const sorted = [...registrations].sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0;
      return ta - tb;
    });

    // Group daily counts
    const dailyMap = new Map<string, number>();
    for (const r of sorted) {
      if (!r.created_at) continue;
      const d = new Date(r.created_at);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
    }

    // Determine range boundary
    const now = new Date();
    let cutoffDays = 0;
    if (timeRange === "7d") cutoffDays = 7;
    else if (timeRange === "14d") cutoffDays = 14;
    else if (timeRange === "30d") cutoffDays = 30;

    const allKeys = Array.from(dailyMap.keys()).sort();
    if (allKeys.length === 0) {
      return { chartData: [], peakDaily: 0, rangeTotal: 0 };
    }

    // If filtering by days, determine start date
    let startD: Date;
    if (cutoffDays > 0) {
      startD = new Date(now.getFullYear(), now.getMonth(), now.getDate() - cutoffDays + 1);
    } else {
      const firstParts = allKeys[0].split("-").map(Number);
      startD = new Date(firstParts[0], firstParts[1] - 1, firstParts[2]);
    }

    const endD = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Generate continuous date series from startD to endD
    const data: DataPoint[] = [];
    let runningCumulative = 0;
    let peak = 0;
    let rangeSum = 0;

    // First calculate cumulative count up to startD
    for (const k of allKeys) {
      const parts = k.split("-").map(Number);
      const curD = new Date(parts[0], parts[1] - 1, parts[2]);
      if (curD < startD) {
        runningCumulative += dailyMap.get(k) || 0;
      }
    }

    const cur = new Date(startD);
    while (cur <= endD) {
      const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
      const dailyCount = dailyMap.get(key) || 0;
      runningCumulative += dailyCount;
      rangeSum += dailyCount;

      if (dailyCount > peak) peak = dailyCount;

      const display = cur.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });

      data.push({
        dateKey: key,
        displayDate: display,
        daily: dailyCount,
        cumulative: runningCumulative,
      });

      cur.setDate(cur.getDate() + 1);
    }

    return { chartData: data, peakDaily: peak, rangeTotal: rangeSum };
  }, [registrations, timeRange]);

  return (
    <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 shadow-sm space-y-4">
      {/* ── Top Header Controls ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-zinc-100">
              Registration Velocity & Trajectory
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Daily inflow spikes and cumulative attendee ramp-up over time.
          </p>
        </div>

        {/* Time Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs w-full sm:w-auto justify-between sm:justify-start">
          {(
            [
              { label: "7 Days", short: "7D", value: "7d" },
              { label: "14 Days", short: "14D", value: "14d" },
              { label: "30 Days", short: "30D", value: "30d" },
              { label: "All Time", short: "All", value: "all" },
            ] as const
          ).map((item) => (
            <button
              key={item.value}
              onClick={() => setTimeRange(item.value)}
              className={cn(
                "px-2 sm:px-2.5 py-1 rounded-md font-medium transition-colors text-xs flex-1 sm:flex-initial text-center",
                timeRange === item.value
                  ? "bg-zinc-800 text-zinc-100 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              <span className="hidden xs:inline">{item.label}</span>
              <span className="xs:hidden">{item.short}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Metric Snapshot Summary ── */}
      <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs border-b border-zinc-800/60 pb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Period Registrations:</span>
          <strong className="text-zinc-200 font-mono text-sm">{rangeTotal}</strong>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Peak Velocity:</span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono font-medium">
            <Zap className="h-3 w-3" />
            {peakDaily} / day
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500">Trajectory:</span>
          <span className="text-zinc-300 font-mono">
            {chartData.length > 0
              ? `${chartData[chartData.length - 1].cumulative} total`
              : "0"}
          </span>
        </div>
      </div>

      {/* ── Recharts Canvas ── */}
      <div className="h-[220px] sm:h-[260px] md:h-[280px] w-full pt-1">
        {chartData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-zinc-500 space-y-1">
            <Calendar className="h-6 w-6 text-zinc-600" />
            <p className="text-xs">No registration data recorded in this timeframe.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="displayDate"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: "#27272a" }}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const item = payload[0].payload as DataPoint;
                  return (
                    <div className="rounded-lg border border-zinc-700 bg-zinc-950/95 p-2.5 shadow-xl backdrop-blur text-xs space-y-1 font-sans">
                      <p className="font-semibold text-zinc-200 border-b border-zinc-800 pb-1">
                        {item.displayDate}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          Daily Registrations:
                        </span>
                        <strong className="text-zinc-100 font-mono">
                          +{item.daily}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-zinc-400">
                          <span className="h-2 w-2 rounded-full bg-zinc-400" />
                          Cumulative Total:
                        </span>
                        <strong className="text-zinc-100 font-mono">
                          {item.cumulative}
                        </strong>
                      </div>
                    </div>
                  );
                }}
              />
              <Area
                type="monotone"
                dataKey="daily"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#dailyGradient)"
                name="Daily Registrations"
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="#a1a1aa"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name="Cumulative Total"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}