import React from "react";
import { useSelector } from "react-redux";
import { FaBell, FaBars, FaSearch } from "react-icons/fa";

const Header = ({ setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
        >
          <FaBars className="text-sm" />
        </button>
        <div>
          <p className="text-slate-800 font-bold text-sm">Welcome back, {user?.name}</p>
          <p className="text-slate-400 text-xs hidden sm:block">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
          <FaSearch className="text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search destinations..."
            className="bg-transparent text-xs text-slate-600 placeholder-slate-400 outline-none w-40"
          />
        </div>

        <div className="relative">
          <button className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500 hover:bg-blue-100 transition-colors">
            <FaBell className="text-sm" />
          </button>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 border-2 border-white rounded-full" />
        </div>

        <div
          className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold"
          title={user?.name}
        >
          {initials}
        </div>
      </div>
    </header>
  );
};

export default Header;
