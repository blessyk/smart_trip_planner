import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [modal, setModal] = useState(null);
    console.log(modal)
    return (
        <nav className="fixed top-0 bg-[#0A3D62] text-white px-6 md:px-12 py-5 shadow-md z-50 w-full">
            <div className="flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 font-bold">
                    <img
                        src="/logo.png"
                        alt="logo"
                        className="w-60 h-10 object-container"
                    />
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex gap-6 text-lg font-medium">
                        <li><a href="#" className="hover:text-[#F4E1C1]">Home</a></li>
                        <li><a href="#about" className="hover:text-[#F4E1C1]">About</a></li>
                        <li><a href="#destinations" className="hover:text-[#F4E1C1]">Destinations</a></li>
                        <li><a href="#testimonialsandcontact" className="hover:text-[#F4E1C1]">Testimonials</a></li>
                        <li><a href="#testimonialsandcontact" className="hover:text-[#F4E1C1]">Contact</a></li>
                    </ul>
                    <button onClick={() => setModal("login")} className="bg-white text-[#0A3D62] px-4 py-1.5 rounded-full font-semibold hover:bg-white transition">
                        Login
                    </button>
                </div>
                <button
                    className="md:hidden text-2xl"
                    onClick={() => setIsOpen(!isOpen)}>
                    ☰
                </button>
            </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-4 flex flex-col gap-4 text-center">
                    <a href="#" className="hover:text-[#F4E1C1]">Home</a>
                    <a href="#about" className="hover:text-[#F4E1C1]">About</a>
                    <a href="#destinations" className="hover:text-[#F4E1C1]">Destinations</a>
                    <a href="#testimonialsandcontact" className="hover:text-[#F4E1C1]">Testimonials</a>
                    <a href="#testimonialsandcontact" className="hover:text-[#F4E1C1]">Contact</a>
                    <button onClick={() => setModal("login")} className="bg-white text-[#0A3D62] px-4 py-2 rounded-full font-semibold">
                        Login
                    </button>
                </div>
            )}
            {modal === "login" && (<LoginModal onSwitch={() => setModal("register")} closeModal={() => setModal(null)} />)}
            {modal === "register" && (<RegisterModal onSwitch={() => setModal("login")} closeModal={() => setModal(null)} />)}
        </nav>
    );
}
