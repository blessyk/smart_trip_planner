import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../Input";
import api from "../Utils/api";
import { FaMapMarkerAlt, FaStar, FaRegClock } from "react-icons/fa";

const schema = yup.object().shape({
  destination: yup.string().optional(),
  budget: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("Budget must be a number")
    .min(0, "Budget must be positive")
    .optional(),
  category: yup.string().optional(),
  rating: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .typeError("Rating must be a number")
    .min(1, "Min rating is 1")
    .max(5, "Max rating is 5")
    .optional(),
});

const DestinationSearch = () => {
  const [destinations, setDestinations] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      destination: "",
      budget: "",
      category: "",
      rating: "",
    },
  });

  // Fetch destinations from the backend on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/destinations");
        if (response.data?.success) {
          const list = response.data.data.destinations || [];
          setDestinations(list);
          setResults(list);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
        setError("Could not load destinations from database.");
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Stable rating generation based on destination name length/chars
  const getRating = (place) => {
    const charSum = place.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return parseFloat((4.0 + (charSum % 11) / 10).toFixed(1));
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

  // ✅ Search Logic
  const onSubmit = (filters) => {
    const filtered = destinations.filter((place) => {
      const matchesDestination = !filters.destination ||
        place.name.toLowerCase().includes(filters.destination.toLowerCase()) ||
        place.country.toLowerCase().includes(filters.destination.toLowerCase());

      const matchesBudget = !filters.budget || place.price <= filters.budget;

      const matchesCategory = !filters.category ||
        place.category.toLowerCase() === filters.category.toLowerCase();

      const matchesRating = !filters.rating || getRating(place) >= filters.rating;

      return matchesDestination && matchesBudget && matchesCategory && matchesRating;
    });

    setResults(filtered);
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6 min-h-screen bg-slate-50">
      {/* 🔍 FORM */}
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-6 rounded-xl shadow-md border border-slate-200 sticky top-6"
        >
          <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
            🔍 Search Destinations
          </h2>

          <Input
            label="Destination / Country"
            placeholder="Enter place or country..."
            {...register("destination")}
            error={errors.destination?.message}
          />

          <Input
            label="Max Budget (₹)"
            type="number"
            placeholder="e.g. 20000"
            {...register("budget")}
            error={errors.budget?.message}
          />

          {/* Category */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-slate-700">Category</label>
            <select
              {...register("category")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
            >
              <option value="">All Categories</option>
              <option value="Beach">Beach</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Relaxation">Relaxation</option>
            </select>
            {errors.category?.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category?.message}
              </p>
            )}
          </div>

          <Input
            label="Minimum Rating (1-5)"
            type="number"
            step="0.1"
            placeholder="e.g. 4.5"
            {...register("rating")}
            error={errors.rating?.message}
          />

          <button
            type="submit"
            className="w-full bg-[#0A3D62] text-white py-2.5 rounded-lg hover:bg-blue-900 transition-colors font-semibold shadow"
          >
            Search
          </button>
        </form>
      </div>

      {/* 📍 RESULTS */}
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">
            Results ({results.length})
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A3D62]"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 py-4">{error}</p>
        ) : results.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm">
            <p className="text-slate-500">No destinations found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[85vh] pr-2">
            {results.map((place) => {
              const rating = getRating(place);
              return (
                <div
                  key={place._id}
                  className="flex bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 mb-4"
                >
                  <div className="w-1/3 min-w-[110px] max-w-[160px] bg-slate-100 relative">
                    <img
                      src={place.images && place.images[0] ? place.images[0] : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}
                      alt={place.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-65 text-white text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow">
                      <FaRegClock className="text-[10px]" /> {place.duration}
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="font-bold text-slate-800 text-sm md:text-base leading-snug">
                          {place.name}
                        </h3>
                        <span className="flex items-center gap-1 text-amber-500 font-bold text-xs flex-shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          <FaStar /> {rating}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-slate-400" /> {place.country}
                      </p>
                      <p className="text-slate-600 text-xs mt-2 line-clamp-2">
                        {place.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                      <span className="text-[#0A3D62] font-bold text-sm">
                        ₹{place.price.toLocaleString("en-IN")}
                      </span>
                      <span className={`text-[10px] border rounded-md px-2 py-0.5 font-medium ${getTagStyle(place.category)}`}>
                        {place.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationSearch;