// src/components/Router/Router.jsx
import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import App from "../../App";
import AdminHome from "../Admin/AdminHome";
import UsersView from "../Admin/UsersView";
import TestimonialsView from "../Admin/TestimonialView";
import Destinations from "../Admin/Destinations";
import Layout from "../Admin/Layout";
import ContactView from "../Admin/ContactView";
import ChangePassword from "../Admin/ChangePassword";
import AddDestination from "../Admin/AddDestination";
import Dashboard from "../Tourist/Dashboard";
import TouristLayout from "../Tourist/Layout";
import Reviews from "../Tourist/Reviews";
import Profile from "../Tourist/Profile";
import DestinationSearch from "../Tourist/DestinationSearch";
import TripPlanner from "../Tourist/TripPlanner";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return isLoggedIn ? children : <Navigate to="/" />;
};

// Create routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Admin",
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminHome />,
      },
      {
        path: "adminhome",
        element: <AdminHome />,
      },
      {
        path: "users",
        element: <UsersView />,
      },
      {
        path: "testimonials",
        element: <TestimonialsView />,
      },
      {
        path: "contact",
        element: <ContactView />,
      },
      {
        path: "destinations",
        element: <Destinations />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
      {
        path: "add-destination",
        element: <AddDestination />,
      }
    ],
  },
  {
    path: "/Tourist",
    element: (
      <PrivateRoute>
        <TouristLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "touristhome",
        element: <Dashboard />,
      },
      {
        path: "reviews",
        element: <Reviews />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "DestinationSearch",
        element: <DestinationSearch />,
      },
      {
        path: "TripPlanner",
        element: <TripPlanner />,
      }
    ],
  },

]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}