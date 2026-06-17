import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../Input";
import api from "../Utils/api";

const schema = yup.object().shape({
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  destinations: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Destination required"),
      })
    )
    .min(1, "At least one destination is required"),
});

const TripPlanner = () => {
  const [itinerary, setItinerary] = useState([]);
  const [dbDestinations, setDbDestinations] = useState([]);

  // Fetch destinations on mount to auto-populate autocomplete datalist
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get("/destinations");
        if (response.data?.success) {
          setDbDestinations(response.data.data.destinations || []);
        }
      } catch (err) {
        console.error("Failed to fetch destinations for autocomplete:", err);
      }
    };
    fetchDestinations();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      destinations: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "destinations",
  });

  const onSubmit = (data) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    const totalDays =
      (end - start) / (1000 * 60 * 60 * 24) + 1;

    let plan = [];
    let index = 0;

    for (let i = 0; i < totalDays; i++) {
      plan.push({
        day: i + 1,
        place: data.destinations[index].name,
      });

      index = (index + 1) % data.destinations.length;
    }

    setItinerary(plan);
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-6 bg-slate-50 min-h-screen">
      {/* Autocomplete Datalist */}
      <datalist id="db-destinations-list">
        {dbDestinations.map((dest) => (
          <option key={dest._id} value={dest.name} />
        ))}
      </datalist>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md border border-slate-200"
      >
        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
          📅 Trip Planner
        </h2>

        <Input
          label="Start Date"
          type="date"
          {...register("startDate")}
          error={errors.startDate?.message}
        />

        <Input
          label="End Date"
          type="date"
          {...register("endDate")}
          error={errors.endDate?.message}
        />

        {/* 📍 Destinations */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-slate-700 text-sm">
            Destinations
          </label>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                {...register(`destinations.${index}.name`)}
                placeholder="Enter destination..."
                list="db-destinations-list"
                autoComplete="off"
                className={`w-full px-4 py-2 rounded-lg border text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] ${
                  errors.destinations?.[index]?.name
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3.5 rounded-lg transition-colors font-semibold"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Error for each destination */}
          {fields.map((_, index) => (
            <p key={index} className="text-red-500 text-xs mt-1">
              {errors.destinations?.[index]?.name?.message}
            </p>
          ))}

          <button
            type="button"
            onClick={() => append({ name: "" })}
            className="text-[#0A3D62] hover:text-blue-800 text-sm font-semibold mt-2 flex items-center gap-1"
          >
            + Add Destination
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0A3D62] text-white py-2.5 rounded-lg hover:bg-blue-900 transition-colors font-semibold shadow"
        >
          Generate Itinerary
        </button>
      </form>

      {/* 📊 OUTPUT */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-800">
          🗺️ Your Itinerary
        </h2>

        {itinerary.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm text-slate-500 text-sm">
            No itinerary generated yet. Complete the form to plan your trip!
          </div>
        ) : (
          <div className="overflow-y-auto max-h-[85vh] pr-2">
            {itinerary.map((item, index) => (
              <div
                key={index}
                className="p-4 mb-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow transition-shadow duration-200"
              >
                <h3 className="font-bold text-[#0A3D62] text-base mb-1">
                  Day {item.day}
                </h3>
                <p className="text-slate-700 text-sm flex items-center gap-1.5 font-medium">
                  <FaMapMarkerAlt className="text-slate-400 text-xs" /> Visit: {item.place}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripPlanner;