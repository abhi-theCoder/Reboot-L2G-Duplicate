import React, { useState, useEffect } from 'react';
import axios from '../api'; // Import axios
import InnerBanner from '../components/InnerBanner'; // Assuming this component exists
import Navbar from '../components/Navbar'; // Assuming this component exists
import Footer from '../components/Footer'; // Assuming this component exists
import { FaHome, FaEnvelope, FaPhone, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa'; // Font Awesome icons

const ContactForm = () => {
    // Loading state for UI feedback
    const [loading, setLoading] = useState(true);

    // State to hold the contact page data, initialized with default values
    const [contactData, setContactData] = useState({
        heading: 'Get In Touch',
        paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut tempor ipsum dolor sit amet. labore',
        address: 'Plaza X, XY Floor, Street, XYZ',
        email: 'admin@gmail.com',
        phone: '+123-456-7890',
        facebookUrl: 'https://facebook.com',
        twitterUrl: 'https://twitter.com',
        linkedinUrl: 'https://linkedin.com'
    });

    // Effect for initial scroll to top and fetching content from backend
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on component mount

        const fetchContactContent = async () => {
            setLoading(true); // Start loading
            try {
                // Make a GET request to your backend API using axios
                const response = await axios.get('/api/contact-content'); // Adjust URL if your backend is on a different port/domain
                console.log(response.data)
                setContactData(response.data); // Axios automatically parses JSON
            } catch (error) {
                console.error("Error fetching contact content:", error);
                // Axios errors often have a 'response' object with more details
                const errorMessage = error.response?.data?.message || error.message || "Unknown error";
                console.error(`Detailed error: ${errorMessage}`);
                // If fetching fails, keep the default values or show an error message
                // For now, we'll just log the error and keep defaults.
                setContactData({ // Revert to defaults on error
                    heading: 'Get In Touch',
                    paragraph: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut tempor ipsum dolor sit amet. labore',
                    address: 'Plaza X, XY Floor, Street, XYZ',
                    email: 'admin@gmail.com',
                    phone: '+123-456-7890',
                    facebookUrl: 'https://facebook.com',
                    twitterUrl: 'https://twitter.com',
                    linkedinUrl: 'https://linkedin.com'
                });
            } finally {
                setLoading(false); // End loading regardless of success or failure
            }
        };

        fetchContactContent();
    }, []); // Empty dependency array means this runs once on mount

    // Display a loading message while content is being fetched
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
                <div className="text-xl font-semibold text-gray-700">Loading contact information...</div>
            </div>
        );
    }

    return (
        <div className="bg-[#E8F3FF] font-sans"> {/* Added font-sans for Inter font */}
            <Navbar />
            <InnerBanner
                title="Contact Us"
                backgroundImage="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />

            {/* Spacer div to push content below the banner */}
            <span className="bg-[#111827] h-[580px] block w-full"></span>

            <section className="text-white py-12 px-4 md:px-10 xl:px-20 relative z-10 -mt-[550px] mb-[130px] max-w-[1260px] mx-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Dynamic Heading */}
                    <h2 className="text-4xl sm:text-5xl md:text-[60px] font-bold mb-4">{contactData.heading}</h2>
                    {/* Dynamic Paragraph */}
                    <p className="text-base sm:text-lg md:text-xl mb-10 max-w-2xl">
                        {contactData.paragraph}
                    </p>

                    <div className="bg-white text-black rounded-md shadow-md flex flex-col md:flex-row overflow-hidden py-8">
                        {/* FORM SECTION (remains static as per request) */}
                        <div className="w-full md:w-2/3 p-4 sm:p-6 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full">
                                    <label className="block mb-1 font-semibold text-sm sm:text-base">Name</label>
                                    <input type="text" className="w-full border border-blue-400 rounded-md px-3 py-2" />
                                </div>
                                <div className="w-full">
                                    <label className="block mb-1 font-semibold text-sm sm:text-base">Email Address</label>
                                    <input type="email" className="w-full border border-blue-400 rounded-md px-3 py-2" />
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="w-full">
                                    <label className="block mb-1 font-semibold text-sm sm:text-base">Phone Number</label>
                                    <input type="text" className="w-full border border-blue-400 rounded-md px-3 py-2" />
                                </div>
                                <div className="w-full">
                                    <label className="block mb-1 font-semibold text-sm sm:text-base">Address</label>
                                    <input type="text" className="w-full border border-blue-400 rounded-md px-3 py-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold text-sm sm:text-base">Message</label>
                                <textarea className="w-full border border-blue-400 rounded-md px-3 py-2 h-28"></textarea>
                            </div>
                            <button className="w-full bg-[#0D2044] text-white py-2 rounded-full text-lg font-semibold hover:bg-[#0a1835] transition duration-300">
                                Submit
                            </button>
                        </div>

                        {/* CONTACT INFO SECTION (now dynamic) */}
                        <div className="w-full md:w-1/3 border-t md:border-t-0 md:border-l border-gray-300 p-4 sm:p-6 bg-white">
                            <h3 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#0D2044] mb-4 border-b pb-2">Contact Info</h3>
                            <ul className="space-y-4 text-sm sm:text-base">
                                <li className="flex items-start gap-3">
                                    <FaHome className="text-[#0D2044] mt-1" />
                                    <span>{contactData.address}</span> {/* Dynamic Address */}
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaEnvelope className="text-[#0D2044] mt-1" />
                                    <span>{contactData.email}</span> {/* Dynamic Email */}
                                </li>
                                <li className="flex items-start gap-3">
                                    <FaPhone className="text-[#0D2044] mt-1" />
                                    <span>{contactData.phone}</span> {/* Dynamic Phone */}
                                </li>
                            </ul>

                            {/* Dynamic Social Media Links */}
                            <div className="flex gap-4 mt-6 text-[#0D2044] text-lg">
                                {contactData.facebookUrl && (
                                    <a href={contactData.facebookUrl} target="_blank" rel="noopener noreferrer">
                                        <FaFacebookF className="cursor-pointer hover:text-blue-600" />
                                    </a>
                                )}
                                {contactData.twitterUrl && (
                                    <a href={contactData.twitterUrl} target="_blank" rel="noopener noreferrer">
                                        <FaTwitter className="cursor-pointer hover:text-blue-400" />
                                    </a>
                                )}
                                {contactData.linkedinUrl && (
                                    <a href={contactData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                        <FaLinkedinIn className="cursor-pointer hover:text-blue-700" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ContactForm;
