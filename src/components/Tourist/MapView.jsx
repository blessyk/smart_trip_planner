import React from "react";

const MapView = ({ pointsOfInterest }) => {
  return (
    <div className="h-64 w-full bg-gray-200 rounded-md flex items-center justify-center">
      <p className="text-gray-500">Map Placeholder (Integrate Google Maps/Mapbox)</p>
      <div className="absolute top-8 left-4">
        {pointsOfInterest.map((poi, idx) => (
          <div key={idx} className="bg-white p-1 rounded shadow mb-1">
            {/* {poi.name} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;