import React, { useState } from 'react';
import { FiEdit, FiTrash2, FiSave, FiPlus, FiImage, FiX, FiCheck } from 'react-icons/fi';
import { FaMountain, FaUmbrellaBeach, FaLandmark, FaTree, FaChurch } from 'react-icons/fa';

const AttractionsEditPage = () => {
  const [attractions, setAttractions] = useState([
    {
      id: 1,
      title: 'Mountain View',
      description: 'Beautiful scenic mountain views with hiking trails',
      icon: 'mountain',
      image: null
    },
    {
      id: 2,
      title: 'Beach Resort',
      description: 'White sandy beach with crystal clear waters',
      icon: 'beach',
      image: null
    }
  ]);
  
  const [newAttraction, setNewAttraction] = useState({
    title: '',
    description: '',
    icon: 'landmark',
    image: null
  });
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const iconComponents = {
    mountain: <FaMountain className="text-green-600" size={24} />,
    beach: <FaUmbrellaBeach className="text-blue-400" size={24} />,
    landmark: <FaLandmark className="text-yellow-500" size={24} />,
    park: <FaTree className="text-green-500" size={24} />,
    church: <FaChurch className="text-purple-500" size={24} />
  };

  const handleInputChange = (id, field, value) => {
    setAttractions(attractions.map(attr => 
      attr.id === id ? { ...attr, [field]: value } : attr
    ));
  };

  const handleNewInputChange = (field, value) => {
    setNewAttraction({ ...newAttraction, [field]: value });
  };

  const handleSave = (id) => {
    setEditingId(null);
    // Here you would typically call an API to save changes
  };

  const handleDelete = (id) => {
    setAttractions(attractions.filter(attr => attr.id !== id));
    // API call to delete would go here
  };

  const handleAdd = () => {
    if (newAttraction.title.trim() === '') return;
    
    const newId = attractions.length > 0 ? Math.max(...attractions.map(a => a.id)) + 1 : 1;
    setAttractions([...attractions, { ...newAttraction, id: newId }]);
    setNewAttraction({
      title: '',
      description: '',
      icon: 'landmark',
      image: null
    });
    setIsAdding(false);
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange(id, 'image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAttraction({ ...newAttraction, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Attractions</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiPlus className="mr-2" />
          Add New Attraction
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {attractions.map(attraction => (
            <div key={attraction.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                {/* Image preview */}
                <div className="w-1/4 bg-gray-100 rounded-lg h-32 flex items-center justify-center overflow-hidden">
                  {attraction.image ? (
                    <img 
                      src={attraction.image} 
                      alt={attraction.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage size={32} className="mx-auto mb-2" />
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                {/* Content section */}
                <div className="w-2/4 px-4">
                  <div className="space-y-3">
                    {/* Title input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      {editingId === attraction.id ? (
                        <input
                          type="text"
                          value={attraction.title}
                          onChange={(e) => handleInputChange(attraction.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="font-medium text-gray-900">{attraction.title}</div>
                      )}
                    </div>

                    {/* Description input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      {editingId === attraction.id ? (
                        <textarea
                          value={attraction.description}
                          onChange={(e) => handleInputChange(attraction.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                      ) : (
                        <div className="text-gray-600">{attraction.description}</div>
                      )}
                    </div>
                    
                    {/* Image upload during edit */}
                    {editingId === attraction.id && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(attraction.id, e)}
                          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Icon and actions */}
                <div className="w-1/4 flex flex-col items-end space-y-4">
                  <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                    {iconComponents[attraction.icon]}
                  </div>
                  <div className="flex space-x-2">
                    {editingId === attraction.id ? (
                      <>
                        <button
                          onClick={() => handleSave(attraction.id)}
                          className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                          <FiSave className="mr-1" /> Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="flex items-center bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                        >
                          <FiX className="mr-1" /> Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingId(attraction.id)}
                          className="flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          <FiEdit className="mr-1" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(attraction.id)}
                          className="flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          <FiTrash2 className="mr-1" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* New attraction form */}
          {isAdding && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-800">Add New Attraction</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <div className="flex justify-between items-start">
                {/* Image preview */}
                <div className="w-1/4 bg-gray-100 rounded-lg h-32 flex items-center justify-center overflow-hidden">
                  {newAttraction.image ? (
                    <img 
                      src={newAttraction.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <FiImage size={32} className="mx-auto mb-2" />
                      <span>No Image</span>
                    </div>
                  )}
                </div>

                {/* Content section */}
                <div className="w-2/4 px-4">
                  <div className="space-y-3">
                    {/* Title input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                      <input
                        type="text"
                        value={newAttraction.title}
                        onChange={(e) => handleNewInputChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter attraction title"
                      />
                    </div>

                    {/* Description input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={newAttraction.description}
                        onChange={(e) => handleNewInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        placeholder="Enter attraction description"
                      />
                    </div>
                    
                    {/* Image upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewImageUpload}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Icon and actions */}
                <div className="w-1/4 flex flex-col items-end space-y-4">
                  <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                    {iconComponents[newAttraction.icon]}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleAdd}
                      disabled={!newAttraction.title.trim()}
                      className={`flex items-center px-3 py-1 rounded transition ${newAttraction.title.trim() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      <FiCheck className="mr-1" /> Add
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="flex items-center bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                    >
                      <FiX className="mr-1" /> Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttractionsEditPage;