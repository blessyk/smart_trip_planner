import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slide1 from "../assets/images/slide1.jpeg"
import slide2 from "../assets/images/slide2.jpg"
import slide3 from "../assets/images/slide3.jpg"
import slide4 from "../assets/images/slide4.png"
import slide5 from "../assets/images/slide5.jpg"

const slides = [
  {
    id: 1,
    image: slide1,
    title: "Explore Beautiful Beaches",
    text: "Relax and unwind at the world's most stunning beaches."
  },
  {
    id: 2,
    image: slide2,
    title: "Adventure in the Mountains",
    text: "Experience thrilling hikes and breathtaking views."
  },
  {
    id: 3,
    image: slide3,
    title: "Discover Urban Wonders",
    text: "Explore vibrant cities and cultural landmarks."
  },
  {
    id: 4,
    image: slide4,
    title: "Reconnect with Nature",
    text: "Find peace in lush green forests and wildlife."
  },
  {
    id: 5,
    image: slide5,
    title: "Escape to Tropical Islands",
    text: "Enjoy crystal clear waters and sunny skies."
  }
];

// Animation variants
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0
  })
};

export default function Header() {
  const [[current, direction], setCurrent] = useState([0, 0]);

  const paginate = (dir) => {
    setCurrent(([prev]) => {
      const newIndex = (prev + dir + slides.length) % slides.length;
      return [newIndex, dir];
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      <AnimatePresence custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6 }}
          className="absolute w-full h-full">
          <img
            src={slides[current].image}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0A3D62]/60 flex flex-col justify-center items-center text-center text-white px-4">
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-5xl font-bold mb-4">
              {slides[current].title}
            </motion.h1>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl max-w-2xl">
              {slides[current].text}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>
      <button
        onClick={() => paginate(-1)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-3 rounded-full"
      >
        ❮
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/60 text-white p-3 rounded-full"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 w-full flex justify-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent([index, index > current ? 1 : -1])}
            className={`w-3 h-3 rounded-full ${
              current === index ? "bg-[#F4E1C1]" : "bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}