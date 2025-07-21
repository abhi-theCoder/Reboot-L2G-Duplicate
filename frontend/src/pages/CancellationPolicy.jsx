import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from '../api';

export default function CancellationPolicy() {
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('/api/cancellation-policy');
        setPolicy(response.data);
      } catch (err) {
        console.error("Failed to fetch cancellation policy:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.message || `Failed to load cancellation policy. Status: ${err.response.status}`);
        } else {
          setError("Failed to load cancellation policy. Please check your network connection.");
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
          <p>Loading cancellation policy...</p>
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
          <p>No cancellation policy data available.</p>
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
          {policy.introText && <p dangerouslySetInnerHTML={{ __html: policy.introText }}></p>}
          
          {policy.sections.map((section, index) => (
            <div key={index}>
              <h2 className="underline mt-6">{section.heading}</h2>
              {section.type === 'paragraph' && (
                <p dangerouslySetInnerHTML={{ __html: section.content }}></p>
              )}
              {section.type === 'table' && section.tableData && (
                <div className="overflow-x-auto mt-4">
                  <table className="min-w-full border">
                    <thead className="bg-gray-100">
                      <tr>
                        {section.tableData.headers.map((header, hIndex) => (
                          <th key={hIndex} className="border px-4 py-2">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.tableData.rows.map((row, rIndex) => (
                        <tr key={rIndex} className={rIndex % 2 === 1 ? 'bg-gray-50' : ''}>
                          {row.map((cell, cIndex) => (
                            <td key={cIndex} className={`border px-4 py-2 ${cell.includes('100%') || cell.includes('Zero') || cell.includes('50%') ? 'font-semibold' : ''}`}>
                              <span dangerouslySetInnerHTML={{ __html: cell }}></span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {policy.footerNotes && policy.footerNotes.length > 0 && (
            <div className="mt-6 text-sm">
              {policy.footerNotes.map((note, index) => (
                <p key={index} className={index > 0 ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: note }}></p>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer/>
    </>
  );
}