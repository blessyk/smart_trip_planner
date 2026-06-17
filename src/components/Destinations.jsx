import React, { useState, useEffect } from "react";
import api from "./Utils/api";
import { FaStar, FaRegClock, FaMapMarkerAlt, FaTimes } from "react-icons/fa";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page,
          limit,
          search,
          category,
          sortBy,
          order,
        }).toString();

        const response = await api.get(`/destinations?${params}`);
        if (response.data?.success) {
          const list = response.data.data.destinations || [];

          if (response.data.pagination) {
            // Server-side pagination is active
            setDestinations(list);
            setTotalPages(response.data.pagination.pages || 1);
            setTotalItems(response.data.pagination.total || 0);
          } else {
            // Client-side fallback if server hasn't been restarted
            let processed = [...list];

            // 1. Search filter
            if (search) {
              const q = search.toLowerCase();
              processed = processed.filter(
                (p) =>
                  p.name.toLowerCase().includes(q) ||
                  p.country.toLowerCase().includes(q) ||
                  p.category.toLowerCase().includes(q)
              );
            }

            // 2. Category filter
            if (category) {
              processed = processed.filter((p) => p.category === category);
            }

            // 3. Sorting
            processed.sort((a, b) => {
              let valA = a[sortBy];
              let valB = b[sortBy];

              if (sortBy === "price") {
                return order === "asc" ? valA - valB : valB - valA;
              } else if (typeof valA === "string") {
                return order === "asc"
                  ? valA.localeCompare(valB)
                  : valB.localeCompare(valA);
              } else {
                return order === "asc"
                  ? new Date(valA) - new Date(valB)
                  : new Date(valB) - new Date(valA);
              }
            });

            // 4. Paginate
            setTotalItems(processed.length);
            const pages = Math.ceil(processed.length / limit);
            setTotalPages(pages || 1);

            const startIdx = (page - 1) * limit;
            const paginatedList = processed.slice(startIdx, startIdx + limit);
            setDestinations(paginatedList);
          }
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [page, limit, search, category, sortBy, order]);

  // Stable rating generator based on place name (matches DestinationSearch)
  const getRating = (place) => {
    const charSum = place.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return parseFloat((4.0 + (charSum % 11) / 10).toFixed(1));
  };

  const getImageUrl = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=90&w=800";
    if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
      return img;
    }
    const cleanImg = img.startsWith("/") ? img : `/${img}`;
    return `http://localhost:5001${cleanImg}`;
  };

  const getTagStyle = (category) => {
    switch (category) {
      case "Beach": return "text-teal-700 bg-teal-50 border-teal-200";
      case "Adventure": return "text-red-700 bg-red-50 border-red-200";
      case "Cultural": return "text-amber-700 bg-amber-50 border-amber-200";
      case "Wildlife": return "text-green-700 bg-green-50 border-green-200";
      case "Relaxation": return "text-indigo-700 bg-indigo-50 border-indigo-200";
      default: return "text-indigo-700 bg-indigo-50 border-indigo-200";
    }
  };

  return (
    <section className="py-16 px-6 md:px-16 bg-gray-50">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0A3D62] mb-10">
        Explore The Destinations
      </h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
        Discover handpicked destinations that offer breathtaking views, rich culture, and unforgettable experiences. Plan your next adventure with our top travel picks.
      </p>

      {/* Filters Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="w-full md:w-1/3">
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Search</label>
          <input
            type="text"
            placeholder="Search destination or country..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-800 text-sm bg-white"
          />
        </div>

        {/* Category */}
        <div className="w-full md:w-1/5">
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-700 text-sm bg-white"
          >
            <option value="">All Categories</option>
            <option value="Beach">Beach</option>
            <option value="Adventure">Adventure</option>
            <option value="Cultural">Cultural</option>
            <option value="Wildlife">Wildlife</option>
            <option value="Relaxation">Relaxation</option>
          </select>
        </div>

        {/* Sort By & Order */}
        <div className="w-full md:w-1/4 flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-700 text-sm bg-white"
            >
              <option value="createdAt">Date Added</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
          </div>
          <div className="w-24">
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Order</label>
            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value);
                setPage(1);
              }}
              className="w-full border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-700 text-sm bg-white"
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </div>
        </div>

        {/* Per Page */}
        <div className="w-full md:w-20">
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Per Page</label>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-700 text-sm bg-white"
          >
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={16}>16</option>
          </select>
        </div>

      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0A3D62]"></div>
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm max-w-md mx-auto">
          <p className="text-slate-500">No destinations found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {destinations.map((place) => {
              const firstImage = place.images && place.images.length > 0 ? place.images[0] : "";
              const rating = getRating(place);

              return (
                <div
                  key={place._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col justify-between"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(firstImage)}
                      alt={place.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=90&w=800";
                      }}
                    />
                    <div className={`absolute top-3 right-3 text-[10px] border rounded-md px-2 py-0.5 font-bold shadow ${getTagStyle(place.category)}`}>
                      {place.category}
                    </div>
                  </div>
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-[#0A3D62] line-clamp-1">
                          {place.name}
                        </h3>
                        <span className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <FaStar /> {rating}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs flex items-center gap-1 mb-2">
                        <FaMapMarkerAlt className="text-slate-400" /> {place.country}
                      </p>
                      <p className="text-slate-600 text-xs line-clamp-2 mb-4">
                        {place.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-slate-400 text-[10px] uppercase font-semibold">Price</p>
                        <span className="text-[#0A3D62] font-bold text-sm">
                          ₹{place.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedPlace(place)}
                        className="bg-[#0A3D62] text-white px-4 py-1.5 rounded-full hover:bg-blue-900 transition text-xs font-semibold"
                      >
                        View More
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[#0A3D62] text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-lg border text-sm font-semibold transition ${
                    page === p
                      ? "bg-[#0A3D62] border-[#0A3D62] text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-[#0A3D62] text-sm font-semibold hover:bg-slate-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail Modal Overlay */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedPlace(null)}
          />

          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden flex flex-col border border-slate-200 max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">{selectedPlace.name}</h3>
              <button
                onClick={() => setSelectedPlace(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <FaTimes className="text-base" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Images Grid */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Photos</p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPlace.images && selectedPlace.images.map((url, idx) => (
                    <div key={idx} className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                      <img
                        src={getImageUrl(url)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => window.open(getImageUrl(url), "_blank")}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=90&w=800";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Destination Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Country</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedPlace.country}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</p>
                  <p className="text-sm font-semibold text-slate-800">{selectedPlace.category}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Duration</p>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                    <FaRegClock className="text-slate-400" /> {selectedPlace.duration}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Price</p>
                  <p className="text-sm font-bold text-[#0A3D62]">
                    ₹{selectedPlace.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Description</p>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {selectedPlace.description}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPlace(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition-colors text-sm shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}