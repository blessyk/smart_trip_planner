import React from "react";
import Button from "../Button";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-end items-center gap-2 mt-4">
      <Button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        className="bg-gray-300 text-black hover:bg-gray-400">
        Prev
      </Button>

      {pageNumbers.map((num) => (
        <Button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${
            num === currentPage
              ? "bg-[#1E3A8A] text-white"
              : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
        >
          {num}
        </Button>
      ))}

      <Button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        className="bg-gray-300 text-black hover:bg-gray-400"
      >
        Next
      </Button>
    </div>
  );
}