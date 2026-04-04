import React from "react";

export default function Sidebar({ active, onNavigate }) {
  const menuItems = [
    { name: "View Users", key: "view-users" },
    { name: "View Destinations", key: "view-destinations" },
    { name: "View Testimonials", key: "view-testimonials" },
    { name: "Change Password", key: "change-password" },
  ];

  return (
    <aside className="w-64 bg-[#0A3D62] text-white h-screen p-6 flex flex-col space-y-4">
      <h2 className="text-xl font-bold mb-6">Admin Menu</h2>

      {menuItems.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          className={`text-left px-4 py-2 rounded-lg hover:bg-blue-700 transition
            ${active === item.key ? "bg-blue-800 font-semibold" : ""}`}
        >
          {item.name}
        </button>
      ))}
    </aside>
  );
}