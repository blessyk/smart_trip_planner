import React from "react";
import Input from "../Input";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  country: yup.string().required("Country is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  duration: yup.string().required("Duration is required"),
});

// Sample categories
const categories = ["Beach", "Adventure", "Cultural", "Wildlife", "Relaxation"];

export default function AddDestination() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Format price as currency while typing
  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, ""); // remove non-numbers
    const formatted = raw ? parseInt(raw).toLocaleString() : "";
    setValue("price", formatted, { shouldValidate: true });
  };

  const onSubmit = (data) => {
    console.log(data); // UI only
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-[#0A3D62] mb-4">
          Add Destination
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            placeholder="Enter destination name"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Country"
            placeholder="Enter country"
            {...register("country")}
            error={errors.country?.message}
          />

          {/* Category dropdown */}
          <div className="mb-4">
            <label className="block mb-1 text-black">Category</label>
            <select
              {...register("category")}
              className={`w-full px-4 py-2 rounded-lg border 
                bg-transparent text-black
                focus:outline-none focus:ring-2 focus:ring-[#0A3D62]
                ${errors.category ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500 text-sm">
                {errors.category.message}
              </span>
            )}
          </div>

          <Input
            label="Description"
            placeholder="Enter description"
            {...register("description")}
            error={errors.description?.message}
          />

          <Input
            label="Price"
            placeholder="Enter price"
            {...register("price")}
            error={errors.price?.message}
            onChange={handlePriceChange}
          />

          <Input
            label="Duration"
            placeholder="Enter duration (e.g., 5 days)"
            {...register("duration")}
            error={errors.duration?.message}
          />

          {/* Right-aligned submit button */}
          <div className="flex justify-end mt-4">
            <Button type="submit">Add Destination</Button>
          </div>
        </form>
      </div>
    </div>
  );
}