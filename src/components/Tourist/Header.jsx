import { useSelector } from "react-redux";

const Header = ({ setIsOpen }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <h1 className="text-xl font-semibold">
          Welcome, {user?.name} 👋
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="hidden sm:block border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <img
          src="https://i.pravatar.cc/40"
          alt="user"
          className="rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;