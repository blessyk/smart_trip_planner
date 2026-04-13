import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Card from "./Card";
import { FaUser, FaGlobe, FaStar, FaEnvelope } from "react-icons/fa";
import UserVisitsChart from "./UserVisitsChart";

export default function AdminHome() {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  if (!isLoggedIn) return <Navigate to="/" />;

  const [metrics, setMetrics] = useState({ users: 0, destinations: 0, testimonials: 0, contacts: 0 });
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/API/users.json").then((r) => r.json()),
      fetch("/API/destinations.json").then((r) => r.json()),
      fetch("/API/testimonials.json").then((r) => r.json()),
      fetch("/API/contacts.json").then((r) => r.json()),
      fetch("/API/visits.json").then((r) => r.json()),
    ])
      .then(([users, destinations, testimonials, contacts, visits]) => {
        setMetrics({
          users: users.length,
          destinations: destinations.length,
          testimonials: testimonials.length,
          contacts: contacts.length,
        });
        setVisits(visits);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
      <p className="mb-7 text-slate-400 text-sm">
        Welcome back, <span className="text-indigo-500 font-medium">{user?.name}</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card title="Total Users"   value={metrics.users}        icon={<FaUser />}     accent="indigo" trend="↑ 12% this month" />
        <Card title="Destinations"  value={metrics.destinations} icon={<FaGlobe />}    accent="teal"   trend="↑ 5 added this week" />
        <Card title="Testimonials"  value={metrics.testimonials} icon={<FaStar />}     accent="amber"  trend="★ 4.8 avg rating" />
        <Card title="Contact Msgs"  value={metrics.contacts}     icon={<FaEnvelope />} accent="pink"   trend="↑ 8 unread msgs" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-slate-800 font-semibold text-sm mb-1">User Visits</h2>
          <p className="text-slate-400 text-xs mb-4">Last 7 days</p>
          <UserVisitsChart data={visits} />
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-slate-800 font-semibold text-sm mb-1">Recent Activity</h2>
          <p className="text-slate-400 text-xs mb-4">Latest actions across the platform</p>
          <p className="text-slate-400 text-sm">Activity feed goes here.</p>
        </div>
      </div>
    </div>
  );
}
