import { useSelector } from "react-redux";

const Dashboard = () => {
   const { isLoggedIn, user } = useSelector((state) => state.auth);
  if (!isLoggedIn) return <Navigate to="/" />;
  return (
    <main className="p-6 overflow-y-auto">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[
          { title: "Trips Planned", value: 12 },
          { title: "Upcoming Trips", value: 3 },
          { title: "Places Visited", value: 25 },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded shadow">
            <h2 className="text-gray-500">{stat.title}</h2>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Trip */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Upcoming Trip</h2>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">Goa Beach Vacation</h3>
            <p className="text-gray-500">15 May - 20 May</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            View Details
          </button>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Recommended Destinations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Maldives", type: "Tropical paradise", img: "beach" },
            { name: "Manali", type: "Snowy mountains", img: "mountain" },
            { name: "Dubai", type: "Luxury city life", img: "city" },
          ].map((place, i) => (
            <div key={i} className="bg-white rounded shadow overflow-hidden">
              <img
                src={`https://source.unsplash.com/400x250/?${place.img}`}
                alt={place.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold">{place.name}</h3>
                <p className="text-gray-500 text-sm">{place.type}</p>
                <button className="mt-3 w-full bg-blue-600 text-white py-1 rounded">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

        <ul className="space-y-3">
          <li className="flex justify-between">
            <span>Booked hotel in Goa</span>
            <span className="text-gray-400 text-sm">2 days ago</span>
          </li>
          <li className="flex justify-between">
            <span>Reviewed Manali trip</span>
            <span className="text-gray-400 text-sm">5 days ago</span>
          </li>
          <li className="flex justify-between">
            <span>Added new trip to Kerala</span>
            <span className="text-gray-400 text-sm">1 week ago</span>
          </li>
        </ul>
      </div>

    </main>
  );
};

export default Dashboard;