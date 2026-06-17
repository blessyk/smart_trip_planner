import React, { useState, useEffect } from "react";
import View from "./View";
import Pagination from "./Pagination";
import Search from "./Search";
import useTable from "./Hooks/useTable";
import DetailModal from "./DetailModal";
import api from "../Utils/api";
import Button from "../Button";
import { toast, ToastContainer } from "react-toastify";
import { FaCloudUploadAlt, FaTrashAlt, FaSpinner, FaTimes } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function TestimonialsView() {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for creating a new testimonial
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: "", location: "", text: "", rating: 5, image: "" });
  const [imageInputMethod, setImageInputMethod] = useState("upload");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);

  const fetchTestimonials = async () => {
    try {
      const response = await api.get("/testimonials");
      if (response.data?.success) {
        setTestimonials(response.data.data.testimonials || []);
      }
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
      toast.error("Failed to fetch testimonials");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (testimonialItem) => {
    if (window.confirm(`Are you sure you want to delete the testimonial from "${testimonialItem.name}"?`)) {
      try {
        const response = await api.delete(`/testimonials/${testimonialItem._id}`);
        if (response.data?.success) {
          toast.success("Testimonial deleted successfully!");
          fetchTestimonials();
        }
      } catch (err) {
        console.error("Failed to delete testimonial:", err);
        toast.error(err.response?.data?.message || "Failed to delete testimonial");
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data?.success) {
        setNewTestimonial((prev) => ({ ...prev, image: response.data.url }));
        toast.success("Image uploaded successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleAddUrl = () => {
    if (!urlInput) return;
    if (!urlInput.startsWith("http://") && !urlInput.startsWith("https://")) {
      toast.error("Please provide a valid HTTP/HTTPS URL");
      return;
    }
    setNewTestimonial((prev) => ({ ...prev, image: urlInput }));
    toast.success("Image URL applied!");
  };

  const handleCreateTestimonial = async (e) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.location || !newTestimonial.text || !newTestimonial.image) {
      toast.error("Please fill in all fields and provide an image");
      return;
    }

    try {
      const response = await api.post("/testimonials", newTestimonial);
      if (response.data?.success) {
        toast.success("Testimonial added successfully!");
        setIsAddModalOpen(false);
        setNewTestimonial({ name: "", location: "", text: "", rating: 5, image: "" });
        setUrlInput("");
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add testimonial");
    }
  };

  const { currentPage, setCurrentPage, totalPages, currentRows } = useTable(
    testimonials,
    searchTerm,
    ["name", "location", "text"],
  );

  const columns = [
    { title: "Name", key: "name" },
    { title: "Location", key: "location" },
    { title: "Rating", key: "rating" },
    { title: "Message", key: "text" },
  ];

  const actions = [
    {
      label: "View",
      className: "bg-green-500 text-white hover:bg-green-600",
      onClick: (testimonial) => {
        setSelectedTestimonial(testimonial);
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
      {/* Top Bar with Search & Add Button */}
      <div className="flex gap-2 mb-4">
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search by name, location, or text"
        />
        <div className="ml-auto">
          <Button onClick={() => setIsAddModalOpen(true)}>Add Testimonial</Button>
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

      {/* Detail View Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Testimonial Details"
        data={selectedTestimonial}
      />

      {/* Add Testimonial Form Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden flex flex-col border border-slate-200 max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Add Testimonial</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <FaTimes className="text-base" />
              </button>
            </div>

            <form onSubmit={handleCreateTestimonial} className="flex-grow overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Author Name</label>
                <input
                  type="text"
                  required
                  value={newTestimonial.name}
                  onChange={(e) => setNewTestimonial((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Mike Taylor"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Location / Role</label>
                <input
                  type="text"
                  required
                  value={newTestimonial.location}
                  onChange={(e) => setNewTestimonial((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Rating (1-5)</label>
                <select
                  value={newTestimonial.rating}
                  onChange={(e) => setNewTestimonial((prev) => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] bg-white"
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Message Text</label>
                <textarea
                  required
                  value={newTestimonial.text}
                  onChange={(e) => setNewTestimonial((prev) => ({ ...prev, text: e.target.value }))}
                  placeholder="Write feedback..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] bg-white"
                />
              </div>

              {/* Hybrid Image input */}
              <div>
                <label className="block mb-1 text-sm font-semibold text-slate-700">Author Picture</label>
                <div className="flex gap-4 mb-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="imageInputMethodModal"
                      checked={imageInputMethod === "upload"}
                      onChange={() => setImageInputMethod("upload")}
                      className="text-[#0A3D62] focus:ring-[#0A3D62]"
                    />
                    Upload File
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="imageInputMethodModal"
                      checked={imageInputMethod === "url"}
                      onChange={() => setImageInputMethod("url")}
                      className="text-[#0A3D62] focus:ring-[#0A3D62]"
                    />
                    Provide URL
                  </label>
                </div>

                {imageInputMethod === "upload" ? (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="modal-browse-input"
                      disabled={uploading}
                    />
                    <label
                      htmlFor="modal-browse-input"
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors duration-200 ${
                        uploading
                          ? "border-slate-300 bg-slate-100 cursor-not-allowed"
                          : "border-slate-300 hover:border-[#0A3D62] hover:bg-slate-50"
                      }`}
                    >
                      {uploading ? (
                        <>
                          <FaSpinner className="text-xl text-slate-500 animate-spin mb-1" />
                          <span className="text-[10px] font-semibold text-slate-500">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <FaCloudUploadAlt className="text-2xl text-slate-400 mb-1" />
                          <span className="text-[10px] font-semibold text-slate-600">Click to browse file</span>
                        </>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Paste avatar URL..."
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-800 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="px-3 py-1.5 bg-[#0A3D62] hover:bg-blue-900 text-white font-semibold text-xs rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Avatar Preview */}
                {newTestimonial.image && (
                  <div className="mt-3 flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-150">
                    <img
                      src={newTestimonial.image}
                      alt="Avatar Preview"
                      className="w-10 h-10 rounded-full object-cover border"
                      onError={(e) => {
                        e.target.src = "https://randomuser.me/api/portraits/men/32.jpg";
                      }}
                    />
                    <span className="text-xs text-slate-500 truncate flex-1">{newTestimonial.image}</span>
                    <button
                      type="button"
                      onClick={() => setNewTestimonial((prev) => ({ ...prev, image: "" }))}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FaTrashAlt className="text-xs" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200 mt-6 gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0A3D62] hover:bg-blue-900 text-white rounded-lg text-sm font-semibold transition shadow"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}