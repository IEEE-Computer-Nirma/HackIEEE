"use client";

import * as React from "react";
import {
  Search,
  X,
  Filter,
  Eye,
  Building2,
  GraduationCap,
  Award,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface Registration {
  id: number;
  registration_id: string;
  full_name: string;
  email: string;
  college_email?: string | null;
  phone: string;
  university: string;
  degree: string;
  branch: string;
  year_of_study: string;
  graduation_year?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  hear_about?: string | null;
  is_ieee_member: boolean;
  is_ieee_cs_member: boolean;
  ieee_membership_number?: string | null;
  created_at: string;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

interface ParticipantTableProps {
  registrations: Registration[];
  onViewDetails: (participant: Registration) => void;
  onFilteredRegistrationsChange?: (filtered: Registration[]) => void;
}

const MEMBERSHIP_OPTIONS = [
  { label: "All", value: "all" },
  { label: "IEEE Members", value: "ieee" },
  { label: "Non-Members", value: "non-ieee" },
  { label: "IEEE CS", value: "ieee-cs" },
] as const;

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgrad"];
const DEGREE_OPTIONS = ["B.Tech", "M.Tech", "BCA/MCA", "Other"];

function matchesYear(yearOfStudy: string, selected: string): boolean {
  const normalized = (yearOfStudy || "").toLowerCase();
  if (selected === "1st Year") return normalized.includes("1") || normalized.includes("first");
  if (selected === "2nd Year") return normalized.includes("2") || normalized.includes("second");
  if (selected === "3rd Year") return normalized.includes("3") || normalized.includes("third");
  if (selected === "4th Year") return normalized.includes("4") || normalized.includes("fourth") || normalized.includes("final");
  if (selected === "Postgrad") return normalized.includes("post") || normalized.includes("m.tech") || normalized.includes("mca") || normalized.includes("master");
  return false;
}

function matchesDegree(degreeStr: string, selected: string): boolean {
  const normalized = (degreeStr || "").toLowerCase();
  if (selected === "B.Tech") return normalized.includes("b.tech") || normalized.includes("btech") || normalized.includes("b.e");
  if (selected === "M.Tech") return normalized.includes("m.tech") || normalized.includes("mtech") || normalized.includes("m.e");
  if (selected === "BCA/MCA") return normalized.includes("bca") || normalized.includes("mca");
  if (selected === "Other") return !normalized.includes("tech") && !normalized.includes("bca") && !normalized.includes("mca") && !normalized.includes("b.e");
  return false;
}

export default function ParticipantTable({
  registrations,
  onViewDetails,
  onFilteredRegistrationsChange,
}: ParticipantTableProps) {
  // Search state
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // Filters state
  const [membership, setMembership] = React.useState<string>("all");
  const [selectedYears, setSelectedYears] = React.useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = React.useState<string[]>([]);
  const [selectedColleges, setSelectedColleges] = React.useState<string[]>([]);
  const [collegeSearch, setCollegeSearch] = React.useState("");
  const [showFilters, setShowFilters] = React.useState(true);

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(25);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
      setPage(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  // Extract unique colleges list
  const uniqueColleges = React.useMemo(() => {
    const set = new Set<string>();
    registrations.forEach((r) => {
      if (r.university && r.university.trim()) {
        set.add(r.university.trim());
      }
    });
    return Array.from(set).sort();
  }, [registrations]);

  const visibleColleges = React.useMemo(() => {
    if (!collegeSearch) return uniqueColleges;
    return uniqueColleges.filter((c) =>
      c.toLowerCase().includes(collegeSearch.toLowerCase())
    );
  }, [uniqueColleges, collegeSearch]);

  // Filtering engine
  const filteredRegistrations = React.useMemo(() => {
    return registrations.filter((r) => {
      // 1. Text Search across 7 key fields
      if (debouncedSearch) {
        const text = [
          r.registration_id,
          r.full_name,
          r.email,
          r.college_email || "",
          r.phone,
          r.university,
          r.branch,
        ]
          .join(" ")
          .toLowerCase();
        if (!text.includes(debouncedSearch)) return false;
      }

      // 2. Membership Filter
      if (membership === "ieee" && !r.is_ieee_member) return false;
      if (membership === "non-ieee" && r.is_ieee_member) return false;
      if (membership === "ieee-cs" && !r.is_ieee_cs_member) return false;

      // 3. Year of Study Multi-select
      if (selectedYears.length > 0) {
        const matched = selectedYears.some((year) => matchesYear(r.year_of_study, year));
        if (!matched) return false;
      }

      // 4. Degree Multi-select
      if (selectedDegrees.length > 0) {
        const matched = selectedDegrees.some((deg) => matchesDegree(r.degree, deg));
        if (!matched) return false;
      }

      // 5. College Multi-select
      if (selectedColleges.length > 0) {
        if (!selectedColleges.includes(r.university)) return false;
      }

      return true;
    });
  }, [
    registrations,
    debouncedSearch,
    membership,
    selectedYears,
    selectedDegrees,
    selectedColleges,
  ]);

  // Notify parent of filtered records
  React.useEffect(() => {
    onFilteredRegistrationsChange?.(filteredRegistrations);
  }, [filteredRegistrations, onFilteredRegistrationsChange]);

  // Reset pagination when filter changes
  const resetFilters = React.useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setMembership("all");
    setSelectedYears([]);
    setSelectedDegrees([]);
    setSelectedColleges([]);
    setCollegeSearch("");
    setPage(1);
  }, []);

  const hasActiveFilters =
    search !== "" ||
    membership !== "all" ||
    selectedYears.length > 0 ||
    selectedDegrees.length > 0 ||
    selectedColleges.length > 0;

  // Toggle multi-select item
  const toggleArrayItem = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setArr((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    setPage(1);
  };

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRegistrations = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRegistrations.slice(start, start + pageSize);
  }, [filteredRegistrations, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* ── Toolbar: Search & Filter Toggle ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, name, email, phone, college..."
            className="pl-9 pr-8 text-xs sm:text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-200"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
              className="text-xs h-8"
            >
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
              Filters {hasActiveFilters && "(Active)"}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-xs h-8 text-zinc-400 hover:text-zinc-100"
              >
                <RotateCcw className="mr-1 h-3 w-3" />
                Reset
              </Button>
            )}
          </div>

          <div className="text-xs text-zinc-400 pl-2 sm:border-l sm:border-zinc-800">
            Showing <strong className="text-zinc-200">{filteredRegistrations.length}</strong> of{" "}
            <strong className="text-zinc-200">{registrations.length}</strong>
          </div>
        </div>
      </div>

      {/* ── Collapsible Filter Pills Panel ── */}
      {showFilters && (
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-3 sm:p-4 space-y-3.5 animate-in fade-in-0 duration-150">
          {/* Membership Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1 sm:w-24 flex-shrink-0">
              <Award className="h-3 w-3 text-zinc-500" />
              Membership:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MEMBERSHIP_OPTIONS.map((opt) => {
                const isActive = membership === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setMembership(opt.value);
                      setPage(1);
                    }}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-full border transition-colors select-none",
                      isActive
                        ? "bg-zinc-100 text-zinc-900 border-zinc-100 font-medium"
                        : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Year of Study Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1 sm:w-24 flex-shrink-0">
              <GraduationCap className="h-3 w-3 text-zinc-500" />
              Year:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {YEAR_OPTIONS.map((year) => {
                const isActive = selectedYears.includes(year);
                return (
                  <button
                    key={year}
                    onClick={() => toggleArrayItem(selectedYears, setSelectedYears, year)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-full border transition-colors select-none",
                      isActive
                        ? "bg-zinc-100 text-zinc-900 border-zinc-100 font-medium"
                        : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                    )}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Degree Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
            <span className="text-xs font-medium text-zinc-400 flex items-center gap-1 sm:w-24 flex-shrink-0">
              <Filter className="h-3 w-3 text-zinc-500" />
              Degree:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {DEGREE_OPTIONS.map((degree) => {
                const isActive = selectedDegrees.includes(degree);
                return (
                  <button
                    key={degree}
                    onClick={() => toggleArrayItem(selectedDegrees, setSelectedDegrees, degree)}
                    className={cn(
                      "px-2.5 py-1 text-xs rounded-full border transition-colors select-none",
                      isActive
                        ? "bg-zinc-100 text-zinc-900 border-zinc-100 font-medium"
                        : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                    )}
                  >
                    {degree}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colleges Multi-Select Filter */}
          {uniqueColleges.length > 0 && (
            <div className="pt-2 border-t border-zinc-800/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-zinc-500" />
                  Universities / Colleges ({uniqueColleges.length})
                  {selectedColleges.length > 0 && ` · ${selectedColleges.length} selected`}
                </span>
                {uniqueColleges.length > 8 && (
                  <Input
                    value={collegeSearch}
                    onChange={(e) => setCollegeSearch(e.target.value)}
                    placeholder="Search universities..."
                    className="h-7 w-full sm:w-48 text-xs bg-zinc-950/60"
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {visibleColleges.map((college) => {
                  const isActive = selectedColleges.includes(college);
                  return (
                    <button
                      key={college}
                      onClick={() => toggleArrayItem(selectedColleges, setSelectedColleges, college)}
                      className={cn(
                        "px-2.5 py-1 text-xs rounded-md border transition-colors text-left truncate max-w-xs",
                        isActive
                          ? "bg-zinc-200 text-zinc-900 border-zinc-200 font-medium"
                          : "bg-zinc-950/40 text-zinc-400 border-zinc-800/80 hover:border-zinc-700 hover:text-zinc-200"
                      )}
                      title={college}
                    >
                      {college}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Table Scroll Hint ── */}
      <div className="md:hidden flex items-center justify-between text-[11px] text-zinc-500 px-1 select-none">
        <span>← Swipe table horizontally →</span>
        <span>Tap row for full details</span>
      </div>

      {/* ── Interactive Shadcn Table ── */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur-sm">
            <TableRow className="border-b border-zinc-800/80">
              <TableHead className="w-36 min-w-[130px]">Registration ID</TableHead>
              <TableHead className="min-w-[190px]">Participant</TableHead>
              <TableHead className="min-w-[220px]">College & Branch</TableHead>
              <TableHead className="w-28 min-w-[110px]">Year / Degree</TableHead>
              <TableHead className="w-32 min-w-[120px]">IEEE Status</TableHead>
              <TableHead className="w-32 min-w-[120px]">Registered</TableHead>
              <TableHead className="w-20 min-w-[80px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-44 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Filter className="h-8 w-8 text-zinc-600" />
                    <p className="text-sm font-medium text-zinc-300">No participants matched</p>
                    <p className="text-xs text-zinc-500">
                      Try loosening your search terms or resetting filter pills.
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="mt-2 text-xs"
                      >
                        Reset All Filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedRegistrations.map((reg) => (
                <TableRow
                  key={reg.id || reg.registration_id}
                  className="cursor-pointer group"
                  onClick={() => onViewDetails(reg)}
                >
                  {/* Registration ID */}
                  <TableCell>
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
                      {reg.registration_id}
                    </span>
                  </TableCell>

                  {/* Participant Name & Email */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-100 group-hover:text-zinc-50">
                        {reg.full_name}
                      </span>
                      <span className="text-xs text-zinc-400 truncate max-w-xs">{reg.email}</span>
                      {reg.phone && <span className="text-xs text-zinc-500">{reg.phone}</span>}
                    </div>
                  </TableCell>

                  {/* College & Branch */}
                  <TableCell>
                    <div className="flex flex-col max-w-sm">
                      <span className="text-xs font-medium text-zinc-200 line-clamp-1" title={reg.university}>
                        {reg.university}
                      </span>
                      <span className="text-xs text-zinc-400 line-clamp-1">{reg.branch}</span>
                    </div>
                  </TableCell>

                  {/* Year / Degree */}
                  <TableCell>
                    <div className="flex flex-col text-xs text-zinc-300">
                      <span>{reg.year_of_study || "—"}</span>
                      <span className="text-zinc-500">{reg.degree || "—"}</span>
                    </div>
                  </TableCell>

                  {/* IEEE Status */}
                  <TableCell>
                    <div className="flex flex-col items-start gap-1">
                      {reg.is_ieee_member ? (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0">
                          IEEE Member
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-zinc-400">
                          Non-Member
                        </Badge>
                      )}
                      {reg.is_ieee_cs_member && (
                        <Badge variant="info" className="text-[10px] px-1.5 py-0">
                          IEEE CS
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  {/* Registered Timestamp */}
                  <TableCell className="text-xs text-zinc-400">
                    {reg.created_at ? (
                      <div className="flex flex-col">
                        <span>{new Date(reg.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                        <span className="text-zinc-500">{new Date(reg.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(reg)}
                      title="Inspect participant details"
                      className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Inspect</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Pagination Footer (Docked & Accessible Toolbar) ── */}
      {filteredRegistrations.length > 0 && (
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 shadow-sm">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span>Rows:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="h-7 rounded border border-zinc-800 bg-zinc-900 px-2 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-[11px] sm:text-xs">
              Showing <strong className="text-zinc-200">{paginatedRegistrations.length}</strong> of{" "}
              <strong className="text-zinc-200">{filteredRegistrations.length}</strong>
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            <span className="text-[11px] sm:text-xs">
              Page <strong className="text-zinc-200">{currentPage}</strong> of <strong className="text-zinc-200">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2.5 text-xs border-zinc-800"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-0.5 sm:mr-1" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2.5 text-xs border-zinc-800"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5 ml-0.5 sm:ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
