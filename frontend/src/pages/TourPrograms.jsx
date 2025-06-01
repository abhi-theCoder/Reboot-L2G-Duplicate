import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import { FaSun, FaCloudRain, FaCloud } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import { HiOutlineUserGroup } from "react-icons/hi";
import { MdOutlineAccessTime } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "../api";

// Helper function to format date
const formatDateForDisplay = (isoDateString) => {
  if (!isoDateString) return "N/A";
  const date = new Date(isoDateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const TourPrograms = () => {
  const navigate = useNavigate();

  const [allTours, setAllTours] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [toursForSelectedMonth, setToursForSelectedMonth] = useState([]);
  const [selectedTourDate, setSelectedTourDate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for the tooltip
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipText, setTooltipText] = useState("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // States for the booking modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState("");
  const [agentReferralId, setAgentReferralId] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState("");
  const token = localStorage.getItem('Token');
  const role = localStorage.getItem('role');
  useEffect(() => {
    const fetchTourData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token || !role) {
          setError("You need to login first to view this section.");
          setLoading(false);
          return;
        }

        const FetchToursRoute = role === 'superadmin' ? 'api/admin/tours' : role === 'customer'? 'api/customer/tours' : 'api/agents/tours';

        const res = await axios.get(FetchToursRoute, {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        });

        const toursData = res.data.tours;
        console.log("Fetched all tours data:", toursData);
        setAllTours(toursData);

        const months = new Set();
        if (Array.isArray(toursData)) {
          toursData.forEach(pkg => {
            if (pkg.startDate) {
              const startDate = new Date(pkg.startDate);
              const monthName = startDate.toLocaleString('en-US', { month: 'long' });
              months.add(monthName);
            }
          });
        } else {
          console.warn("toursData is not an array:", toursData);
          setError("Unexpected data format from server.");
        }

        setAvailableMonths(Array.from(months));

      } catch (err) {
        let errorMessage = '';
        const message = err?.response?.data?.message;
        // console.log(err.response.data.error)
        if(err.response.data.error === 'Unauthorized: Invalid token'){
          errorMessage = 'Unauthorized access or Session expired. Please re-login again.!!';
        }else if(message === 'Inactive user'){
          errorMessage = 'Your account is inactive. Please contact support.';
        }else{
          errorMessage = 'Error fetching tours. Try again later.';
        }
        setError(errorMessage);
        console.error("Error fetching tour data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTourData();
  }, []);

  useEffect(() => {
    if (selectedMonth && allTours.length > 0) {
      const filtered = allTours.filter(tour => {
        if (!tour.startDate) return false;
        const tourMonth = new Date(tour.startDate).toLocaleString('en-US', { month: 'long' });
        return tourMonth === selectedMonth;
      });
      setToursForSelectedMonth(filtered);
      setSelectedTourDate(null);
    } else {
      setToursForSelectedMonth([]);
      setSelectedTourDate(null);
    }
  }, [selectedMonth, allTours]);


  const handleMonthClick = (month) => {
    if (!availableMonths.includes(month)) {
      return;
    }
    console.log(`Clicked on month: ${month}`);
    setSelectedMonth(month);
  };

  const handleTourDateClick = (tour) => {
    console.log("Selected Tour Date:", tour);
    setSelectedTourDate(tour);
    setNumberOfPeople(""); // Clear previous input when a new tour is selected
    setAgentReferralId(""); // Clear previous agent ID
    setBookingError(""); // Clear previous booking errors
    setBookingSuccessMessage(""); // Clear any previous success message
  };

  const handleContinue = () => {
    if (selectedTourDate) {
      setIsBookingModalOpen(true);
    } else {
      alert("Please select a tour date to continue.");
    }
  };

  const handleModalContinue = async() => {
    const numPeople = parseInt(numberOfPeople, 10);

    setBookingError("");
    setBookingSuccessMessage("");

    if (isNaN(numPeople) || numPeople <= 0) {
      setBookingError("Please enter a valid number of people (greater than 0).");
      return;
    }

    if (!selectedTourDate) {
      setBookingError("No tour selected. Please close and try again.");
      return;
    }

    if (numPeople > selectedTourDate.remainingOccupancy) {
      setBookingError(`Only ${selectedTourDate.remainingOccupancy} seats available. Please enter a lower number.`);
      return;
    }

    const message = `Booking ${numPeople} people for ${selectedTourDate.name}. Redirecting to KYC page...`;
    setBookingSuccessMessage(message);

    // Prepare data for URL parameters
    if (agentReferralId) {
      try {
        const res = await axios.get(`/api/agents/${agentReferralId.trim()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        });
        // Assuming your API returns a success status or agent details if valid
        if (res.status !== 200) {
          setBookingError("Invalid Agent Referral ID. Please check and try again.");
          return;
        }
      } catch (err) {
        // --- CHANGE STARTS HERE ---
        console.error("Full Axios Error Object:", err); // This will print the entire error object
        if (err.response && err.response.data && err.response.data.message) {
          setBookingError(err.response.data.message);
        } else {
          setBookingError("Agent Referral ID validation failed. Please try again.");
        }
        return;
      }
    }
    // console.log(agentDetails)
    const agentID = agentReferralId.trim();
    const tourName = selectedTourDate.name;
    const tourID = selectedTourDate.tourID;
    const tourPricePerHead = selectedTourDate.pricePerHead;
    const tourActualOccupancy = selectedTourDate.occupancy;
    const tourGivenOccupancy = numPeople;
    // Ensure startDate is formatted correctly for URL, if it's an ISO string, encode it
    const tourStartDate = selectedTourDate.startDate ? new Date(selectedTourDate.startDate).toISOString() : '';

    const query = new URLSearchParams({
      agentID: agentID?agentID:'',
      tourName: tourName,
      tourID: tourID,
      tourPricePerHead: tourPricePerHead,
      tourActualOccupancy: tourActualOccupancy,
      tourGivenOccupancy: tourGivenOccupancy,
      tourStartDate: tourStartDate
    }).toString();

    // Log the full link for debugging
    const fullLink = `/kyc?${query}`;
    console.log("Navigating to:", fullLink);


    setTimeout(()=>{
      setIsBookingModalOpen(false);
      navigate(fullLink);
    }, 3000);
  };


  // Tooltip handlers
  const handleMouseEnterMonth = (month, event) => {
    if (!availableMonths.includes(month)) {
      setIsTooltipVisible(true);
      setTooltipText("Not Available Now");
      setTooltipPosition({ x: event.clientX + 10, y: event.clientY + 10 });
    }
  };

  const handleMouseMoveMonth = (event) => {
    if (isTooltipVisible) {
      setTooltipPosition({ x: event.clientX + 10, y: event.clientY + 10 });
    }
  };

  const handleMouseLeaveMonth = () => {
    setIsTooltipVisible(false);
    setTooltipText("");
  };

  const monthsData = [
    { month: "January", year: 2025, season: "Off-Peak Season", weather: "Pleasant", icon: <FaCloud /> },
    { month: "February", year: 2025, season: "Off-Peak Season", weather: "Pleasant", icon: <FaCloud /> },
    { month: "March", year: 2025, season: "Shoulder Season", weather: "Sunny", icon: <FaSun /> },
    { month: "April", year: 2025, season: "Shoulder Season", weather: "Sunny", icon: <FaSun /> },
    { month: "May", year: 2025, season: "Peak Season", weather: "Sunny", icon: <FaSun /> },
    { month: "June", year: 2025, season: "Peak Season", weather: "Sunny", icon: <FaSun /> },
    { month: "July", year: 2025, season: "Off-Peak Season", weather: "Monsoon", icon: <FaCloudRain /> },
    { month: "August", year: 2025, season: "Off-Peak Season", weather: "Monsoon", icon: <FaCloudRain /> },
    { month: "September", year: 2025, season: "Shoulder Season", weather: "Pleasant", icon: <FaCloud /> },
    { month: "October", year: 2025, season: "Shoulder Season", weather: "Pleasant", icon: <FaCloud /> },
    { month: "November", year: 2025, season: "Peak Season", weather: "Pleasant", icon: <FaCloud /> },
    { month: "December", year: 2025, season: "Peak Season", weather: "Pleasant", icon: <FaCloud /> },
  ];

  return (
    <div className="flex flex-col min-h-screen relative">
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-semibold text-gray-800 mb-8">
          Select Your Travel Dates
        </h1>
        <p className="text-gray-600 mb-10">
          Select your preferred month and available dates
        </p>

        {loading && <div className="text-center text-blue-500">Loading available tour dates...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {monthsData.map((month, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-lg border ${
                    selectedMonth === month.month
                      ? "border-blue-500 bg-blue-50"
                      : availableMonths.includes(month.month)
                      ? "border-gray-300 hover:border-blue-500 cursor-pointer"
                      : "border-gray-200 bg-gray-50 text-gray-400 opacity-70 cursor-not-allowed"
                  } flex justify-between items-start`}
                  onClick={() => handleMonthClick(month.month)}
                  onMouseEnter={(e) => handleMouseEnterMonth(month.month, e)}
                  onMouseMove={handleMouseMoveMonth}
                  onMouseLeave={handleMouseLeaveMonth}
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {month.month} {month.year}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        month.season === "Peak Season"
                          ? "text-red-500"
                          : month.season === "Off-Peak Season"
                          ? "text-green-600"
                          : "text-orange-500"
                      }`}
                    >
                      {month.season}
                    </p>
                  </div>
                  <div className="text-gray-500 text-2xl ml-4 flex flex-col items-center">
                    {month.icon}
                    <span className="text-sm mt-1">{month.weather}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Details of Tour Section */}
            {selectedMonth && toursForSelectedMonth.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                  Details of Tour
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {toursForSelectedMonth.map((tour) => (
                    <div
                      key={tour.tourID}
                      className={`p-6 rounded-lg border cursor-pointer
                      ${selectedTourDate?.tourID === tour.tourID
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-300 hover:border-blue-500"
                      }`}
                      onClick={() => handleTourDateClick(tour)}
                    >
                      {tour.image && (
                        <img
                          src={tour.image}
                          alt={tour.name}
                          className="w-full h-40 object-cover rounded-md mb-4"
                        />
                      )}
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.name}</h3>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <IoLocationOutline className="mr-2 text-blue-500" />
                        {tour.categoryType} | {tour.country}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                           {tour.tourType}
                        </span>
                        <span className="text-lg font-semibold text-green-600">
                          ₹{tour.pricePerHead?.toLocaleString()}
                        </span>
                      </p>

                      <p className="text-gray-600 text-lg font-bold my-2">
                        ₹{tour.pricePerHead?.toLocaleString()}
                      </p>

                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <MdOutlineAccessTime className="mr-2 text-blue-500" />
                        Duration: {tour.duration} days
                      </p>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <HiOutlineUserGroup className="mr-2 text-blue-500" />
                        Occupancy: {tour.occupancy} people
                      </p>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <HiOutlineUserGroup className="mr-2 text-blue-500" />
                        Remaining Occupancy: {tour.remainingOccupancy} people
                      </p>
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <SlCalender className="mr-2 text-blue-500" />
                        Start: {formatDateForDisplay(tour.startDate)}
                      </p>
                       <p className="text-gray-600 text-sm mt-2">
                        {tour.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedMonth && toursForSelectedMonth.length === 0 && (
              <div className="mt-12 text-center text-gray-600">
                No tours found for {selectedMonth}. Please select another month.
              </div>
            )}


            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-300 rounded-full mr-2"></span>
                  <span>Unavailable</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  <span>Selected</span>
                </div>
              </div>
              <button
                className={`bg-blue-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  !selectedTourDate ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!selectedTourDate}
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Need Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-600">
                Our travel experts are available round the clock to assist you
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Secure Booking
              </h3>
              <p className="text-gray-600">
                Your payments and personal information are protected
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Best Price Guarantee
              </h3>
              <p className="text-gray-600">
                Find a lower price? We'll match it!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Tooltip component */}
      {isTooltipVisible && (
        <div
          style={{
            position: "fixed",
            top: tooltipPosition.y,
            left: tooltipPosition.x,
            zIndex: 1000,
            pointerEvents: "none",
          }}
          className="bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg"
        >
          {tooltipText}
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && selectedTourDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Enter Booking Details for: {selectedTourDate.name}
            </h2>
            <div className="mb-4">
              <label htmlFor="numPeople" className="block text-gray-700 text-sm font-bold mb-2">
                Number of People:
              </label>
              <input
                type="number"
                id="numPeople"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                min="1"
                placeholder="e.g., 2"
              />

              {/* Agent Referral ID Input */}
              <label htmlFor="agentReferral" className="block text-gray-700 text-sm font-bold mb-2">
                Agent Referral ID (Optional):
              </label>
              <input
                type="text"
                id="agentReferral"
                value={agentReferralId}
                onChange={(e) => setAgentReferralId(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter Agent ID"
              />

              {bookingError && (
                <p className="text-red-500 text-xs mt-2">{bookingError}</p>
              )}
              {bookingSuccessMessage && (
                <p className="text-green-600 text-sm mt-2 font-medium">{bookingSuccessMessage}</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleModalContinue}
                className={`bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 ${
                  bookingSuccessMessage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={!!bookingSuccessMessage}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default TourPrograms;