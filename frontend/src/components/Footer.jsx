import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#3b28a7] text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center leading-relaxed">
        {/* Main footer text */}
        <p>
          Ministry of Micro, Small & Medium Enterprises, Government of India
        </p>
        <p className="mt-1">
          सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय, भारत सरकार
        </p>

        {/* Divider */}
        <hr className="border-gray-400 my-4 w-2/3 mx-auto" />

        {/* Copyright */}
        <p className="text-xs">
          © {new Date().getFullYear()} | All Rights Reserved |{" "}
          <a href="#" className="underline hover:text-gray-300">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className="underline hover:text-gray-300">
            Terms of Use
          </a>
        </p>
      </div>
    </footer>
  );
}
