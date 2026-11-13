"use client";

import * as React from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Award,
  Globe,
  Copy,
  Check,
  ExternalLink,
  MapPin,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const [copied, setCopied] = React.useState(false);

  if (!participant) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(participant.registration_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto bg-zinc-950 border-zinc-800 p-4 sm:p-6 text-zinc-100">
        {/* ── Modal Header ── */}
        <DialogHeader className="border-b border-zinc-800 pb-3 sm:pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700/80 text-zinc-200">
                {participant.registration_id}
              </span>
              {participant.is_ieee_member && (
                <Badge variant="success" className="text-xs">
                  IEEE Member
                </Badge>
              )}
              {participant.is_ieee_cs_member && (
                <Badge variant="info" className="text-xs">
                  IEEE CS
                </Badge>
              )}
            </div>
            {participant.created_at && (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Registered: {new Date(participant.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            )}
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-zinc-100 mt-1 sm:mt-2">
            {participant.full_name}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            {participant.university} · {participant.branch}
          </DialogDescription>
        </DialogHeader>

        {/* ── Modal Body: Organized Detail Cards ── */}
        <div className="space-y-4 py-4 text-xs">
          {/* 1. Contact Information */}
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5">
            <h4 className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Mail className="h-3.5 w-3.5 text-zinc-400" />
              Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
              <div>
                <span className="text-zinc-500 block">Personal Email:</span>
                <a
                  href={`mailto:${participant.email}`}
                  className="text-zinc-200 hover:text-zinc-50 underline font-medium"
                >
                  {participant.email}
                </a>
              </div>
              {participant.college_email && (
                <div>
                  <span className="text-zinc-500 block">College Email:</span>
                  <span className="text-zinc-300 font-medium">{participant.college_email}</span>
                </div>
              )}
              <div>
                <span className="text-zinc-500 block">Phone:</span>
                <span className="text-zinc-200 font-medium">{participant.phone || "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Location:</span>
                <span className="text-zinc-300 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-zinc-500" />
                  {[participant.city, participant.state, participant.country || "India"]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Academic Information */}
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5">
            <h4 className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <GraduationCap className="h-3.5 w-3.5 text-zinc-400" />
              Academic Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
              <div className="sm:col-span-2">
                <span className="text-zinc-500 block">University / Institute:</span>
                <span className="text-zinc-100 font-medium">{participant.university}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Degree:</span>
                <span className="text-zinc-200 font-medium">{participant.degree || "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Branch / Major:</span>
                <span className="text-zinc-200 font-medium">{participant.branch || "—"}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Year of Study:</span>
                <span className="text-zinc-200 font-medium">{participant.year_of_study || "—"}</span>
              </div>
              {participant.graduation_year && (
                <div>
                  <span className="text-zinc-500 block">Expected Graduation:</span>
                  <span className="text-zinc-200 font-medium">{participant.graduation_year}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. IEEE Membership */}
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5">
            <h4 className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Award className="h-3.5 w-3.5 text-zinc-400" />
              IEEE Affiliation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-300">
              <div>
                <span className="text-zinc-500 block">IEEE Member:</span>
                <span className="font-medium">
                  {participant.is_ieee_member ? (
                    <Badge variant="success" className="text-[10px]">Active Member</Badge>
                  ) : (
                    <span className="text-zinc-400">Non-Member</span>
                  )}
                </span>
              </div>
              {participant.ieee_membership_number && (
                <div>
                  <span className="text-zinc-500 block">Membership Number:</span>
                  <span className="font-mono text-zinc-200 font-semibold">
                    {participant.ieee_membership_number}
                  </span>
                </div>
              )}
              <div>
                <span className="text-zinc-500 block">IEEE Computer Society:</span>
                <span className="font-medium">
                  {participant.is_ieee_cs_member ? (
                    <Badge variant="info" className="text-[10px]">CS Chapter Member</Badge>
                  ) : (
                    <span className="text-zinc-400">No</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Social Links & Discovery */}
          <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3.5 space-y-2.5">
            <h4 className="font-semibold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Globe className="h-3.5 w-3.5 text-zinc-400" />
              Profiles & Discovery
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {participant.linkedin_url ? (
                <div>
                  <span className="text-zinc-500 block">LinkedIn:</span>
                  <a
                    href={String(participant.linkedin_url).startsWith("http") ? String(participant.linkedin_url) : `https://${participant.linkedin_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center gap-1 font-medium truncate"
                  >
                    View LinkedIn Profile <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <div>
                  <span className="text-zinc-500 block">LinkedIn:</span>
                  <span className="text-zinc-500">Not provided</span>
                </div>
              )}

              {participant.github_url ? (
                <div>
                  <span className="text-zinc-500 block">GitHub:</span>
                  <a
                    href={String(participant.github_url).startsWith("http") ? String(participant.github_url) : `https://${participant.github_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-200 hover:underline flex items-center gap-1 font-medium truncate"
                  >
                    View GitHub Profile <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              ) : (
                <div>
                  <span className="text-zinc-500 block">GitHub:</span>
                  <span className="text-zinc-500">Not provided</span>
                </div>
              )}

              {participant.hear_about ? (
                <div className="sm:col-span-2 pt-1 border-t border-zinc-800/50">
                  <span className="text-zinc-500 block">Heard About HackIEEE From:</span>
                  <span className="text-zinc-300">{String(participant.hear_about)}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-t border-zinc-800 pt-3 sm:pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyId}
            className="text-xs h-8 justify-center"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                Copied ID
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                Copy ID
              </>
            )}
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <a
              href={`mailto:${participant.email}?subject=HackIEEE 2027 Registration Update (${participant.registration_id})`}
              className="flex-1 sm:flex-initial"
            >
              <Button variant="secondary" size="sm" className="text-xs h-8 w-full justify-center">
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Email Attendee
              </Button>
            </a>
            <Button
              variant="default"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-8 flex-1 sm:flex-initial justify-center"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
