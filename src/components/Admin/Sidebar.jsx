import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Admin Home", path: "/Admin/adminhome" },
    { name: "View Users", path: "/Admin/users" },
    { name: "View Destinations", path: "/Admin/destinations" },
    { name: "View Testimonials", path: "/Admin/testimonials" },
    { name: "View Contact Messages", path: "/Admin/contact" },
    { name: "Change Password", path: "/Admin/change-password" },
  ];

  return (
    <aside className="w-64 bg-[#0A3D62] text-white h-screen p-6 flex flex-col space-y-4">
      <h2 className="text-xl font-bold mb-6">Admin Menu</h2>

      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `block px-4 py-2 rounded-lg transition text-left
            ${isActive ? "bg-blue-800 font-semibold" : "hover:bg-blue-700"}`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
}