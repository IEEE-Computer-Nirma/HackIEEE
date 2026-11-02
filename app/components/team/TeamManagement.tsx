"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Search,
  PlusCircle,
  Edit2,
  UserCheck,
  ArrowRightLeft,
  LogOut,
  Calendar,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  MapPin,
  ShieldAlert,
  Info,
  UserPlus,
  Copy,
  CheckCircle2,
  Send,
  Share2,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  university: string;
  program: string;
  isLeader?: boolean;
}

interface Team {
  id: string;
  name: string;
  description: string;
  track: string;
  membersCount: number;
  maxMembers: number;
  isOpen: boolean;
}

interface JoinRequest {
  id: string;
  name: string;
  program: string;
  university: string;
}

interface SentInvite {
  id: string;
  recipient: string;
  sentAt: string;
}

interface PersistedTeamState {
  hasTeam: boolean;
  teamName: string;
  teamDescription: string;
  teamTrack: string;
  inviteCode: string;
  members: TeamMember[];
  joinRequests: JoinRequest[];
  requestHistory: Array<{ name: string; status: "Accepted" | "Rejected" }>;
  sentInvites: SentInvite[];
}

const STORAGE_KEY = "hackieee_team_state_v3";

const defaultInitialState: PersistedTeamState = {
  hasTeam: false, // User is INITIALLY NOT in any team
  teamName: "",
  teamDescription: "",
  teamTrack: "Cybersecurity",
  inviteCode: "",
  members: [],
  joinRequests: [],
  requestHistory: [],
  sentInvites: [],
};

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState<"my-team" | "find-team" | "create-team">("my-team");
  const [subView, setSubView] = useState<"none" | "edit" | "requests" | "transfer">("none");

  // Persistent team state
  const [teamState, setTeamState] = useState<PersistedTeamState>(defaultInitialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTeamState(parsed);
      }
    } catch (e) {
      console.error("Failed to load saved team state:", e);
    }
  }, []);

  // Update state & persist to localStorage
  const updatePersistedState = (updater: (prev: PersistedTeamState) => PersistedTeamState) => {
    setTeamState((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error("Failed to persist team state:", e);
      }
      return next;
    });
  };

  // Modals state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isTeamFullModalOpen, setIsTeamFullModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [targetJoinTeam, setTargetJoinTeam] = useState<Team | null>(null);
  const [isEventDetailsModalOpen, setIsEventDetailsModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // Invite modal form state
  const [inviteInput, setInviteInput] = useState("");
  const [inviteSuccessMsg, setInviteSuccessMsg] = useState<string | null>(null);
  const [inviteErrorMsg, setInviteErrorMsg] = useState<string | null>(null);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);

  // Edit team form state
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editTrack, setEditTrack] = useState("");
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Requests subview tab
  const [activeRequestTab, setActiveRequestTab] = useState<"active" | "history">("active");

  // Find a team state
  const [searchQuery, setSearchQuery] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [joinStatus, setJoinStatus] = useState<Record<string, string>>({});

  const sampleTeams: Team[] = [
    {
      id: "t1",
      name: "ByteForce",
      description: "Building tech solutions for real-world problems.",
      track: "AI / ML",
      membersCount: 3,
      maxMembers: 4,
      isOpen: true,
    },
    {
      id: "t2",
      name: "CodeCrusaders",
      description: "A team passionate about impactful innovation.",
      track: "Cybersecurity",
      membersCount: 2,
      maxMembers: 4,
      isOpen: true,
    },
    {
      id: "t3",
      name: "NeuralNinjas",
      description: "Exploring AI/ML for meaningful applications.",
      track: "Healthcare",
      membersCount: 4,
      maxMembers: 4,
      isOpen: false,
    },
  ];

  // Create team form state
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamTrack, setNewTeamTrack] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [createSuccessMsg, setCreateSuccessMsg] = useState<string | null>(null);

  // Transfer leadership state
  const [selectedNewLeader, setSelectedNewLeader] = useState("");

  // Sync edit form fields whenever entering edit subview
  const handleOpenEdit = () => {
    setEditName(teamState.teamName);
    setEditDesc(teamState.teamDescription);
    setEditTrack(teamState.teamTrack);
    setSubView("edit");
  };

  // Save changes in Edit subview
  const handleSaveTeamDetails = () => {
    if (!editName.trim()) return;
    updatePersistedState((prev) => ({
      ...prev,
      teamName: editName.trim(),
      teamDescription: editDesc.trim(),
      teamTrack: editTrack || prev.teamTrack,
    }));
    setSaveToast("Team details updated successfully!");
    setTimeout(() => {
      setSaveToast(null);
      setSubView("none");
    }, 800);
  };

  // Accept join request with 4-person capacity check
  const handleAcceptRequest = (id: string, name: string, university: string, program: string) => {
    if (teamState.members.length >= 4) {
      setIsTeamFullModalOpen(true);
      return;
    }

    updatePersistedState((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        {
          id: `member-${Date.now()}`,
          name,
          university,
          program,
          isLeader: false,
        },
      ],
      joinRequests: prev.joinRequests.filter((r) => r.id !== id),
      requestHistory: [...prev.requestHistory, { name, status: "Accepted" }],
    }));
  };

  // Reject join request
  const handleRejectRequest = (id: string, name: string) => {
    updatePersistedState((prev) => ({
      ...prev,
      joinRequests: prev.joinRequests.filter((r) => r.id !== id),
      requestHistory: [...prev.requestHistory, { name, status: "Rejected" }],
    }));
  };

  // Transfer leadership
  const handleTransferLeadership = () => {
    if (!selectedNewLeader) return;
    updatePersistedState((prev) => ({
      ...prev,
      members: prev.members.map((m) => {
        if (m.name === selectedNewLeader) {
          return { ...m, isLeader: true };
        }
        if (m.isLeader) {
          return { ...m, isLeader: false };
        }
        return m;
      }),
    }));
    setSubView("none");
  };

  // Create team logic: fresh team containing ONLY the creator (1/4)
  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    const cleanCodeName = newTeamName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 4).toUpperCase() || "SQUAD";
    const generatedCode = `HACK-${cleanCodeName}-${Math.floor(1000 + Math.random() * 9000)}`;

    updatePersistedState(() => ({
      hasTeam: true,
      teamName: newTeamName.trim(),
      teamDescription: newTeamDesc.trim() || "Building innovative solutions for HackIEEE '26-27.",
      teamTrack: newTeamTrack || "Open Innovation",
      inviteCode: generatedCode,
      members: [
        {
          id: "creator-1",
          name: "Vishwa Ghori (You)",
          university: "Nirma University",
          program: "B.Tech CSE (2nd Year)",
          isLeader: true,
        },
      ],
      joinRequests: [
        {
          id: "req-1",
          name: "Kavya Desai",
          program: "B.Tech CSE (2nd Year)",
          university: "Nirma University",
        },
        {
          id: "req-2",
          name: "Rohan Mehta",
          program: "B.Tech IT (2nd Year)",
          university: "Nirma University",
        },
      ],
      requestHistory: [],
      sentInvites: [],
    }));

    setCreateSuccessMsg(`Team "${newTeamName.trim()}" created successfully!`);
    setTimeout(() => {
      setCreateSuccessMsg(null);
      setNewTeamName("");
      setNewTeamDesc("");
      setNewTeamTrack("");
      setActiveTab("my-team");
    }, 1000);
  };

  // Leave team logic
  const handleConfirmLeaveTeam = () => {
    setIsLeaveModalOpen(false);
    updatePersistedState(() => ({
      ...defaultInitialState,
      hasTeam: false,
    }));
    setSubView("none");
    setActiveTab("my-team");
  };

  // Join team request logic with conflict-of-interest check
  const handleAttemptJoinTeam = (team: Team) => {
    if (teamState.hasTeam) {
      setTargetJoinTeam(team);
      setIsConflictModalOpen(true);
      return;
    }

    setJoinStatus((prev) => ({
      ...prev,
      [team.id]: prev[team.id] === "requested" ? "" : "requested",
    }));
  };

  const handleResolveConflictAndJoin = () => {
    if (!targetJoinTeam) return;

    // Leave current team
    updatePersistedState(() => ({
      ...defaultInitialState,
      hasTeam: false,
    }));

    // Submit join request
    setJoinStatus((prev) => ({
      ...prev,
      [targetJoinTeam.id]: "requested",
    }));

    setIsConflictModalOpen(false);
    setTargetJoinTeam(null);
  };

  // Send team invite
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteErrorMsg(null);
    setInviteSuccessMsg(null);

    const recipient = inviteInput.trim();
    if (!recipient) {
      setInviteErrorMsg("Please enter an email address or Participant ID");
      return;
    }

    if (teamState.members.length >= 4) {
      setInviteErrorMsg("Team capacity is already reached (4/4 members).");
      return;
    }

    const newInvite: SentInvite = {
      id: `inv-${Date.now()}`,
      recipient,
      sentAt: "Just now",
    };

    updatePersistedState((prev) => ({
      ...prev,
      sentInvites: [newInvite, ...prev.sentInvites],
    }));

    setInviteSuccessMsg(`Invitation dispatched to ${recipient}!`);
    setInviteInput("");
    setTimeout(() => setInviteSuccessMsg(null), 3000);
  };

  const handleRevokeInvite = (id: string) => {
    updatePersistedState((prev) => ({
      ...prev,
      sentInvites: prev.sentInvites.filter((inv) => inv.id !== id),
    }));
  };

  const handleCopyCode = () => {
    const code = teamState.inviteCode || "HACK-SQUAD-2026";
    navigator.clipboard.writeText(code);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    const code = teamState.inviteCode || "HACK-SQUAD-2026";
    const link = `https://hackieee.nirmauni.ac.in/join?code=${encodeURIComponent(code)}`;
    navigator.clipboard.writeText(link);
    setHasCopiedLink(true);
    setTimeout(() => setHasCopiedLink(false), 2000);
  };

  // Filter sample teams
  const filteredTeams = sampleTeams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrack = trackFilter === "all" || team.track === trackFilter;
    const matchesSize =
      sizeFilter === "all" ||
      (sizeFilter === "open" && team.isOpen) ||
      (sizeFilter === "full" && !team.isOpen);
    return matchesSearch && matchesTrack && matchesSize;
  });

  return (
    <div className="w-full text-ink">
      {/* Eyebrow and Subtitle */}
      <div className="text-center mb-6">
        <p className="text-[0.68rem] font-mono tracking-[0.3em] uppercase text-spice font-semibold mb-2">
          HACKIEEE&apos;26
        </p>
        <h2 className="display text-2xl sm:text-3xl md:text-4xl font-bold tracking-[0.2em] text-ink uppercase mb-2">
          Team Management
        </h2>
        <p className="text-sm text-sand/70 max-w-lg mx-auto">
          Create a new team, join an existing one, or manage your current team.
        </p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-spice to-transparent mx-auto mt-4" />
      </div>

      {/* Main Pill Tabs */}
      {subView === "none" && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("my-team")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "my-team"
                ? "bg-gradient-to-r from-spice via-spice-hot to-amber-500 text-[#1d130a] shadow-[0_0_20px_rgba(226,130,47,0.5)] scale-105"
                : "border border-line bg-[#16100c] text-sand/70 hover:border-spice/40 hover:text-ink"
            }`}
          >
            <Users size={16} />
            <span>MY TEAM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("find-team")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "find-team"
                ? "bg-gradient-to-r from-spice via-spice-hot to-amber-500 text-[#1d130a] shadow-[0_0_20px_rgba(226,130,47,0.5)] scale-105"
                : "border border-line bg-[#16100c] text-sand/70 hover:border-spice/40 hover:text-ink"
            }`}
          >
            <Search size={16} />
            <span>FIND A TEAM</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("create-team")}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
              activeTab === "create-team"
                ? "bg-gradient-to-r from-spice via-spice-hot to-amber-500 text-[#1d130a] shadow-[0_0_20px_rgba(226,130,47,0.5)] scale-105"
                : "border border-line bg-[#16100c] text-sand/70 hover:border-spice/40 hover:text-ink"
            }`}
          >
            <PlusCircle size={16} />
            <span>CREATE TEAM</span>
          </button>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          SUBVIEW: EDIT TEAM DETAILS
      ────────────────────────────────────────────────────────── */}
      {subView === "edit" && teamState.hasTeam && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-spice/40 bg-[#140e0a]/90 backdrop-blur-xl p-6 sm:p-8">
          <button
            type="button"
            onClick={() => setSubView("none")}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-sand/70 hover:text-spice transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <div className="text-center mb-6">
            <p className="text-[0.65rem] font-mono tracking-widest uppercase text-spice font-semibold mb-1">
              HACKIEEE&apos;26
            </p>
            <h3 className="display text-xl sm:text-2xl font-bold tracking-[0.18em] text-ink uppercase">
              Edit Team Details
            </h3>
            <p className="text-xs text-sand/70 mt-1">Update your team&apos;s information.</p>
          </div>

          {saveToast && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{saveToast}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
                Team Name <span className="text-spice">*</span>
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 text-ink text-sm outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-sand/80">
                  Team Description <span className="text-spice">*</span>
                </label>
                <span className="text-xs font-mono text-sand/50">{editDesc.length}/150</span>
              </div>
              <textarea
                value={editDesc}
                maxLength={150}
                rows={3}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 text-ink text-sm outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
                Track / Problem Statement <span className="text-spice">*</span>
              </label>
              <select
                value={editTrack}
                onChange={(e) => setEditTrack(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] focus:border-spice text-ink text-sm outline-none cursor-pointer"
              >
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="AI / ML">AI / Machine Learning</option>
                <option value="FinTech">FinTech & Blockchain</option>
                <option value="Healthcare">Healthcare & BioTech</option>
                <option value="Sustainability">Sustainability & CleanTech</option>
                <option value="Open Innovation">Open Innovation</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setSubView("none")}
                className="px-5 py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-solid text-sand text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveTeamDetails}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice to-amber-500 text-[#1d130a] text-xs font-semibold tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(226,130,47,0.4)] cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          SUBVIEW: MANAGE JOIN REQUESTS
      ────────────────────────────────────────────────────────── */}
      {subView === "requests" && teamState.hasTeam && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-spice/40 bg-[#140e0a]/90 backdrop-blur-xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => setSubView("none")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-line bg-surface hover:border-spice/50 text-xs font-mono text-sand/80 hover:text-spice transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>← Back to My Team</span>
            </button>

            <span className="text-xs font-mono text-sand/50">
              {teamState.members.length} / 4 Members
            </span>
          </div>

          <div className="text-center mb-6">
            <p className="text-[0.65rem] font-mono tracking-widest uppercase text-spice font-semibold mb-1">
              HACKIEEE&apos;26
            </p>
            <h3 className="display text-xl sm:text-2xl font-bold tracking-[0.18em] text-ink uppercase">
              Manage Join Requests
            </h3>
            <p className="text-xs text-sand/70 mt-1">Review and take action on requests to join your team.</p>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => setActiveRequestTab("active")}
              className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                activeRequestTab === "active"
                  ? "bg-spice/20 border border-spice text-spice-hot font-semibold"
                  : "border border-line bg-surface text-sand/60 hover:text-ink"
              }`}
            >
              Join Requests ({teamState.joinRequests.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveRequestTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-colors cursor-pointer ${
                activeRequestTab === "history"
                  ? "bg-spice/20 border border-spice text-spice-hot font-semibold"
                  : "border border-line bg-surface text-sand/60 hover:text-ink"
              }`}
            >
              Request History ({teamState.requestHistory.length})
            </button>
          </div>

          {activeRequestTab === "active" ? (
            <div className="space-y-3">
              {teamState.joinRequests.length > 0 ? (
                teamState.joinRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-line bg-[#16100c] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-sand/60 shrink-0">
                        <Users size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ink">{req.name}</p>
                        <p className="text-xs text-sand/60">
                          {req.program} · {req.university}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() =>
                          handleAcceptRequest(req.id, req.name, req.university, req.program)
                        }
                        className="px-4 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Check size={14} />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectRequest(req.id, req.name)}
                        className="px-4 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border border-dashed border-line rounded-xl space-y-3">
                  <p className="text-sand/50 text-sm">No pending join requests right now.</p>
                  <button
                    type="button"
                    onClick={() => setSubView("none")}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-spice to-amber-500 text-[#1d130a] text-xs font-semibold hover:brightness-110 shadow-[0_0_15px_rgba(226,130,47,0.4)] inline-flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to My Team</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {teamState.requestHistory.length > 0 ? (
                teamState.requestHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-line bg-surface flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-ink">{item.name}</span>
                    <span
                      className={`font-semibold ${
                        item.status === "Accepted" ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center border border-dashed border-line rounded-xl space-y-3">
                  <p className="text-sand/50 text-sm">No request history yet.</p>
                  <button
                    type="button"
                    onClick={() => setSubView("none")}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-spice to-amber-500 text-[#1d130a] text-xs font-semibold hover:brightness-110 shadow-[0_0_15px_rgba(226,130,47,0.4)] inline-flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <ArrowLeft size={14} />
                    <span>Back to My Team</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-line mt-6">
            <span className="text-xs text-sand/50 font-mono">
              Team Capacity: {teamState.members.length}/4
            </span>
            <button
              type="button"
              onClick={() => setSubView("none")}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice via-spice-hot to-amber-500 text-[#1d130a] text-xs font-semibold tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(226,130,47,0.4)] flex items-center gap-2 cursor-pointer transition-all"
            >
              <ArrowLeft size={15} />
              <span>Back to My Team</span>
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          SUBVIEW: TRANSFER LEADERSHIP
      ────────────────────────────────────────────────────────── */}
      {subView === "transfer" && teamState.hasTeam && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-spice/40 bg-[#140e0a]/90 backdrop-blur-xl p-6 sm:p-8">
          <button
            type="button"
            onClick={() => setSubView("none")}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-sand/70 hover:text-spice transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>

          <div className="text-center mb-6">
            <p className="text-[0.65rem] font-mono tracking-widest uppercase text-spice font-semibold mb-1">
              HACKIEEE&apos;26
            </p>
            <h3 className="display text-xl sm:text-2xl font-bold tracking-[0.18em] text-ink uppercase">
              Transfer Leadership
            </h3>
            <p className="text-xs text-sand/70 mt-1">
              Choose a team member to make the new team leader.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
                Select New Team Leader <span className="text-spice">*</span>
              </label>
              <select
                value={selectedNewLeader}
                onChange={(e) => setSelectedNewLeader(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] focus:border-spice text-ink text-sm outline-none cursor-pointer"
              >
                <option value="" disabled className="bg-[#1a140e] text-sand/40">
                  Choose a team member
                </option>
                {teamState.members
                  .filter((m) => !m.isLeader)
                  .map((m) => (
                    <option key={m.id} value={m.name} className="bg-[#1a140e] text-ink">
                      {m.name} ({m.program})
                    </option>
                  ))}
              </select>
            </div>

            <div className="p-4 rounded-xl border border-amber-600/30 bg-amber-500/10 flex items-start gap-3">
              <span className="text-spice font-bold">ℹ</span>
              <p className="text-xs text-sand/80 leading-relaxed">
                After transferring, you will become a regular member and won&apos;t have leader privileges.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setSubView("none")}
                className="px-5 py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-solid text-sand text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedNewLeader}
                onClick={handleTransferLeadership}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice to-amber-500 disabled:opacity-50 text-[#1d130a] text-xs font-semibold tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(226,130,47,0.4)] cursor-pointer"
              >
                Transfer Leadership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 1: MY TEAM
      ────────────────────────────────────────────────────────── */}
      {subView === "none" && activeTab === "my-team" && (
        <>
          {teamState.hasTeam ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Team Card */}
              <div className="lg:col-span-8 rounded-2xl border border-spice/40 bg-[#120d09]/95 backdrop-blur-xl p-6 sm:p-7 shadow-[0_0_30px_rgba(226,130,47,0.12)]">
                <div className="flex items-start justify-between border-b border-line pb-5 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-spice/15 border border-spice/40 text-spice-hot font-mono text-[10px] uppercase tracking-wider font-semibold">
                        {teamState.teamTrack}
                      </span>
                    </div>
                    <h3 className="display text-2xl sm:text-3xl font-bold tracking-[0.16em] text-ink uppercase">
                      {teamState.teamName}
                    </h3>
                    <p className="text-xs sm:text-sm text-sand/70 mt-1 max-w-xl">
                      {teamState.teamDescription}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[0.62rem] font-mono uppercase tracking-widest text-sand/50">
                      TEAM SIZE
                    </p>
                    <p className="font-mono text-xl sm:text-2xl font-bold text-spice-hot">
                      {teamState.members.length} / 4
                    </p>
                  </div>
                </div>

                {/* Team Members List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-mono uppercase tracking-widest text-sand/60">
                      ─── TEAM MEMBERS ───
                    </p>
                    {teamState.members.length < 4 && (
                      <button
                        type="button"
                        onClick={() => setIsInviteModalOpen(true)}
                        className="text-xs font-mono text-spice hover:text-spice-hot inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <UserPlus size={14} />
                        <span>Invite Member ({4 - teamState.members.length} slot{4 - teamState.members.length > 1 ? "s" : ""} left)</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {teamState.members.map((member) => (
                      <div
                        key={member.id}
                        className="p-3.5 rounded-xl border border-line bg-[#16100c] hover:border-spice/30 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-sand/60 shrink-0">
                            <Users size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-ink truncate">
                              {member.name}
                            </p>
                            <p className="text-xs text-sand/60 truncate">
                              {member.university} · {member.program}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {member.isLeader ? (
                            <span className="px-3 py-1 rounded-full border border-spice bg-spice/15 text-spice-hot font-mono text-[10px] font-bold tracking-widest uppercase">
                              LEADER
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full border border-line bg-surface text-sand/60 font-mono text-[10px] font-bold tracking-widest uppercase">
                              MEMBER
                            </span>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Invite Member Slot placeholder if under capacity */}
                    {teamState.members.length < 4 && (
                      <button
                        type="button"
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-full p-3.5 rounded-xl border-2 border-dashed border-spice/30 hover:border-spice/60 bg-spice/5 hover:bg-spice/10 transition-all flex items-center justify-center gap-2 text-xs font-medium text-spice-hot cursor-pointer"
                      >
                        <UserPlus size={16} />
                        <span>+ Invite Member to Team (Slot {teamState.members.length + 1} of 4)</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Actions & Event Info */}
              <div className="lg:col-span-4 space-y-6">
                {/* Team Actions Card */}
                <div className="rounded-2xl border border-spice/40 bg-[#120d09]/95 backdrop-blur-xl p-5 shadow-[0_0_20px_rgba(226,130,47,0.1)]">
                  <p className="text-xs font-mono uppercase tracking-widest text-sand/70 mb-3">
                    TEAM ACTIONS
                  </p>
                  <div className="space-y-2">
                    {/* Invite Members */}
                    <button
                      type="button"
                      onClick={() => setIsInviteModalOpen(true)}
                      className="w-full p-3 rounded-xl border border-spice/40 bg-spice/10 hover:bg-spice/20 text-left text-xs font-medium text-spice-hot flex items-center justify-between transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserPlus size={16} className="text-spice" />
                        <span>Invite Members</span>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-spice/20 border border-spice/40 text-spice-hot">
                        {4 - teamState.members.length} left
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenEdit}
                      className="w-full p-3 rounded-xl border border-line hover:border-spice/50 bg-[#16100c] hover:bg-spice/10 text-left text-xs font-medium text-ink flex items-center justify-between transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Edit2 size={16} className="text-spice" />
                        <span>Edit Team Details</span>
                      </div>
                      <span className="text-sand/40">›</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubView("requests")}
                      className="w-full p-3 rounded-xl border border-line hover:border-spice/50 bg-[#16100c] hover:bg-spice/10 text-left text-xs font-medium text-ink flex items-center justify-between transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <UserCheck size={16} className="text-spice" />
                        <span>Manage Join Requests</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-spice text-[#1d130a] font-mono text-[10px] font-bold flex items-center justify-center">
                          {teamState.joinRequests.length}
                        </span>
                        <span className="text-sand/40">›</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSubView("transfer")}
                      className="w-full p-3 rounded-xl border border-line hover:border-spice/50 bg-[#16100c] hover:bg-spice/10 text-left text-xs font-medium text-ink flex items-center justify-between transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <ArrowRightLeft size={16} className="text-spice" />
                        <span>Transfer Leadership</span>
                      </div>
                      <span className="text-sand/40">›</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsLeaveModalOpen(true)}
                      className="w-full p-3 rounded-xl border border-line hover:border-rose-500/50 bg-[#16100c] hover:bg-rose-500/10 text-left text-xs font-medium text-rose-300 flex items-center justify-between transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <LogOut size={16} className="text-rose-400" />
                        <span>Leave Team</span>
                      </div>
                      <span className="text-rose-400/50">›</span>
                    </button>
                  </div>
                </div>

                {/* About HackIEEE'26 Card */}
                <div className="rounded-2xl border border-line-strong bg-[#120d09]/95 backdrop-blur-xl p-5">
                  <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-sand/70">
                      ABOUT HACKIEEE&apos;26
                    </p>
                    <span className="font-mono text-xs text-spice">&lt;/&gt;</span>
                  </div>

                  <div className="space-y-3 text-xs text-sand/80 mb-5">
                    <div className="flex items-center gap-2.5">
                      <Calendar size={16} className="text-spice shrink-0" />
                      <span>Expected: Dec 2026 – Jan 2027</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users size={16} className="text-spice shrink-0" />
                      <span>Team Size: 2 – 4 Members</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Trophy size={16} className="text-spice shrink-0" />
                      <span>Mode: Offline at Nirma University</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEventDetailsModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl border border-spice/40 hover:border-spice bg-spice/10 hover:bg-spice/20 text-spice-hot text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>View Event Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State: User is not in a team (INITIAL STATE) */
            <div className="max-w-2xl mx-auto rounded-2xl border border-line-strong bg-[#120d09]/90 backdrop-blur-xl p-8 sm:p-12 text-center shadow-[0_0_40px_rgba(0,0,0,0.6)]">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-spice/50 bg-spice/10 flex items-center justify-center text-spice-hot mx-auto mb-4">
                <Users size={30} />
              </div>

              <span className="px-3 py-1 rounded-full bg-surface border border-line text-sand/60 font-mono text-xs uppercase tracking-widest mb-3 inline-block">
                No Active Team
              </span>

              <h3 className="display text-2xl sm:text-3xl font-bold tracking-[0.16em] text-ink uppercase mb-3">
                You are not in a team
              </h3>

              <p className="text-xs sm:text-sm text-sand/70 max-w-md mx-auto leading-relaxed mb-8">
                You currently don&apos;t belong to any squad for HackIEEE &apos;26-27. Join an existing team or create your own squad to compete.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("find-team")}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-spice/40 hover:border-spice bg-spice/10 hover:bg-spice/20 text-spice-hot text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Search size={15} />
                  <span>Find a Team</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("create-team")}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice via-spice-hot to-amber-500 text-[#1d130a] text-xs font-semibold tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(226,130,47,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <PlusCircle size={15} />
                  <span>Create a Team</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 2: FIND A TEAM
      ────────────────────────────────────────────────────────── */}
      {subView === "none" && activeTab === "find-team" && (
        <div className="space-y-6">
          {/* Search and Filters Bar */}
          <div className="p-4 sm:p-5 rounded-2xl border border-line bg-[#140e0a]/90 backdrop-blur-md flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/50">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams by name or keywords..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#140f0b]/80 border border-line focus:border-spice text-ink placeholder:text-sand/30 text-xs sm:text-sm outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#140f0b]/80 border border-line focus:border-spice text-sand text-xs outline-none cursor-pointer"
              >
                <option value="all">All Tracks</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Healthcare">Healthcare</option>
                <option value="FinTech">FinTech</option>
              </select>

              <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-[#140f0b]/80 border border-line focus:border-spice text-sand text-xs outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="open">Open Spots</option>
                <option value="full">Full (4/4)</option>
              </select>

              {(searchQuery || trackFilter !== "all" || sizeFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setTrackFilter("all");
                    setSizeFilter("all");
                  }}
                  className="p-2.5 rounded-xl border border-line hover:border-spice/40 text-sand/60 hover:text-ink cursor-pointer"
                  title="Reset Filters"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTeams.map((team) => {
              const status = joinStatus[team.id];
              return (
                <div
                  key={team.id}
                  className="rounded-2xl border border-line hover:border-spice/50 bg-[#120d09]/95 backdrop-blur-xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_25px_rgba(226,130,47,0.15)] group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-md bg-spice/15 border border-spice/40 text-spice-hot font-mono text-[10px] uppercase tracking-wider font-semibold">
                        {team.track}
                      </span>
                      <span
                        className={`font-mono text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                          team.isOpen
                            ? "bg-emerald-500/15 border border-emerald-500/40 text-emerald-400"
                            : "bg-surface border border-line text-sand/40"
                        }`}
                      >
                        {team.membersCount}/{team.maxMembers} Members
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-ink group-hover:text-spice transition-colors mb-2">
                      {team.name}
                    </h4>
                    <p className="text-xs text-sand/70 line-clamp-3 leading-relaxed mb-4">
                      {team.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-line flex items-center justify-between">
                    <span className="text-[11px] font-mono text-sand/50">
                      {team.isOpen ? "Accepting Members" : "Squad Full"}
                    </span>

                    {team.isOpen ? (
                      <button
                        type="button"
                        onClick={() => handleAttemptJoinTeam(team)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                          status === "requested"
                            ? "bg-amber-500/20 border border-amber-500/50 text-amber-300"
                            : "bg-gradient-to-r from-spice to-amber-500 text-[#1d130a] hover:brightness-110 shadow-[0_0_15px_rgba(226,130,47,0.3)]"
                        }`}
                      >
                        {status === "requested" ? "Requested" : "Request to Join"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="px-4 py-1.5 rounded-lg border border-line bg-surface text-sand/40 text-xs font-medium cursor-not-allowed"
                      >
                        Full
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTeams.length === 0 && (
            <div className="p-12 text-center rounded-2xl border border-dashed border-line text-sand/50">
              No teams found matching your filters.
            </div>
          )}
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 3: CREATE TEAM
      ────────────────────────────────────────────────────────── */}
      {subView === "none" && activeTab === "create-team" && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-spice/40 bg-[#120d09]/95 backdrop-blur-xl p-6 sm:p-8 shadow-[0_0_35px_rgba(226,130,47,0.15)]">
          <div className="text-center mb-6">
            <p className="text-[0.65rem] font-mono tracking-widest uppercase text-spice font-semibold mb-1">
              FOUND YOUR SQUAD
            </p>
            <h3 className="display text-xl sm:text-2xl font-bold tracking-[0.18em] text-ink uppercase">
              Create a New Team
            </h3>
            <p className="text-xs text-sand/70 mt-1">
              You will automatically become the Team Leader (1/4 members) and can invite or accept members.
            </p>
          </div>

          {createSuccessMsg && (
            <div className="mb-6 p-4 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
              <Check size={16} />
              <span>{createSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleCreateTeamSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
                Team Name <span className="text-spice">*</span>
              </label>
              <input
                type="text"
                required
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g. DuneHacks, CyberKnights"
                className="w-full px-4 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 text-ink text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
                Preferred Track / Problem Area <span className="text-spice">*</span>
              </label>
              <select
                value={newTeamTrack}
                onChange={(e) => setNewTeamTrack(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] focus:border-spice text-ink text-sm outline-none cursor-pointer"
              >
                <option value="" disabled className="bg-[#1a140e] text-sand/40">
                  Select a hackathon track
                </option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="AI / ML">AI / Machine Learning</option>
                <option value="FinTech">FinTech & Blockchain</option>
                <option value="Healthcare">Healthcare & BioTech</option>
                <option value="Sustainability">Sustainability & CleanTech</option>
                <option value="Open Innovation">Open Innovation</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-sand/80">
                  Team Pitch / Description
                </label>
                <span className="text-xs font-mono text-sand/50">{newTeamDesc.length}/150</span>
              </div>
              <textarea
                value={newTeamDesc}
                maxLength={150}
                rows={3}
                onChange={(e) => setNewTeamDesc(e.target.value)}
                placeholder="Tell potential teammates about your project vision and what skills you are looking for..."
                className="w-full px-4 py-3 rounded-xl bg-[#140f0b]/80 border border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 text-ink text-sm outline-none resize-none"
              />
            </div>

            <div className="p-4 rounded-xl border border-spice/30 bg-spice/5 text-xs text-sand/80 leading-relaxed">
              <p className="font-semibold text-spice-hot mb-1">Squad Guidelines:</p>
              <ul className="list-disc list-inside space-y-1 text-sand/70">
                <li>Teams can have a minimum of 2 and maximum of 4 participants.</li>
                <li>You will be assigned as the Team Leader with permissions to manage join requests.</li>
                <li>Your team will start with you as the sole member (1/4).</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => setActiveTab("my-team")}
                className="px-5 py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-solid text-sand text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTeamName.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice via-spice-hot to-amber-500 disabled:opacity-50 text-[#1d130a] text-xs font-semibold tracking-wider hover:brightness-110 shadow-[0_0_20px_rgba(226,130,47,0.4)] cursor-pointer"
              >
                Create Team
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 1: TEAM FULL ALERT (4/4 LIMIT)
      ────────────────────────────────────────────────────────── */}
      {isTeamFullModalOpen && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-500/50 bg-[#16100c] p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center">
            <button
              type="button"
              onClick={() => setIsTeamFullModalOpen(false)}
              className="absolute top-4 right-4 text-sand/50 hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Users size={28} />
            </div>

            <h4 className="text-lg font-bold text-ink mb-2">Team Capacity Reached (4/4)</h4>
            <p className="text-xs sm:text-sm text-sand/80 leading-relaxed mb-6">
              Your team already has the maximum allowable limit of <strong className="text-ink">4 members</strong>. You cannot accept more join requests unless an existing member leaves or is removed.
            </p>

            <button
              type="button"
              onClick={() => setIsTeamFullModalOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice to-amber-500 text-[#1d130a] text-xs font-semibold shadow-[0_0_15px_rgba(226,130,47,0.4)] hover:brightness-110 cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 2: CONFLICT OF INTEREST
      ────────────────────────────────────────────────────────── */}
      {isConflictModalOpen && targetJoinTeam && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-500/50 bg-[#16100c] p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-center">
            <button
              type="button"
              onClick={() => setIsConflictModalOpen(false)}
              className="absolute top-4 right-4 text-sand/50 hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <ShieldAlert size={28} />
            </div>

            <h4 className="text-lg font-bold text-ink mb-2">Conflict of Interest</h4>
            <p className="text-xs sm:text-sm text-sand/80 leading-relaxed mb-6">
              You are currently an active member of <strong className="text-ink">{teamState.teamName}</strong>. Hackathon regulations require you to leave your current squad before requesting to join <strong className="text-ink">{targetJoinTeam.name}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsConflictModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-solid text-sand text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveConflictAndJoin}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_15px_rgba(225,29,72,0.4)] cursor-pointer"
              >
                Leave Current Team & Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 3: LEAVE TEAM CONFIRMATION
      ────────────────────────────────────────────────────────── */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-spice/40 bg-[#16100c] p-6 sm:p-7 shadow-[0_0_50px_rgba(226,130,47,0.25)] text-center">
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(false)}
              className="absolute top-4 right-4 text-sand/50 hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-spice-hot mx-auto mb-4">
              <AlertTriangle size={28} />
            </div>

            <h4 className="text-lg font-bold text-ink mb-2">Leave Team?</h4>
            <p className="text-xs sm:text-sm text-sand/80 leading-relaxed mb-6">
              Are you sure you want to leave <strong className="text-ink">{teamState.teamName}</strong>? You will no longer be part of this team and can create a new team or request to join another afterwards.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsLeaveModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-solid text-sand text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLeaveTeam}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:brightness-110 text-white text-xs font-semibold shadow-[0_0_15px_rgba(225,29,72,0.4)] cursor-pointer"
              >
                Leave Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 4: VIEW EVENT DETAILS MODAL
      ────────────────────────────────────────────────────────── */}
      {isEventDetailsModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-spice/40 bg-[#16100c] p-6 sm:p-7 shadow-[0_0_50px_rgba(226,130,47,0.3)]">
            <button
              type="button"
              onClick={() => setIsEventDetailsModalOpen(false)}
              className="absolute top-4 right-4 text-sand/50 hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b border-line pb-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-spice/15 border border-spice/40 flex items-center justify-center text-spice shrink-0">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-spice font-semibold">
                  EVENT BRIEF
                </p>
                <h4 className="text-lg font-bold text-ink">HackIEEE &apos;26-27</h4>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-sand/85 mb-6">
              <div className="p-3 rounded-xl bg-[#120d09] border border-line flex items-center gap-3">
                <Calendar size={18} className="text-spice shrink-0" />
                <div>
                  <p className="font-semibold text-ink">Event Dates</p>
                  <p className="text-sand/60">January 2–4, 2027 (48-Hour In-Person Offline Hack)</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#120d09] border border-line flex items-center gap-3">
                <MapPin size={18} className="text-spice shrink-0" />
                <div>
                  <p className="font-semibold text-ink">Venue & Mode</p>
                  <p className="text-sand/60">Offline at Nirma University Campus, Ahmedabad, Gujarat</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#120d09] border border-line flex items-center gap-3">
                <Users size={18} className="text-spice shrink-0" />
                <div>
                  <p className="font-semibold text-ink">Team Composition</p>
                  <p className="text-sand/60">2 to 4 participants per team across all academic years</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#120d09] border border-line flex items-center gap-3">
                <Sparkles size={18} className="text-spice shrink-0" />
                <div>
                  <p className="font-semibold text-ink">Key Milestones</p>
                  <p className="text-sand/60">Nov 15 (Reg Open) → Dec 20 (Tracks Declared) → Jan 2 (Kickoff)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setIsEventDetailsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-spice to-amber-500 text-[#1d130a] text-xs font-semibold hover:brightness-110 shadow-[0_0_15px_rgba(226,130,47,0.4)] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          MODAL 5: INVITE MEMBERS MODAL
      ────────────────────────────────────────────────────────── */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-spice/40 bg-[#16100c] p-6 sm:p-7 shadow-[0_0_50px_rgba(226,130,47,0.3)]">
            <button
              type="button"
              onClick={() => {
                setIsInviteModalOpen(false);
                setInviteErrorMsg(null);
                setInviteSuccessMsg(null);
              }}
              className="absolute top-4 right-4 text-sand/50 hover:text-ink cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 border-b border-line pb-4 mb-5">
              <div className="w-10 h-10 rounded-xl bg-spice/15 border border-spice/40 flex items-center justify-center text-spice shrink-0">
                <UserPlus size={20} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-spice font-semibold">
                  EXPAND YOUR SQUAD
                </p>
                <h4 className="text-lg font-bold text-ink">Invite Team Members</h4>
              </div>
            </div>

            {/* Quick Share Code / Link */}
            <div className="mb-6 p-4 rounded-xl bg-[#120d09] border border-line">
              <p className="text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
                Team Invite Code
              </p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 px-4 py-2.5 rounded-lg bg-[#18110b] border border-spice/30 font-mono text-sm text-spice-hot font-bold tracking-wider select-all">
                  {teamState.inviteCode || "HACK-SQUAD-2026"}
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-4 py-2.5 rounded-lg bg-spice/15 hover:bg-spice/25 border border-spice/40 text-spice text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {hasCopiedCode ? <Check size={14} /> : <Copy size={14} />}
                  <span>{hasCopiedCode ? "Copied" : "Copy Code"}</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-sand/60">
                <span>Share this code with eligible participants to let them join.</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-spice hover:underline font-mono text-[11px] inline-flex items-center gap-1 cursor-pointer"
                >
                  <Share2 size={12} />
                  <span>{hasCopiedLink ? "Link Copied!" : "Copy Link"}</span>
                </button>
              </div>
            </div>

            {/* Direct Invite Form */}
            <form onSubmit={handleSendInvite} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-sand/80 mb-2">
                  Invite via Email or Participant ID
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="e.g. teammate@gmail.com or HACK-2026-XXXXX"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#140f0b]/80 border border-line focus:border-spice text-ink text-xs sm:text-sm outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-spice to-amber-500 text-[#1d130a] text-xs font-semibold tracking-wider hover:brightness-110 shadow-[0_0_15px_rgba(226,130,47,0.4)] flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Send size={14} />
                    <span>Invite</span>
                  </button>
                </div>
              </div>

              {inviteSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 size={14} />
                  <span>{inviteSuccessMsg}</span>
                </div>
              )}

              {inviteErrorMsg && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs flex items-center gap-2">
                  <AlertTriangle size={14} />
                  <span>{inviteErrorMsg}</span>
                </div>
              )}
            </form>

            {/* Pending Sent Invitations */}
            {teamState.sentInvites.length > 0 && (
              <div>
                <p className="text-[11px] font-mono uppercase tracking-wider text-sand/60 mb-2">
                  Pending Invitations ({teamState.sentInvites.length})
                </p>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {teamState.sentInvites.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-2.5 rounded-lg border border-line bg-[#120d09] flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-medium text-ink">{inv.recipient}</span>
                        <span className="text-[10px] text-sand/40 ml-2">Sent {inv.sentAt}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRevokeInvite(inv.id)}
                        className="text-rose-400 hover:text-rose-300 text-[11px] font-mono cursor-pointer"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-line mt-4">
              <button
                type="button"
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setInviteErrorMsg(null);
                  setInviteSuccessMsg(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-line bg-surface hover:bg-surface-solid text-sand text-xs font-medium cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
