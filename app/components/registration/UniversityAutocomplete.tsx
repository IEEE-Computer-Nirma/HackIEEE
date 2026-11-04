"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { School, Check, Plus, Loader2, Search } from "lucide-react";
import { University } from "@/app/data/universities";

interface UniversityAutocompleteProps {
  value: string;
  onChange: (value: string, university?: University) => void;
  error?: string;
  id?: string;
}

export default function UniversityAutocomplete({
  value,
  onChange,
  error,
  id = "university-autocomplete",
}: UniversityAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<University[]>([]);
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

  // Fetch suggestions with caching
  const cacheRef = useRef<Record<string, University[]>>({});

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setQuery(newVal);
    onChange(newVal);
    setIsOpen(true);
    setSelectedIndex(-1);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchUniversities(newVal);
    }, 200);
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
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-sand/60">
          <School size={18} strokeWidth={1.8} />
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
          className={`w-full pl-11 pr-10 py-3 rounded-xl bg-[#140f0b]/80 border text-ink placeholder:text-sand/30 text-[0.95rem] transition-all duration-200 outline-none ${
            error
              ? "border-ember focus:border-ember focus:ring-1 focus:ring-ember/40"
              : "border-[rgba(241,214,172,0.18)] focus:border-spice focus:ring-1 focus:ring-spice/40 focus:bg-[#1a130d]"
          }`}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls="university-suggestions-list"
          role="combobox"
        />
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-sand/40">
          {loading ? (
            <Loader2 size={16} className="animate-spin text-spice" />
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
          className="absolute z-50 left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-xl border border-line-strong bg-[#16100b]/98 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] py-1.5 focus:outline-none"
        >
          {suggestions.length > 0 ? (
            suggestions.map((univ, idx) => {
              const isSelected = selectedIndex === idx;
              const isCurrent = value.toLowerCase().trim() === univ.name.toLowerCase().trim();
              return (
                <button
                  key={univ.id}
                  type="button"
                  onClick={() => handleSelect(univ)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                    isSelected ? "bg-spice/15 text-sand" : "text-ink hover:bg-surface"
                  }`}
                >
                  <School size={16} className={`mt-0.5 shrink-0 ${isSelected ? "text-spice" : "text-sand/50"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.92rem] font-medium leading-snug truncate">{univ.name}</p>
                    {(univ.city || univ.state) && (
                      <p className="text-[0.78rem] text-sand/60 leading-tight">
                        {[univ.city, univ.state, univ.country].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                  {isCurrent && <Check size={16} className="text-spice shrink-0 mt-0.5" />}
                </button>
              );
            })
          ) : (
            !loading && query.trim().length > 0 && (
              <div className="px-4 py-3 text-center text-sand/60 text-sm">
                No matching university found in recommendations.
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
                className={`w-full text-left px-4 py-3 border-t border-line flex items-center gap-2.5 transition-colors ${
                  selectedIndex === suggestions.length
                    ? "bg-spice/20 text-spice-hot"
                    : "text-spice hover:bg-spice/10"
                }`}
              >
                <Plus size={16} className="shrink-0" />
                <span className="text-[0.88rem] font-medium truncate">
                  Use custom entry: <span className="underline italic">&quot;{query.trim()}&quot;</span>
                </span>
              </button>
            )}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-ember font-medium">{error}</p>}
    </div>
  );
}
