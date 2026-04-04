// src/components/Router/Router.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import App from "../../App"; // your main landing page
import AdminHome from "../Admin/AdminHome";

// ✅ Protected route using Redux
const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to="/" />;
};

// Create routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Login / Home page
  },
  {
    path: "/adminhome",
    element: (
      <PrivateRoute>
        <AdminHome />
      </PrivateRoute>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}