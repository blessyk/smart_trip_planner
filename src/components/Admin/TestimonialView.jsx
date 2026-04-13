import React, { useState, useEffect } from "react";
import View from "./View";
import Pagination from "./Pagination";
import Search from "./Search";
import useTable from "./Hooks/useTable";

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
    fetch("/API/testimonials.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setTestimonials(data))
      .catch((err) => console.error("Failed to fetch testimonials:", err));
  }, []);

  const { currentPage, setCurrentPage, totalPages, currentRows } = useTable(
    testimonials,
    searchTerm,
    ["name", "email", "message"],
  );

  const columns = [
    { title: "ID", key: "id" },
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Rating", key: "rating" },
    { title: "Message", key: "message" },
  ];

  const actions = [
    {
      label: "Delete",
      className: "bg-red-500 text-white hover:bg-red-600",
      onClick: (testimonial) => console.log("Delete", testimonial),
    },
  ];

  return (
    <div className="p-4">
      {/* Top Bar with Search */}
      <div className="w-full">
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by name, email, or message"
        />
      </div>

      {/* Table */}
      <View columns={columns} data={currentRows} actions={actions} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}