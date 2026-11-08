
"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  is_ieee_member: boolean;
  is_ieee_cs_member: boolean;
  ieee_membership_number?: string | null;
  created_at: string;
  [key: string]: unknown;
}

interface ParticipantTableProps {
  registrations: Registration[];
  onViewDetails: (participant: Registration) => void;
  onFilteredRegistrationsChange?: (filtered: Registration[]) => void;
}

const YEAR_OPTIONS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year",
  "Postgrad",
];

const DEGREE_OPTIONS = ["B.Tech", "M.Tech", "BCA/MCA", "Other"];

const MEMBERSHIP_OPTIONS = [
  "All",
  "IEEE Members",
  "Non-Members",
  "IEEE CS Members",
];

function matchesYear(value: string, selected: string) {
  const year = value.toLowerCase();

  const yearPatterns: Record<string, string[]> = {
    "1st Year": ["1", "first"],
    "2nd Year": ["2", "second"],
    "3rd Year": ["3", "third"],
    "4th Year": ["4", "fourth"],
    Postgrad: ["post", "master", "m.tech", "mca"],
  };

  return (yearPatterns[selected] || []).some((pattern) =>
    year.includes(pattern)
  );
}

function matchesDegree(value: string, selected: string) {
  const degree = value.toLowerCase();

  if (selected === "Other") {
    return !["b.tech", "m.tech", "bca", "mca"].some((item) =>
      degree.includes(item)
    );
  }

  if (selected === "BCA/MCA") {
    return degree.includes("bca") || degree.includes("mca");
  }

  return degree.includes(selected.toLowerCase());
}

