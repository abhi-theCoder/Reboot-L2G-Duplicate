// filepath: d:\NOI Software\new project - reboot home\Reboot-L2G\frontend\src\pages\CommunityServices.jsx

import React from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaHandsHelping, FaUsers, FaHeart, FaSeedling, FaChalkboardTeacher } from 'react-icons/fa';

export default function CommunityServices() {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-3xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header with animated background */}
                    <div className="bg-gradient-to-r from-green-500 to-blue-600 p-8 text-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-10 left-1/4 w-16 h-16 rounded-full bg-white animate-pulse"></div>
                            <div className="absolute bottom-20 right-1/3 w-24 h-24 rounded-full bg-white animate-pulse delay-300"></div>
                            <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white animate-pulse delay-700"></div>
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-center mb-6">
                                <FaHandsHelping className="text-6xl text-white drop-shadow-lg" />
                            </div>
                            <h1 className="text-4xl font-bold mb-2">Community Services Coming Soon</h1>
                            <p className="text-xl mb-6">
                                We're working on impactful community initiatives for you!
                            </p>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 md:p-12">
                        <div className="flex justify-center mb-8">
                            <FaUsers className="text-6xl text-green-400 animate-bounce" />
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Exciting Community Services Are On The Way
                        </h2>

                        <p className="text-gray-600 mb-8">
                            Our team is developing meaningful programs to support, uplift, and connect communities. Stay tuned for volunteering, education, and social impact opportunities!
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <FaHeart className="text-2xl text-pink-500 mx-auto mb-2" />
                                <p className="text-sm font-medium">Social Impact</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <FaSeedling className="text-2xl text-green-600 mx-auto mb-2" />
                                <p className="text-sm font-medium">Sustainability</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <FaChalkboardTeacher className="text-2xl text-blue-500 mx-auto mb-2" />
                                <p className="text-sm font-medium">Education</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                <FaHandsHelping className="text-2xl text-amber-500 mx-auto mb-2" />
                                <p className="text-sm font-medium">Volunteering</p>
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
                                    className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors">
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
                    <p>Have suggestions for our upcoming community services? Contact our team!</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}