import React, { useState, useEffect } from "react";
import View from "./View";
import Pagination from "./Pagination";
import Search from "./Search";
import useTable from "./Hooks/useTable";

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from API
  useEffect(() => {
    fetch("/API/users.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  // Use reusable table hook for search + pagination
  const { currentPage, setCurrentPage, totalPages, currentRows } = useTable(
    users,
    searchTerm,
    ["name", "email", "role"],
    10 // rows per page
  );

  const columns = [
    { title: "ID", key: "id" },
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Role", key: "role" },
  ];

  const actions = [
    {
      label: "Edit",
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (user) => console.log("Edit", user),
    },
    {
      label: "Delete",
      className: "bg-red-500 text-white hover:bg-red-600",
      onClick: (user) => console.log("Delete", user),
    },
  ];

  return (
    <div className="p-4">
      {/* Top Bar with Search */}
      <div className="flex mb-4 gap-2">
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by name, email, or role"
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