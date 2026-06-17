import React, { useState, useEffect } from "react";
import Input from "../Input";
import Button from "../Button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../Utils/api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaCloudUploadAlt, FaTrashAlt, FaSpinner } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  country: yup.string().required("Country is required"),
  category: yup.string().required("Category is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .string()
    .required("Price is required")
    .test("is-positive-number", "Price must be a positive number", (value) => {
      if (!value) return false;
      const parsed = parseFloat(value.replace(/,/g, ""));
      return !isNaN(parsed) && parsed > 0;
    }),
  duration: yup.string().required("Duration is required"),
  images: yup
    .array()
    .of(yup.string().url("Must be a valid URL").required("Image URL is required"))
    .min(1, "At least one image is required"),
});

const categories = ["Beach", "Adventure", "Cultural", "Wildlife", "Relaxation"];

export default function EditDestination() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageInputMethod, setImageInputMethod] = useState("upload"); // "upload" or "url"
  const [urlInput, setUrlInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      images: [],
    },
  });

  // Sync react-hook-form images value
  useEffect(() => {
    register("images");
  }, [register]);

  useEffect(() => {
    setValue("images", images, { shouldValidate: true });
  }, [images, setValue]);

  const populateForm = (dest) => {
    setValue("name", dest.name);
    setValue("country", dest.country);
    setValue("category", dest.category);
    setValue("description", dest.description);
    setValue("price", dest.price ? dest.price.toLocaleString("en-IN") : "");
    setValue("duration", dest.duration);
    setImages(dest.images || []);
  };

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/destinations/${id}`);
      if (response.data?.success) {
        populateForm(response.data.data.destination);
      }
    } catch (err) {
      console.error("Failed to fetch destination:", err);
      toast.error("Failed to load destination details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.destination) {
      populateForm(location.state.destination);
    } else {
      fetchDestination();
    }
  }, [id]);

  const handlePriceChange = (e) => {
    const raw = e.target.value.replace(/\D/g, ""); // remove non-digits
    const formatted = raw ? parseInt(raw).toLocaleString() : "";
    setValue("price", formatted, { shouldValidate: true });
  };

  const handleAddUrl = () => {
    if (!urlInput) return;
    if (!urlInput.startsWith("http://") && !urlInput.startsWith("https://")) {
      toast.error("Please provide a valid HTTP/HTTPS image URL");
      return;
    }
    setImages((prev) => [...prev, urlInput]);
    setUrlInput("");
    toast.success("Image URL added!");
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file!`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB size limit!`);
        continue;
      }

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await api.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data?.success) {
          uploadedUrls.push(response.data.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
        toast.error(err.response?.data?.message || `Failed to upload image: ${file.name}`);
      }
    }

    if (uploadedUrls.length > 0) {
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("Images uploaded successfully!");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, i) => i !== indexToRemove);
    setImages(updated);
  };

  const onSubmit = async (data) => {
    try {
      const priceNumber = parseFloat(data.price.replace(/,/g, ""));
      if (images.length === 0) {
        toast.error("Please upload or provide at least one image");
        return;
      }

      const payload = {
        ...data,
        price: priceNumber,
        images: images,
      };

      const response = await api.put(`/destinations/${id}`, payload);

      if (response.data?.success) {
        toast.success("Destination updated successfully!");
        setTimeout(() => {
          navigate("/Admin/destinations");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update destination");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <FaSpinner className="text-3xl text-[#0A3D62] animate-spin" />
          <p className="text-sm font-semibold text-slate-500">Loading destination data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h2 className="text-2xl font-bold text-center text-[#0A3D62] mb-6">
          Edit Destination
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Destination Name"
            placeholder="e.g. Bora Bora"
            {...register("name")}
            error={errors.name?.message}
          />

          <Input
            label="Country"
            placeholder="e.g. French Polynesia"
            {...register("country")}
            error={errors.country?.message}
          />

          {/* Category selection */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-slate-700">
              Category
            </label>
            <select
              {...register("category")}
              className={`w-full px-4 py-2 rounded-lg border bg-transparent text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D62] ${
                errors.category ? "border-red-500" : "border-slate-300"
              }`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-red-500 text-xs block mt-1">
                {errors.category.message}
              </span>
            )}
          </div>

          <Input
            label="Description"
            placeholder="Describe the highlights of this trip..."
            {...register("description")}
            error={errors.description?.message}
          />

          <Input
            label="Price (₹)"
            placeholder="e.g. 15,000"
            {...register("price")}
            error={errors.price?.message}
            onChange={handlePriceChange}
          />

          <Input
            label="Duration"
            placeholder="e.g. 5 days / 4 nights"
            {...register("duration")}
            error={errors.duration?.message}
          />

          {/* Image Upload Area */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-slate-700">
              Destination Images
            </label>
            
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="imageInputMethod"
                  value="upload"
                  checked={imageInputMethod === "upload"}
                  onChange={() => setImageInputMethod("upload")}
                  className="text-[#0A3D62] focus:ring-[#0A3D62]"
                />
                Upload File
              </label>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="imageInputMethod"
                  value="url"
                  checked={imageInputMethod === "url"}
                  onChange={() => setImageInputMethod("url")}
                  className="text-[#0A3D62] focus:ring-[#0A3D62]"
                />
                Provide URL
              </label>
            </div>

            <div className="space-y-4">
              {/* Conditional rendering based on method */}
              {imageInputMethod === "upload" ? (
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-browse-input"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-browse-input"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 cursor-pointer transition-colors duration-200 ${
                      uploading
                        ? "border-slate-300 bg-slate-100 cursor-not-allowed"
                        : "border-slate-300 hover:border-[#0A3D62] hover:bg-slate-50"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="text-2xl text-slate-500 animate-spin mb-2" />
                        <span className="text-xs font-semibold text-slate-500">Uploading images...</span>
                      </>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-3xl text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-600">Click to browse files</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Supports PNG, JPG, JPEG (Max 5MB)</span>
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
                    placeholder="Enter image URL..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-800 bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="px-4 py-2 bg-[#0A3D62] hover:bg-blue-900 text-white font-semibold text-sm rounded-lg transition-colors shadow"
                  >
                    Add URL
                  </button>
                </div>
              )}

              {/* Uploaded Images Preview Grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((url, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group bg-slate-100 shadow-sm">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-90 transition shadow-md"
                        title="Remove Image"
                      >
                        <FaTrashAlt className="text-[10px]" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errors.images && (
                <span className="text-red-500 text-xs block">
                  {errors.images.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 mt-6 gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition"
              onClick={() => navigate("/Admin/destinations")}
            >
              Cancel
            </button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
