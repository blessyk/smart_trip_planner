import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";
import View from "./View";
import Pagination from "./Pagination";
import Search from "./Search";
import api from "../Utils/api";
import DetailModal from "./DetailModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Dynamic Query States
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit,
        search,
        sortBy,
        order,
      }).toString();

      const response = await api.get(`/destinations?${params}`);
      if (response.data?.success) {
        const list = response.data.data.destinations || [];

        if (response.data.pagination) {
          // Server-side pagination is active
          setDestinations(list);
          setTotalPages(response.data.pagination.pages || 1);
          setTotalItems(response.data.pagination.total || 0);
        } else {
          // Client-side fallback if server hasn't been restarted
          let processed = [...list];

          // 1. Search filter
          if (search) {
            const q = search.toLowerCase();
            processed = processed.filter(
              (p) =>
                p.name?.toLowerCase().includes(q) ||
                p.country?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q)
            );
          }

          // 2. Sorting
          processed.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            if (sortBy === "price") {
              return order === "asc" ? valA - valB : valB - valA;
            } else if (typeof valA === "string") {
              return order === "asc"
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
            } else {
              return order === "asc"
                ? new Date(valA) - new Date(valB)
                : new Date(valB) - new Date(valA);
            }
          });

          // 3. Paginate
          setTotalItems(processed.length);
          const pages = Math.ceil(processed.length / limit);
          setTotalPages(pages || 1);

          const startIdx = (page - 1) * limit;
          const paginatedList = processed.slice(startIdx, startIdx + limit);
          setDestinations(paginatedList);
        }
      }
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
      toast.error("Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [page, limit, search, sortBy, order]);

  const handleDelete = async (destination) => {
    if (window.confirm(`Are you sure you want to delete "${destination.name}"?`)) {
      try {
        const response = await api.delete(`/destinations/${destination._id}`);
        if (response.data?.success) {
          toast.success("Destination deleted successfully!");
          fetchDestinations();
        }
      } catch (err) {
        console.error("Failed to delete destination:", err);
        toast.error(err.response?.data?.message || "Failed to delete destination");
      }
    }
  };

  const goToAddDestination = () => navigate("/Admin/add-destination");

  const columns = [
    { title: "Name", key: "name" },
    { title: "Country", key: "country" },
    { title: "Price", key: "price" },
    { title: "Duration", key: "duration" },
    { title: "Category", key: "category" },
  ];

  const actions = [
    {
      label: "View",
      className: "bg-green-500 text-white hover:bg-green-600",
      onClick: (destination) => {
        setSelectedDestination(destination);
        setIsModalOpen(true);
      },
    },
    {
      label: "Edit",
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (destination) => navigate(`/Admin/edit-destination/${destination._id}`, { state: { destination } }),
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
      
      {/* Dynamic Controls Toolbar Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="w-full md:w-1/3">
          <Search
            searchTerm={search}
            setSearchTerm={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search by name, country, or category..."
          />
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Sort By</span>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            className="border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-700 text-sm bg-white"
          >
            <option value="createdAt">Date Added</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
          </select>
        </div>

        {/* Order */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Order</span>
          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
            className="border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-700 text-sm bg-white"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>

        {/* Per Page Limit */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase">Per Page</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
            className="border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-700 text-sm bg-white"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Add Destination Button */}
        <div className="w-full md:w-auto text-right">
          <Button onClick={goToAddDestination}>Add Destination</Button>
        </div>

      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0A3D62]"></div>
        </div>
      ) : destinations.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center shadow-sm max-w-md mx-auto">
          <p className="text-slate-500">No destinations found matching your criteria.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <View columns={columns} data={destinations} actions={actions} />

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Detail View Modal */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Destination Details"
        data={selectedDestination}
      />
    </div>
  );
}