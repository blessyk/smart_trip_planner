import React from "react";

const accentMap = {
  indigo: {
    border: "border-indigo-200",
    orb1: "bg-indigo-50",
    orb2: "bg-indigo-100",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-500",
    label: "text-indigo-500",
    value: "text-indigo-950",
    trend: "text-indigo-400",
  },
  teal: {
    border: "border-teal-200",
    orb1: "bg-teal-50",
    orb2: "bg-teal-100",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    label: "text-teal-600",
    value: "text-teal-950",
    trend: "text-teal-400",
  },
  amber: {
    border: "border-amber-200",
    orb1: "bg-amber-50",
    orb2: "bg-amber-100",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    label: "text-amber-600",
    value: "text-amber-950",
    trend: "text-amber-400",
  },
  pink: {
    border: "border-pink-200",
    orb1: "bg-pink-50",
    orb2: "bg-pink-100",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
    label: "text-pink-600",
    value: "text-pink-950",
    trend: "text-pink-400",
  },
};

export default function Card({ title, value, icon, accent = "indigo", trend }) {
  const c = accentMap[accent] || accentMap.indigo;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${c.border} bg-white p-5 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md`}
    >
      <span className={`absolute -top-5 -right-5 w-20 h-20 rounded-full ${c.orb1} animate-pulse`} aria-hidden="true" />
      <span className={`absolute -bottom-4 -left-4 w-14 h-14 rounded-full ${c.orb2} animate-pulse`} style={{ animationDelay: "0.5s" }} aria-hidden="true" />

      <div className="relative flex justify-between items-start">
        <div>
          <p className={`text-[10.5px] font-semibold uppercase tracking-widest mb-2 ${c.label}`}>{title}</p>
          <p className={`text-3xl font-bold ${c.value}`}>{value}</p>
          {trend && <p className={`text-xs mt-1 ${c.trend}`}>{trend}</p>}
        </div>
        <div
          className={`w-10 h-10 rounded-xl ${c.iconBg} flex items-center justify-center text-xl ${c.iconColor} flex-shrink-0`}
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          {icon}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}
