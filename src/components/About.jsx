export default function About() {

return (
    <section className="w-full py-16 px-6 md:px-16 bg-white">
      <div className="flex flex-col md:flex-row items-center gap-10">

        {/* Left Content */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A3D62] mb-4">
            Smart Trip Planner
          </h2>

          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Our Smart Trip Planner helps you design the perfect journey with ease.
            Discover destinations, create personalized itineraries, and manage
            your travel plans all in one place. Whether you're exploring beaches,
            mountains, or vibrant cities, we make your travel smarter, faster,
            and more enjoyable.
          </p>

          <p className="text-gray-600 text-lg leading-relaxed">
            Plan your trips efficiently with real-time suggestions, optimized
            routes, and curated travel experiences tailored just for you.
          </p>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?fm=jpg&q=90&w=800"
            alt="travel animation"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>

      </div>
    </section>
  );
}