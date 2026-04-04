const destinations = [
    {
        name: "Munnar",
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?fm=jpg&q=90&w=800",
        rating: 4.8
    },
    {
        name: "Alleppey",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?fm=jpg&q=90&w=800",
        rating: 4.7
    },
    {
        name: "Kochi",
        image: "https://images.unsplash.com/photo-1597047084897-51e81819a499?fm=jpg&q=90&w=800",
        rating: 4.6
    },
    {
        name: "Wayanad",
        image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?fm=jpg&q=90&w=800",
        rating: 4.7
    },
    {
        name: "Goa",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fm=jpg&q=90&w=800",
        rating: 4.9
    },
    {
        name: "Manali",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?fm=jpg&q=90&w=800",
        rating: 4.8
    },
    {
        name: "Jaipur",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?fm=jpg&q=90&w=800",
        rating: 4.6
    },
    {
        name: "Agra",
        image: "https://images.unsplash.com/photo-1587135991058-8816c06c5d9f?fm=jpg&q=90&w=800",
        rating: 4.7
    }
];

export default function Destinations() {
    return (
        <section className="py-16 px-6 md:px-16 bg-gray-50">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0A3D62] mb-10">
                Explore The Destinations
            </h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
                Discover handpicked destinations that offer breathtaking views, rich culture, and unforgettable experiences. Plan your next adventure with our top travel picks.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {destinations.map((place, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
                    >
                        <img
                            src={place.image}
                            alt={place.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold text-[#0A3D62] mb-2">
                                {place.name}
                            </h3>
                            <p className="text-yellow-500 mb-3">
                                ⭐ {place.rating}
                            </p>
                            <button className="bg-[#0A3D62] text-white px-4 py-2 rounded-full hover:bg-blue-900 transition">
                                View More
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}