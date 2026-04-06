import React, { useEffect, useState } from "react";
import View from "./View";
import Pagination from "./Pagination";
import Search from "./Search";
import useTable from "./Hooks/useTable";

export default function ContactView() {
  const [contact, setContact] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data
  useEffect(() => {
    fetch("/API/contacts.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setContact(data))
      .catch((err) => console.error("Failed to fetch contacts:", err));
  }, []);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentRows,
  } = useTable(contact, searchTerm, ["name", "email", "message"]);

  const columns = [
    { title: "ID", key: "id" },
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Message", key: "message" },
  ];

  const actions = [
    {
      label: "Delete",
      className: "bg-red-500 text-white hover:bg-red-600",
      onClick: (contact) => console.log("Delete", contact),
    },
  ];

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="flex mb-4 gap-2">
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