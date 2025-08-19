import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import axios from '../api';
import { FaMountain, FaUmbrellaBeach, FaLandmark, FaTree, FaChurch, FaTimes } from 'react-icons/fa';

const PopularTourSection = () => {
    const [attractions, setAttractions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAttraction, setSelectedAttraction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const iconComponents = {
        mountain: <FaMountain className="text-green-600" size={24} />,
        beach: <FaUmbrellaBeach className="text-blue-400" size={24} />,
        landmark: <FaLandmark className="text-yellow-500" size={24} />,
        park: <FaTree className="text-green-500" size={24} />,
        church: <FaChurch className="text-purple-500" size={24} />
    };

    useEffect(() => {
        const fetchAttractions = async () => {
            try {
                const response = await axios.get('/api/attractions');
                setAttractions(response.data);
            } catch (err) {
                setError("Failed to fetch attractions. Please try again later.");
                console.error("Error fetching attractions:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAttractions();
    }, []);

    const openModal = (attraction) => {
        setSelectedAttraction(attraction);
        setIsModalOpen(true);
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAttraction(null);
        // Restore body scrolling when modal is closed
        document.body.style.overflow = 'auto';
    };

    // Close modal when clicking outside of modal content
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    // Close modal with Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.keyCode === 27) {
                closeModal();
            }
        };
        
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    if (isLoading) {
        return (
            <section className="bg-blue-50 py-12 px-6 min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-700">Loading attractions...</div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="bg-blue-50 py-12 px-6 min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-red-600">{error}</div>
            </section>
        );
    }
    
    if (attractions.length === 0) {
        return (
            <section className="bg-blue-50 py-12 px-6 min-h-screen flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-500">No attractions available.</div>
            </section>
        );
    }

    return (
        <section ref={ref} className="bg-blue-50 py-12 px-6">
            <div className="max-w-[1440px] mx-auto">
                <h2 className="lg:text-6xl text-3xl font-bold text-black mb-10">Other Attractions</h2>
                <div className="m-8">
                    <Swiper
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        navigation={false}
                    >
                        {attractions.map((attraction) => (
                            <SwiperSlide key={attraction._id}>
                                <div 
                                    className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 cursor-pointer transition-transform duration-300"
                                    onClick={() => openModal(attraction)}
                                >
                                    {attraction.image ? (
                                        <img
                                            src={attraction.image}
                                            alt={attraction.title}
                                            className="w-full max-h-[270px] h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full max-h-[270px] h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            No Image
                                        </div>
                                    )}
                                    <div className="flex items-start gap-2 p-4">
                                        <span className="rounded-full pt-[5px] shrink-0">
                                            {iconComponents[attraction.icon]}
                                        </span>
                                        <div>
                                            <h4 className="font-bold capitalize text-[20px] text-[#011A4D]">
                                                {attraction.title}
                                            </h4>
                                            <p className="text-black mt-2 text-[15px] line-clamp-2">
                                                {attraction.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedAttraction && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    onClick={handleBackdropClick}
                >
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-[#011A4D]">
                                {selectedAttraction.title}
                            </h3>
                            <button 
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {selectedAttraction.image ? (
                                <img
                                    src={selectedAttraction.image}
                                    alt={selectedAttraction.title}
                                    className="w-full h-64 object-cover rounded-lg mb-4"
                                />
                            ) : (
                                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500 rounded-lg mb-4">
                                    No Image
                                </div>
                            )}
                            
                            <div className="flex items-center gap-2 mb-4">
                                <span className="rounded-full">
                                    {iconComponents[selectedAttraction.icon]}
                                </span>
                                <span className="text-gray-600 capitalize">
                                    {selectedAttraction.icon} attraction
                                </span>
                            </div>
                            
                            <p className="text-gray-700 mb-4">
                                {selectedAttraction.description}
                            </p>
                            
                            {/* Add more details here if available in your data */}
                            {selectedAttraction.location && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800">Location:</h4>
                                    <p className="text-gray-600">{selectedAttraction.location}</p>
                                </div>
                            )}
                            
                            {selectedAttraction.hours && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800">Opening Hours:</h4>
                                    <p className="text-gray-600">{selectedAttraction.hours}</p>
                                </div>
                            )}
                            
                            {selectedAttraction.price && (
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-800">Price:</h4>
                                    <p className="text-gray-600">{selectedAttraction.price}</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 border-t flex justify-end">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PopularTourSection;