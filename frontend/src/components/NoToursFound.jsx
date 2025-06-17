import React from "react";
import { FaCalendarAlt, FaMountain, FaUmbrellaBeach, FaCity, FaTree, FaGlobeAmericas } from "react-icons/fa";
import { GiVillage, GiDesert, GiIsland, GiRiver } from "react-icons/gi";
import { MdOutlineTravelExplore } from "react-icons/md";
import { Link } from "react-router-dom";

const NoToursFound = ({ tourType }) => {
    // Map tour types to corresponding icons
    const getTourTypeIcon = () => {
        const type = tourType.toLowerCase();
        if (type.includes("mountain")) return <FaMountain className="text-4xl" />;
        if (type.includes("beach")) return <FaUmbrellaBeach className="text-4xl" />;
        if (type.includes("city")) return <FaCity className="text-4xl" />;
        if (type.includes("village")) return <GiVillage className="text-4xl" />;
        if (type.includes("desert")) return <GiDesert className="text-4xl" />;
        if (type.includes("island")) return <GiIsland className="text-4xl" />;
        if (type.includes("river")) return <GiRiver className="text-4xl" />;
        if (type.includes("forest")) return <FaTree className="text-4xl" />;
        return <MdOutlineTravelExplore className="text-4xl" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Header with animated background */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-10 left-1/4 w-16 h-16 rounded-full bg-white animate-pulse"></div>
                        <div className="absolute bottom-20 right-1/3 w-24 h-24 rounded-full bg-white animate-pulse delay-300"></div>
                        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white animate-pulse delay-700"></div>
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            {getTourTypeIcon()}
                        </div>
                        <h1 className="text-4xl font-bold mb-2">Coming Soon</h1>
                        <p className="text-xl mb-6">
                            We're preparing amazing {tourType} tours for you!
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                    <div className="flex justify-center mb-8">
                        <FaCalendarAlt className="text-6xl text-blue-400 animate-bounce" />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Our {tourType} adventures are in the works
                    </h2>

                    <p className="text-gray-600 mb-8">
                        We're curating exceptional {tourType.toLowerCase()} experiences that will be available soon.
                        Our team is carefully designing itineraries to bring you the best possible adventure.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <FaGlobeAmericas className="text-2xl text-blue-500 mx-auto mb-2" />
                            <p className="text-sm font-medium">Unique Locations</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <FaTree className="text-2xl text-green-500 mx-auto mb-2" />
                            <p className="text-sm font-medium">Eco-Friendly</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <GiVillage className="text-2xl text-amber-500 mx-auto mb-2" />
                            <p className="text-sm font-medium">Local Experiences</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <FaCity className="text-2xl text-purple-500 mx-auto mb-2" />
                            <p className="text-sm font-medium">Comfortable Stays</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-3">
                            Be the first to know when we launch!
                        </h3>
                        <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                                Notify Me
                            </button>
                        </div>
                    </div>

                    <a
                        href="/"
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                        ← Back to Home
                    </a>
                </div>
            </div>

            <div className="mt-8 text-gray-500 text-sm">
                <p>Have suggestions for our {tourType} tours? Contact our travel experts!</p>
            </div>
        </div>
    );
};

export default NoToursFound;