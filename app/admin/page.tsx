
"use client";

import { useCallback, useEffect, useState } from "react";

import { getSupabaseBrowserClient } from "@/app/lib/supabase/client";

import ParticipantTable, {
  type Registration,
} from "@/app/components/admin/ParticipantTable";

import ParticipantDetailModal from "@/app/components/admin/ParticipantDetailModal";

import ExportToolbar from "@/app/components/admin/ExportToolbar";

export default function AdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<
    Registration[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [error, setError] = useState("");

  const [selectedParticipant, setSelectedParticipant] =
    useState<Registration | null>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const fetchLive = useCallback(async () => {
    try {
      const supabase = getSupabaseBrowserClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("Please sign in to access the organizer dashboard.");
        setRegistrations([]);
        return;
      }

      const res = await fetch("/api/admin/registrations", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch registrations.");
      }

      if (data.success && Array.isArray(data.registrations)) {
        setRegistrations(data.registrations);
        setLastSync(new Date());
        setError("");
      }
    } catch (err) {
      console.error("Failed to fetch registrations:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load registrations."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLive();

    const supabase = getSupabaseBrowserClient();

    const channel = supabase
      .channel("admin-registrations-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "registrations",
        },
        () => {
          fetchLive();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLive]);

  const handleViewDetails = (participant: Registration) => {
    setSelectedParticipant(participant);
    setModalOpen(true);
  };

  const handleFilteredRegistrationsChange = useCallback(
    (filtered: Registration[]) => {
      setFilteredRegistrations(filtered);
    },
    []
  );

  return (
    <main className="min-h-screen bg-[#0a0705] text-[#f8cf96]">
      <header className="border-b border-[#f8cf96]/10 px-8 py-6">
        <p className="text-sm tracking-[0.3em] text-[#e2822f]">
          HACKIEEE 2027
        </p>

        <h1 className="mt-2 text-3xl font-semibold">
          Organizer Dashboard
        </h1>

        <p className="mt-2 text-sm text-[#f8cf96]/60">
          Manage registrations and monitor event activity.
        </p>
      </header>

      <section className="space-y-6 p-8">
        <div>
          <h2 className="text-xl font-medium">
            Participant Directory
          </h2>

          <p className="mt-2 text-sm text-[#f8cf96]/60">
            View and manage HackIEEE registrations.
          </p>
        </div>

        {!loading && !error && (
          <ExportToolbar
            registrations={registrations}
            filteredRegistrations={filteredRegistrations}
          />
        )}

        {loading ? (
          <p className="text-sm text-[#f8cf96]/60">
            Loading registrations...
          </p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <ParticipantTable
            registrations={registrations}
            onViewDetails={handleViewDetails}
            onFilteredRegistrationsChange={
              handleFilteredRegistrationsChange
            }
          />
        )}

        <p className="text-xs text-[#f8cf96]/40">
          Last synced: {lastSync.toLocaleTimeString("en-IN")}
        </p>
      </section>

      <ParticipantDetailModal
        participant={selectedParticipant}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </main>
  );
}
