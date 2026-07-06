import React, { useState, useEffect } from "react";
import { FaSearch, FaTrash, FaSuitcase, FaWallet, FaCalendarAlt, FaSpinner, FaEye, FaTimes } from "react-icons/fa";
import api from "../Utils/api";
import { toast } from "react-toastify";
import Pagination from "./Pagination";

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ totalTrips: 0, totalBudget: 0, avgDays: 0 });
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const limit = 10;

  const fetchAllTrips = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/admin/trips?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`
      );
      if (response.data?.success) {
        setTrips(response.data.data.trips || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1);
        }
        if (response.data.stats) {
          setStats(response.data.stats);
        }
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
  }, [currentPage, searchTerm]);

  const handleDeleteTrip = async (id, destination) => {
    if (!window.confirm(`Are you sure you want to delete this trip to ${destination}? This action is permanent.`)) {
      return;
    }
    try {
      const response = await api.delete(`/trips/${id}`);
      if (response.data?.success) {
        toast.success(`Successfully deleted trip to ${destination}`);
        fetchAllTrips();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete trip.");
    }
  };

  // Compute stats
  const totalTrips = stats.totalTrips;
  const totalBudget = stats.totalBudget;
  const avgDays = stats.avgDays;

  const currentRows = trips;

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-rose-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Title */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Trips Management</h1>
          <p className="text-slate-500 text-sm mt-1">Review, analyze, and manage all AI-generated travel itineraries.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-violet-950/60 text-violet-400 border border-violet-800/60 flex items-center justify-center text-lg">
              <FaSuitcase />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Itineraries</p>
              <h3 className="text-2xl font-extrabold text-slate-100 mt-0.5">{totalTrips}</h3>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center justify-center text-lg">
              <FaWallet />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Budget</p>
              <h3 className="text-2xl font-extrabold text-slate-100 mt-0.5">₹{totalBudget.toLocaleString("en-IN")}</h3>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center justify-center text-lg">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Average Duration</p>
              <h3 className="text-2xl font-extrabold text-slate-100 mt-0.5">{avgDays} Days</h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
            <h2 className="text-sm font-bold text-slate-200">Generated Trips ({currentRows.length})</h2>
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs pointer-events-none">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search by destination or user..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/40 bg-slate-950 text-slate-200 placeholder-slate-500"
              />
            </div>
          </div>

          {currentRows.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs italic">
              No generated itineraries found matching the search criteria.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-500 font-bold uppercase">
                      <th className="px-4 py-3">Destination</th>
                      <th className="px-4 py-3">Created By</th>
                      <th className="px-4 py-3">Duration</th>
                      <th className="px-4 py-3">Budget</th>
                      <th className="px-4 py-3">Trip Type</th>
                      <th className="px-4 py-3">Date Planned</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {currentRows.map((trip) => {
                      const createdDate = new Date(trip.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric"
                      });
                      return (
                        <tr key={trip._id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-100">{trip.destination}</td>
                          <td className="px-4 py-3">
                            {trip.userId ? (
                              <div>
                                <p className="font-semibold text-slate-200">{trip.userId.name}</p>
                                <p className="text-[10px] text-slate-500">{trip.userId.email}</p>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Unknown User</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-300">{trip.numberOfDays} Days</td>
                          <td className="px-4 py-3 font-bold text-slate-200">₹{trip.budget.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3">
                            <span className="bg-violet-950/60 text-violet-300 px-2.5 py-0.5 rounded-full text-[10px] border border-violet-800/60 font-semibold">
                              {trip.tripType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">{createdDate}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedTrip(trip);
                                  setIsDetailModalOpen(true);
                                }}
                                className="p-2 bg-emerald-955/40 hover:bg-emerald-900/40 text-emerald-450 rounded-xl transition-colors inline-flex border border-emerald-800/60"
                                title="View Trip Details"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleDeleteTrip(trip._id, trip.destination)}
                                className="p-2 bg-red-955/40 hover:bg-red-900/40 text-red-450 rounded-xl transition-colors inline-flex border border-red-800/60"
                                title="Delete Trip"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-4 border-t border-slate-800">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>

      </div>

      {/* Trip Details Modal */}
      {isDetailModalOpen && selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)} />
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-100">Trip to {selectedTrip.destination}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  {selectedTrip.numberOfDays} Days | Budget: ₹{selectedTrip.budget?.toLocaleString("en-IN")}
                </p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-1.5 rounded-lg text-slate-550 hover:bg-slate-800 hover:text-slate-300 transition-colors">
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-350">
              
              {/* Creator Info */}
              <div className="bg-slate-955/20 border border-slate-800 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">👤 Created By</h4>
                {selectedTrip.userId ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-slate-500">Name</p>
                      <p className="font-semibold text-slate-300">{selectedTrip.userId.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500">Email Address</p>
                      <p className="font-semibold text-slate-300">{selectedTrip.userId.email}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Unknown Creator</span>
                )}
              </div>

              {/* Weather & Safety Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Weather */}
                {selectedTrip.weatherInfo && (
                  <div className="bg-slate-955/20 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">🌤️ Weather Forecast</h4>
                    <p className="font-semibold text-slate-300">{selectedTrip.weatherInfo.forecast}</p>
                    {selectedTrip.weatherInfo.warnings && selectedTrip.weatherInfo.warnings !== "None" && (
                      <p className="text-red-400 font-semibold text-[10px]">⚠️ Warning: {selectedTrip.weatherInfo.warnings}</p>
                    )}
                  </div>
                )}

                {/* Risk */}
                {selectedTrip.riskAnalysis && (
                  <div className="bg-slate-955/20 border border-slate-800 p-4 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">🛡️ Risk Analysis</h4>
                    <p className="font-semibold text-slate-300">Level: <span className={selectedTrip.riskAnalysis.riskLevel === "High" ? "text-red-500" : "text-emerald-500"}>{selectedTrip.riskAnalysis.riskLevel}</span></p>
                    <p className="text-[10px] text-slate-500 leading-snug">{selectedTrip.riskAnalysis.reason || "No risks reported."}</p>
                  </div>
                )}
              </div>

              {/* Itinerary */}
              {selectedTrip.itinerary && selectedTrip.itinerary.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">📅 Itinerary Schedule</h4>
                  <div className="space-y-4">
                    {selectedTrip.itinerary.map((day) => (
                      <div key={day.day} className="border border-slate-800 rounded-xl p-4 space-y-3 bg-slate-955/10">
                        <div className="flex justify-between items-center border-b border-slate-800/60 pb-1.5">
                          <span className="font-bold text-rose-450 text-xs">Day {day.day}</span>
                          {day.date && <span className="text-[10px] text-slate-500">{day.date}</span>}
                        </div>
                        <div className="space-y-3">
                          {day.schedule && day.schedule.map((item, sIdx) => (
                            <div key={sIdx} className="space-y-1 pl-2 border-l border-slate-850">
                              <div className="flex justify-between font-bold text-slate-300">
                                <span>{item.time} - {item.activity}</span>
                                {item.cost > 0 && <span className="text-[10px] text-rose-400">₹{item.cost}</span>}
                              </div>
                              {item.description && <p className="text-slate-500 text-[10px] leading-relaxed">{item.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Hotels */}
              {selectedTrip.recommendedHotels && selectedTrip.recommendedHotels.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider border-b border-slate-800 pb-2">🏨 Recommended Accommodations</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTrip.recommendedHotels.map((hotel, hIdx) => (
                      <div key={hIdx} className="border border-slate-800 p-3.5 rounded-xl space-y-1.5 bg-slate-955/10">
                        <h5 className="font-bold text-slate-300">{hotel.hotelName}</h5>
                        <p className="text-[10px] text-slate-550">📍 {hotel.location} | ★ {hotel.rating}</p>
                        <p className="text-[10px] text-slate-450 italic">"{hotel.reasonForRecommendation}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-350 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
