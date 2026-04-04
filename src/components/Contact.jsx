export default function Contact() {
    
  return (
    <div className="bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-[#0A3D62] mb-6">Contact Us</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
        />
        <textarea
          placeholder="Message"
          rows="4"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
        ></textarea>
        <button
          type="submit"
          className="w-full bg-[#0A3D62] text-white py-2 rounded-lg hover:bg-blue-900 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}