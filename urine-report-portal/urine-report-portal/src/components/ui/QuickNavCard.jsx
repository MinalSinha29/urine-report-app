import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Card from "./Card";

export default function QuickNavCard({ to, title, description, icon: Icon }) {
  return (
    <Link
      to={to}
      title={description}
      aria-label={`${title}: ${description}`}
    >
      <Card
        className="group h-full transition-all duration-150 hover:border-ink-600 hover:shadow-[0_1px_2px_rgba(15,61,92,0.04),0_12px_28px_-14px_rgba(15,61,92,0.28)]"
        padding="p-5"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-50 text-ink-900">
            <Icon size={19} strokeWidth={2.1} />
          </div>

          <ArrowRight
            size={16}
            className="text-slate-300 group-hover:text-ink-600 group-hover:translate-x-0.5 transition-all"
          />
        </div>

        <p className="font-display font-bold text-slate-900 mt-4">
          {title}
        </p>

        <p className="text-sm text-slate-600 mt-1">
          {description}
        </p>
      </Card>
    </Link>
  );
}