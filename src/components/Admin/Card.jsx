// Card.jsx
import React from "react";

export default function Card({ title, value, icon }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex items-center space-x-4">
      {/* Optional Icon */}
      {icon && <div className="text-3xl">{icon}</div>}

      <div>
        <p className="text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}