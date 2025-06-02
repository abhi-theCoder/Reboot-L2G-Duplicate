import { useState } from 'react';
import { FiShoppingCart, FiClock, FiMapPin, FiCalendar, FiUsers, FiDollarSign, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('current');
    const [expandedTour, setExpandedTour] = useState(null);

    // Sample data
    const currentTours = [
        {
            id: 1,
            title: "Mountain Adventure",
            date: "2023-07-15",
            location: "Swiss Alps",
            price: 499,
            people: 4,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
            description: "A thrilling 5-day mountain trek with professional guides and breathtaking views."
        },
        {
            id: 2,
            title: "Beach Getaway",
            date: "2023-08-20",
            location: "Maldives",
            price: 799,
            people: 2,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6",
            description: "Relaxing 7-day beach vacation with private bungalow and all-inclusive service."
        }
    ];

    const previousTours = [
        {
            id: 3,
            title: "City Explorer",
            date: "2022-11-10",
            location: "Paris",
            price: 350,
            people: 2,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1431274172761-fca41d930114",
            description: "Cultural tour of Paris with visits to all major landmarks and museums."
        },
        {
            id: 4,
            title: "Safari Adventure",
            date: "2022-05-22",
            location: "Kenya",
            price: 650,
            people: 4,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1523805009345-7448845a9e53",
            description: "10-day wildlife safari with expert trackers and luxury camping."
        }
    ];

    const toggleTourExpand = (id) => {
        setExpandedTour(expandedTour === id ? null : id);
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">My Tours</h1>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        <button
                            className={`py-2 px-4 font-medium flex items-center ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('current')}
                        >
                            <FiShoppingCart className="mr-2" />
                            Current Tours ({currentTours.length})
                        </button>
                        <button
                            className={`py-2 px-4 font-medium flex items-center ${activeTab === 'previous' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                            onClick={() => setActiveTab('previous')}
                        >
                            <FiClock className="mr-2" />
                            Previous Tours ({previousTours.length})
                        </button>
                    </div>

                    {/* Tour Cards */}
                    <div className="grid gap-6">
                        {(activeTab === 'current' ? currentTours : previousTours).map((tour) => (
                            <div
                                key={tour.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                            >
                                <div className="md:flex">
                                    <div className="md:flex-shrink-0 md:w-48 h-48 bg-cover bg-center" style={{ backgroundImage: `url(${tour.image})` }}></div>
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-800">{tour.title}</h2>
                                                <div className="mt-2 flex items-center text-gray-600">
                                                    <FiMapPin className="mr-1" />
                                                    <span>{tour.location}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                <FiStar className="mr-1" />
                                                <span>{tour.rating}</span>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="flex items-center text-gray-700">
                                                <FiCalendar className="mr-2 text-gray-500" />
                                                <span>{new Date(tour.date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <FiUsers className="mr-2 text-gray-500" />
                                                <span>{tour.people} {tour.people > 1 ? 'People' : 'Person'}</span>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <FiDollarSign className="mr-2 text-gray-500" />
                                                <span>${tour.price}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => toggleTourExpand(tour.id)}
                                            className="mt-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            {expandedTour === tour.id ? (
                                                <>
                                                    <span>Show less</span>
                                                    <FiChevronUp className="ml-1" />
                                                </>
                                            ) : (
                                                <>
                                                    <span>Show details</span>
                                                    <FiChevronDown className="ml-1" />
                                                </>
                                            )}
                                        </button>

                                        {expandedTour === tour.id && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <p className="text-gray-700">{tour.description}</p>
                                                {activeTab === 'current' && (
                                                    <div className="mt-4 flex space-x-3">
                                                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                            View Itinerary
                                                        </button>
                                                        <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                                            Cancel Tour
                                                        </button>
                                                    </div>
                                                )}
                                                {activeTab === 'previous' && (
                                                    <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                                        Book Again
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {activeTab === 'current' && currentTours.length === 0 && (
                        <div className="text-center py-12">
                            <FiShoppingCart className="mx-auto text-4xl text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">No tours in your cart</h3>
                            <p className="text-gray-500 mt-2">Browse our amazing tours and start your next adventure!</p>
                        </div>
                    )}

                    {activeTab === 'previous' && previousTours.length === 0 && (
                        <div className="text-center py-12">
                            <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-700">No previous tours</h3>
                            <p className="text-gray-500 mt-2">Your future adventures will appear here after completion.</p>
                        </div>
                    )}
                </div>
            </div>

            <Footer />

        </>
    );
};

export default Dashboard;