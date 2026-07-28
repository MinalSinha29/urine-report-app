export default function PageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-extrabold text-slate-900">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
