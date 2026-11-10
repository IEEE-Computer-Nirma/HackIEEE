"use client";

import * as React from "react";
import {
  Users,
  ShieldCheck,
  Database,
  Radio,
  LogOut,
  RefreshCw,
  BarChart3,
  Workflow,
  Download,
  AlertTriangle,
  Lock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/app/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import ParticipantTable, {
  type Registration,
} from "@/app/components/admin/ParticipantTable";
import ParticipantDetailModal from "@/app/components/admin/ParticipantDetailModal";
import ExportToolbar from "@/app/components/admin/ExportToolbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdminProfile {
  email: string;
  fullName: string;
  role: string;
}

type DashboardTab = "participants" | "analytics" | "deep";

export default function AdminDashboardPage() {
  // Auth state
  const [sessionChecked, setSessionChecked] = React.useState(false);
  const [currentUserEmail, setCurrentUserEmail] = React.useState<string | null>(null);
  const [adminProfile, setAdminProfile] = React.useState<AdminProfile | null>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = React.useState<DashboardTab>("participants");
  const [registrations, setRegistrations] = React.useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = React.useState<Registration[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastSync, setLastSync] = React.useState<Date | null>(null);

  // Selected participant for modal inspection
  const [selectedParticipant, setSelectedParticipant] = React.useState<Registration | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  // ── Fetch registrations with token ──
  const fetchRegistrations = React.useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);
    setAuthError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session?.access_token) {
        setSessionChecked(true);
        setCurrentUserEmail(null);
        setAdminProfile(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      setCurrentUserEmail(session.user?.email || null);

      const res = await fetch("/api/admin/registrations", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (res.status === 403) {
          setAuthError(json.error || "Access Denied: Your account is not on the organizer whitelist.");
          setAdminProfile(null);
        } else {
          setAuthError(json.error || `Server error (${res.status})`);
        }
        setRegistrations([]);
        setFilteredRegistrations([]);
        return;
      }

      setRegistrations(json.registrations || []);
      setFilteredRegistrations(json.registrations || []);
      if (json.admin) {
        setAdminProfile(json.admin);
      }
      setLastSync(new Date());
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      console.error("[Admin Dashboard] Fetch error:", err);
      setAuthError(msg);
    } finally {
      setSessionChecked(true);
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Check initial session & listen for auth state changes
  React.useEffect(() => {
    const initAuth = async () => {
      const supabase = getSupabaseBrowserClient();
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        if (code) {
          try {
            await supabase.auth.exchangeCodeForSession(code);
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (err) {
            console.error("[Admin Auth] Code exchange error:", err);
          }
        }
      }
      await fetchRegistrations();
    };

    initAuth();

    const supabase = getSupabaseBrowserClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        fetchRegistrations();
      } else if (event === "SIGNED_OUT") {
        setCurrentUserEmail(null);
        setAdminProfile(null);
        setRegistrations([]);
        setFilteredRegistrations([]);
        setSessionChecked(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchRegistrations]);

  // Realtime subscription on public.registrations
  React.useEffect(() => {
    if (!adminProfile) return;

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
          fetchRegistrations(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [adminProfile, fetchRegistrations]);

  // ── Google OAuth Sign-in Handler ──
  const handleGoogleSignIn = async () => {
    setLoading(true);
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        queryParams: {
          prompt: "select_account",
        },
      },
    });
  };

  // ── Sign-out Handler ──
  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    setCurrentUserEmail(null);
    setAdminProfile(null);
    setRegistrations([]);
    setFilteredRegistrations([]);
  };

  const handleInspectParticipant = (participant: Registration) => {
    setSelectedParticipant(participant);
    setModalOpen(true);
  };

  // ── 1. Checking Session State ──
  if (!sessionChecked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400 space-y-3">
        <RefreshCw className="h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-sm font-medium">Verifying organizer credentials...</p>
      </div>
    );
  }

  // ── 2. Unauthenticated State: Google OAuth Login Gate ──
  if (!currentUserEmail) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl text-center space-y-6 animate-in fade-in-0 duration-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 border border-zinc-700 text-zinc-100 shadow-inner">
            <ShieldCheck className="h-7 w-7 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <Badge variant="outline" className="border-zinc-700 text-zinc-300 text-xs px-2.5 py-0.5">
              <Lock className="mr-1 h-3 w-3 text-zinc-400" /> Restricted Access
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
              HackIEEE Organizer Portal
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
              Access is restricted to authorized organizing committee members. Sign in with your Google account to access attendee records and management tools.
            </p>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full h-11 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold shadow-md flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
          >
            {/* Google G Logo */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800">
            Only whitelisted organizing accounts have permission to access.
          </p>
        </div>
      </div>
    );
  }

  // ── 3. Authenticated but Unauthorized (Not on Whitelist) ──
  if (authError && !adminProfile) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-red-900/60 bg-zinc-900/80 p-8 shadow-2xl backdrop-blur-xl text-center space-y-5 animate-in fade-in-0 duration-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-950/80 border border-red-800/80 text-red-400">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-bold text-zinc-100">Access Restricted</h2>
            <p className="text-xs text-red-300/90 leading-relaxed">
              You are signed in as <strong className="text-white underline">{currentUserEmail}</strong>, but this email address is not in the HackIEEE organizer whitelist.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-left text-xs text-zinc-400 space-y-1">
            <p className="text-zinc-300 font-medium">To gain access:</p>
            <p>1. Ensure your email was added to the Supabase <code className="text-emerald-400">admin_users</code> table.</p>
            <p>2. Or sign in using your official IEEE committee Google account.</p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full text-xs border-zinc-700 hover:bg-zinc-800"
            >
              <LogOut className="mr-1.5 h-3.5 w-3.5" />
              Sign in with a different account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── 4. Authenticated & Authorized: Shadcn Sidebar Dashboard ──
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* ── Left Sidebar (Shadcn Style - Fixed in View) ── */}
      <aside className="w-64 h-full flex-shrink-0 border-r border-zinc-800/80 bg-zinc-950 flex flex-col justify-between select-none z-20">
        {/* Top: Branding & Navigation (Scrolls if viewport is very short) */}
        <div className="p-4 space-y-5 overflow-y-auto flex-1">
          {/* Logo & Portal Identity */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm text-zinc-100">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-zinc-100">
                HackIEEE 2027
              </span>
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                Organizer Portal
              </span>
            </div>
          </div>

          {/* Nav Section: Core Dashboard */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 mb-2">
              Management
            </p>

            <button
              onClick={() => setActiveTab("participants")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                activeTab === "participants"
                  ? "bg-zinc-800 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Users className="h-4 w-4" />
                Participant Directory
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700/60 text-zinc-300">
                {registrations.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                activeTab === "analytics"
                  ? "bg-zinc-800 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <span className="flex items-center gap-2.5">
                <BarChart3 className="h-4 w-4" />
                Visual Analytics
              </span>
              <Badge variant="outline" className="text-[9px] px-1 py-0 border-zinc-700 text-zinc-400">
                Phase 2
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("deep")}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left",
                activeTab === "deep"
                  ? "bg-zinc-800 text-zinc-100 font-semibold"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Workflow className="h-4 w-4" />
                Deep Cohorts
              </span>
              <Badge variant="outline" className="text-[9px] px-1 py-0 border-zinc-700 text-zinc-400">
                Phase 3
              </Badge>
            </button>
          </div>

          {/* System Section */}
          <div className="space-y-1.5 pt-4 border-t border-zinc-800/60">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 mb-2">
              System Health
            </p>
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-xs text-zinc-300">
              <span className="flex items-center gap-2">
                <Database className="h-3.5 w-3.5 text-zinc-400" />
                Supabase Realtime
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Footer: Log Out & User Profile Card (Pinned & Always Visible) */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-900/50 space-y-2.5 mt-auto flex-shrink-0">
          {/* Logout Button prominently visible just above user info */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="w-full justify-start text-xs h-8 border-zinc-800 bg-zinc-950/70 text-zinc-300 hover:text-red-400 hover:bg-red-950/30 hover:border-red-900/50 transition-colors shadow-sm"
          >
            <LogOut className="mr-2 h-3.5 w-3.5 text-zinc-400" />
            Log Out
          </Button>

          {/* User Card */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/60">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-100">
                {adminProfile?.fullName?.charAt(0).toUpperCase() || currentUserEmail?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-zinc-200 truncate">
                  {adminProfile?.fullName || "Organizer"}
                </span>
                <span className="text-[10px] text-zinc-500 truncate" title={currentUserEmail || ""}>
                  {currentUserEmail}
                </span>
              </div>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] uppercase tracking-wider px-1.5 py-0 flex-shrink-0",
                adminProfile?.role === "owner" ? "border-amber-700/60 text-amber-300" : "border-zinc-700 text-zinc-300"
              )}
            >
              {adminProfile?.role || "Admin"}
            </Badge>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area (Inner-scrollable) ── */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar (Fixed & Pinned) */}
        <header className="h-14 flex-shrink-0 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md px-6 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Admin</span>
              <ChevronRight className="h-3 w-3 text-zinc-600" />
              <span className="text-zinc-200 capitalize font-medium">{activeTab}</span>
            </div>
            <h2 className="text-base font-semibold text-zinc-100 capitalize">
              {activeTab === "participants" && "Participant Directory"}
              {activeTab === "analytics" && "Visual Analytics & Demographics"}
              {activeTab === "deep" && "Deep Cohort Analytics"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Database Channel</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchRegistrations(true)}
              disabled={loading || refreshing}
              className="text-xs h-8 border-zinc-800"
            >
              <RefreshCw className={cn("mr-1.5 h-3.5 w-3.5", refreshing && "animate-spin")} />
              {refreshing ? "Refreshing..." : "Refresh Data"}
            </Button>
          </div>
        </header>

        {/* Content Body (Inner-scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "participants" && (
            <>
              {/* Metric KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Total Registrations</p>
                    <p className="text-2xl font-bold tracking-tight text-zinc-100 mt-1">
                      {registrations.length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">IEEE Members</p>
                    <p className="text-2xl font-bold tracking-tight text-emerald-400 mt-1">
                      {registrations.filter((r) => r.is_ieee_member).length}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400">
                    <Radio className="h-5 w-5" />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Unique Colleges</p>
                    <p className="text-2xl font-bold tracking-tight text-zinc-100 mt-1">
                      {new Set(registrations.map((r) => r.university).filter(Boolean)).size}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <Database className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Multi-Format Export Toolbar */}
              <ExportToolbar
                registrations={registrations}
                filteredRegistrations={filteredRegistrations}
              />

              {/* Participant Table */}
              <ParticipantTable
                registrations={registrations}
                onViewDetails={handleInspectParticipant}
                onFilteredRegistrationsChange={setFilteredRegistrations}
              />
            </>
          )}

          {activeTab === "analytics" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
              <BarChart3 className="h-10 w-10 text-zinc-500 mx-auto" />
              <h3 className="text-base font-semibold text-zinc-200">Visual Analytics (Phase 2)</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Next up in Phase 2: Live Velocity Line Chart, Donut/Circle Demographics (IEEE vs Non-IEEE), and Top 10 Ranked Colleges Leaderboard.
              </p>
            </div>
          )}

          {activeTab === "deep" && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-3">
              <Workflow className="h-10 w-10 text-zinc-500 mx-auto" />
              <h3 className="text-base font-semibold text-zinc-200">Deep Cohort Analytics (Phase 3)</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                Next up in Phase 3: Sankey Flow Diagram (University ➔ Branch ➔ IEEE) and Radial Sunburst Hierarchy Tree.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Participant Detail Card Modal */}
      <ParticipantDetailModal
        participant={selectedParticipant}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
