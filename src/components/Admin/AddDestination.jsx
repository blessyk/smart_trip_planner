import React, { useState } from "react";
import Input from "../Input"; // Adjust path if Input is outside the folder

export default function AddDestination({ onSave }) {
  const [form, setForm] = useState({
    name: "",
    country: "",
    price: "",
    duration: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.country) newErrors.country = "Country is required";
    if (!form.price) newErrors.price = "Price is required";
    if (!form.duration) newErrors.duration = "Duration is required";
    if (!form.category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    console.log("Destination Data:", form);
    if (onSave) onSave(form);

    setForm({
      name: "",
      country: "",
      price: "",
      duration: "",
      category: "",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold text-[#0A3D62] mb-4">Add Destination</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Destination Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter destination name"
          error={errors.name}
        />
        <Input
          label="Country"
          name="country"
          value={form.country}
          onChange={handleChange}
          placeholder="Enter country"
          error={errors.country}
        />
        <Input
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Enter price"
          error={errors.price}
        />
        <Input
          label="Duration"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          placeholder="Enter duration (e.g., 5 days)"
          error={errors.duration}
        />
        <Input
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Enter category (Adventure, Cultural, Romantic)"
          error={errors.category}
        />

        <button
          type="submit"
          className="w-full bg-[#0A3D62] text-white py-2 rounded-lg hover:bg-blue-900 transition mt-2"
        >
          Save Destination
        </button>
      </form>
    </div>
  );
}