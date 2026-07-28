import { CheckCircle2, AlertTriangle, Stethoscope } from "lucide-react";
import Card from "../ui/Card";

export default function OverallAssessmentCard({ overallStatus, overallAssessment, flags }) {
  const isNormal = overallStatus === "Normal";

  return (
    <Card
      className={`border-l-4 ${
        isNormal ? "border-l-teal-600" : "border-l-brick-600"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isNormal ? "bg-teal-100 text-teal-600" : "bg-brick-100 text-brick-600"
          }`}
        >
          {isNormal ? (
            <CheckCircle2 size={20} strokeWidth={2.25} />
          ) : (
            <AlertTriangle size={20} strokeWidth={2.25} />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
            Overall Assessment
          </p>
          <p className="font-display text-lg font-bold text-slate-900">
            {overallAssessment}
          </p>

          {!isNormal && flags.length > 0 && (
            <ul className="mt-2 space-y-1">
              {flags.map((f) => (
                <li
                  key={f}
                  className="text-sm text-slate-600 flex items-center gap-1.5"
                >
                  <span className="h-1 w-1 rounded-full bg-slate-400" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          <div className="flex items-start gap-1.5 mt-4 text-xs text-slate-500 bg-mist-50 rounded-lg px-3 py-2">
            <Stethoscope size={14} className="shrink-0 mt-0.5" />
            <span>
              This is automated decision support based on reference ranges,
              not a diagnosis. A qualified clinician must review and confirm
              all findings before any clinical action is taken.
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
