import React from "react";

const Weather = ({ current, forecast }) => {
  return (
    <div className="my-4 bg-white p-4 rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-2">Weather Updates</h2>
      <p className="font-bold">Today: {current.temp}°C, {current.condition}</p>
      <div className="flex gap-4 mt-2">
        {forecast.map((day, idx) => (
          <p key={idx} className="text-gray-500">{day.day}: {day.temp}°C</p>
        ))}
      </div>
    </div>
  );
};

export default Weather;