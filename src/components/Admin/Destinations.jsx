import React, { useState } from "react";
import View from "./View";
import AddDestination from "./AddDestination";

export default function Destinations() {
  const [destinations, setDestinations] = useState([
    {
      id: 1,
      name: "Paris",
      country: "France",
      price: "$1200",
      duration: "5 days",
      category: "Romantic",
    },
    {
      id: 2,
      name: "Tokyo",
      country: "Japan",
      price: "$1500",
      duration: "7 days",
      category: "Cultural",
    },
    {
      id: 3,
      name: "Sydney",
      country: "Australia",
      price: "$1800",
      duration: "6 days",
      category: "Adventure",
    },
  ]);

  const columns = [
    { title: "ID", key: "id" },
    { title: "Name", key: "name" },
    { title: "Country", key: "country" },
    { title: "Price", key: "price" },
    { title: "Duration", key: "duration" },
    { title: "Category", key: "category" },
  ];

  const actions = [
    {
      label: "Edit",
      className: "bg-blue-500 text-white hover:bg-blue-600",
      onClick: (destination) => console.log("Edit", destination),
    },
    {
      label: "Delete",
      className: "bg-red-500 text-white hover:bg-red-600",
      onClick: (destination) => console.log("Delete", destination),
    },
  ];

   const handleSave = (newDest) => {
    const nextId = destinations.length > 0 ? destinations[destinations.length - 1].id + 1 : 1;
    setDestinations([...destinations, { id: nextId, ...newDest }]);
  };

  return (
    
        <View columns={columns} data={destinations} actions={actions} />
  )
  
}