import Card from "./Card";

export default function StatCard({ label, value, icon: Icon, tone = "ink" }) {
  const TONES = {
    ink: "bg-ink-900 text-white",
    amber: "bg-amber-100 text-amber-600",
    teal: "bg-teal-100 text-teal-600",
    brick: "bg-brick-100 text-brick-600",
  };

  return (
    <Card className="flex items-center gap-4" padding="p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${TONES[tone]}`}
      >
        <Icon size={20} strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
          {label}
        </p>
        <p className="font-data text-2xl font-semibold text-slate-900 mt-0.5">
          {value}
        </p>
      </div>
    </Card>
  );
}
