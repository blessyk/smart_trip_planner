import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { name: "Dashboard", path: "/Tourist/touristhome" },
    { name: "My Trips", path: "/Tourist/trips" },
    { name: "Explore", path: "/Tourist/explore" },
    { name: "Bookings", path: "/Tourist/bookings" },
    { name: "Reviews", path: "/Tourist/reviews" },
    { name: "Profile", path: "/Tourist/profile" },
  ];

  return (
    <aside className="w-64 bg-[#0A3D62] text-white flex flex-col">
      <div className="p-5 text-2xl font-bold">
        TripPlanner
      </div>

      <nav className="flex-1 p-4 space-y-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block p-2 rounded transition ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <button className="w-full bg-red-500 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;