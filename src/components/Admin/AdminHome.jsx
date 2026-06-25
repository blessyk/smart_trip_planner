import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Card from "./Card";
import { FaUser, FaGlobe, FaStar, FaEnvelope, FaSpinner } from "react-icons/fa";
import UserVisitsChart from "./UserVisitsChart";
import api from "../Utils/api";
import { toast } from "react-toastify";

export default function AdminHome() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  
  const [metrics, setMetrics] = useState({ users: 0, destinations: 0, testimonials: 0, contacts: 0 });
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedModel, setSelectedModel] = useState("gemini-flash-latest");
  const [updatingSetting, setUpdatingSetting] = useState(false);
  const [availableModels, setAvailableModels] = useState([
    { value: 'gemini-flash-latest', label: 'gemini-flash-latest (Fastest/Default)' },
    { value: 'gemini-2.5-flash', label: 'gemini-2.5-flash' },
    { value: 'gemini-2.5-pro', label: 'gemini-2.5-pro' },
    { value: 'gemini-2.0-flash', label: 'gemini-2.0-flash' },
    { value: 'gemini-3.5-flash', label: 'gemini-3.5-flash' }
  ]);
  const [loadingModels, setLoadingModels] = useState(true);

  useEffect(() => {
    const initSettings = async () => {
      try {
        setLoadingModels(true);
        const [settingRes, modelsRes] = await Promise.all([
          api.get("/admin/settings/gemini-model").catch(err => {
            console.error("Failed to load model setting:", err);
            return null;
          }),
          api.get("/admin/settings/gemini-available-models").catch(err => {
            console.error("Failed to load available models:", err);
            return null;
          })
        ]);

        if (settingRes?.data?.success && settingRes.data.data) {
          setSelectedModel(settingRes.data.data.value);
        }
        if (modelsRes?.data?.success && Array.isArray(modelsRes.data.data)) {
          setAvailableModels(modelsRes.data.data);
        }
      } catch (err) {
        console.error("Error initializing settings:", err);
      } finally {
        setLoadingModels(false);
      }
    };
    initSettings();
  }, []);

  if (!isLoggedIn) return <Navigate to="/" />;

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

  const handleModelSave = async () => {
    setUpdatingSetting(true);
    try {
      const response = await api.put("/admin/settings/gemini-model", {
        value: selectedModel
      });
      if (response.data?.success) {
        toast.success("Successfully updated Gemini AI model!");
      } else {
        toast.error("Failed to update setting.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating settings.");
    } finally {
      setUpdatingSetting(false);
    }
  };

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

          {/* Settings Section */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mt-6 max-w-xl">
            <h2 className="text-slate-800 font-semibold text-sm mb-1">🤖 Gemini AI Model Configuration</h2>
            <p className="text-slate-400 text-xs mb-4">Choose which Gemini model is used dynamically across the planner services.</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={loadingModels || updatingSetting}
                className="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-750 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingModels ? (
                  <option>Loading models...</option>
                ) : (
                  availableModels.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))
                )}
              </select>
              
              <button
                onClick={handleModelSave}
                disabled={updatingSetting || loadingModels}
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-755 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:bg-slate-350"
              >
                {updatingSetting ? <FaSpinner className="animate-spin text-xs" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
