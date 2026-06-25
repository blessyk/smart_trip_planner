import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaSuitcase, FaWallet, FaCalendarAlt, FaSpinner } from "react-icons/fa";
import api from "../Utils/api";
import { toast } from "react-toastify";

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAllTrips = async () => {
    try {
      const response = await api.get("/admin/trips");
      if (response.data?.success) {
        setTrips(response.data.data.trips || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load generated trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTrips();
  }, []);

  const handleDeleteTrip = async (id, destination) => {
    if (!window.confirm(`Are you sure you want to delete this trip to ${destination}? This action is permanent.`)) {
      return;
    }
    try {
      const response = await api.delete(`/trips/${id}`);
      if (response.data?.success) {
        toast.success(`Successfully deleted trip to ${destination}`);
        setTrips((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete trip.");
    }
  };

  // Compute stats
  const totalTrips = trips.length;
  const totalBudget = trips.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const avgDays = totalTrips > 0 ? (trips.reduce((acc, curr) => acc + (curr.numberOfDays || 0), 0) / totalTrips).toFixed(1) : 0;

  // Filter
  const filteredTrips = trips.filter(trip => 
    trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (trip.userId && trip.userId.name && trip.userId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (trip.userId && trip.userId.email && trip.userId.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">📋 Trips Management</h1>
          <p className="text-slate-500 text-sm">Review, analyze, and manage all AI-generated travel itineraries in the database.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-650 flex items-center justify-center text-xl">
              <FaSuitcase />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Total Itineraries</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{totalTrips}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
              <FaWallet />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Total Managed Budget</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-0.5">₹{totalBudget.toLocaleString("en-IN")}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase">Average Duration</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{avgDays} Days</h3>
            </div>
          </div>
        </div>

        {/* Search Filter and Table list */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-150 flex flex-col sm:flex-row justify-between items-center gap-3">
            <h2 className="text-sm font-bold text-slate-800">Generated Trips list ({filteredTrips.length})</h2>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3.5 top-3 text-slate-400 text-xs">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search by destination or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No generated itineraries found matching the search criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold uppercase">
                    <th className="p-4">Destination</th>
                    <th className="p-4">Created By</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Budget</th>
                    <th className="p-4 font-medium">Trip Type</th>
                    <th className="p-4">Date Planned</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-slate-650">
                  {filteredTrips.map((trip) => {
                    const createdDate = new Date(trip.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    });
                    
                    return (
                      <tr key={trip._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-850">{trip.destination}</td>
                        <td className="p-4">
                          {trip.userId ? (
                            <div>
                              <p className="font-semibold text-slate-800">{trip.userId.name}</p>
                              <p className="text-[10px] text-slate-400">{trip.userId.email}</p>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">Unknown User</span>
                          )}
                        </td>
                        <td className="p-4 font-semibold text-slate-800">{trip.numberOfDays} Days</td>
                        <td className="p-4 font-bold text-slate-800">₹{trip.budget.toLocaleString("en-IN")}</td>
                        <td className="p-4 font-medium">
                          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-[10px] border border-indigo-100 font-semibold">
                            {trip.tripType}
                          </span>
                        </td>
                        <td className="p-4 text-slate-450">{createdDate}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteTrip(trip._id, trip.destination)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors inline-flex border border-red-200"
                            title="Delete Trip from Database"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
