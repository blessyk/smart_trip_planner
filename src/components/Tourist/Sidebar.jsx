import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  FaThLarge, FaSearch, FaCalendarAlt,
  FaStar, FaUser, FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  { name: "Dashboard",          path: "/Tourist/touristhome",      icon: <FaThLarge /> },
  { name: "Destination Search", path: "/Tourist/DestinationSearch", icon: <FaSearch /> },
  { name: "Trip Planner",       path: "/Tourist/TripPlanner",       icon: <FaCalendarAlt /> },
  { name: "Reviews",            path: "/Tourist/reviews",           icon: <FaStar /> },
  { name: "Profile",            path: "/Tourist/profile",           icon: <FaUser /> },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-56 bg-white border-r border-slate-200
          flex flex-col transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div>
            <p className="text-slate-800 font-bold text-sm leading-tight">TripPlanner</p>
            <p className="text-slate-400 text-xs">Tourist Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold px-3 pb-2">
            Menu
          </p>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 border border-blue-200 font-semibold"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-slate-200 pt-3">
          <button
            onClick={() => dispatch(logout())}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm hover:bg-red-100 transition-colors"
          >
            <FaSignOutAlt className="text-sm" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
