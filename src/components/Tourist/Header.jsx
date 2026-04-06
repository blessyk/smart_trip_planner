import React from "react";

const Header = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Welcome, Traveler 👋</h1>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;