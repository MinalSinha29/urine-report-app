const VARIANTS = {
  primary:
    "bg-ink-900 text-white hover:bg-ink-800 focus-visible:outline-white shadow-sm",
  secondary:
    "bg-white text-ink-900 border border-mist-300 hover:bg-mist-100",
  ghost:
    "bg-transparent text-slate-700 hover:bg-mist-100",
  danger:
    "bg-brick-600 text-white hover:opacity-90",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={16} strokeWidth={2.25} />}
      {children}
    </button>
  );
}
