import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        aria-label="Dismiss"
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/50"
      />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brick-100 text-brick-600 mb-4">
          <AlertTriangle size={20} strokeWidth={2.25} />
        </div>
        <h2 className="font-display font-bold text-slate-900 mb-1.5">
          {title}
        </h2>
        <p className="text-sm text-slate-600 mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
