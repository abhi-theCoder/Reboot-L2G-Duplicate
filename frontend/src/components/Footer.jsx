import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import MainLogo from '../../public/Images/main-logo-01.png'

const Footer = () => {
  return (
    <footer className="bg-[#111827] text-gray-300 py-10 pb-0">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Left Section - Company Info */}
        <div className="flex flex-col space-y-4">
          <img src={MainLogo} alt="Company Logo" className="w-28" />
          <p className="text-sm">
            Book 60 days in advance and save up to 40% on international flights.
          </p>
        </div>

        {/* Center - Quick Links */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">Quick Links</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Tours</a></li>
            <li><a href="#" className="hover:text-white">Destinations</a></li>
            <li><a href="#" className="hover:text-white">Blog</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Center - Support */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">Support</h2>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">FAQs</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Refund Policy</a></li>
          </ul>
        </div>

        {/* Right Section - Contact Info */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-3">Contact Info</h2>
          <p className="flex items-center gap-2 mb-5"><FaPhone /> +1 (555) 123-4567</p>
          <p className="flex items-center gap-2 mb-5"><FaEnvelope /> support@travelease.com</p>
          <p className="flex items-center gap-2 mb-5"><FaMapMarkerAlt /> 123 Travel Street, City, Country</p>
        </div>
      </div>
      <div className="h-14 bg-[#0B111C] mt-9"></div>
    </footer>
  );
};

export default Footer;
