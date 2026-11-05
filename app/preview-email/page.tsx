"use client";

import { useState } from "react";

export default function EmailPreviewPage() {
  const [scale, setScale] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="min-h-screen bg-[#070503] text-[#f3e6cf] p-6 flex flex-col items-center font-sans">
      <header className="max-w-4xl w-full flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-[#f8cf96]/20 pb-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#e2822f] font-mono font-semibold">
            HackIEEE 2026–27
          </span>
          <h1 className="text-2xl font-bold text-[#f8cf96] tracking-wide mt-1">
            Email Template & Format Studio
          </h1>
          <p className="text-xs text-[#f3e6cf]/60 mt-1 font-mono">
            Direct preview of the confirmation email sent to registered participants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#140e0a] border border-[#f8cf96]/20 rounded-lg p-1 flex">
            <button
              onClick={() => setScale("desktop")}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                scale === "desktop"
                  ? "bg-[#e2822f] text-black font-semibold"
                  : "text-[#f3e6cf]/70 hover:text-white"
              }`}
            >
              Desktop (580px)
            </button>
            <button
              onClick={() => setScale("mobile")}
              className={`px-3 py-1.5 text-xs font-mono rounded transition-colors ${
                scale === "mobile"
                  ? "bg-[#e2822f] text-black font-semibold"
                  : "text-[#f3e6cf]/70 hover:text-white"
              }`}
            >
              Mobile (380px)
            </button>
          </div>

          <a
            href="/api/preview-email"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-[#24170d] hover:bg-[#342214] text-[#f8cf96] border border-[#f8cf96]/30 text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5"
          >
            Open Raw HTML ↗
          </a>
        </div>
      </header>

      {/* Frame Container */}
      <div
        className="transition-all duration-300 w-full flex justify-center"
        style={{
          maxWidth: scale === "desktop" ? "640px" : "420px",
        }}
      >
        <div className="w-full bg-[#0b0906] rounded-2xl border border-[#f8cf96]/25 shadow-2xl overflow-hidden p-2">
          <div className="bg-[#140e0a] px-4 py-2 border-b border-[#f8cf96]/15 flex items-center justify-between text-[11px] font-mono text-[#f3e6cf]/50">
            <span>Subject: Registration Confirmed: HackIEEE 2026-27 [HI27-PP-3K34]</span>
            <span className="text-emerald-400 font-sans">Verified Delivery</span>
          </div>
          <iframe
            src="/api/preview-email"
            title="Email Preview"
            className="w-full h-[950px] border-0 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
