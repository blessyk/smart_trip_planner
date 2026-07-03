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
  
  const [metrics, setMetrics] = useState({ users: 0, testimonials: 0, contacts: 0 });
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
  const [selectedProvider, setSelectedProvider] = useState("gemini");
  const [updatingProviderSetting, setUpdatingProviderSetting] = useState(false);

  useEffect(() => {
    const initSettings = async () => {
      try {
        setLoadingModels(true);
        const [settingRes, modelsRes, providerRes] = await Promise.all([
          api.get("/admin/settings/gemini-model").catch(err => {
            console.error("Failed to load model setting:", err);
            return null;
          }),
          api.get("/admin/settings/gemini-available-models").catch(err => {
            console.error("Failed to load available models:", err);
            return null;
          }),
          api.get("/admin/settings/ai-provider").catch(err => {
            console.error("Failed to load provider setting:", err);
            return null;
          })
        ]);

        if (settingRes?.data?.success && settingRes.data.data) {
          setSelectedModel(settingRes.data.data.value);
        }
        if (modelsRes?.data?.success && Array.isArray(modelsRes.data.data)) {
          setAvailableModels(modelsRes.data.data);
        }
        if (providerRes?.data?.success && providerRes.data.data) {
          setSelectedProvider(providerRes.data.data.value);
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
        const [usersRes, testRes, contactRes, visitsRes] = await Promise.all([
          api.get("/admin/users?limit=1"),
          api.get("/testimonials"),
          api.get("/contacts"),
          fetch("/API/visits.json").then((r) => r.json()).catch(() => []),
        ]);

        setMetrics({
          users: usersRes.data?.pagination?.total || 0,
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

  const handleProviderSave = async (e) => {
    e.preventDefault();
    setUpdatingProviderSetting(true);
    try {
      const response = await api.put("/admin/settings/ai-provider", {
        value: selectedProvider
      });
      if (response.data?.success) {
        toast.success("Successfully updated active AI Provider!");
      } else {
        toast.error("Failed to update AI Provider.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating provider settings.");
    } finally {
      setUpdatingProviderSetting(false);
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card title="Total Users"   value={metrics.users}        icon={<FaUser />}     accent="indigo" trend="" onClick={() => navigate("/Admin/users")} />
            <Card title="Testimonials"  value={metrics.testimonials} icon={<FaStar />}     accent="amber"  trend="" onClick={() => navigate("/Admin/testimonials")} />
            <Card title="Contact Msgs"  value={metrics.contacts}     icon={<FaEnvelope />} accent="pink"   trend="" onClick={() => navigate("/Admin/contact")} />
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

          {/* AI Settings Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            
            {/* AI Provider Config */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-slate-800 font-semibold text-sm mb-1">🤖 Active AI Provider</h2>
              <p className="text-slate-400 text-xs mb-4">Choose which AI API is used dynamically for planning and analysis.</p>
              
              <form onSubmit={handleProviderSave} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="ai-provider"
                      value="gemini"
                      checked={selectedProvider === "gemini"}
                      onChange={() => setSelectedProvider("gemini")}
                      className="text-indigo-650 focus:ring-indigo-500"
                    />
                    <span>Google Gemini API</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="ai-provider"
                      value="groq"
                      checked={selectedProvider === "groq"}
                      onChange={() => setSelectedProvider("groq")}
                      className="text-indigo-650 focus:ring-indigo-500"
                    />
                    <span>Groq Cloud API (Llama 3)</span>
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={updatingProviderSetting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {updatingProviderSetting ? <FaSpinner className="animate-spin text-xs" /> : "Save Provider"}
                </button>
              </form>
            </div>

            {/* Gemini Model Config */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h2 className="text-slate-850 font-semibold text-sm mb-1">⚙️ Gemini Model Selection</h2>
              <p className="text-slate-400 text-xs mb-4">Select the specific model to target when Google Gemini is active.</p>
              
              <div className="space-y-4">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={loadingModels || updatingSetting}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium disabled:opacity-50"
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
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 disabled:bg-slate-300"
                >
                  {updatingSetting ? <FaSpinner className="animate-spin text-xs" /> : "Save Gemini Model"}
                </button>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
