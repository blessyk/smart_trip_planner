import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ─── Custom Tooltip ─────────────────────────────────────── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg text-xs font-['Plus_Jakarta_Sans',sans-serif]">
      <p className="font-700 text-[#0A2540] mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: <span className="font-bold">{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

/* ─── Custom Bar Shape with rounded top ─────────────────── */
function RoundedBar(props) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0) return null;
  const r = Math.min(6, width / 2);
  return (
    <path
      d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
      fill={fill}
    />
  );
}

/* ─── Main Component ─────────────────────────────────────── */
export default function UserVisitsChart({ data = [] }) {
  const [filter, setFilter] = useState("week");
  const [activeBar, setActiveBar] = useState(null);

  const filteredData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      /* Fallback sample data */
      const samples = {
        week: [
          { date: "Mon", visits: 320, returning: 210 },
          { date: "Tue", visits: 480, returning: 300 },
          { date: "Wed", visits: 400, returning: 260 },
          { date: "Thu", visits: 540, returning: 370 },
          { date: "Fri", visits: 460, returning: 340 },
          { date: "Sat", visits: 270, returning: 190 },
          { date: "Sun", visits: 210, returning: 150 },
        ],
        month: Array.from({ length: 30 }, (_, i) => ({
          date: `${i + 1}`,
          visits: Math.floor(150 + Math.random() * 400),
          returning: Math.floor(80 + Math.random() * 200),
        })),
        all: Array.from({ length: 12 }, (_, i) => ({
          date: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
          visits: Math.floor(3000 + Math.random() * 8000),
          returning: Math.floor(1500 + Math.random() * 4000),
        })),
      };
      return samples[filter] || samples.week;
    }

    const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (filter === "week")  return sorted.slice(-7);
    if (filter === "month") return sorted.slice(-30);
    return sorted;
  }, [data, filter]);

  /* Summary stats */
  const totalVisits    = filteredData.reduce((s, d) => s + (d.visits || 0), 0);
  const totalReturning = filteredData.reduce((s, d) => s + (d.returning || 0), 0);
  const avgVisits      = filteredData.length ? Math.round(totalVisits / filteredData.length) : 0;
  const peak           = filteredData.reduce((m, d) => (d.visits > (m.visits || 0) ? d : m), {});

  const tabs = ["week", "month", "all"];

  return (
    <div className="w-full font-sans">

      {/* ── Header row ── */}
      <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full bg-[#00C896]"
              style={{ animation: "uvc-pulse 2s infinite" }}
            />
            <span className="text-sm font-bold text-[#0A2540]">User Visits</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">Visitor analytics overview</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all duration-200
                ${filter === t
                  ? "bg-white text-[#0A2540] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
                }`}
            >
              {t === "all" ? "All Time" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Summary chips ── */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total Visits",    value: totalVisits.toLocaleString(),    color: "bg-[#ecfdf5] text-[#059669]" },
          { label: "Returning",       value: totalReturning.toLocaleString(), color: "bg-[#f0f9ff] text-[#0ea5c9]" },
          { label: "Daily Avg",       value: avgVisits.toLocaleString(),      color: "bg-[#f5f3ff] text-[#7c3aed]" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl px-3 py-2.5 ${s.color}`}>
            <p className="text-[10px] font-600 opacity-70 uppercase tracking-wide">{s.label}</p>
            <p className="text-base font-extrabold mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Bar Chart ── */}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={filteredData}
          barGap={3}
          barSize={filter === "month" ? 6 : 14}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          onMouseLeave={() => setActiveBar(null)}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f0f4f8"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "#8899aa", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#8899aa" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(240,244,248,0.6)", radius: 8 }}
          />

          {/* Returning visitors bar */}
          <Bar
            dataKey="returning"
            name="Returning"
            shape={<RoundedBar />}
            isAnimationActive={true}
            animationDuration={700}
            animationEasing="ease-out"
          >
            {filteredData.map((entry, i) => (
              <Cell
                key={i}
                fill={activeBar === i ? "#b3e8d8" : "#d1f5eb"}
                onMouseEnter={() => setActiveBar(i)}
              />
            ))}
          </Bar>

          {/* New visitors bar */}
          <Bar
            dataKey="visits"
            name="New Visitors"
            shape={<RoundedBar />}
            isAnimationActive={true}
            animationDuration={900}
            animationBegin={100}
            animationEasing="ease-out"
          >
            {filteredData.map((entry, i) => (
              <Cell
                key={i}
                fill={activeBar === i ? "#00b584" : "#00C896"}
                onMouseEnter={() => setActiveBar(i)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* ── Legend + Peak ── */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#00C896]" />
            <span className="text-[11px] text-gray-400 font-medium">New Visitors</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-[#d1f5eb]" />
            <span className="text-[11px] text-gray-400 font-medium">Returning</span>
          </div>
        </div>
        {peak.date && (
          <div className="text-[11px] text-gray-400">
            Peak: <span className="font-bold text-[#0A2540]">{peak.date}</span>
            <span className="ml-1 text-[#00C896] font-bold">
              {peak.visits?.toLocaleString()} visits
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes uvc-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
