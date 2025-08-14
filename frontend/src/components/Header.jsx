import React, { useState } from "react";
import logo from "../assets/logo.jpg"; // your logo path
import { FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdown, setDropdown] = useState({
    documents: false,
    verify: false,
    update: false,
  });

  return (
   <header className="bg-[#3a2ca0] text-white fixed top-0 left-0 w-full z-50 shadow-lg">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="MSME Logo" className="h-12" />
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          <FaBars />
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <a href="#">Home</a>
          <a href="#">NIC Code</a>
          <a href="#">Useful Documents</a>
          <a href="#">Print / Verify</a>
          <a href="#">Update Details</a>
          <a href="#">Login</a>
        </nav>
      </div>

      {/* Mobile Side Menu */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white text-black shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4 bg-[#3a2ca0] text-white">
          <FaTimes
            className="text-2xl cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* Menu Items */}
        <ul className="p-4 space-y-4">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">NIC Code</a>
          </li>
          <li>
            <button
              onClick={() =>
                setDropdown((prev) => ({
                  ...prev,
                  documents: !prev.documents,
                }))
              }
              className="flex justify-between w-full"
            >
              Useful Documents <FaChevronDown />
            </button>
            {dropdown.documents && (
              <ul className="ml-4 mt-2 space-y-2 text-sm">
                <li><a href="#">Document 1</a></li>
                <li><a href="#">Document 2</a></li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() =>
                setDropdown((prev) => ({
                  ...prev,
                  verify: !prev.verify,
                }))
              }
              className="flex justify-between w-full"
            >
              Print / Verify <FaChevronDown />
            </button>
            {dropdown.verify && (
              <ul className="ml-4 mt-2 space-y-2 text-sm">
                <li><a href="#">Verify 1</a></li>
                <li><a href="#">Verify 2</a></li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() =>
                setDropdown((prev) => ({
                  ...prev,
                  update: !prev.update,
                }))
              }
              className="flex justify-between w-full"
            >
              Update Details <FaChevronDown />
            </button>
            {dropdown.update && (
              <ul className="ml-4 mt-2 space-y-2 text-sm">
                <li><a href="#">Update 1</a></li>
                <li><a href="#">Update 2</a></li>
              </ul>
            )}
          </li>
          <li>
            <a href="#">Login</a>
          </li>
        </ul>
      </div>
    </header>
  );
}
