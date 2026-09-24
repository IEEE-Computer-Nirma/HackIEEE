"use client";

import { useRef, useState } from "react";
import { timelineEvents } from "../data/timeline";

const compact = (iso: string) => iso.replaceAll("-", "");

function nextDay(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

// Builds an all-day .ics for every milestone — no backend involved.
function buildCalendar() {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (s: string) => s.replace(/[\\;,]/g, (m) => `\\${m}`);
  const events = timelineEvents.map((e, i) =>
    [
      "BEGIN:VEVENT",
      `UID:hackieee-2026-${i}@hackieee`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(e.start)}`,
      `DTEND;VALUE=DATE:${compact(nextDay(e.end))}`,
      `SUMMARY:${esc(`HackIEEE: ${e.title}`)}`,
      `DESCRIPTION:${esc(`${e.description} Dates are tentative and may shift by ±1 week.`)}`,
      "END:VEVENT",
    ].join("\r\n")
  );
  return ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//HackIEEE//Timeline//EN", "CALSCALE:GREGORIAN", ...events, "END:VCALENDAR"].join("\r\n");
}

/* Bell Toggle — rings, recolours and drops a dot once the dates are saved. */
export default function BellReminder() {
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    const blob = new Blob([buildCalendar()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hackieee-2026.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDone(true);

    const bell = ref.current;
    if (bell) {
      bell.classList.remove("ring");
      void bell.offsetWidth; // restart the ring on repeat clicks
      bell.classList.add("ring");
    }
  };

  return (
    <button ref={ref} type="button" className="bell" data-done={done} onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 16.5V10a6 6 0 0 1 12 0v6.5l1.6 2.3H4.4L6 16.5z" />
        <path d="M10 21.5h4" />
      </svg>
      <span className="dot" />
      <span aria-live="polite">{done ? "Calendar file saved" : "Add dates to calendar"}</span>
    </button>
  );
}
