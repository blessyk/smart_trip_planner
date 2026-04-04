import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Layout from "./Layout";
import UsersView from "./UsersView";
import TestimonialsView from "./TestimonialView";
import Destinations from "./Destinations";
import { logout } from "../redux/authSlice";

export default function AdminHome() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [activePage, setActivePage] = useState("view-users");
  if (!isLoggedIn) return <Navigate to="/" />;

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleNavigate = (key) => setActivePage(key);

  const renderContent = () => {
    switch (activePage) {
      case "view-users":
        return <UsersView />;
      case "view-testimonials":
        return <TestimonialsView />;
      case "view-destinations":
        return <Destinations />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <Layout
      header={<Header onLogout={handleLogout} user={user} />}
      sidebar={<Sidebar active={activePage} onNavigate={handleNavigate} />}
    >
      {renderContent()}
    </Layout>
  );
}