export default function ParticipantTable({
  registrations,
  onViewDetails,
  onFilteredRegistrationsChange,
}: ParticipantTableProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedColleges, setSelectedColleges] = useState<string[]>([]);

  const [membership, setMembership] = useState("All");
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Get available colleges
  const colleges = useMemo(() => {
    return Array.from(
      new Set(registrations.map((r) => r.university).filter(Boolean))
    ).sort();
  }, [registrations]);

  const visibleColleges = colleges.filter((college) =>
    college.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  // Apply search and filters
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      const searchableText = [
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

      const matchesSearch =
        debouncedSearch === "" ||
        searchableText.includes(debouncedSearch);

      const matchesCollege =
        selectedColleges.length === 0 ||
        selectedColleges.includes(r.university);

      let matchesMembership = true;

      if (membership === "IEEE Members") {
        matchesMembership = r.is_ieee_member;
      } else if (membership === "Non-Members") {
        matchesMembership = !r.is_ieee_member;
      } else if (membership === "IEEE CS Members") {
        matchesMembership = r.is_ieee_cs_member;
      }

      const matchesSelectedYears =
        selectedYears.length === 0 ||
        selectedYears.some((year) =>
          matchesYear(r.year_of_study, year)
        );

      const matchesSelectedDegrees =
        selectedDegrees.length === 0 ||
        selectedDegrees.some((degree) =>
          matchesDegree(r.degree, degree)
        );

      return (
        matchesSearch &&
        matchesCollege &&
        matchesMembership &&
        matchesSelectedYears &&
        matchesSelectedDegrees
      );
    });
  }, [
    registrations,
    debouncedSearch,
    selectedColleges,
    membership,
    selectedYears,
    selectedDegrees,
  ]);

  useEffect(() => {
    onFilteredRegistrationsChange?.(filteredRegistrations);
  }, [filteredRegistrations, onFilteredRegistrationsChange]);

  // Toggle multi-select filter values
  function toggleValue(
    value: string,
    selected: string[],
    setter: (values: string[]) => void
  ) {
    if (selected.includes(value)) {
      setter(selected.filter((item) => item !== value));
    } else {
      setter([...selected, value]);
    }
  }

  const filterButton = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-xs transition ${
      active
        ? "border-[#e2822f] bg-[#e2822f]/15 text-[#f8cf96]"
        : "border-[#f8cf96]/15 text-[#f8cf96]/65 hover:border-[#e2822f]"
    }`;

  return (
    <div className="space-y-5">

      {/* Search */}
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search registration ID, name, email, phone, college or branch..."
        className="border-[#f8cf96]/15 bg-[#120d09] text-[#f8cf96] placeholder:text-[#f8cf96]/40"
      />

      {/* College filter */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#f8cf96]/70">
          College
        </p>

        <Input
          value={collegeSearch}
          onChange={(e) => setCollegeSearch(e.target.value)}
          placeholder="Search colleges..."
          className="max-w-sm border-[#f8cf96]/15 bg-[#120d09] text-[#f8cf96]"
        />

        <div className="flex flex-wrap gap-2">
          {visibleColleges.map((college) => (
            <button
              key={college}
              type="button"
              onClick={() =>
                toggleValue(college, selectedColleges, setSelectedColleges)
              }
              className={filterButton(selectedColleges.includes(college))}
            >
              {college}
            </button>
          ))}
        </div>
      </div>

      {/* IEEE membership filter */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#f8cf96]/70">
          IEEE Membership
        </p>

        <div className="flex flex-wrap gap-2">
          {MEMBERSHIP_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMembership(option)}
              className={filterButton(membership === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Year filter */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#f8cf96]/70">
          Year of Study
        </p>

        <div className="flex flex-wrap gap-2">
          {YEAR_OPTIONS.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() =>
                toggleValue(year, selectedYears, setSelectedYears)
              }
              className={filterButton(selectedYears.includes(year))}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Degree filter */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#f8cf96]/70">
          Degree
        </p>

        <div className="flex flex-wrap gap-2">
          {DEGREE_OPTIONS.map((degree) => (
            <button
              key={degree}
              type="button"
              onClick={() =>
                toggleValue(degree, selectedDegrees, setSelectedDegrees)
              }
              className={filterButton(selectedDegrees.includes(degree))}
            >
              {degree}
            </button>
          ))}
        </div>
      </div>

      {/* Participant table */}
      <div className="overflow-x-auto rounded-xl border border-[#f8cf96]/10">
        <Table>
          <TableHeader>
            <TableRow className="border-[#f8cf96]/10 hover:bg-transparent">
              {[
                "Registration ID",
                "Participant Name",
                "Email & Phone",
                "University",
                "Degree & Branch",
                "Year",
                "IEEE Status",
                "Registered At",
                "Action",
              ].map((heading) => (
                <TableHead
                  key={heading}
                  className="whitespace-nowrap text-[#f8cf96]"
                >
                  {heading}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredRegistrations.map((r) => (
              <TableRow
                key={r.id}
                className="border-[#f8cf96]/10 text-white"
              >
                <TableCell className="whitespace-nowrap font-mono text-[#f8cf96]">
                  {r.registration_id}
                </TableCell>

                <TableCell className="font-semibold">
                  {r.full_name}
                </TableCell>

                <TableCell>
                  <div className="text-sm">{r.email}</div>
                  <div className="text-xs text-[#f8cf96]/50">
                    {r.phone}
                  </div>
                </TableCell>

                <TableCell className="max-w-[180px] truncate">
                  {r.university}
                </TableCell>

                <TableCell>
                  {r.degree}, {r.branch}
                </TableCell>

                <TableCell>
                  <Badge variant="outline">
                    {r.year_of_study}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    className={
                      r.is_ieee_member
                        ? "bg-[#4ade80]/15 text-[#4ade80]"
                        : "bg-[#f8cf96]/10 text-[#f8cf96]/60"
                    }
                  >
                    {r.is_ieee_member
                      ? "Active Member"
                      : "Non-Member"}
                  </Badge>
                </TableCell>

                <TableCell className="whitespace-nowrap text-xs text-[#f8cf96]/70">
                  {new Date(r.created_at).toLocaleString("en-IN")}
                </TableCell>

                <TableCell>
                  <button
                    type="button"
                    onClick={() => onViewDetails(r)}
                    className="whitespace-nowrap text-xs text-[#e2822f] hover:underline"
                  >
                    View Details
                  </button>
                </TableCell>
              </TableRow>
            ))}

            {filteredRegistrations.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-10 text-center text-[#f8cf96]/50"
                >
                  No participants found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-[#f8cf96]/50">
        Showing {filteredRegistrations.length} of{" "}
        {registrations.length} participants
      </p>
    </div>
  );
}
