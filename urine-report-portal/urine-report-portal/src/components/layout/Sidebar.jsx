import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  History,
  FlaskConical,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Urine Report Dashboard",
    title: "View the urine report analysis dashboard",
    icon: LayoutDashboard,
    end: true,
  },
  {
    to: "/new-patient",
    label: "Register New Patient",
    title: "Register a new patient and enter urine test details",
    icon: UserPlus,
  },
  {
    to: "/history",
    label: "Patient Report History",
    title: "View previous patient urine reports and history",
    icon: History,
  },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-ink-950 text-white flex flex-col
          transition-transform duration-200 ease-out
          lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-600">
              <FlaskConical size={17} strokeWidth={2.25} />
            </div>

            <div className="leading-tight">
              <p className="font-display text-sm font-bold tracking-tight">
                UroScan
              </p>

              <p className="text-[10px] text-white/50 uppercase tracking-wider">
                Diagnostics Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav
          className="flex-1 px-3 py-5 space-y-1"
          aria-label="Urine report navigation"
        >
          {NAV_ITEMS.map(({ to, label, title, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              title={title}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-white text-ink-900 shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} strokeWidth={2.1} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-white/10 space-y-1">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Open application settings"
          >
            <Settings size={18} strokeWidth={2.1} />
            Settings
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Log out of the UroScan diagnostics portal"
          >
            <LogOut size={18} strokeWidth={2.1} />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}