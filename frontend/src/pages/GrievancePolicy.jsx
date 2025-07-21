import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../api'; // <--- Import axios here

export default function GrievancePolicy() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        // Use axios.get to make the GET request
        const response = await axios.get('/api/grievance-policy'); // Adjust URL as per your backend
        setPolicy(response.data); // Axios puts the response data in .data
      } catch (err) {
        console.error("Failed to fetch grievance policy:", err);
        if (axios.isAxiosError(err) && err.response) {
          // Access specific error message from the backend if available
          setError(err.response.data.message || `Failed to load grievance policy. Status: ${err.response.status}`);
        } else {
          setError("Failed to load grievance policy. Please check your network connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 my-5 text-center">
          <p>Loading grievance policy...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 my-5 text-center text-red-600">
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!policy) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 my-5 text-center">
          <p>No grievance policy data available.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6 my-5">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">{policy.title}</h1>
        
        <div className="prose">
          {policy.sections.map((section, index) => (
            <div key={index}>
              <h2 className="underline mt-6">{section.heading}</h2>
              {/* Using dangerouslySetInnerHTML if content might contain HTML tags like <strong> or <p> */}
              <p dangerouslySetInnerHTML={{ __html: section.content }}></p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}