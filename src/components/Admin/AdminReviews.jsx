import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { FaStar, FaSpinner, FaChevronDown, FaChevronUp, FaRobot, FaFilter } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import api from "../Utils/api";
import { toast } from "react-toastify";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"]; // Green (Positive), Amber (Neutral), Red (Negative)

export default function AdminReviews() {
  const { isLoggedIn } = useSelector((state) => state.auth);
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  
  // Filter state
  const [sentimentFilter, setSentimentFilter] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get("/reviews/admin");
        if (response.data?.success) {
          setReviews(response.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
        toast.error("Failed to load user reviews.");
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchReviews();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return <Navigate to="/" />;

  // Calculate metrics
  const totalReviews = reviews.length;
  const avgDestinationRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.destination.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const sentimentCounts = reviews.reduce(
    (acc, r) => {
      const lbl = r.destination.sentiment?.label || "Neutral";
      if (lbl === "Positive") acc.positive++;
      else if (lbl === "Negative") acc.negative++;
      else acc.neutral++;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  const positivePercent = totalReviews > 0
    ? ((sentimentCounts.positive / totalReviews) * 100).toFixed(0)
    : 0;

  const chartData = [
    { name: "Positive", value: sentimentCounts.positive },
    { name: "Neutral", value: sentimentCounts.neutral },
    { name: "Negative", value: sentimentCounts.negative }
  ].filter(item => item.value > 0);

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (sentimentFilter === "all") return true;
    return (r.destination.sentiment?.label || "Neutral").toLowerCase() === sentimentFilter.toLowerCase();
  });

  const toggleExpand = (id) => {
    setExpandedReviewId(expandedReviewId === id ? null : id);
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={`text-xs ${
              star <= rating ? "text-amber-400 fill-amber-400" : "text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              📊 Review Analytics & Sentiment Analysis
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Monitor customer satisfaction and inspect AI-analyzed review sentiments
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-60 w-full items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center">
              <FaSpinner className="animate-spin text-3xl text-indigo-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm font-semibold">Loading user reviews & analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Feedbacks</span>
                <p className="text-2xl font-extrabold text-slate-800 mt-1">{totalReviews}</p>
                <div className="text-[10px] text-indigo-600 mt-1 font-semibold flex items-center gap-1">
                  <FaRobot /> AI analyzed in real-time
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Average Rating</span>
                <p className="text-2xl font-extrabold text-slate-800 mt-1">{avgDestinationRating} / 5.0</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <StarRating rating={Math.round(avgDestinationRating)} />
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Positive Sentiment</span>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">{positivePercent}%</p>
                <p className="text-[10px] text-slate-400 mt-1">Based on Gemini evaluation</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Negative Sentiment</span>
                <p className="text-2xl font-extrabold text-red-500 mt-1">
                  {totalReviews > 0 ? ((sentimentCounts.negative / totalReviews) * 100).toFixed(0) : 0}%
                </p>
                <p className="text-[10px] text-slate-400 mt-1">Flagged for dynamic action</p>
              </div>
            </div>

            {/* Visual Charts & Filters */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Pie Chart Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Sentiment Distribution</h3>
                {chartData.length > 0 ? (
                  <>
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => {
                              let cellColor = COLORS[1]; // Neutral
                              if (entry.name === "Positive") cellColor = COLORS[0];
                              if (entry.name === "Negative") cellColor = COLORS[2];
                              return <Cell key={`cell-${index}`} fill={cellColor} />;
                            })}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Custom Legend */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                          <span className="text-slate-500">Positive</span>
                        </div>
                        <span className="font-bold text-slate-700">{sentimentCounts.positive}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                          <span className="text-slate-500">Neutral</span>
                        </div>
                        <span className="font-bold text-slate-700">{sentimentCounts.neutral}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded bg-red-500" />
                          <span className="text-slate-500">Negative</span>
                        </div>
                        <span className="font-bold text-slate-700">{sentimentCounts.negative}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-44 items-center justify-center text-slate-400 text-xs">
                    No data available.
                  </div>
                )}
              </div>

              {/* Reviews List & Table (Right 2 columns) */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                
                {/* Filters header */}
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <FaFilter className="text-slate-400 text-xs" /> Recent Reviews ({filteredReviews.length})
                  </h3>
                  <div className="flex gap-2">
                    {["all", "positive", "neutral", "negative"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setSentimentFilter(type)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all capitalize ${
                          sentimentFilter === type
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table / List */}
                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px]">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((rev) => {
                      const isExpanded = expandedReviewId === rev._id;
                      const userLabel = rev.userId?.name || "Deleted User";
                      const userEmail = rev.userId?.email || "";
                      const destinationLabel = rev.tripId?.destination || rev.destination.name;
                      
                      return (
                        <div key={rev._id} className="p-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-slate-800 text-xs sm:text-sm">{userLabel}</span>
                              <span className="text-[10px] text-slate-400 ml-2">({userEmail})</span>
                              <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                Trip to: <span className="text-indigo-600">{destinationLabel}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                rev.destination.sentiment?.label === "Positive"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : rev.destination.sentiment?.label === "Negative"
                                  ? "bg-red-50 text-red-700 border border-red-100"
                                  : "bg-amber-50 text-amber-700 border border-amber-100"
                              }`}>
                                {rev.destination.sentiment?.label}
                              </span>
                              <button
                                onClick={() => toggleExpand(rev._id)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                              >
                                {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                              </button>
                            </div>
                          </div>

                          {/* Destination review text */}
                          <div className="mt-2.5 space-y-1">
                            <div className="flex items-center gap-2">
                              <StarRating rating={rev.destination.rating} />
                              <span className="text-[10px] text-slate-400">
                                {new Date(rev.createdAt).toLocaleDateString("en-IN")}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 italic">
                              "{rev.destination.comment || "No comments written."}"
                            </p>
                            
                            {rev.destination.sentiment?.keywords?.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {rev.destination.sentiment.keywords.map((kw, i) => (
                                  <span key={i} className="text-[8px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded font-medium">
                                    #{kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Expanded sub-reviews */}
                          {isExpanded && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3 animate-in fade-in duration-200">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Sub-Component Feedbacks
                              </h4>

                              {/* Hotel */}
                              {rev.hotel && rev.hotel.name ? (
                                <div className="text-xs space-y-1 border-l-2 border-blue-400 pl-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-slate-700">🏨 Hotel: {rev.hotel.name} ({rev.hotel.roomType})</span>
                                    <StarRating rating={rev.hotel.rating} />
                                  </div>
                                  <p className="text-slate-500 italic">"{rev.hotel.comment || "No comment."}"</p>
                                  <div className="text-[9px] text-slate-400 flex justify-between">
                                    <span>AI: {rev.hotel.sentiment?.label}</span>
                                    <span>{rev.hotel.sentiment?.keywords?.join(', ')}</span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 italic">No hotel stayed / reviewed.</p>
                              )}

                              {/* Room */}
                              {rev.room && rev.room.name ? (
                                <div className="text-xs space-y-1 border-l-2 border-indigo-400 pl-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-slate-700">🛏️ Room Stay: {rev.room.name}</span>
                                    <StarRating rating={rev.room.rating} />
                                  </div>
                                  <p className="text-slate-500 italic">"{rev.room.comment || "No comment."}"</p>
                                  <div className="text-[9px] text-slate-400 flex justify-between">
                                    <span>AI: {rev.room.sentiment?.label}</span>
                                    <span>{rev.room.sentiment?.keywords?.join(', ')}</span>
                                  </div>
                                </div>
                              ) : null}

                              {/* Restaurant */}
                              {rev.restaurant && rev.restaurant.name ? (
                                <div className="text-xs space-y-1 border-l-2 border-amber-400 pl-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-slate-700">🍽️ Restaurant: {rev.restaurant.name}</span>
                                    <StarRating rating={rev.restaurant.rating} />
                                  </div>
                                  <p className="text-slate-500 italic">"{rev.restaurant.comment || "No comment."}"</p>
                                  <div className="text-[9px] text-slate-400 flex justify-between">
                                    <span>AI: {rev.restaurant.sentiment?.label}</span>
                                    <span>{rev.restaurant.sentiment?.keywords?.join(', ')}</span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 italic">No restaurant dining reviewed.</p>
                              )}

                              {/* Attraction */}
                              {rev.attraction && rev.attraction.name ? (
                                <div className="text-xs space-y-1 border-l-2 border-teal-400 pl-2">
                                  <div className="flex justify-between items-center">
                                    <span className="font-semibold text-slate-700">🎡 Attraction: {rev.attraction.name}</span>
                                    <StarRating rating={rev.attraction.rating} />
                                  </div>
                                  <p className="text-slate-500 italic">"{rev.attraction.comment || "No comment."}"</p>
                                  <div className="text-[9px] text-slate-400 flex justify-between">
                                    <span>AI: {rev.attraction.sentiment?.label}</span>
                                    <span>{rev.attraction.sentiment?.keywords?.join(', ')}</span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-[10px] text-slate-400 italic">No attraction sightseeing reviewed.</p>
                              )}

                            </div>
                          )}

                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No matching reviews found.
                    </div>
                  )}
                </div>

              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}
