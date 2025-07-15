import React, { useState, useEffect } from 'react';
import axios from '../api'; // Import axios

const AdminContactEditPage = () => {
    // Loading and saving states for UI feedback
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(''); // For success/error messages

    // State to hold the contact page data
    const [contactData, setContactData] = useState({
        heading: '',
        paragraph: '',
        address: '',
        email: '',
        phone: '',
        facebookUrl: '',
        twitterUrl: '',
        linkedinUrl: ''
    });

    // Effect to fetch contact content from your backend API
    useEffect(() => {
        const fetchContactContent = async () => {
            setLoading(true); // Start loading
            try {
                // Make a GET request to your backend API
                const response = await axios.get('/api/contact-content'); // Adjust URL if your backend is on a different port/domain
                console.log(response)
                setContactData(response.data); // Axios automatically parses JSON
            } catch (error) {
                console.error("Error fetching contact content:", error);
                setMessage("Error loading content from backend.");
                // Initialize with default values if fetching fails
                setContactData({
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


    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        setSaving(true); // Indicate that saving is in progress
        setMessage(''); // Clear previous messages
        try {
            // Make a PUT request to your backend API to update content 
            const response = await axios.put('/api/contact-content', contactData, { // Adjust URL if your backend is on a different port/domain
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${localStorage.getItem('Token')}` 
                },
            });

            setMessage("Content updated successfully!"); // Success message
        } catch (error) {
            console.error("Error updating contact content:", error);
            // Axios errors often have a 'response' object with more details
            const errorMessage = error.response?.data?.message || error.message || "Unknown error";
            setMessage(`Error saving content: ${errorMessage}. Please try again.`); // Error message
        } finally {
            setSaving(false); // End saving process
        }
    };

    // Display a loading message while content is being fetched
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
                <div className="text-xl font-semibold text-gray-700">Loading content...</div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">Edit Contact Page Content</h1>

                {/* Display success or error messages */}
                {message && (
                    <div className={`p-3 mb-4 rounded-md text-center ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Heading Input */}
                    <div>
                        <label htmlFor="heading" className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
                        <input
                            type="text"
                            id="heading"
                            name="heading"
                            value={contactData.heading}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Paragraph Textarea */}
                    <div>
                        <label htmlFor="paragraph" className="block text-sm font-medium text-gray-700 mb-1">Paragraph Text</label>
                        <textarea
                            id="paragraph"
                            name="paragraph"
                            value={contactData.paragraph}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        ></textarea>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2">Contact Information</h2>
                    {/* Address Input */}
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={contactData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={contactData.email}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Phone Number Input */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={contactData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4 border-b pb-2">Social Media Links</h2>
                    {/* Facebook URL Input */}
                    <div>
                        <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                        <input
                            type="url"
                            id="facebookUrl"
                            name="facebookUrl"
                            value={contactData.facebookUrl}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* Twitter URL Input */}
                    <div>
                        <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
                        <input
                            type="url"
                            id="twitterUrl"
                            name="twitterUrl"
                            value={contactData.twitterUrl}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {/* LinkedIn URL Input */}
                    <div>
                        <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                        <input
                            type="url"
                            id="linkedinUrl"
                            name="linkedinUrl"
                            value={contactData.linkedinUrl}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Save Changes Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={saving} // Disable button while saving
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminContactEditPage;