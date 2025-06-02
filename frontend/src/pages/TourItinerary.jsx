// src/components/TourItinerary.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { IoLocationOutline } from 'react-icons/io5';
import { MdOutlineAccessTime } from 'react-icons/md';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { SlCalender } from 'react-icons/sl';
import { FaArrowLeft, FaMapMarkerAlt, FaHotel, FaUtensils, FaBus, FaHiking, FaCamera, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import NeedHelp from '../components/NeedHelp';

const dummyTour = {
    tourID: "1",
    name: "Majestic Himalayas Adventure",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    categoryType: "Adventure",
    country: "India",
    tourType: "Group Tour",
    pricePerHead: 24999,
    duration: 7,
    occupancy: 20,
    remainingOccupancy: 8,
    startDate: "2025-06-15",
    description: "Experience the breathtaking beauty of the Himalayas with our 7-day adventure tour. Enjoy trekking, sightseeing, and cultural experiences in the heart of the mountains.",
    highlights: [
        "Trek to scenic viewpoints",
        "Visit ancient monasteries",
        "Local cuisine tasting",
        "Guided city tour"
    ],
    inclusions: [
        "Accommodation",
        "Meals (Breakfast & Dinner)",
        "All transfers",
        "Sightseeing tours",
        "Guide services"
    ],
    exclusions: [
        "Airfare",
        "Personal expenses",
        "Lunch",
        "Travel insurance"
    ],
    thingsToPack: [
        "Warm clothes",
        "Trekking shoes",
        "Sunscreen",
        "Camera"
    ],
    itinerary: [
        {
            title: "Arrival & Acclimatization",
            description: "Arrive at the base city, meet your guide, and acclimatize to the altitude.",
            activities: [
                { type: "travel", title: "Airport Pickup", description: "Transfer from airport to hotel.", time: "10:00 AM" },
                { type: "accommodation", title: "Hotel Check-in", description: "Relax and settle in at the hotel." },
                { type: "meal", title: "Welcome Dinner", description: "Enjoy a traditional welcome dinner." }
            ]
        },
        {
            title: "Trek to Valley Viewpoint",
            description: "Start your trek to the famous valley viewpoint and enjoy panoramic mountain views.",
            activities: [
                { type: "hiking", title: "Morning Trek", description: "Trek through scenic trails.", time: "8:00 AM" },
                { type: "sightseeing", title: "Photography", description: "Capture the stunning landscapes." },
                { type: "meal", title: "Packed Lunch", description: "Lunch on the trail." }
            ]
        }
        // Add more days as needed
    ],
    gallery: [
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80"
    ]
};

const TourItinerary = () => {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedTourDate, setSelectedTourDate] = useState(null);
    const [numberOfPeople, setNumberOfPeople] = useState(1);
    const [agentReferralId, setAgentReferralId] = useState('');
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccessMessage, setBookingSuccessMessage] = useState('');

    useEffect(() => {
        // Simulate API call with dummy data
        setLoading(true);
        setTimeout(() => {
            // Commented out actual API call
            // const fetchTour = async () => {
            //     try {
            //         const response = await fetch(`/api/tours/${tourId}`);
            //         const data = await response.json();
            //         setTour(data);
            //     } catch (error) {
            //         console.error('Error fetching tour:', error);
            //     } finally {
            //         setLoading(false);
            //     }
            // };
            // fetchTour();

            setTour(dummyTour);
            setLoading(false);
        }, 500);
    }, [tourId]);

    const formatDateForDisplay = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="animate-pulse space-y-6">
                    {/* Back button placeholder */}
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>

                    {/* Image placeholder */}
                    <div className="h-64 sm:h-80 md:h-96 bg-gray-200 rounded-xl"></div>

                    {/* Title and price placeholders */}
                    <div className="space-y-2">
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>

                    {/* Stats grid placeholder */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                        ))}
                    </div>

                    {/* Description placeholders */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <h2 className="text-xl font-medium text-gray-800">Tour not found</h2>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Back to tours
                </button>
            </div>
        );
    }

    const handleModalContinue = async () => {
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

        // Agent Referral ID validation (dummy API call)
        if (agentReferralId) {
            try {
                const res = await axios.get(`/api/agents/${agentReferralId.trim()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Role: role,
                    },
                });
                if (res.status !== 200) {
                    setBookingError("Invalid Agent Referral ID. Please check and try again.");
                    return;
                }
            } catch (err) {
                console.error("Full Axios Error Object:", err);
                if (err.response && err.response.data && err.response.data.message) {
                    setBookingError(err.response.data.message);
                } else {
                    setBookingError("Agent Referral ID validation failed. Please try again.");
                }
                return;
            }
        }

        const agentID = agentReferralId ? agentReferralId.trim() : '';
        const tourID = selectedTourDate.tourID;

        // Create a more compact URL with just IDs
        const query = new URLSearchParams();
        if (agentID) query.append('a', agentID);  // 'a' for agent
        query.append('t', tourID);                // 't' for tour
        query.append('p', numPeople);             // 'p' for people

        const fullLink = `/kyc?${query.toString()}`;
        console.log("Navigating to:", fullLink);

        setTimeout(() => {
            setIsBookingModalOpen(false);
            navigate(fullLink);
        }, 3000);
    };

    return (
        <>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6 text-sm sm:text-base"
                >
                    <FaArrowLeft className="mr-2" /> Back to tours
                </button>

                {/* Tour header */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
                    {tour.image && (
                        <img
                            src={tour.image}
                            alt={tour.name}
                            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
                        />
                    )}

                    <div className="p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6">
                            <div className="mb-4 sm:mb-0">
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">{tour.name}</h1>
                                <p className="text-gray-600 flex items-center text-sm sm:text-base">
                                    <IoLocationOutline className="mr-2 text-blue-500" />
                                    {tour.categoryType} | {tour.country}
                                </p>
                            </div>

                            <div className="flex flex-col items-end">
                                <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 mb-2">
                                    {tour.tourType}
                                </span>
                                <span className="text-lg sm:text-xl md:text-2xl font-semibold text-green-600">
                                    ₹{tour.pricePerHead?.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Stats grid - changes layout on small screens */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <p className="text-gray-500 text-xs sm:text-sm">Duration</p>
                                <p className="text-gray-800 font-medium flex items-center text-sm sm:text-base">
                                    <MdOutlineAccessTime className="mr-2 text-blue-500" />
                                    {tour.duration} days
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <p className="text-gray-500 text-xs sm:text-sm">Occupancy</p>
                                <p className="text-gray-800 font-medium flex items-center text-sm sm:text-base">
                                    <HiOutlineUserGroup className="mr-2 text-blue-500" />
                                    {tour.occupancy} people
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <p className="text-gray-500 text-xs sm:text-sm">Remaining</p>
                                <p className="text-gray-800 font-medium flex items-center text-sm sm:text-base">
                                    <HiOutlineUserGroup className="mr-2 text-blue-500" />
                                    {tour.remainingOccupancy} spots
                                </p>
                            </div>

                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <p className="text-gray-500 text-xs sm:text-sm">Start Date</p>
                                <p className="text-gray-800 font-medium flex items-center text-sm sm:text-base">
                                    <SlCalender className="mr-2 text-blue-500" />
                                    {formatDateForDisplay(tour.startDate)}
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm sm:text-base mb-6">{tour.description}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {tour.highlights?.map((highlight, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs sm:text-sm"
                                >
                                    {highlight}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile itinerary menu toggle */}
                <div className="sm:hidden mb-4">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="w-full flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
                    >
                        <span className="font-medium text-gray-700">
                            {activeDay === 0 ? 'Overview' : `Day ${activeDay}`}
                        </span>
                        {mobileMenuOpen ? (
                            <FaChevronUp className="text-gray-500" />
                        ) : (
                            <FaChevronDown className="text-gray-500" />
                        )}
                    </button>

                    {mobileMenuOpen && (
                        <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                            <button
                                onClick={() => {
                                    setActiveDay(0);
                                    setMobileMenuOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 ${activeDay === 0 ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                            >
                                Overview
                            </button>
                            {tour.itinerary?.map((day, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setActiveDay(index + 1);
                                        setMobileMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 border-t border-gray-200 ${activeDay === index + 1 ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                                >
                                    Day {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Itinerary content - desktop and mobile */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
                    {/* Desktop tabs */}
                    <div className="hidden sm:block border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveDay(0)}
                                className={`py-3 px-4 sm:py-4 sm:px-6 text-center border-b-2 font-medium text-sm ${activeDay === 0 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                Overview
                            </button>
                            {tour.itinerary?.map((day, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveDay(index + 1)}
                                    className={`py-3 px-4 sm:py-4 sm:px-6 text-center border-b-2 font-medium text-sm ${activeDay === index + 1 ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Day {index + 1}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="p-4 sm:p-6 md:p-8">
                        {activeDay === 0 ? (
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Tour Overview</h2>
                                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Inclusions</h3>
                                        <ul className="space-y-1 sm:space-y-2">
                                            {tour.inclusions?.map((item, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-green-500 mr-2 mt-0.5">✓</span>
                                                    <span className="text-gray-600 text-sm sm:text-base">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Exclusions</h3>
                                        <ul className="space-y-1 sm:space-y-2">
                                            {tour.exclusions?.map((item, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-red-500 mr-2 mt-0.5">✗</span>
                                                    <span className="text-gray-600 text-sm sm:text-base">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {tour.thingsToPack && (
                                    <div className="mt-4 sm:mt-6">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">Things to Pack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {tour.thingsToPack.map((item, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm"
                                                >
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                                    Day {activeDay}: {tour.itinerary[activeDay - 1].title}
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
                                    {tour.itinerary[activeDay - 1].description}
                                </p>

                                <div className="space-y-3 sm:space-y-4">
                                    {tour.itinerary[activeDay - 1].activities?.map((activity, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                                                {activity.type === 'travel' && <FaBus className="text-blue-500 mr-3 text-sm sm:text-base" />}
                                                {activity.type === 'sightseeing' && <FaCamera className="text-purple-500 mr-3 text-sm sm:text-base" />}
                                                {activity.type === 'meal' && <FaUtensils className="text-yellow-500 mr-3 text-sm sm:text-base" />}
                                                {activity.type === 'accommodation' && <FaHotel className="text-green-500 mr-3 text-sm sm:text-base" />}
                                                {activity.type === 'hiking' && <FaHiking className="text-red-500 mr-3 text-sm sm:text-base" />}
                                                {activity.type === 'location' && <FaMapMarkerAlt className="text-blue-500 mr-3 text-sm sm:text-base" />}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800 text-sm sm:text-base">{activity.title}</h4>
                                                <p className="text-gray-600 text-xs sm:text-sm">{activity.description}</p>
                                                {activity.time && (
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        <MdOutlineAccessTime className="inline mr-1" />
                                                        {activity.time}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Gallery - responsive grid */}
                {tour.gallery && tour.gallery.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8 border border-gray-100">
                        <div className="p-4 sm:p-6 md:p-8">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Photo Gallery</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                {tour.gallery.map((photo, index) => (
                                    <div
                                        key={index}
                                        className="aspect-square overflow-hidden rounded-lg bg-gray-100 hover:shadow-md transition-shadow"
                                    >
                                        <img
                                            src={photo}
                                            alt={`Tour gallery ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking section - responsive layout */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-4 sm:p-6 border border-gray-100">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Book This Tour</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-3 sm:mb-0">
                            <p className="text-gray-600 text-sm sm:text-base mb-1">
                                Price per person: <span className="text-green-600 font-bold">₹{tour.pricePerHead?.toLocaleString()}</span>
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base">
                                Available spots: <span className="font-medium">{tour.remainingOccupancy}</span>
                            </p>
                        </div>
                        <button
                            className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 text-sm sm:text-base"
                            onClick={() => {
                                setSelectedTourDate(tour);
                                setIsBookingModalOpen(true);
                                setNumberOfPeople(1);
                                setAgentReferralId('');
                                setBookingError('');
                                setBookingSuccessMessage('');
                            }}
                        >
                            Book Now
                        </button>
                    </div>
                </div>

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
                                    className={`bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 ${bookingSuccessMessage ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={!!bookingSuccessMessage}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <NeedHelp />

            <Footer />

        </>
    );
};

export default TourItinerary;