import React, { useState } from 'react';

const AddNewTour = () => {
    const [tourData, setTourData] = useState({ 
        category: '',
        name: '',
        country: '',
        price: '',
        duration: '',
        startDate: '',
        image: null,
        description: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTourData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setTourData((prevState) => ({
            ...prevState,
            [name]: files[0],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(tourData); // Handle form submission here (e.g., sending data to the server)
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Add New Tour</h2>
            <section className="min-h-screen text-white">
                <div className="mx-auto bg-white rounded-2xl shadow-xl p-6 text-gray-800 border border-gray-200">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>

                        {/* Tour Category */}
                        <div>
                            <label className="block font-medium mb-1">Tour Category</label>
                            <select
                                name="category"
                                value={tourData.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            >
                                <option value="">Select Category</option>
                                <option value="Low Budget Tour">Low Budget Tour</option>
                                <option value="Standard Tour">Standard Tour</option>
                                <option value="Premium Tour">Premium Tour</option>
                            </select>
                        </div>

                        {/* Tour Name */}
                        <div>
                            <label className="block font-medium mb-1">Tour Name</label>
                            <input
                                type="text"
                                name="name"
                                value={tourData.name}
                                onChange={handleChange}
                                placeholder="e.g., Goa"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block font-medium mb-1">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={tourData.country}
                                onChange={handleChange}
                                placeholder="e.g., India"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block font-medium mb-1">Price (₹)</label>
                            <input
                                type="number"
                                name="price"
                                value={tourData.price}
                                onChange={handleChange}
                                placeholder="e.g., 15999"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="block font-medium mb-1">Duration (Days)</label>
                            <input
                                type="number"
                                name="duration"
                                value={tourData.duration}
                                onChange={handleChange}
                                placeholder="e.g., 5"
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label className="block font-medium mb-1">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={tourData.startDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Tour Image */}
                        <div className="md:col-span-2">
                            <label className="block font-medium mb-1">Tour Image</label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                value={tourData.description}
                                onChange={handleChange}
                                rows="4"
                                placeholder="Write tour details..."
                                className="w-full border border-gray-300 rounded-md p-2"
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
                            >
                                Add Tour
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default AddNewTour;
