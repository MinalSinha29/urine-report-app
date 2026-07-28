import { Menu, Search, Bell } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-mist-200 bg-white/90 backdrop-blur px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-slate-600 hover:text-ink-900"
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      <div className="hidden sm:flex flex-1 max-w-sm items-center gap-2 rounded-xl bg-mist-100 px-3 py-2 text-slate-500">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search patients, report ID..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="flex-1 sm:hidden" />

      <div className="flex items-center gap-4">
        <button
          className="relative text-slate-600 hover:text-ink-900"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-brick-600" />
        </button>

        <div className="flex items-center gap-2.5 pl-4 border-l border-mist-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-900 font-display text-sm font-bold">
            NM
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-slate-900">
              Dr. Ninad Mehendale
            </p>
            <p className="text-xs text-slate-500">Electronics Dept.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
