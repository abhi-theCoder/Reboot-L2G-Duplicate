import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api';

export default function EditGrievance() {
  const [policy, setPolicy] = useState({ title: '', sections: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get(`/api/grievance-policy`);
        setPolicy(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          if (err.response.status === 404) {
            setMessage('No existing policy found. You can create a new one.');
            setPolicy({ title: 'Grievance Redressal Policy', sections: [] });
          } else {
            setError(err.response.data.message || `Failed to load policy for editing. Status: ${err.response.status}`);
          }
        } else {
          setError("Failed to load policy for editing. Please check your network connection.");
        }
        console.error("Failed to fetch grievance policy for editing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  const handleTitleChange = (e) => {
    setPolicy({ ...policy, title: e.target.value });
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...policy.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setPolicy({ ...policy, sections: newSections });
  };

  const addSection = () => {
    setPolicy({
      ...policy,
      sections: [...policy.sections, { heading: '', content: '' }]
    });
  };

  const removeSection = (index) => {
    const newSections = policy.sections.filter((_, i) => i !== index);
    setPolicy({ ...policy, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const method = policy._id ? 'patch' : 'post';
      const url = policy._id
        ? `/api/grievance-policy/${policy._id}`
        : '/api/grievance-policy';

      const response = await axios[method](url, policy, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization token here if your API requires it
        },
      });

      setPolicy(response.data);
      setMessage('Grievance policy updated successfully!');
    } catch (err) {
      console.error("Failed to save grievance policy:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to save policy: ${err.response.data.message || err.response.statusText}`);
      } else {
        setError(`Failed to save policy: ${err.message}`);
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading editor...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  return (
    // Increased max-w-6xl to max-w-7xl for even more width, and increased padding.
    // Added bigger vertical margin.
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden p-10 my-10">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center">Edit Grievance Redressal Policy</h1>
      
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-4 rounded-lg relative mb-6" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg relative mb-6" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <label htmlFor="policyTitle" className="block text-gray-800 text-xl font-bold mb-3">Policy Title</label>
          <input
            type="text"
            id="policyTitle"
            className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-4 px-5 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl" // Increased padding, font size, added ring focus
            value={policy.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        {policy.sections.map((section, index) => (
          // Increased padding, border radius, and shadow for each section
          <div key={index} className="mb-10 p-8 border border-gray-200 rounded-xl bg-gray-50 shadow-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-5">Section {index + 1}</h3> {/* Larger font for section heading */}
            <div className="mb-6">
              <label htmlFor={`heading-${index}`} className="block text-gray-800 text-lg font-semibold mb-3">Heading</label>
              <input
                type="text"
                id={`heading-${index}`}
                className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-3.5 px-4.5 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" // Increased padding, font size, added ring focus
                value={section.heading}
                onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor={`content-${index}`} className="block text-gray-800 text-lg font-semibold mb-3">Content</label>
              <textarea
                id={`content-${index}`}
                // Significantly increased height (h-72), padding, font size
                className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-4 px-5 text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-72 resize-y text-lg"
                value={section.content}
                onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="button"
              onClick={() => removeSection(index)}
              className="bg-red-700 hover:bg-red-800 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105" // Larger button, darker red, better transition
            >
              Remove Section
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addSection}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 px-8 rounded-lg focus:outline-none focus:shadow-outline mb-8 transition duration-300 ease-in-out transform hover:scale-105" // Larger button, darker blue, better transition
        >
          Add Section
        </button>

        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline w-full text-xl transition duration-300 ease-in-out transform hover:scale-105" // Larger, full-width button, darker green, better transition
        >
          Save Policy
        </button>
      </form>
    </div>
  );
}