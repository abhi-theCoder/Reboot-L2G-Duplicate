import React, { useState } from 'react';
import axios from '../api';
import Swal from 'sweetalert2';

function AddTour() {
  const [formData, setFormData] = useState({
    categoryType: '',
    name: '',
    country: '',
    pricePerHead: '',
    duration: '',
    startDate: '',
    description: '',
    occupancy: '',
    tourType: '' ,
    image: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' }); // Clear error for the field being updated
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryType) newErrors.categoryType = 'Category is required.';
    if (!formData.name) newErrors.name = 'Tour name is required.';
    if (!formData.country) newErrors.country = 'Country is required.';
    if (!formData.pricePerHead) newErrors.pricePerHead = 'Price per head is required.';
    if (!formData.duration) newErrors.duration = 'Duration is required.';
    if (!formData.startDate) newErrors.startDate = 'Start date is required.';
    if (!formData.description) newErrors.description = 'Description is required.';
    if (!formData.occupancy) newErrors.occupancy = 'Occupancy is required.';
    if (!formData.tourType) newErrors.tourType = 'Tour Type is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem('Token');
    const role = localStorage.getItem('role');

    const form = new FormData();
    form.append('categoryType', formData.categoryType);
    form.append(
      'packageData',
      JSON.stringify({
        name: formData.name,
        country: formData.country,
        pricePerHead: formData.pricePerHead,
        duration: formData.duration,
        startDate: formData.startDate,
        description: formData.description,
        occupancy: formData.occupancy,
        tourType: formData.tourType,
      })
    );

    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const res = await axios.post('/api/admin/tours', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          Role: role,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'Tour Added Successfully!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Reset form fields
      setFormData({
        categoryType: '',
        name: '',
        country: '',
        pricePerHead: '',
        duration: '',
        startDate: '',
        description: '',
        image: null,
      });
    } catch (err) {
      console.error('Error submitting tour:', err);
      Swal.fire({
        icon: 'error',
        title: err?.response?.data?.message || 'Something went wrong.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <>
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Tour</h2>
        <section className="min-h-screen text-white">
          <div className="mx-auto bg-white rounded-2xl shadow-xl p-6 text-gray-800 border border-gray-200">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tour Category */}
              <div>
                <label className="block font-medium mb-1">Tour Category</label>
                <select
                  name="categoryType"
                  value={formData.categoryType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Category</option>
                  <option value="Low Budget Tour">Low Budget Tour</option>
                  <option value="Standard Tour">Standard Tour</option>
                  <option value="Premium Tour">Premium Tour</option>
                </select>
                {errors.categoryType && <p className="text-red-500 text-sm">{errors.categoryType}</p>}
              </div>

              {/* Tour Name */}
              <div>
                <label className="block font-medium mb-1">Tour Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Goa"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block font-medium mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., India"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>

              {/* PricePerHead */}
              <div>
                <label className="block font-medium mb-1">PricePerHead (₹)</label>
                <input
                  type="number"
                  name="pricePerHead"
                  value={formData.pricePerHead}
                  onChange={handleChange}
                  placeholder="e.g., 15999"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.pricePerHead && <p className="text-red-500 text-sm">{errors.pricePerHead}</p>}
              </div>

              {/* Duration */}
              <div>
                <label className="block font-medium mb-1">Duration (Days)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
              </div>

              {/* Start Date */}
              <div>
                <label className="block font-medium mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
              </div>

              {/* Occupancy */}
              <div>
                <label className="block font-medium mb-1">Occupancy (People)</label>
                <input
                  type="number"
                  name="occupancy"
                  value={formData.occupancy}
                  onChange={handleChange}
                  placeholder="e.g., 50"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                {errors.occupancy && <p className="text-red-500 text-sm">{errors.occupancy}</p>}
              </div>

              {/* Tour Type */}
              <div>
                <label className="block font-medium mb-1">Tour Type</label>
                <select
                  name="tourType"
                  value={formData.tourType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select Tour Type</option>
                  <option value="Leisure Tourism">Leisure Tourism</option>
                  <option value="Religious Tourism">Religious Tourism</option>
                  <option value="Rural Tourism">Rural Tourism</option>
                  <option value="Heritage Tourism">Heritage Tourism</option>
                  <option value="Nursery Tourism">Nursery Tourism</option>
                  <option value="Eco Tourism">Eco Tourism</option>
                  <option value="Dark Tourism">Dark Tourism</option>
                  <option value="Food Tourism">Food Tourism</option>
                  <option value="Business Tourism">Business Tourism</option>
                </select>
                {errors.tourType && <p className="text-red-500 text-sm">{errors.tourType}</p>}
              </div>

              {/* Tour Image */}
              <div className="w-full col-span-2">
                <label className="block font-medium mb-1">Tour Image</label>
                <input
                  type="file"
                  accept='image/*'
                  name="image"
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.files.length > 0) {
                      setErrors({ ...errors, image: '' }); 
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder={formData.image ? formData.image.name : "Select an image"}
                />
                {formData.image && (
                  <div className="mt-4">
                    {/* <p className="text-sm text-gray-600">Selected file: {formData.image.name}</p> */}
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Selected"
                      className="mt-2 w-[100px] h-w-[100px] object-cover rounded-md border object-contain"
                    />
                  </div>
                )}
                {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Write tour details..."
                  className="w-full border border-gray-300 rounded-md p-2"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
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
      </main>
    </>
  );
}

export default AddTour;
