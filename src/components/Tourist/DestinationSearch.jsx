import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../Input";


const schema = yup.object().shape({
  destination: yup.string().required("Destination is required"),
  budget: yup
    .number()
    .typeError("Budget must be a number")
    .min(0, "Budget must be positive")
    .required("Budget is required"),
  category: yup.string().required("Category is required"),
  rating: yup
    .number()
    .typeError("Rating must be a number")
    .min(1, "Min rating is 1")
    .max(5, "Max rating is 5")
    .required("Rating is required"),
});

// ✅ Dummy Data
const dataList = [
  { name: "Munnar", budget: 5000, category: "hill", rating: 4.5 },
  { name: "Goa", budget: 8000, category: "beach", rating: 4.2 },
  { name: "Hampi", budget: 4000, category: "heritage", rating: 4.7 },
];

const DestinationSearch = () => {
  const [results, setResults] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // ✅ Search Logic
  const onSubmit = (filters) => {
    const filtered = dataList.filter((place) => {
      return (
        place.name
          .toLowerCase()
          .includes(filters.destination.toLowerCase()) &&
        place.budget <= filters.budget &&
        place.category === filters.category &&
        place.rating >= filters.rating
      );
    });

    setResults(filtered);
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6">
      {/* 🔍 FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          Search Destinations
        </h2>

        <Input
          label="Destination"
          placeholder="Enter place..."
          {...register("destination")}
          error={errors.destination?.message}
        />

        <Input
          label="Budget (₹)"
          type="number"
          {...register("budget")}
          error={errors.budget?.message}
        />

        {/* Category */}
        <div className="mb-4">
          <label className="block mb-1">Category</label>
          <select
            {...register("category")}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">Select category</option>
            <option value="beach">Beach</option>
            <option value="hill">Hill Station</option>
            <option value="heritage">Heritage</option>
            <option value="adventure">Adventure</option>
          </select>
          <p className="text-red-500 text-sm">
            {errors.category?.message}
          </p>
        </div>

        <Input
          label="Minimum Rating (1-5)"
          type="number"
          {...register("rating")}
          error={errors.rating?.message}
        />

        <button
          type="submit"
          className="w-full bg-[#0A3D62] text-white py-2 rounded-lg hover:bg-blue-900"
        >
          Search
        </button>
      </form>

      {/* 📍 RESULTS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Results
        </h2>

        {results.length === 0 ? (
          <p className="text-gray-500">
            No destinations found
          </p>
        ) : (
          results.map((place, index) => (
            <div
              key={index}
              className="p-4 mb-3 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold">
                {place.name}
              </h3>
              <p>Budget: ₹{place.budget}</p>
              <p>Category: {place.category}</p>
              <p>Rating: ⭐ {place.rating}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DestinationSearch;