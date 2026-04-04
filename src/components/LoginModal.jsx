import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import Input from "./Input";
import "react-toastify/dist/ReactToastify.css";
import { loginSuccess } from "../components/redux/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Yup validation schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export default function LoginModal({ closeModal, onSwitch, onLogin }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onChange", 
  });

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (!user) {
      toast.error("Invalid email or password");
      return;
    }
    toast.success("Login successful!");
    closeModal();
    dispatch(loginSuccess(user))
    console.log(isLoggedIn)
    navigate("/adminhome") 
    // Optional callback for Redux or navigation
    if (onLogin) onLogin(user);
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl p-8 w-full max-w-md relative shadow-lg">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-[#0A3D62] mb-6">Login</h2>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              error={errors.email?.message}
            />

            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              error={errors.password?.message}
            />

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-[#0A3D62] text-white hover:bg-blue-900 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Not registered?{" "}
            <button
              type="button"
              onClick={onSwitch}
              className="text-[#0A3D62] font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </>
  );
}