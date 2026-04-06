import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import View from "./View";
import Pagination from "./Pagination";
import Search from "./Search";
import useTable from "./Hooks/useTable"; 

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("/API/destinations.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setDestinations(data))
      .catch((err) => console.error("Failed to fetch destinations:", err));
  }, []);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentRows,
  } = useTable(destinations, searchTerm, ["name", "country", "category"]);

  const goToAddDestination = () => navigate("/Admin/add-destination");

  const columns = [
    { title: "ID", key: "id" },
    { title: "Name", key: "name" },
    { title: "Country", key: "country" },
    { title: "Price", key: "price" },
    { title: "Duration", key: "duration" },
    { title: "Category", key: "category" },
  ];

  const actions = [
    {
      label: "Edit",
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (destination) => console.log("Edit", destination),
    },
    {
      label: "Delete",
      className: "bg-red-500 text-white hover:bg-red-600",
      onClick: (destination) => console.log("Delete", destination),
    },
  ];

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="flex mb-4 gap-2">
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by name, country, or category"
        />
        <div className="ml-auto">
          <Button onClick={goToAddDestination}>Add Destination</Button>
        </div>
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