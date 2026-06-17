import React, { useState, useEffect } from "react";
import View from "./View";
import Pagination from "./Pagination";
import Search from "./Search";
import api from "../Utils/api";
import DetailModal from "./DetailModal";
import { toast } from "react-toastify";

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const limit = 10;

  const fetchUsers = async (page, search) => {
    try {
      const response = await api.get(
        `/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      );
      if (response.data?.success) {
        setUsers(response.data.data.users || []);
        setCurrentPage(response.data.pagination?.page || 1);
        setTotalPages(response.data.pagination?.pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error(err.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const columns = [
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Phone Number", key: "phone" },
    { title: "Aadhar", key: "aadharNumber" },
  ];

  const actions = [
    {
      label: "View",
      className: "bg-green-500 text-white hover:bg-green-600",
      onClick: (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
      },
    },
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
      <div className="w-full">
        <Search
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          placeholder="Search by name, email, phone, or Aadhar"
        />
      </div>

      {/* Table */}
      <View columns={columns} data={users} actions={actions} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Detail View Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Details"
        data={selectedUser}
      />
    </div>
  );
}