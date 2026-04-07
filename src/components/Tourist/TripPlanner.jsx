import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Input from "../Input";

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
    <div className="p-6 grid md:grid-cols-2 gap-6">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-xl font-semibold mb-4">
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
          <label className="block mb-2 font-medium">
            Destinations
          </label>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <input
                {...register(`destinations.${index}.name`)}
                placeholder="Enter destination"
                className={`w-full px-4 py-2 rounded-lg border ${errors.destinations?.[index]?.name
                    ? "border-red-500"
                    : "border-gray-300"
                  }`}
              />

              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white px-3 rounded"
              >
                ✕
              </button>
            </div>
          ))}

          {/* Error for each destination */}
          {fields.map((_, index) => (
            <p key={index} className="text-red-500 text-sm">
              {errors.destinations?.[index]?.name?.message}
            </p>
          ))}

          <button
            type="button"
            onClick={() => append({ name: "" })}
            className="text-blue-600 text-sm mt-2"
          >
            + Add Destination
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-[#0A3D62] text-white py-2 rounded-lg hover:bg-blue-900"
        >
          Generate Itinerary
        </button>
      </form>

      {/* 📊 OUTPUT */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          🗺️ Your Itinerary
        </h2>

        {itinerary.length === 0 ? (
          <p className="text-gray-500">
            No itinerary generated
          </p>
        ) : (
          itinerary.map((item, index) => (
            <div
              key={index}
              className="p-4 mb-3 border rounded-lg shadow hover:shadow-md"
            >
              <h3 className="font-bold text-lg">
                Day {item.day}
              </h3>
              <p className="text-gray-700">
                Visit: {item.place}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TripPlanner;