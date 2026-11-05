"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { School, Check, Plus, Loader2, Search } from "lucide-react";
import { University, INITIAL_UNIVERSITIES } from "@/app/data/universities";

interface UniversityAutocompleteProps {
  value: string;
  onChange: (value: string, university?: University) => void;
  error?: string;
  id?: string;
  isDark?: boolean;
}

export default function UniversityAutocomplete({
  value,
  onChange,
  error,
  id = "university-autocomplete",
  isDark = false,
}: UniversityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  // Pre-seed with curated universities immediately so dropdown opens at 0ms latency
  const [suggestions, setSuggestions] = useState<University[]>(() => INITIAL_UNIVERSITIES.slice(0, 25));
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync external value when not focused
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setQuery(value);
    }
  }, [value]);

  // In-memory cache pre-seeded with empty query
  const cacheRef = useRef<Record<string, University[]>>({
    "": INITIAL_UNIVERSITIES,
  });

  const fetchUniversities = useCallback(async (searchQuery: string) => {
    const key = searchQuery.trim().toLowerCase();
    if (cacheRef.current[key]) {
      setSuggestions(cacheRef.current[key]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/universities?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.universities)) {
        cacheRef.current[key] = data.universities;
        setSuggestions(data.universities);
      }
    } catch (err) {
      console.error("Failed to fetch universities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Pre-fetch updated backend catalog immediately on mount
  useEffect(() => {
    void fetchUniversities("");
  }, [fetchUniversities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    onChange(newVal);
    setIsOpen(true);
    setSelectedIndex(-1);

    const clean = newVal.toLowerCase().trim();
    if (!clean) {
      setSuggestions(cacheRef.current[""] || INITIAL_UNIVERSITIES.slice(0, 25));
    } else {
      // Instant local preview for zero-latency feedback
      const localMatches = INITIAL_UNIVERSITIES.filter(
        (u) =>
          u.name.toLowerCase().includes(clean) ||
          u.aliases?.some((a) => a.toLowerCase().includes(clean)) ||
          u.city?.toLowerCase().includes(clean) ||
          u.state?.toLowerCase().includes(clean)
      );
      if (localMatches.length > 0) {
        setSuggestions(localMatches.slice(0, 15));
      }
    }

    // Debounced query to backend for full search + online fallback
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchUniversities(newVal);
    }, 150);
  };

  const handleSelect = (univ: University) => {
    setQuery(univ.name);
    onChange(univ.name, univ);
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleAddCustom = async () => {
    if (!query.trim()) return;
    try {
      const res = await fetch("/api/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: query.trim() }),
      });
      const data = await res.json();
      if (data.success && data.university) {
        onChange(data.university.name, data.university);
      } else {
        onChange(query.trim());
      }
    } catch {
      onChange(query.trim());
    }
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        fetchUniversities(query);
      }
      return;
    }

    const totalItems = suggestions.length + (query.trim() ? 1 : 0);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelect(suggestions[selectedIndex]);
      } else if (selectedIndex === suggestions.length && query.trim()) {
        handleAddCustom();
      } else if (suggestions.length > 0) {
        handleSelect(suggestions[0]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8a8073]">
          <School size={17} strokeWidth={1.8} />
        </div>
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            if (suggestions.length === 0) fetchUniversities(query);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search or enter your university / institution"
          autoComplete="off"
          className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-200 outline-none ${
            isDark
              ? "bg-[#18110b] border-[rgba(248,207,150,0.2)] text-[#f3e6cf] placeholder:text-[#f3e6cf]/35 hover:border-[rgba(248,207,150,0.35)] focus:border-[#ffa64d] focus:ring-1 focus:ring-[#ffa64d]/30"
              : "bg-[#f5f0e8] border-[#e5dcce] text-[#2b2318] placeholder:text-[#9a9184] hover:border-[#c67634]/60 focus:border-[#c06820] focus:ring-1 focus:ring-[#c06820]/30"
          } ${
            error ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30" : ""
          }`}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="university-suggestions-list"
          role="combobox"
        />
        <div className={`absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none ${isDark ? "text-[#f3e6cf]/40" : "text-[#8a8073]"}`}>
          {loading ? (
            <Loader2 size={16} className={`animate-spin ${isDark ? "text-[#ffa64d]" : "text-[#c06820]"}`} />
          ) : (
            <Search size={16} />
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div
          id="university-suggestions-list"
          role="listbox"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: isDark
              ? "rgba(248, 207, 150, 0.25) transparent"
              : "rgba(192, 104, 32, 0.2) transparent",
          }}
          className={`absolute z-50 left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-xl p-1.5 border backdrop-blur-xl focus:outline-none ${
            isDark
              ? "border-[rgba(248,207,150,0.22)] bg-[#18110b]/98 shadow-[0_16px_50px_rgba(0,0,0,0.85)] text-[#f3e6cf]"
              : "border-[#ecd8c5] bg-[#fefbf6]/98 shadow-[0_16px_50px_rgba(140,80,30,0.14)] text-[#2b2318]"
          }`}
        >
          {suggestions.length > 0 ? (
            suggestions.map((univ, idx) => {
              const isSelected = selectedIndex === idx;
              const isCurrent = value.toLowerCase().trim() === univ.name.toLowerCase().trim();
              return (
                <button
                  key={`${univ.id}-${idx}`}
                  type="button"
                  onClick={() => handleSelect(univ)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors cursor-pointer ${
                    isDark
                      ? isSelected
                        ? "bg-[#e2822f]/20 text-[#ffa64d]"
                        : "text-[#f3e6cf] hover:bg-white/5"
                      : isSelected
                        ? "bg-[#faefe3] text-[#c06820]"
                        : "text-[#2b2318] hover:bg-[#f5f0e8]"
                  }`}
                >
                  <School
                    size={16}
                    className={`mt-0.5 shrink-0 ${
                      isSelected
                        ? isDark ? "text-[#ffa64d]" : "text-[#c06820]"
                        : isDark ? "text-[#f3e6cf]/40" : "text-[#8a8073]"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug truncate ${isDark ? "text-[#f3e6cf]" : "text-[#2b2318]"}`}>
                      {univ.name}
                    </p>
                    {(univ.city || univ.state) && (
                      <p className={`text-xs leading-tight ${isDark ? "text-[#f3e6cf]/50" : "text-[#7f7669]"}`}>
                        {[univ.city, univ.state, univ.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                  {isCurrent && (
                    <Check size={16} className={`shrink-0 mt-0.5 ${isDark ? "text-[#ffa64d]" : "text-[#c06820]"}`} />
                  )}
                </button>
              );
            })
          ) : (
            !loading && query.trim().length > 0 && (
              <div className={`px-4 py-3 text-center text-xs ${isDark ? "text-[#f3e6cf]/50" : "text-[#7f7669]"}`}>
                No matching university found in catalog.
              </div>
            )
          )}

          {/* Add custom university option if not an exact match */}
          {query.trim().length > 2 &&
            !suggestions.some(
              (s) => s.name.toLowerCase().trim() === query.toLowerCase().trim()
            ) && (
              <button
                type="button"
                onClick={handleAddCustom}
                onMouseEnter={() => setSelectedIndex(suggestions.length)}
                className={`w-full text-left px-4 py-3 flex items-center gap-2.5 transition-colors cursor-pointer ${
                  isDark
                    ? `border-t border-[rgba(248,207,150,0.15)] ${
                        selectedIndex === suggestions.length
                          ? "bg-[#e2822f]/20 text-[#ffa64d]"
                          : "text-[#f3e6cf] hover:bg-white/5"
                      }`
                    : `border-t border-[#ecd8c5] ${
                        selectedIndex === suggestions.length
                          ? "bg-[#faefe3] text-[#c06820]"
                          : "text-[#2b2318] hover:bg-[#f5f0e8]"
                      }`
                }`}
              >
                <Plus size={16} className={`shrink-0 ${isDark ? "text-[#ffa64d]" : "text-[#c06820]"}`} />
                <span className="text-xs font-medium truncate">
                  Use custom entry: <span className={`underline italic ${isDark ? "text-[#ffa64d]" : "text-[#c06820]"}`}>&quot;{query.trim()}&quot;</span>
                </span>
              </button>
            )}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
}
