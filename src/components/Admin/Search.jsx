import React from "react";

export default function Search({ searchTerm, setSearchTerm, placeholder = "Search..." }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
      />
    </div>
  );
}