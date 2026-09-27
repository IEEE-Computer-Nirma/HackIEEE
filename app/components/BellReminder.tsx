"use client";

import { useRef, useState, useEffect } from "react";

export default function BellReminder() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onClick = () => {
    setOpen(!open);
    if (!open && btnRef.current) {
      btnRef.current.classList.remove("ring");
      void btnRef.current.offsetWidth;
      btnRef.current.classList.add("ring");
    }
  };

  const title = encodeURIComponent("hackieee 2026 Hackathon");
  const details = encodeURIComponent("Intense coding and product building. Join the ultimate hackathon experience!");
  const location = encodeURIComponent("Nirma University");
  
  // Jan 2 to Jan 4 inclusive (All Day event spanning to Jan 5 boundary)
  const gDates = "20270102T000000Z/20270105T000000Z";
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${gDates}&details=${details}&location=${location}`;

  const outlookStart = "2027-01-02T00:00:00Z";
  const outlookEnd = "2027-01-05T00:00:00Z";
  const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&startdt=${outlookStart}&enddt=${outlookEnd}&subject=${title}&body=${details}&location=${location}`;

  const yahooUrl = `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=20270102T000000Z&et=20270105T000000Z&desc=${details}&in_loc=${location}`;

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button ref={btnRef} type="button" className="bell" data-done={open} onClick={onClick}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 16.5V10a6 6 0 0 1 12 0v6.5l1.6 2.3H4.4L6 16.5z" />
          <path d="M10 21.5h4" />
        </svg>
        <span className="dot" />
        <span aria-live="polite">Add to Calendar</span>
      </button>

      {open && (
        <div 
          className="absolute left-full top-1/2 ml-4 flex -translate-y-1/2 flex-col gap-1 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl z-50 min-w-[160px]"
          style={{ 
            background: "var(--glass)",
            borderColor: "var(--glass-border)",
          }}
        >
          <a href={googleUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/10 dark:hover:bg-white/10 text-center transition-colors">
            Google Calendar
          </a>
          <a href={outlookUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/10 dark:hover:bg-white/10 text-center transition-colors">
            Outlook
          </a>
          <a href={yahooUrl} target="_blank" rel="noopener noreferrer" className="rounded-xl px-4 py-2.5 text-sm font-medium text-ink hover:bg-black/10 dark:hover:bg-white/10 text-center transition-colors">
            Yahoo
          </a>
        </div>
      )}
    </div>
  );
}
