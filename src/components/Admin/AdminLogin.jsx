import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, fetchUserProfile, logout } from "../redux/authSlice";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function AdminLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      const profileResult = await dispatch(fetchUserProfile()).unwrap();
      
      const userRole = profileResult?.data?.user?.role;
      if (userRole === "admin") {
        toast.success("Admin Login successful!");
        navigate("/Admin");
      } else {
        toast.error("Access denied. Admin role required.");
        dispatch(logout());
      }
    } catch (err) {
      const errorMsg = err?.message || err?.error || "Invalid email or password";
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#092537] px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0f344d] border border-[#1b4e70] rounded-2xl p-8 w-full max-w-md shadow-2xl relative"
      >
        {/* Decorative badge */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-[#092537] px-6 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-md border border-[#092537]">
          Admin Portal
        </div>

        <h2 className="text-3xl font-extrabold text-white text-center mt-4 mb-2">
          Control Center
        </h2>
        <p className="text-gray-400 text-center text-sm mb-8">
          Sign in to access administrative tools
        </p>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="admin@smarttrip.com"
              {...register("email")}
              className={`w-full px-4 py-3 rounded-lg border bg-[#092537] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition ${
                errors.email ? "border-red-500" : "border-[#1b4e70]"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full px-4 py-3 rounded-lg border bg-[#092537] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition ${
                errors.password ? "border-red-500" : "border-[#1b4e70]"
              }`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm mt-1 block">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg bg-[#d4af37] text-[#092537] font-bold text-lg hover:bg-[#ffe066] transition-all duration-200 shadow-lg ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.01]"
            }`}
          >
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#1b4e70] pt-6">
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
