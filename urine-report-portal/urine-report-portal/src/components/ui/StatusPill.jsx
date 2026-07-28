const STYLES = {
  Normal: "bg-teal-100 text-teal-600",
  Low: "bg-amber-100 text-amber-600",
  High: "bg-brick-100 text-brick-600",
  Abnormal: "bg-brick-100 text-brick-600",
};

const DOT_STYLES = {
  Normal: "bg-teal-600",
  Low: "bg-amber-600",
  High: "bg-brick-600",
  Abnormal: "bg-brick-600",
};

export default function StatusPill({ status, children }) {
  const style = STYLES[status] ?? "bg-mist-200 text-slate-700";
  const dot = DOT_STYLES[status] ?? "bg-slate-600";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {children ?? status}
    </span>
  );
}
