
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy, MessageCircle } from "lucide-react";

import type { Registration } from "./ParticipantTable";

interface ParticipantDetailModalProps {
  participant: Registration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ParticipantDetailModal({
  participant,
  open,
  onOpenChange,
}: ParticipantDetailModalProps) {
  if (!participant) return null;

  const displayValue = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return "Not provided";
    }

    return String(value);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(
        String(participant.email ?? "")
      );
    } catch (error) {
      console.error("Could not copy email:", error);
    }
  };

  const whatsappNumber = String(
    participant.phone ?? ""
  ).replace(/\D/g, "");

  const Detail = ({
    label,
    value,
  }: {
    label: string;
    value: unknown;
  }) => (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wider text-[#f8cf96]/45">
        {label}
      </p>

      <p className="break-words text-sm text-[#f8cf96]">
        {displayValue(value)}
      </p>
    </div>
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-[#f8cf96]/15 bg-[#120d09] text-[#f8cf96]">

        {/* Header Banner */}
        <DialogHeader className="border-b border-[#f8cf96]/10 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-0 bg-[#4ade80]/15 text-[#4ade80]">
              <Check className="mr-1 h-3 w-3" />
              Registration Recorded
            </Badge>

            <span className="text-xs text-[#f8cf96]/50">
              {formatDate(String(participant.created_at))}
            </span>
          </div>

          <DialogTitle className="pt-3 text-2xl font-semibold text-white">
            {displayValue(participant.full_name)}
          </DialogTitle>

          <p className="font-mono text-lg tracking-wider text-[#f8cf96]">
            {displayValue(participant.registration_id)}
          </p>
        </DialogHeader>

        <div className="space-y-6 py-3">

          {/* Academic Information */}
          <section className="rounded-xl border border-[#f8cf96]/10 bg-[#0a0705] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#e2822f]">
              Academic Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <Detail
                label="University / Institution"
                value={participant.university}
              />

              <Detail
                label="Degree"
                value={participant.degree}
              />

              <Detail
                label="Major Branch"
                value={participant.branch}
              />

              <Detail
                label="Year of Study"
                value={participant.year_of_study}
              />

              <Detail
                label="Expected Graduation Year"
                value={participant.graduation_year}
              />

              <Detail
                label="College Email"
                value={participant.college_email}
              />
            </div>
          </section>

          {/* Contact & Personal Information */}
          <section className="rounded-xl border border-[#f8cf96]/10 bg-[#0a0705] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#e2822f]">
              Contact & Personal Information
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Detail
                  label="Personal Email"
                  value={participant.email}
                />

                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyEmail}
                  className="border-[#f8cf96]/20 bg-transparent text-[#f8cf96]"
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Email
                </Button>
              </div>

              <div className="space-y-2">
                <Detail
                  label="Phone Number"
                  value={participant.phone}
                />

                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md border border-[#4ade80]/30 px-3 py-2 text-sm text-[#4ade80]"
                  >
                    <MessageCircle className="mr-2 h-3 w-3" />
                    WhatsApp
                  </a>
                )}
              </div>

              <Detail label="City" value={participant.city} />
              <Detail label="State" value={participant.state} />
              <Detail label="Country" value={participant.country} />
            </div>
          </section>

          {/* IEEE Affiliation */}
          <section className="rounded-xl border border-[#f8cf96]/10 bg-[#0a0705] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#e2822f]">
              IEEE Affiliation Details
            </h3>

            <div className="grid gap-5 sm:grid-cols-2">
              <Detail
                label="IEEE Membership"
                value={participant.is_ieee_member ? "Yes" : "No"}
              />

              <Detail
                label="IEEE Member Number"
                value={participant.ieee_membership_number}
              />

              <Detail
                label="IEEE Computer Society Member"
                value={participant.is_ieee_cs_member ? "Yes" : "No"}
              />
            </div>
          </section>

          {/* Online Presence & Links */}
          <section className="rounded-xl border border-[#f8cf96]/10 bg-[#0a0705] p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#e2822f]">
              Online Presence & Links
            </h3>

            <div className="flex flex-wrap gap-3">
              {Boolean(participant.github_url) && (
                <a
                  href={String(participant.github_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-[#f8cf96]/20 px-4 py-2 text-sm text-[#f8cf96]"
                >
                  GitHub
                </a>
              )}

              {Boolean(participant.linkedin_url) && (
                <a
                  href={String(participant.linkedin_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-[#f8cf96]/20 px-4 py-2 text-sm text-[#f8cf96]"
                >
                  LinkedIn
                </a>
              )}
            </div>

            <div className="mt-5">
              <Detail
                label="How did you hear about HackIEEE?"
                value={participant.hear_about}
              />
            </div>
          </section>

          {/* Raw JSON Inspector */}
          <section className="rounded-xl border border-[#f8cf96]/10 bg-[#0a0705] px-5">
            <details className="py-4">
              <summary className="cursor-pointer text-sm text-[#e2822f]">
                Raw JSON Payload Inspector
              </summary>

              <pre className="mt-4 max-h-80 overflow-auto rounded-lg bg-black/40 p-4 text-xs text-[#f8cf96]/80">
                {JSON.stringify(participant.data ?? {}, null, 2)}
              </pre>
            </details>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  );
}
