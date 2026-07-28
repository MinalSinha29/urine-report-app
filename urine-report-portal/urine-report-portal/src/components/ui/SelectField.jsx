import { ChevronDown } from "lucide-react";

export default function SelectField({
  label,
  error,
  required,
  options,
  className = "",
  ...selectProps
}) {
  return (
    <div className={className}>
      <label className="block mb-1.5">
        <span className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-brick-600 ml-0.5">*</span>}
        </span>
      </label>

      <div className="relative">
        <select
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-colors
            ${
              error
                ? "border-brick-600 focus:border-brick-600"
                : "border-mist-300 focus:border-ink-600"
            }
            focus:outline-none focus:ring-2 focus:ring-ink-600/15`}
          {...selectProps}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-brick-600 mt-1.5">{error}</p>
      )}
    </div>
  );
}
