import React from "react";

const ItineraryPlanner = ({ days }) => {
  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-2">Itinerary Planner</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {days.map((day, idx) => (
          <div key={idx} className="bg-white p-4 rounded-md shadow-md">
            <h3 className="font-bold mb-2">Day {idx + 1}</h3>
            <ul className="list-disc list-inside">
              {day.places.map((place, i) => (
                <li key={i}>{place}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryPlanner;