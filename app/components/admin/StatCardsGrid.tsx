"use client";

import * as React from "react";
import {
  Users,
  Radio,
  Building2,
  Trophy,
  TrendingUp,
  MapPin,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Registration } from "./ParticipantTable";
import { cn } from "@/lib/utils";

interface StatCardsGridProps {
  registrations: Registration[];
}

export default function StatCardsGrid({ registrations }: StatCardsGridProps) {
  const stats = React.useMemo(() => {
    const total = registrations.length;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    let todayCount = 0;
    let thisWeekCount = 0;
    let ieeeMembers = 0;
    let ieeeCsMembers = 0;
    const collegeCounts = new Map<string, number>();
    const statesSet = new Set<string>();

    for (const r of registrations) {
      const regTime = r.created_at ? new Date(r.created_at).getTime() : 0;
      if (regTime >= startOfToday) todayCount++;
      if (regTime >= sevenDaysAgo) thisWeekCount++;

      if (r.is_ieee_member) ieeeMembers++;
      if (r.is_ieee_cs_member) ieeeCsMembers++;

      const col = (r.university || "").trim();
      if (col) {
        collegeCounts.set(col, (collegeCounts.get(col) || 0) + 1);
      }

      const st = (r.state || "").trim();
      if (st) statesSet.add(st);
    }

    const nonIeeeMembers = total - ieeeMembers;
    const ieeePercent = total > 0 ? ((ieeeMembers / total) * 100).toFixed(1) : "0";
    const ieeeCsPercent = ieeeMembers > 0 ? ((ieeeCsMembers / ieeeMembers) * 100).toFixed(0) : "0";

    const sortedColleges = Array.from(collegeCounts.entries()).sort(
      (a, b) => b[1] - a[1]
    );

    const topCollege = sortedColleges[0] || ["No data yet", 0];
    const runnerUp = sortedColleges[1] || null;
    const topCollegeShare =
      total > 0 && topCollege[1] > 0
        ? ((topCollege[1] / total) * 100).toFixed(1)
        : "0";

    return {
      total,
      todayCount,
      thisWeekCount,
      ieeeMembers,
      ieeeCsMembers,
      nonIeeeMembers,
      ieeePercent,
      ieeeCsPercent,
      uniqueColleges: collegeCounts.size,
      uniqueStates: statesSet.size,
      topCollegeName: topCollege[0],
      topCollegeCount: topCollege[1],
      topCollegeShare,
      runnerUpName: runnerUp ? runnerUp[0] : null,
      runnerUpCount: runnerUp ? runnerUp[1] : 0,
    };
  }, [registrations]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* ── Card 1: Total Registrations ── */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Total Registrations</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:text-zinc-100 transition-colors">
            <Users className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-100 font-mono">
              {stats.total}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live DB
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium font-mono">
              <TrendingUp className="h-3 w-3" />
              +{stats.todayCount} today
            </span>
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-zinc-400">+{stats.thisWeekCount} this week</span>
          </div>
        </div>
      </div>

      {/* ── Card 2: IEEE Membership Breakdown ── */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">IEEE Membership</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-emerald-400">
            <Radio className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-emerald-400 font-mono">
              {stats.ieeeMembers}
            </span>
            <span className="text-xs font-mono text-zinc-400 font-medium">
              ({stats.ieeePercent}%)
            </span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 font-mono">
              <ShieldCheck className="h-3 w-3 text-cyan-400" />
              CS Chapter: <strong className="text-zinc-200">{stats.ieeeCsMembers}</strong>
            </span>
            <span className="font-mono text-zinc-500">
              Non: <strong className="text-zinc-400">{stats.nonIeeeMembers}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── Card 3: Colleges Represented ── */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">Institutions</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 group-hover:text-zinc-100 transition-colors">
            <Building2 className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-100 font-mono">
              {stats.uniqueColleges}
            </span>
            <span className="text-xs text-zinc-400">Universities</span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1 font-mono">
              <MapPin className="h-3 w-3 text-amber-400" />
              {stats.uniqueStates > 0 ? `${stats.uniqueStates} States / Regions` : "Pan-India Reach"}
            </span>
            <span className="text-zinc-500 text-[10px]">National</span>
          </div>
        </div>
      </div>

      {/* ── Card 4: Top Ranked College ── */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-zinc-700/80 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-400">#1 Top College</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
            <Trophy className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between gap-1">
            <span
              className="text-sm font-bold tracking-tight text-zinc-100 truncate max-w-[170px]"
              title={stats.topCollegeName}
            >
              {stats.topCollegeName}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] font-mono border-amber-900/60 text-amber-400 bg-amber-950/20 px-1.5 py-0 flex-shrink-0"
            >
              {stats.topCollegeCount} ({stats.topCollegeShare}%)
            </Badge>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400">
            <span className="truncate max-w-[180px] text-zinc-500" title={stats.runnerUpName || ""}>
              {stats.runnerUpName ? `#2 ${stats.runnerUpName}` : "Awaiting more records"}
            </span>
            {stats.runnerUpCount > 0 && (
              <span className="font-mono text-zinc-400 flex-shrink-0">
                {stats.runnerUpCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}