export default function InputField({
  label,
  hint,
  error,
  unit,
  required,
  className = "",
  ...inputProps
}) {
  return (
    <div className={className}>
      <label className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="text-brick-600 ml-0.5">*</span>}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </label>

      <div className="relative">
        <input
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors
            ${
              error
                ? "border-brick-600 focus:border-brick-600"
                : "border-mist-300 focus:border-ink-600"
            }
            focus:outline-none focus:ring-2 focus:ring-ink-600/15
            ${unit ? "pr-14" : ""}`}
          {...inputProps}
        />
        {unit && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-data">
            {unit}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs font-medium text-brick-600 mt-1.5">{error}</p>
      )}
    </div>
  );
}
