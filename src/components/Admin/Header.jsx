import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

export default function Header() {
  const dispatch = useDispatch();
  
  return (
    <header className="w-full bg-[#0A3D62] text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/logo.png"
            alt="Admin Logo"
            className="h-8 w-8 object-contain flex-shrink-0"
          />
          <span className="font-semibold text-lg truncate">Admin Panel</span>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="flex-shrink-0 ml-6 bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm whitespace-nowrap"
        >
          Logout
        </button>
      </div>
    </header>
  );
}