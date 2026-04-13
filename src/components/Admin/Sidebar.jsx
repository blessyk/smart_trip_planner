import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaUsers, FaMapMarkedAlt, FaStar, FaEnvelope, FaKey } from "react-icons/fa";

const menuItems = [
  { name: "Admin Home",            path: "/Admin/adminhome",       icon: <FaHome /> },
  { name: "View Users",            path: "/Admin/users",           icon: <FaUsers /> },
  { name: "View Destinations",     path: "/Admin/destinations",    icon: <FaMapMarkedAlt /> },
  { name: "View Testimonials",     path: "/Admin/testimonials",    icon: <FaStar /> },
  { name: "View Contact Messages", path: "/Admin/contact",         icon: <FaEnvelope /> },
  { name: "Change Password",       path: "/Admin/change-password", icon: <FaKey /> },
];

export default function Sidebar() {
  return (
    <aside className="w-56 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">
          ✈
        </div>
        <div>
          <p className="text-slate-800 text-sm font-semibold leading-tight">TripPlanner</p>
          <p className="text-slate-400 text-xs">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-slate-400 text-[10px] uppercase tracking-widest font-semibold px-3 pb-2">Main</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 border border-indigo-200 font-medium"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
