import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Card from "./Card";
import { FaUser, FaGlobe, FaStar, FaEnvelope } from "react-icons/fa";
import UserVisitsChart from "./UserVisitsChart";
import api from "../Utils/api";

export default function AdminHome() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  if (!isLoggedIn) return <Navigate to="/" />;

  const [metrics, setMetrics] = useState({ users: 0, destinations: 0, testimonials: 0, contacts: 0 });
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        const [usersRes, destRes, testRes, contactRes, visitsRes] = await Promise.all([
          api.get("/admin/users?limit=1"),
          api.get("/destinations?limit=1"),
          api.get("/testimonials"),
          api.get("/contacts"),
          fetch("/API/visits.json").then((r) => r.json()).catch(() => []),
        ]);

        setMetrics({
          users: usersRes.data?.pagination?.total || 0,
          destinations: destRes.data?.pagination?.total !== undefined 
            ? destRes.data.pagination.total 
            : (destRes.data?.data?.destinations?.length || 0),
          testimonials: testRes.data?.data?.testimonials?.length || 0,
          contacts: contactRes.data?.data?.contacts?.length || 0,
        });
        setVisits(visitsRes);
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Dashboard</h1>
      <p className="mb-7 text-slate-400 text-sm">
        Welcome back, <span className="text-indigo-500 font-medium">{user?.name}</span>
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0A3D62]"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <Card title="Total Users"   value={metrics.users}        icon={<FaUser />}     accent="indigo" trend="Dynamic count" onClick={() => navigate("/Admin/users")} />
            <Card title="Destinations"  value={metrics.destinations} icon={<FaGlobe />}    accent="teal"   trend="Dynamic count" onClick={() => navigate("/Admin/destinations")} />
            <Card title="Testimonials"  value={metrics.testimonials} icon={<FaStar />}     accent="amber"  trend="Dynamic count" onClick={() => navigate("/Admin/testimonials")} />
            <Card title="Contact Msgs"  value={metrics.contacts}     icon={<FaEnvelope />} accent="pink"   trend="Dynamic count" onClick={() => navigate("/Admin/contact")} />
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
              <p className="text-slate-400 text-sm">Activity feed is dynamically tracking database updates.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
