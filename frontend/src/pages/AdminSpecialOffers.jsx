import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck, FaImage } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminSpecialOffers = () => {
    const [offers, setOffers] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: "",
        validity: "",
        badge: "",
        isActive: true
    });
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch offers
    useEffect(() => {
        fetchOffers();
    }, []);

    const fetchOffers = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get("/api/offers");
            // Ensure we always set an array
            setOffers(Array.isArray(res?.data) ? res.data : []);
        } catch (error) {
            toast.error("Failed to fetch offers");
            console.error("Error fetching offers:", error);
            setOffers([]); // Set empty array on error
        } finally {
            setIsLoading(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Handle image upload preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({
                    ...formData,
                    image: reader.result // Store as base64 or upload to server
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Save new / edit offer
    const saveOffer = async () => {
        if (!formData.title || !formData.description) {
            toast.warning("Please fill in required fields");
            return;
        }

        setIsLoading(true);
        try {
            if (editingId) {
                await axios.put(`/api/offers/${editingId}`, formData);
                toast.success("Offer updated successfully");
            } else {
                await axios.post("/api/offers", formData);
                toast.success("Offer added successfully");
            }
            fetchOffers();
            resetForm();
        } catch (error) {
            toast.error("Failed to save offer");
            console.error("Error saving offer:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Delete offer
    const deleteOffer = async (id) => {
        if (window.confirm("Are you sure you want to delete this offer?")) {
            setIsLoading(true);
            try {
                await axios.delete(`/api/offers/${id}`);
                toast.success("Offer deleted successfully");
                fetchOffers();
            } catch (error) {
                toast.error("Failed to delete offer");
                console.error("Error deleting offer:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            image: "",
            validity: "",
            badge: "",
            isActive: true
        });
        setEditingId(null);
        setImagePreview(null);
    };

    const startEdit = (offer) => {
        setFormData(offer);
        setEditingId(offer._id);
        if (offer.image) {
            setImagePreview(offer.image);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Manage Special Offers</h1>

            {/* Add / Edit Form */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                    {editingId ? "Edit Offer" : "Add New Offer"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                Title *
                            </label>
                            <input
                                id="title"
                                name="title"
                                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Offer title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows="3"
                                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Detailed description"
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="badge">
                                Badge Text
                            </label>
                            <input
                                id="badge"
                                name="badge"
                                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g. 'Limited Time'"
                                value={formData.badge}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                                Image
                            </label>
                            <div className="flex items-center">
                                <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 rounded px-4 py-2 flex items-center">
                                    <FaImage className="mr-2" />
                                    Choose Image
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-32 object-cover rounded border border-gray-300"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="validity">
                                Validity Date
                            </label>
                            <input
                                type="date"
                                id="validity"
                                name="validity"
                                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.validity}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                checked={formData.isActive}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                                Active Offer
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        onClick={saveOffer}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center disabled:opacity-50"
                    >
                        {isLoading ? (
                            "Processing..."
                        ) : (
                            <>
                                {editingId ? (
                                    <>
                                        <FaCheck className="mr-2" /> Update Offer
                                    </>
                                ) : (
                                    <>
                                        <FaPlus className="mr-2" /> Add Offer
                                    </>
                                )}
                            </>
                        )}
                    </button>
                    {editingId && (
                        <button
                            onClick={resetForm}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            <FaTimes className="mr-2 inline" /> Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Offers List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-semibold text-gray-700">Current Offers</h2>
                </div>
                
                {isLoading && !offers.length ? (
                    <div className="p-8 text-center text-gray-500">Loading offers...</div>
                ) : offers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No offers available. Add your first offer!</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Badge</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valid Until</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {offers.map((offer) => (
                                    <tr key={offer._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {offer.image && (
                                                    <div className="flex-shrink-0 h-10 w-10 mr-3">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={offer.image} alt="" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                                                    <div className="text-sm text-gray-500 line-clamp-1">{offer.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${offer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {offer.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {offer.badge && (
                                                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                                                    {offer.badge}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {offer.validity || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <button
                                                    onClick={() => startEdit(offer)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="inline" />
                                                </button>
                                                <button
                                                    onClick={() => deleteOffer(offer._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Delete"
                                                >
                                                    <FaTrash className="inline" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSpecialOffers;