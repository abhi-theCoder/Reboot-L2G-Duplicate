import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MainLogo from '../../public/Images/main-logo-02-new.png';
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Simply check if token exists
    const token = localStorage.getItem("Token");
    if (token) {
      // Assume logged in, but you may want to store user info in localStorage or context to show name
      setUser({ name: "User" }); // Placeholder name, replace with actual user data if available
    } else {
      setUser(null);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const logout = () => {
    localStorage.removeItem("Token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navLinks = (
    <>
      {[
        { path: "/", label: "Home" },
        { path: "/About", label: "About Us" },
        { path: "/leisure-tour", label: "Leisure Tour" },
        { path: "/MedicalTourismSection", label: "Medical Tour" },
        { path: "/l2g-services", label: "L2G ad services" },
        { path: "/customer-forum", label: "Customer Forum" },
        { path: "/community-services", label: "Community Services" },
        { path: "/connect-us", label: "Connect Us" }
      ].map((link) => (
        <li key={link.path}>
          <NavLink
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "!text-[#F4B41A] text-base lg:text-xl font-bold hover:!text-[#F4B41A]"
                : "text-white text-base lg:text-xl font-bold border-0 !outline-0 hover:text-[#F4B41A] transition-all duration-300"
            }
            onClick={() => setIsMobileMenuOpen(false)} 
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </>
  );

  return (
    <>
      <div className="flex justify-between items-center px-4 sm:px-6 lg:px-12 py-3 relative z-50">
        <div className="flex-shrink-0">
          <Link to='/' className="block">
            <img src={MainLogo} alt="Main Logo" className="h-12 sm:h-16" />
          </Link>
        </div>

        <div className="flex-grow flex justify-center mx-4">
          <p className="bg-[#011A4D] max-w-[800px] w-full py-3 sm:py-5 px-4 text-center text-white font-bold text-lg sm:text-2xl lg:text-3xl rounded-t-2xl shadow-lg hidden md:block">
            L2g Cruise & Cure Travel Management Pvt. Ltd.
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-4">
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#011A4D] text-3xl p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#011A4D]"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {!user ? (
            <div className="flex">
              <Link to="/login">
                <li className="list-none flex items-center gap-2 bg-[#011A4D] text-white rounded-full px-4 py-2 text-base sm:text-lg font-medium hover:shadow-lg hover:scale-105 transition duration-300 cursor-pointer">
                  <FaUser className="w-5 h-5 sm:w-6 sm:h-6" />
                  Login
                </li>
              </Link>
            </div>
          ) : (
            <div className="relative z-50" ref={dropdownRef}>
              <div
                tabIndex={0}
                role="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <div className="avatar">
                  <span className="flex items-center gap-2 bg-[#011A4D] text-white rounded-full px-4 py-2 text-base sm:text-lg font-medium hover:shadow-lg hover:scale-105 transition duration-300 cursor-pointer">
                    <FaUser className="w-5 h-5 sm:w-6 sm:h-6" />
                    {user.name}
                  </span>
                </div>
              </div>
              {isDropdownOpen && (
                <div className="dropdown-content menu w-full p-0">
                  <ul
                    tabIndex={0}
                    className="bg-[#D9D9D9] rounded-box z-[100] w-[180px] p-2 shadow flex flex-col gap-2 absolute right-0 top-full mt-2 rounded-lg"
                  >
                    <li className="border-b border-[#113A5F] pb-2">
                      <Link to='/' className="text-md text-[#113A5F] font-bold" onClick={() => setIsDropdownOpen(false)}>
                        Track Your Booking
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="text-md text-[#113A5F] font-bold cursor-pointer"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:flex justify-center bg-[#011A4D] sticky top-0 z-30 w-full py-3"> 
        <ul className="menu menu-horizontal px-1 flex flex-row gap-5">
          {navLinks}
        </ul>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#011A4D] w-full absolute top-full left-0 z-40 shadow-lg pb-4">
          <ul className="menu menu-vertical px-4 py-2 flex flex-col gap-2">
            {navLinks}
            
            {!user ? (
              <li>
                <Link to="/login" className="text-white text-xl font-bold hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link to='/' className="text-white text-xl font-bold hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
                    Track Your Booking
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-white text-xl font-bold hover:underline"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
