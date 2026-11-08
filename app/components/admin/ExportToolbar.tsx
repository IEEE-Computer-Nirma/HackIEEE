
"use client";

import * as XLSX from "xlsx";
import { FileSpreadsheet, FileText, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Registration } from "./ParticipantTable";

interface ExportToolbarProps {
  registrations: Registration[];
  filteredRegistrations: Registration[];
}

export default function ExportToolbar({
  registrations,
  filteredRegistrations,
}: ExportToolbarProps) {
  // Calculate summary metrics
  const totalCount = registrations.length;

  const ieeeCount = registrations.filter(
    (r) => r.is_ieee_member
  ).length;

  const ieeePercentage =
    totalCount > 0
      ? ((ieeeCount / totalCount) * 100).toFixed(1)
      : "0.0";

  const uniqueColleges = new Set(
    registrations.map((r) => r.university).filter(Boolean)
  ).size;

  const collegeCounts = registrations.reduce(
    (acc, r) => {
      const college = String(r.university || "Unknown");
      acc[college] = (acc[college] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const topColleges = Object.entries(collegeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Excel export: Summary and Attendees sheets
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();

    const summaryRows = [
      { Metric: "Total Registrations", Value: totalCount },
      { Metric: "IEEE Members", Value: ieeeCount },
      { Metric: "IEEE Member Percentage", Value: `${ieeePercentage}%` },
      { Metric: "Unique Colleges", Value: uniqueColleges },
      {},
      { Metric: "Top 10 Colleges", Value: "Registrations" },
      ...topColleges.map(([college, count]) => ({
        Metric: college,
        Value: count,
      })),
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
    XLSX.utils.book_append_sheet(
      workbook,
      summarySheet,
      "Summary & Metrics"
    );

    const attendeeRows = registrations.map((r, index) => ({
      "S.No": index + 1,
      "Registration ID": r.registration_id,
      "Full Name": r.full_name,
      Email: r.email,
      "College Email": r.college_email || "-",
      Phone: r.phone,
      University: r.university,
      Degree: r.degree,
      Branch: r.branch,
      "Year of Study": r.year_of_study,
      "Graduation Year": r.graduation_year || "-",
      "IEEE Member": r.is_ieee_member ? "Yes" : "No",
      "IEEE Membership Number": r.ieee_membership_number || "-",
      "IEEE CS Member": r.is_ieee_cs_member ? "Yes" : "No",
      GitHub: r.github_url || "-",
      LinkedIn: r.linkedin_url || "-",
      "Registered At": r.created_at
        ? new Date(r.created_at).toLocaleString("en-IN")
        : "-",
    }));

    const attendeeSheet = XLSX.utils.json_to_sheet(attendeeRows);

    attendeeSheet["!cols"] = [
      { wch: 6 }, { wch: 20 }, { wch: 25 }, { wch: 30 },
      { wch: 30 }, { wch: 16 }, { wch: 35 }, { wch: 15 },
      { wch: 22 }, { wch: 15 }, { wch: 16 }, { wch: 14 },
      { wch: 22 }, { wch: 16 }, { wch: 30 }, { wch: 30 },
      { wch: 22 },
    ];

    attendeeSheet["!freeze"] = {
      xSplit: 0,
      ySplit: 1,
      topLeftCell: "A2",
      activePane: "bottomLeft",
      state: "frozen",
    };

    XLSX.utils.book_append_sheet(
      workbook,
      attendeeSheet,
      "Attendees Roster"
    );

    XLSX.writeFile(workbook, "HackIEEE_Registrations.xlsx");
  };

  // CSV export: uses active search and filters
  const exportToCSV = () => {
    const rows = filteredRegistrations.map((r) => ({
      "Registration ID": r.registration_id,
      "Full Name": r.full_name,
      Email: r.email,
      "College Email": r.college_email || "",
      Phone: r.phone,
      University: r.university,
      Degree: r.degree,
      Branch: r.branch,
      "Year of Study": r.year_of_study,
      "Graduation Year": r.graduation_year || "",
      "IEEE Member": r.is_ieee_member ? "Yes" : "No",
      "IEEE Membership Number": r.ieee_membership_number || "",
      "IEEE CS Member": r.is_ieee_cs_member ? "Yes" : "No",
      "Registered At": r.created_at || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "HackIEEE_Filtered_Registrations.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  // Printable PDF using browser print
  const exportToPDF = () => {
    window.print();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 print:hidden">
        <Button
          onClick={exportToExcel}
          className="bg-[#e2822f] text-[#0a0705] hover:bg-[#f8cf96]"
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Excel
        </Button>

        <Button
          onClick={exportToCSV}
          variant="outline"
          className="border-[#f8cf96]/20 bg-transparent text-[#f8cf96]"
        >
          <FileText className="mr-2 h-4 w-4" />
          Export CSV
        </Button>

        <Button
          onClick={exportToPDF}
          variant="outline"
          className="border-[#f8cf96]/20 bg-transparent text-[#f8cf96]"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      {/* Printable A4 landscape report */}
      <div className="hidden print:block print-area">
        <h1>HackIEEE 2027 — Registration Report</h1>

        <p>
          Total Registrations: {totalCount} |
          IEEE Members: {ieeeCount} ({ieeePercentage}%) |
          Unique Colleges: {uniqueColleges}
        </p>

        <h2>Attendees Roster</h2>

        <table>
          <thead>
            <tr>
              <th>Registration ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>University</th>
              <th>Degree</th>
              <th>Branch</th>
              <th>Year</th>
              <th>IEEE Member</th>
              <th>Registered At</th>
            </tr>
          </thead>

          <tbody>
            {registrations.map((r) => (
              <tr key={r.registration_id}>
                <td>{r.registration_id}</td>
                <td>{r.full_name}</td>
                <td>{r.email}</td>
                <td>{r.phone}</td>
                <td>{r.university}</td>
                <td>{r.degree}</td>
                <td>{r.branch}</td>
                <td>{r.year_of_study}</td>
                <td>{r.is_ieee_member ? "Yes" : "No"}</td>
                <td>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString("en-IN")
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          body * {
            visibility: hidden;
          }

          .print-area,
          .print-area * {
            visibility: visible;
          }

          .print-area {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            color: #111;
            background: white;
            font-size: 9px;
          }

          .print-area h1 {
            font-size: 20px;
            margin-bottom: 12px;
          }

          .print-area h2 {
            font-size: 14px;
            margin: 16px 0 8px;
          }

          .print-area table {
            width: 100%;
            border-collapse: collapse;
          }

          .print-area th,
          .print-area td {
            border: 1px solid #999;
            padding: 5px;
            text-align: left;
          }

          .print-area th {
            background: #eee;
          }
        }
      `}</style>
    </>
  );
}
