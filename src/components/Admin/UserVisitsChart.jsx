import React, { useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

export default function UserVisitsChart({ data = [] }) {
    const [filter, setFilter] = useState("week");

    const filteredData = useMemo(() => {
        if (!Array.isArray(data) || data.length === 0) return [];

        const sorted = [...data].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );

        if (filter === "week") {
            return sorted.slice(-7);
        }

        if (filter === "month") {
            return sorted.slice(-30);
        }

        return sorted;
    }, [data, filter]);
    console.log("filterdata", filteredData)
    return (
        <div>
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setFilter("week")}
                    className={`px-3 py-1 rounded ${filter === "week" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    Week
                </button>

                <button
                    onClick={() => setFilter("month")}
                    className={`px-3 py-1 rounded ${filter === "month" ? "bg-blue-600 text-white" : "bg-gray-200"
                        }`}
                >
                    Month
                </button>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={filteredData}>
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    
                    <Line
                        type="monotone"
                        dataKey="visits"
                        stroke="#0A3D62"
                        strokeWidth={3}
                        isAnimationActive={true}
                        animationDuration={800}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}