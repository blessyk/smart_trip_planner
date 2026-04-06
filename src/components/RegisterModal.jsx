import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import Input from "./Input";
import { registerSchema } from "../components/Utils/Validation";
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterModal({ onSwitch, closeModal }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const password = watch("password");
  const email = watch("email");

  // Live email uniqueness check
  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];
  const emailExists = email && existingUsers.some((user) => user.email === email);

  // Password strength logic
  const getStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(password);
  const widthPercent = (strength / 4) * 100;

  const strengthColor = [
    "bg-gray-300",   // 0
    "bg-red-500",    // 1
    "bg-orange-400", // 2
    "bg-yellow-400", // 3
    "bg-green-500",  // 4
  ][strength] || "bg-gray-300";

  const onSubmit = (data) => {
    if (emailExists) {
      toast.error("Email already registered!");
      return;
    }
    localStorage.setItem("users", JSON.stringify([...existingUsers, data]));
    reset();
    onSwitch();
    toast.success("Registered successfully!");
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-[#0A3D62] mb-6">Register</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              placeholder="Enter your name"
              {...register("name")}
              error={errors.name?.message}
            />

            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              error={errors.email?.message || (emailExists && "Email already registered")}
            />

            <Input
              type="tel"
              placeholder="Enter phone number"
              {...register("phone")}
              error={errors.phone?.message}
            />

            <Input
              placeholder="Enter your aadhaar number"
              {...register("aadhaar")}
              error={errors.aadhaar?.message}
            />

            <Input
              type="password"
              placeholder="Enter password"
              {...register("password")}
              error={errors.password?.message}
            />

            {/* Password strength bar with animation */}
            <div className="w-full bg-gray-300 h-2 rounded mt-1 overflow-hidden">
              <div
                className={`h-2 rounded transition-all duration-500 ease-in-out transition-colors ${strengthColor}`}
                style={{ width: `${widthPercent}%` }}
              ></div>
            </div>

            {/* Live password hints */}
            {password && (
              <p className="text-sm text-gray-600 mt-1">
                {password.length < 8 && "• At least 8 characters. "} 
                {!/[A-Z]/.test(password) && "• Include an uppercase letter. "} 
                {!/[0-9]/.test(password) && "• Include a number. "} 
                {!/[^A-Za-z0-9]/.test(password) && "• Include a special character. "}
              </p>
            )}

            <Input
              type="password"
              placeholder="Confirm password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <button
              type="submit"
              disabled={!isValid || emailExists}
              className={`w-full py-2 rounded-lg transition ${
                isValid && !emailExists
                  ? "bg-[#0A3D62] text-white hover:bg-blue-900"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              Register
            </button>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}