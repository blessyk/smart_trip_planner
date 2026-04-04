import React, { useState } from "react";
import View from "./View";

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      rating: 5,
      message: "Amazing experience!",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      rating: 4,
      message: "Really enjoyed the service.",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      rating: 3,
      message: "It was okay, could be better.",
    },
  ]);

  const columns = [
    { title: "ID", key: "id" },
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Rating", key: "rating" },
    { title: "Message", key: "message" },
  ];

  const actions = [
    {
      label: "Edit",
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (testimonial) => console.log("Edit", testimonial),
    },
    {
      label: "Delete",
      className: "bg-red-500 text-white hover:bg-red-600",
      onClick: (testimonial) => console.log("Delete", testimonial),
    },
  ];

  return <View columns={columns} data={testimonials} actions={actions} />;
}