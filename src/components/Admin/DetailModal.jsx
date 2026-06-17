import React from "react";
import { FaTimes } from "react-icons/fa";

export default function DetailModal({ isOpen, onClose, title, data }) {
  if (!isOpen || !data) return null;

  // Format keys like "aadharNumber" -> "Aadhar Number"
  const formatKey = (key) => {
    if (key === "aadharNumber") return "Aadhar Number";
    if (key === "createdAt") return "Created At";
    if (key === "updatedAt") return "Last Updated";
    if (key === "_id") return "Database ID";

    // Convert camelCase to Title Case
    const result = key.replace(/([A-Z])/g, " $1");
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  const renderValue = (key, value) => {
    if (value === null || value === undefined) return <span className="text-slate-400">N/A</span>;

    // Handle array of images
    if (key === "images" && Array.isArray(value)) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {value.map((url, i) => (
            <div key={i} className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img
                src={url}
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                onClick={() => window.open(url, "_blank")}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
                }}
              />
            </div>
          ))}
        </div>
      );
    }

    // Handle generic arrays
    if (Array.isArray(value)) {
      return <span className="text-slate-700">{value.join(", ")}</span>;
    }

    // Handle objects (timestamps, metadata)
    if (typeof value === "object") {
      return <pre className="text-slate-700 font-mono text-xs">{JSON.stringify(value, null, 2)}</pre>;
    }

    // Format prices as INR
    if (key === "price" && typeof value === "number") {
      return <span className="font-bold text-[#0A3D62]">₹{value.toLocaleString("en-IN")}</span>;
    }

    // Format booleans
    if (typeof value === "boolean") {
      return (
        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {value ? "Yes" : "No"}
        </span>
      );
    }

    return <span className="text-slate-700 whitespace-pre-wrap">{value.toString()}</span>;
  };

  // Ignored keys for view display
  const isIgnoredKey = (key) => {
    const ignored = ["__v", "password", "passwordConfirm"];
    return ignored.includes(key);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden flex flex-col border border-slate-200 max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">{title || "Details View"}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <FaTimes className="text-base" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {Object.entries(data)
            .filter(([key]) => !isIgnoredKey(key))
            .map(([key, value]) => (
              <div key={key} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{formatKey(key)}</p>
                <div className="text-sm font-medium text-slate-800">{renderValue(key, value)}</div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors text-sm shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
