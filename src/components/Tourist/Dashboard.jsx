import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  FaCalendarAlt, FaMapMarkerAlt, FaStar,
  FaHotel, FaBus, FaUmbrellaBeach,
} from "react-icons/fa";

const StatCard = ({ title, value, sub, icon, border, iconBg, iconColor, valueColor, subColor, orbBg }) => (
  <div className={`bg-white border ${border} rounded-2xl p-5 relative overflow-hidden hover:-translate-y-1 transition-transform duration-200`}>
    <span className={`absolute -top-4 -right-4 w-16 h-16 rounded-full ${orbBg} animate-pulse`} />
    <div className="relative flex justify-between items-start">
      <div>
        <p className={`text-[10.5px] font-semibold uppercase tracking-widest mb-2 ${iconColor}`}>{title}</p>
        <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
        <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-xl ${iconColor} flex-shrink-0`}
        style={{ animation: "float 3s ease-in-out infinite" }}>
        {icon}
      </div>
    </div>
    <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}`}</style>
  </div>
);

const destinations = [
  {
    name: "Maldives", type: "Tropical paradise", tag: "Beach",
    tagStyle: "text-teal-700 bg-teal-50 border-teal-200",
    bg: "bg-gradient-to-br from-sky-400 to-sky-600",
    icon: <FaUmbrellaBeach className="text-sky-100 text-3xl" />,
  },
  {
    name: "Manali", type: "Snowy mountains", tag: "Mountains",
    tagStyle: "text-indigo-700 bg-indigo-50 border-indigo-200",
    bg: "bg-gradient-to-br from-indigo-400 to-indigo-600",
    icon: <FaMapMarkerAlt className="text-indigo-100 text-3xl" />,
  },
  {
    name: "Dubai", type: "Luxury city life", tag: "City",
    tagStyle: "text-amber-700 bg-amber-50 border-amber-200",
    bg: "bg-gradient-to-br from-amber-400 to-amber-600",
    icon: <FaStar className="text-amber-100 text-3xl" />,
  },
];

const activities = [
  { label: "Booked hotel in Goa",    time: "2 days ago",  dotBg: "bg-blue-500",   iconBg: "bg-blue-100",  icon: <FaHotel className="text-blue-600 text-xs" /> },
  { label: "Reviewed Manali trip",   time: "5 days ago",  dotBg: "bg-amber-400",  iconBg: "bg-amber-100", icon: <FaStar className="text-amber-500 text-xs" /> },
  { label: "Added trip to Kerala",   time: "1 week ago",  dotBg: "bg-teal-500",   iconBg: "bg-teal-100",  icon: <FaMapMarkerAlt className="text-teal-600 text-xs" /> },
];

const budgetItems = [
  { label: "Hotels",    amount: "₹18,000", pct: "40%", color: "bg-blue-500" },
  { label: "Transport", amount: "₹9,000",  pct: "20%", color: "bg-teal-500" },
  { label: "Activities",amount: "₹12,000", pct: "27%", color: "bg-amber-400" },
];

const Dashboard = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  if (!isLoggedIn) return <Navigate to="/" />;

  return (
    <main className="p-5 bg-slate-50 min-h-screen overflow-y-auto">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <StatCard title="Trips Planned"   value={12} sub="↑ 3 this month"       icon={<FaCalendarAlt />}  border="border-blue-200"   iconBg="bg-blue-100"   iconColor="text-blue-600"   valueColor="text-blue-950"   subColor="text-blue-300"   orbBg="bg-blue-50" />
        <StatCard title="Upcoming Trips"  value={3}  sub="Next: Goa in 12 days" icon={<FaMapMarkerAlt />} border="border-teal-200"   iconBg="bg-teal-100"   iconColor="text-teal-600"   valueColor="text-teal-950"   subColor="text-teal-300"   orbBg="bg-teal-50" />
        <StatCard title="Places Visited"  value={25} sub="★ 4.6 avg rating"     icon={<FaStar />}         border="border-amber-200"  iconBg="bg-amber-100"  iconColor="text-amber-500"  valueColor="text-amber-950"  subColor="text-amber-300"  orbBg="bg-amber-50" />
      </div>

      {/* Upcoming Trip Banner */}
      <div className="bg-white border border-blue-200 rounded-2xl px-5 py-4 mb-5 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FaMapMarkerAlt className="text-blue-600 text-lg" />
          </div>
          <div>
            <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-widest mb-1">Upcoming Trip</p>
            <p className="text-slate-800 font-bold text-base">Goa Beach Vacation</p>
            <p className="text-slate-500 text-xs">15 May — 20 May &nbsp;·&nbsp; 5 nights</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">Countdown</p>
            <p className="text-xl font-bold text-blue-600">32 days</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Destinations — spans 2 cols */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-slate-800 font-bold text-sm">Recommended Destinations</p>
              <p className="text-slate-400 text-xs">Picked for you</p>
            </div>
            <button className="bg-blue-50 border border-blue-200 text-blue-600 text-xs rounded-lg px-3 py-1 hover:bg-blue-100 transition-colors">
              View all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {destinations.map((d) => (
              <div key={d.name} className="border border-slate-200 rounded-xl overflow-hidden hover:-translate-y-1 transition-transform duration-200">
                <div className={`w-full h-24 ${d.bg} flex items-center justify-center`}>{d.icon}</div>
                <div className="p-3">
                  <p className="font-bold text-slate-800 text-sm">{d.name}</p>
                  <p className="text-slate-500 text-xs mb-2">{d.type}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] border rounded-md px-2 py-0.5 font-medium ${d.tagStyle}`}>{d.tag}</span>
                    <button className="bg-blue-50 border border-blue-200 text-blue-600 text-[11px] rounded-lg px-2.5 py-1 hover:bg-blue-100 transition-colors">
                      Explore
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">

          {/* Activity */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-slate-800 font-bold text-sm mb-1">Recent Activity</p>
            <p className="text-slate-400 text-xs mb-3">Latest actions</p>
            <div className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full ${a.iconBg} flex items-center justify-center flex-shrink-0`}>
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 text-xs truncate">{a.label}</p>
                    <p className="text-slate-400 text-[10px]">{a.time}</p>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${a.dotBg} flex-shrink-0`} />
                </div>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-slate-800 font-bold text-sm mb-1">Goa Trip Budget</p>
            <p className="text-slate-400 text-xs mb-3">₹45,000 total</p>
            <div className="space-y-2.5">
              {budgetItems.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{b.label}</span>
                    <span className="text-slate-800 font-medium">{b.amount}</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-1.5">
                    <div className={`${b.color} h-1.5 rounded-full`} style={{ width: b.pct }} />
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Spent so far</span>
                <span className="text-blue-600 font-semibold">₹39,000 / ₹45,000</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default Dashboard;
