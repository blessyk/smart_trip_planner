import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import Card from "./Card";
import { FaUser, FaGlobe, FaStar, FaEnvelope } from "react-icons/fa";
import UserVisitsChart from "./UserVisitsChart";

export default function AdminHome() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  if (!isLoggedIn) return <Navigate to="/" />;

  const [metrics, setMetrics] = useState({
    users: 0,
    destinations: 0,
    testimonials: 0,
    contacts: 0
  });

  const [visits, setVisits] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch("/API/users.json").then(res => res.json()),
      fetch("/API/destinations.json").then(res => res.json()),
      fetch("/API/testimonials.json").then(res => res.json()),
      fetch("/API/contacts.json").then(res => res.json()),
      fetch("/API/visits.json").then(res => res.json()),
    ])
      .then(([users, destinations, testimonials, contacts, visits]) => {
        setMetrics({
          users: users.length,
          destinations: destinations.length,
          testimonials: testimonials.length,
          contacts: contacts.length
        });
        setVisits(visits);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      </div>

      <p className="mb-6 text-gray-700">Welcome, {user?.name}!</p>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card title="Users" value={metrics.users} icon={<FaUser />} />
        <Card title="Destinations" value={metrics.destinations} icon={<FaGlobe />} />
        <Card title="Testimonials" value={metrics.testimonials} icon={<FaStar />} />
        <Card title="Contacts" value={metrics.contacts} icon={<FaEnvelope />} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">User Visits</h2>
          <UserVisitsChart data={visits} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 h-64 flex items-center justify-center">
          User Registrations Chart
        </div>
      </div>
    </div>
  );
}