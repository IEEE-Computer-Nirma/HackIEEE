"use client";

import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly (string | SelectOption)[];
  placeholder?: string;
  icon?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  isDark?: boolean;
  id?: string;
  name?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  "aria-label"?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  icon,
  error,
  disabled = false,
  isDark: propIsDark,
  id,
  name,
  className = "",
  triggerClassName = "",
  dropdownClassName = "",
  "aria-label": ariaLabel,
}: CustomSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [openUpward, setOpenUpward] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  // Auto-detect system preference if propIsDark is omitted or for real-time fallback
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mql.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const isDark = propIsDark !== undefined ? propIsDark : systemDark;

  const containerRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Determine whether to open upward or downward based on viewport clearance
  const updateDropdownPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 240px below and more space above, open upward
      if (spaceBelow < 240 && spaceAbove > spaceBelow) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }
    }
  }, []);

  const handleOpen = () => {
    if (disabled) return;
    updateDropdownPosition();
    setIsOpen((prev) => !prev);
    // Highlight the currently selected option or the first one
    const idx = normalizedOptions.findIndex((opt) => opt.value === value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listboxRef.current && highlightedIndex >= 0) {
      const highlightedEl = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < normalizedOptions.length - 1 ? prev + 1 : 0));
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : normalizedOptions.length - 1));
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < normalizedOptions.length) {
          onChange(normalizedOptions[highlightedIndex].value);
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;
      }
      case "Escape": {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      }
      case "Tab": {
        setIsOpen(false);
        break;
      }
    }
  };

  const handleSelectOption = (optVal: string) => {
    onChange(optVal);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Color tokens matching the Dune / Arrakis design system across dark & light modes
  const triggerThemeClass = isDark
    ? "bg-[#18110b] border-[rgba(248,207,150,0.2)] text-[#f3e6cf] hover:border-[rgba(248,207,150,0.35)] focus:border-[#ffa64d] focus:ring-1 focus:ring-[#ffa64d]/30"
    : "bg-[#f5f0e8] border-[#e5dcce] text-[#2b2318] hover:border-[#c67634]/60 focus:border-[#c06820] focus:ring-1 focus:ring-[#c06820]/30";

  const triggerOpenClass = isOpen
    ? isDark
      ? "border-[#ffa64d] ring-1 ring-[#ffa64d]/30 shadow-[0_4px_20px_rgba(226,130,47,0.15)]"
      : "border-[#c06820] ring-1 ring-[#c06820]/30 shadow-[0_4px_20px_rgba(192,104,32,0.12)]"
    : "";

  const menuThemeClass = isDark
    ? "bg-[#18110b]/98 border-[rgba(248,207,150,0.22)] shadow-[0_16px_50px_rgba(0,0,0,0.85)] text-[#f3e6cf]"
    : "bg-[#fefbf6]/98 border-[#ecd8c5] shadow-[0_16px_50px_rgba(140,80,30,0.14)] text-[#2b2318]";

  const iconColor = isDark ? "text-[#f3e6cf]/40" : "text-[#8a8073]";
  const chevronColor = isOpen
    ? isDark
      ? "text-[#ffa64d]"
      : "text-[#c06820]"
    : isDark
      ? "text-[#f3e6cf]/40 group-hover:text-[#ffa64d]"
      : "text-[#8a8073] group-hover:text-[#c06820]";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden input for form serialization */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Main Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={selectId}
        disabled={disabled}
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || placeholder}
        className={`group relative w-full py-3 rounded-xl text-sm transition-all duration-200 outline-none flex items-center justify-between cursor-pointer border text-left ${
          icon ? "pl-10 pr-3.5" : "px-3.5"
        } ${triggerThemeClass} ${triggerOpenClass} ${
          error ? "border-red-500/80 focus:border-red-500 ring-1 ring-red-500/30" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${triggerClassName}`}
      >
        {/* Leading Icon (if provided) */}
        {icon && (
          <div
            className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors ${iconColor}`}
          >
            {icon}
          </div>
        )}

        {/* Selected Label or Placeholder */}
        <div className="flex-1 min-w-0 pr-2 truncate">
          {selectedOption ? (
            <span
              className={`font-medium truncate block ${
                isDark ? "text-[#f3e6cf]" : "text-[#2b2318]"
              }`}
            >
              {selectedOption.label}
            </span>
          ) : (
            <span
              className={`truncate block ${
                isDark ? "text-[#f3e6cf]/35" : "text-[#9a9184]"
              }`}
            >
              {placeholder}
            </span>
          )}
        </div>

        {/* Animated Chevron Indicator */}
        <div className="shrink-0 flex items-center pointer-events-none">
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            } ${chevronColor}`}
          />
        </div>
      </button>

      {/* Custom Dropdown Menu Popup */}
      {isOpen && (
        <div
          ref={listboxRef}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={selectId}
          className={`absolute z-50 left-0 right-0 max-h-60 overflow-y-auto rounded-xl p-1.5 border backdrop-blur-xl transition-all duration-150 ease-out focus:outline-none ${
            openUpward ? "bottom-full mb-2" : "top-full mt-2"
          } ${menuThemeClass} ${dropdownClassName}`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: isDark
              ? "rgba(248, 207, 150, 0.25) transparent"
              : "rgba(192, 104, 32, 0.2) transparent",
          }}
        >
          {normalizedOptions.length > 0 ? (
            normalizedOptions.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = highlightedIndex === idx;

              return (
                <button
                  key={`${opt.value}-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectOption(opt.value)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-lg flex items-center justify-between gap-3 text-sm transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-[#e2822f]/20 text-[#ffa64d] font-semibold shadow-sm"
                        : "bg-[#faefe3] text-[#c06820] font-semibold shadow-sm"
                      : isHighlighted
                        ? isDark
                          ? "bg-white/[0.08] text-white"
                          : "bg-[#f5f0e8] text-[#2b2318]"
                        : isDark
                          ? "text-[#f3e6cf]/85 hover:bg-white/5"
                          : "text-[#3d3224] hover:bg-[#f5f0e8]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {opt.icon && (
                      <span
                        className={`shrink-0 ${
                          isSelected
                            ? isDark
                              ? "text-[#ffa64d]"
                              : "text-[#c06820]"
                            : isDark
                              ? "text-[#f3e6cf]/40"
                              : "text-[#8a8073]"
                        }`}
                      >
                        {opt.icon}
                      </span>
                    )}
                    <div className="truncate">
                      <span className="truncate block">{opt.label}</span>
                      {opt.sublabel && (
                        <span
                          className={`text-xs block mt-0.5 truncate ${
                            isDark ? "text-[#f3e6cf]/50" : "text-[#7f7669]"
                          }`}
                        >
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <Check
                      size={15}
                      strokeWidth={2.5}
                      className={`shrink-0 ${
                        isDark ? "text-[#ffa64d]" : "text-[#c06820]"
                      }`}
                    />
                  )}
                </button>
              );
            })
          ) : (
            <div
              className={`px-3 py-3 text-center text-xs ${
                isDark ? "text-[#f3e6cf]/50" : "text-[#7f7669]"
              }`}
            >
              No options available
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
