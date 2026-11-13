"use client";

import * as React from "react";
import { FileSpreadsheet, FileText, Printer, Download, ChevronDown } from "lucide-react";
import * as XLSX from "xlsx";
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
  const [exportScope, setExportScope] = React.useState<"filtered" | "all">("filtered");

  const targetData = exportScope === "filtered" ? filteredRegistrations : registrations;

  // Format data row for export
  const prepareExportData = (dataList: Registration[]) => {
    return dataList.map((r, index) => ({
      "S.No": index + 1,
      "Registration ID": r.registration_id,
      "Full Name": r.full_name,
      "Personal Email": r.email,
      "College Email": r.college_email || "",
      "Phone": r.phone || "",
      "University": r.university || "",
      "Degree": r.degree || "",
      "Branch": r.branch || "",
      "Year of Study": r.year_of_study || "",
      "Expected Graduation": r.graduation_year || "",
      "IEEE Member": r.is_ieee_member ? "Yes" : "No",
      "IEEE Member Number": r.ieee_membership_number || "",
      "IEEE CS Member": r.is_ieee_cs_member ? "Yes" : "No",
      "City": r.city || "",
      "State": r.state || "",
      "Country": r.country || "India",
      "LinkedIn": r.linkedin_url || "",
      "GitHub": r.github_url || "",
      "Hear About": r.hear_about || "",
      "Registration Date": r.created_at
        ? new Date(r.created_at).toLocaleString("en-IN")
        : "",
    }));
  };

  // 1. Export as Excel (.xlsx)
  const exportToExcel = () => {
    if (targetData.length === 0) {
      alert("No participants to export.");
      return;
    }
    const exportRows = prepareExportData(targetData);
    const worksheet = XLSX.utils.json_to_sheet(exportRows);

    // Auto-fit column widths
    const colWidths = Object.keys(exportRows[0] || {}).map((key) => ({
      wch: Math.max(key.length, 14),
    }));
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HackIEEE Registrations");

    const dateStr = new Date().toISOString().split("T")[0];
    const fileName = `HackIEEE_2027_Registrations_${exportScope}_${dateStr}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // 2. Export as CSV
  const exportToCSV = () => {
    if (targetData.length === 0) {
      alert("No participants to export.");
      return;
    }
    const exportRows = prepareExportData(targetData);
    if (exportRows.length === 0) return;

    const headers = Object.keys(exportRows[0]);
    const csvLines = [
      headers.join(","),
      ...exportRows.map((row) =>
        headers
          .map((h) => {
            const val = String((row as Record<string, unknown>)[h] ?? "").replace(/"/g, '""');
            return `"${val}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    link.href = url;
    link.download = `HackIEEE_2027_Registrations_${exportScope}_${dateStr}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 3. Print / PDF Export
  const exportToPDF = () => {
    if (targetData.length === 0) {
      alert("No participants to print/export.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Pop-up blocked. Please allow pop-ups for this site to export PDF.");
      return;
    }

    const rowsHtml = targetData
      .map(
        (r, i) => `
        <tr>
          <td style="padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px;">${i + 1}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #ddd; font-family: monospace; font-size: 11px; font-weight: bold;">${r.registration_id}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px;">${r.full_name}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px;">${r.email}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px;">${r.phone || "—"}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px;">${r.university}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px;">${r.branch}</td>
          <td style="padding: 6px 8px; border-bottom: 1px solid #ddd; font-size: 11px;">${r.is_ieee_member ? "Yes" : "No"}</td>
        </tr>
      `
      )
      .join("");

    const dateStr = new Date().toLocaleString("en-IN");
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>HackIEEE 2027 Registrations Roster</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; color: #111; }
            h1 { margin-bottom: 4px; font-size: 20px; }
            p { margin-top: 0; color: #555; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { text-align: left; padding: 8px; background: #f0f0f0; border-bottom: 2px solid #ccc; font-size: 11px; text-transform: uppercase; }
            @media print {
              body { padding: 0; }
              @page { size: landscape; margin: 12mm; }
            }
          </style>
        </head>
        <body>
          <h1>HackIEEE 2027 — Participant Roster</h1>
          <p>Generated on ${dateStr} · Scope: ${exportScope.toUpperCase()} (${targetData.length} attendees)</p>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Registration ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>University</th>
                <th>Branch</th>
                <th>IEEE</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 sm:px-4 sm:py-2.5">
      {/* Scope Selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-zinc-400 font-medium">Export Scope:</span>
        <div className="inline-flex rounded-md border border-zinc-800 bg-zinc-950 p-0.5">
          <button
            onClick={() => setExportScope("filtered")}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              exportScope === "filtered"
                ? "bg-zinc-800 text-zinc-100 font-medium shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Filtered ({filteredRegistrations.length})
          </button>
          <button
            onClick={() => setExportScope("all")}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              exportScope === "all"
                ? "bg-zinc-800 text-zinc-100 font-medium shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            All Attendees ({registrations.length})
          </button>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={exportToExcel}
          disabled={targetData.length === 0}
          className="text-xs h-8 px-2 sm:px-3 border-zinc-800 hover:bg-zinc-800 hover:text-emerald-400 justify-center"
        >
          <FileSpreadsheet className="mr-1 sm:mr-1.5 h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
          <span>Excel</span>
          <span className="hidden md:inline"> (.xlsx)</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={exportToCSV}
          disabled={targetData.length === 0}
          className="text-xs h-8 px-2 sm:px-3 border-zinc-800 hover:bg-zinc-800 hover:text-sky-400 justify-center"
        >
          <FileText className="mr-1 sm:mr-1.5 h-3.5 w-3.5 text-sky-400 flex-shrink-0" />
          <span>CSV</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={exportToPDF}
          disabled={targetData.length === 0}
          className="text-xs h-8 px-2 sm:px-3 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-100 justify-center"
        >
          <Printer className="mr-1 sm:mr-1.5 h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
          <span>PDF</span>
          <span className="hidden md:inline"> / Print</span>
        </Button>
      </div>
    </div>
  );
}
