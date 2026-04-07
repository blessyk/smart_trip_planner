import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();

  const menuItems = [
    { name: "Dashboard", path: "/Tourist/touristhome" },
    { name: "Destination Search", path: "/Tourist/DestinationSearch" },
    { name: "Trip Planner", path: "/Tourist/TripPlanner" },
    { name: "Reviews", path: "/Tourist/reviews" },
    { name: "Profile", path: "/Tourist/profile" }
  ] 
  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-[#0A3D62] text-white flex flex-col transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="p-5 text-2xl font-bold">TripPlanner</div>

        <nav className="flex-1 p-4 space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)} // close on mobile click
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
          <button
            onClick={() => dispatch(logout())}
            className="w-full bg-red-500 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;