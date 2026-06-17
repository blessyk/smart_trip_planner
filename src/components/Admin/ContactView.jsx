import React, { useEffect, useState } from "react";
import View from "./View";
import Pagination from "./Pagination";
import Search from "./Search";
import useTable from "./Hooks/useTable";
import DetailModal from "./DetailModal";
import api from "../Utils/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContactView() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      const response = await api.get("/contacts");
      if (response.data?.success) {
        setContacts(response.data.data.contacts || []);
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      toast.error("Failed to fetch contact messages");
    }
  };

  // Fetch data
  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (contactItem) => {
    if (window.confirm(`Are you sure you want to delete this message from "${contactItem.name}"?`)) {
      try {
        const response = await api.delete(`/contacts/${contactItem._id}`);
        if (response.data?.success) {
          toast.success("Contact message deleted successfully!");
          fetchContacts();
        }
      } catch (err) {
        console.error("Failed to delete contact message:", err);
        toast.error(err.response?.data?.message || "Failed to delete message");
      }
    }
  };

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    currentRows,
  } = useTable(contacts, searchTerm, ["name", "email", "message"]);

  const columns = [
    { title: "Name", key: "name" },
    { title: "Email", key: "email" },
    { title: "Phone", key: "phone" },
    { title: "Message", key: "message" },
  ];

  const actions = [
    {
      label: "View",
      className: "bg-green-500 text-white hover:bg-green-600",
      onClick: (contact) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
      },
    },
    {
      label: "Delete",
      className: "bg-red-500 text-white hover:bg-red-600",
      onClick: handleDelete,
    },
  ];

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Top Bar */}
      <div className="w-full mb-4">
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

      {/* Detail View Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Contact Message Details"
        data={selectedContact}
      />
    </div>
  );
}