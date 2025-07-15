import React, { useState, useEffect } from 'react';
import axios from '../api'; // Import your configured axios instance

const AdminAboutEditPage = () => {
    // Loading and saving states for UI feedback
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(''); // For success/error messages

    const [aboutData, setAboutData] = useState({
        heading: '',
        paragraph1: '',
        paragraph2: '',
    });

    // Effect to fetch about content from your backend API
    useEffect(() => {
        const fetchAboutContent = async () => {
            setLoading(true); // Start loading
            try {
                // Make a GET request to your backend API
                const response = await axios.get('/api/about-content');
                // Destructure to exclude imageUrl if it's present in the response
                const { imageUrl, ...dataWithoutImage } = response.data;
                setAboutData(dataWithoutImage); // Axios automatically parses JSON
            } catch (error) {
                console.error("Error fetching about content:", error);
                setMessage("Error loading content from backend.");
                // Initialize with default values if fetching fails (imageUrl removed)
                setAboutData({
                    heading: 'About L2G',
                    paragraph1: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
                    paragraph2: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
                });
            } finally {
                setLoading(false); // End loading regardless of success or failure
            }
        };

        fetchAboutContent();
    }, []); // Empty dependency array means this runs once on mount


    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prevData => ({
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
            const payload = {
                heading: aboutData.heading,
                paragraph1: aboutData.paragraph1,
                paragraph2: aboutData.paragraph2,
            };

            const response = await axios.put('/api/about-content', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('Token')}` // Send the auth token
                },
            });

            setMessage("Content updated successfully!"); // Success message
        } catch (error) {
            console.error("Error updating about content:", error);
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
                <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8">Edit About Page Content</h1>

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
                            value={aboutData.heading}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>
                    {/* Paragraph 1 Textarea */}
                    <div>
                        <label htmlFor="paragraph1" className="block text-sm font-medium text-gray-700 mb-1">First Paragraph</label>
                        <textarea
                            id="paragraph1"
                            name="paragraph1"
                            value={aboutData.paragraph1}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        ></textarea>
                    </div>
                    {/* Paragraph 2 Textarea */}
                    <div>
                        <label htmlFor="paragraph2" className="block text-sm font-medium text-gray-700 mb-1">Second Paragraph</label>
                        <textarea
                            id="paragraph2"
                            name="paragraph2"
                            value={aboutData.paragraph2}
                            onChange={handleChange}
                            rows="4"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        ></textarea>
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

export default AdminAboutEditPage;
