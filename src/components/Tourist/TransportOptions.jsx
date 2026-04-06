import React from "react";

const TransportOptions = ({ options }) => {
  return (
    <div className="my-4">
      <h2 className="text-xl font-semibold mb-2">Transport Options</h2>
      <div className="flex gap-4 flex-wrap">
        {options.map((option) => (
          <div
            key={option.id}
            className="bg-white p-3 rounded-md shadow-md hover:shadow-lg"
          >
            <p className="font-bold">{option.type}</p>
            <p>{option.estimatedTime} mins - ${option.cost}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransportOptions;