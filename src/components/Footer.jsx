import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0A3D62] text-white px-6 md:px-16 py-10">
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold mb-3">SmartTripPlanner</h2>
          <p className="text-gray-300 text-sm">
            Plan your perfect trip with our smart travel planner. Discover
            destinations, create itineraries, and explore the world with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="#" className="hover:text-[#F4E1C1]">Home</a></li>
            <li><a href="#" className="hover:text-[#F4E1C1]">About</a></li>
            <li><a href="#" className="hover:text-[#F4E1C1]">Destinations</a></li>
            <li><a href="#" className="hover:text-[#F4E1C1]">Testimonials</a></li>
            <li><a href="#" className="hover:text-[#F4E1C1]">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-gray-300 text-sm">📍 Kochi, Kerala, India</p>
          <p className="text-gray-300 text-sm">📧 support@smarttripplanner.com</p>
          <p className="text-gray-300 text-sm">📞 +91 98765 43210</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-[#F4E1C1] hover:text-[#0A3D62] transition">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-[#F4E1C1] hover:text-[#0A3D62] transition">
              <FaInstagram />
            </a>
            <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-[#F4E1C1] hover:text-[#0A3D62] transition">
              <FaTwitter />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/20 mt-8 pt-4 text-center text-gray-300 text-sm">
        © 2026 SmartTripPlanner. All rights reserved.
      </div>
    </footer>
  );
}