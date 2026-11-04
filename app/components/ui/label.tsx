"use client";

import React from "react";
import { cn } from "../../lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ className, required, children, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "block font-mono text-xs font-medium tracking-wide uppercase text-[#e0d3c5]/80 mb-1.5 select-none",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-[#e2822f] ml-1">*</span>}
    </label>
  );
}
