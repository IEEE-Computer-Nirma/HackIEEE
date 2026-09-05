"use client";

import { useState, useTransition } from "react";
import { submitSponsorshipForm, type ActionResult } from "@/lib/actions";
import { ChevronDown, CheckCircle, Loader2 } from "lucide-react";

type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "email" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  fullWidth?: boolean;
};

const fields: FieldConfig[] = [
  {
    name: "orgName",
    label: "Organization Name",
    placeholder: "e.g. Acme Corp",
    required: true,
  },
  {
    name: "contactPerson",
    label: "Contact Person",
    placeholder: "e.g. Jane Doe",
    required: true,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "e.g. hello@example.com",
    required: true,
  },
  {
    name: "message",
    label: "Additional Information (Optional)",
    type: "textarea",
    placeholder: "Tell us about your sponsorship goals…",
    fullWidth: true,
  },
];

const initialState: ActionResult = { ok: false };

export default function SponsorshipForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      setError(null);
      setFieldErrors(null);
      
      const result = await submitSponsorshipForm({ ok: false }, formData);
      
      if (result.ok) {
        setIsSuccess(true);
      } else {
        if (result.error) setError(result.error);
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="sponsor-success">
        <CheckCircle size={32} strokeWidth={2} />
        <div>
          <p className="sponsor-success__title">Request Received!</p>
          <p className="sponsor-success__subtitle">
            We&apos;ve received your details and will be in touch shortly!
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="sponsor-form">
      {/* Honeypot — hidden from real users, bots will fill it */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px" }}
        className="sponsor-form__full"
      >
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {fields.map((f) => (
        <div
          key={f.name}
          className={`sponsor-form__field ${f.fullWidth ? "sponsor-form__full" : ""}`}
        >
          <label htmlFor={f.name}>
            {f.label}
            {f.required && <span className="sponsor-form__required">*</span>}
          </label>

          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              placeholder={f.placeholder}
              required={f.required}
              rows={4}
              className="sponsor-form__input"
            />
          ) : f.type === "select" ? (
            <div className="sponsor-form__select-wrap">
              <select
                id={f.name}
                name={f.name}
                required={f.required}
                defaultValue=""
                className="sponsor-form__input"
              >
                <option value="" disabled>
                  {f.placeholder || "Select…"}
                </option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="sponsor-form__select-icon"
                size={18}
                strokeWidth={2.5}
              />
            </div>
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type || "text"}
              placeholder={f.placeholder}
              required={f.required}
              className="sponsor-form__input"
            />
          )}

          {fieldErrors?.[f.name] && (
            <span className="sponsor-form__error">
              {fieldErrors[f.name][0]}
            </span>
          )}
        </div>
      ))}

      {error && !fieldErrors && (
        <p className="sponsor-form__form-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="sponsor-form__submit rounded-2xl font-bold text-black text-base px-8 py-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(204,255,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{ backgroundColor: "#ccff00" }}
      >
        <span>
          {pending ? (
            <span className="sponsor-form__loading">
              <Loader2 size={18} className="sponsor-form__spinner" />
              Processing…
            </span>
          ) : (
            "Submit"
          )}
        </span>
      </button>
    </form>
  );
}
