import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState("");

  const handleSearch = () => onSearch({ destination, dates });

  return (
    <div className="flex gap-4 p-4 bg-gray-100 rounded-md shadow-md">
      <input
        type="text"
        placeholder="Search Destination"
        className="flex-1 p-2 border rounded-md focus:outline-none"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        type="text"
        placeholder="Select Dates"
        className="p-2 border rounded-md focus:outline-none"
        value={dates}
        onChange={(e) => setDates(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default Search;