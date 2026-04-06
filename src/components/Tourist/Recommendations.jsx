import React from "react";

const Recommendations = ({ places }) => {
  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-2">Recommended Places</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition"
          >
            <h3 className="font-bold">{place.name}</h3>
            <p className="text-gray-500">{place.category}</p>
            <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Add to Itinerary
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;