"use client";

import * as React from "react";
import { RefreshCw, Users, ShieldCheck, Database, Radio } from "lucide-react";
import ParticipantTable, {
  type Registration,
} from "@/app/components/admin/ParticipantTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSupabaseBrowserClient } from "@/app/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);
  const [filteredCount, setFilteredCount] = React.useState<number>(0);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [lastSync, setLastSync] = React.useState<Date | null>(null);

  // Fetch registrations from secure server API
  const fetchRegistrations = React.useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Check for user session token if available
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/admin/registrations", {
        headers,
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || `Failed with status ${res.status}`);
      }

      setRegistrations(json.registrations || []);
      setFilteredCount((json.registrations || []).length);
      setLastSync(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load registrations";
      console.error("[Admin Dashboard] Fetch error:", err);
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load
  React.useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Realtime subscription on public.registrations
  React.useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel("admin-realtime-registrations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          // Re-fetch when any insert/update/delete happens in database
          fetchRegistrations(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRegistrations]);

  const handleViewDetails = (participant: Registration) => {
    // This will open the ParticipantDetailModal in Step 1.4
    console.log("Viewing participant:", participant);
    alert(`Participant Selected:\n\nID: ${participant.registration_id}\nName: ${participant.full_name}\nEmail: ${participant.email}\nUniversity: ${participant.university}\nBranch: ${participant.branch}\nIEEE Member: ${participant.is_ieee_member ? "Yes" : "No"}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ── Top Navigation Header ── */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold text-zinc-100 tracking-tight">
                  HackIEEE Organizer Dashboard
                </h1>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-zinc-700 text-zinc-300">
                  Admin v1.0
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                Live participant management & attendee directory
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 mr-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Database Sync</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchRegistrations(true)}
              disabled={loading || refreshing}
              className="text-xs h-8"
            >
              <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", refreshing && "animate-spin")} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Quick Overview Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Total Registered</p>
              <p className="text-2xl font-bold tracking-tight text-zinc-100 mt-1">
                {registrations.length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">IEEE Members</p>
              <p className="text-2xl font-bold tracking-tight text-emerald-400 mt-1">
                {registrations.filter((r) => r.is_ieee_member).length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
              <Radio className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">Unique Colleges</p>
              <p className="text-2xl font-bold tracking-tight text-zinc-100 mt-1">
                {new Set(registrations.map((r) => r.university).filter(Boolean)).size}
              </p>
            </div>
            <div className="h-10 w-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
              <Database className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Error Alert if any */}
        {error && (
          <div className="rounded-lg border border-red-800/60 bg-red-950/40 p-4 text-sm text-red-300 flex items-center justify-between">
            <div>
              <p className="font-semibold">Failed to fetch live registrations</p>
              <p className="text-xs text-red-400 mt-0.5">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchRegistrations(true)}
              className="text-xs border-red-800 hover:bg-red-900/50"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading ? (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin text-zinc-400 mx-auto" />
            <p className="text-sm font-medium text-zinc-300">Loading attendee directory...</p>
            <p className="text-xs text-zinc-500">Connecting to Supabase PostgreSQL database</p>
          </div>
        ) : (
          /* Participant Directory Table */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">
                  Participant Directory
                </h2>
                <p className="text-xs text-zinc-400">
                  Search, filter, inspect profiles, and track attendance.
                </p>
              </div>
              {lastSync && (
                <span className="text-xs text-zinc-500 hidden sm:inline">
                  Last synced at {lastSync.toLocaleTimeString("en-IN")}
                </span>
              )}
            </div>

            <ParticipantTable
              registrations={registrations}
              onViewDetails={handleViewDetails}
              onFilteredRegistrationsChange={(filtered) => setFilteredCount(filtered.length)}
            />
          </div>
        )}
      </main>
    </div>
  );
}
