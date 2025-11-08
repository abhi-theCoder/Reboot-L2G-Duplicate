import React, { useState, useEffect, useRef } from 'react';
import axios from '../api';

const ViewAgreements = () => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [agreementType, setAgreementType] = useState('agents');
  const [tourId, setTourId] = useState('');
  const token = localStorage.getItem('Token');
  const printRef = useRef(); // For printing the selected agreement

  useEffect(() => {
    const fetchAgreements = async () => {
      if (!token) {
        setError('Authentication token not found. Please log in.');
        setLoading(false);
        return;
      }

      if (agreementType === 'tour' && !tourId) {
        setAgreements([]);
        setLoading(false);
        setError("Please enter a Tour ID to view customer agreements.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        let apiUrl = '';
        if (agreementType === 'all_customers') {
          apiUrl = `/api/terms/all-agreements?userType=Customer`;
          const allAgreementsResponse = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setAgreements(allAgreementsResponse.data);
        } else {
          const latestTermsUrl = `/api/terms/latest?type=${agreementType}${
            agreementType === 'tour' ? `&tourId=${tourId}` : ''
          }`;
          const latestTermsResponse = await axios.get(latestTermsUrl, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (latestTermsResponse.data && latestTermsResponse.data._id) {
            const latestTermsId = latestTermsResponse.data._id;
            const usersResponse = await axios.get(
              `/api/terms/agreed-users/${latestTermsId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setAgreements(usersResponse.data);
          } else {
            setAgreements([]);
          }
        }
      } catch (e) {
        console.error('Error fetching agreements:', e);
        setError(
          e.response?.data?.message ||
            'Failed to load agreements. Please check your network and try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAgreements();
  }, [agreementType, tourId, token]);

  const handleViewDetails = async (agreement) => {
    setError(null);
    try {
      if (agreement.termsDetails) {
        setSelectedAgreement({ ...agreement, termsDetails: agreement.termsDetails });
      } else {
        const termsResponse = await axios.get(`/api/terms/${agreement.termsId}`);
        setSelectedAgreement({ ...agreement, termsDetails: termsResponse.data });
      }
    } catch (e) {
      console.error('Error fetching detailed agreement:', e);
      setError('Failed to load agreement details.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const newWindow = window.open('', '', 'width=900,height=650');
    newWindow.document.write(`
      <html>
        <head>
          <title>L2G Cruise and Cure Agreement Document</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              color: #333;
            }
            h2, h3 {
              color: #111;
            }
            .footer {
              margin-top: 50px;
              border-top: 1px solid #ccc;
              padding-top: 10px;
              font-size: 14px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <svg
            className="animate-spin h-8 w-8 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
              5.291A7.962 7.962 0 014 12H0c0
              3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading Agreements...
          </p>
        </div>
      </div>
    );
  }

  if (selectedAgreement) {
    const { termsDetails, agreedAt, name } = selectedAgreement;
    return (
      <div className="bg-gray-50 min-h-screen p-6 sm:p-10 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={() => setSelectedAgreement(null)}
              className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
            >
              ← Back
            </button>
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow-md transition-all"
            >
              🖨️ Print PDF
            </button>
          </div>

          {/* Agreement Content */}
          <div
            ref={printRef}
            className="bg-white p-8 rounded-xl shadow-md border border-gray-200"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              {termsDetails?.mainHeader || 'Agreement Document'}
            </h2>
            <p className="text-gray-600 mb-6 text-justify">
              {termsDetails?.introText || 'No introduction available.'}
            </p>

            {termsDetails?.sections &&
              termsDetails.sections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {section.header}
                  </h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              ))}

            {termsDetails?.footerNotes && (
              <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
                {termsDetails.footerNotes.map((note, index) => (
                  <p key={index} className="mb-1">
                    {note}
                  </p>
                ))}
              </div>
            )}

            {/* Signature Section */}
            <div className="footer mt-10 text-sm text-gray-700">
              <p><strong>Agreed by:</strong> {name}</p>
              <p><strong>Agreed on:</strong> {formatDate(agreedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6 sm:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-indigo-600 mr-4"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2
              2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {agreementType === 'agents'
                  ? 'Agent Agreements'
                  : 'Customer Agreements'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View all {agreementType === 'agents' ? 'agent' : 'customer'} T&C
                agreements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={agreementType}
              onChange={(e) => {
                setAgreementType(e.target.value);
                setTourId('');
              }}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2 px-3"
            >
              <option value="agents">Agents</option>
              <option value="tour">Customers (Tour T&C)</option>
              <option value="all_customers">All Customers</option>
            </select>

            {agreementType === 'tour' && (
              <input
                type="text"
                placeholder="Enter Tour ID"
                className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm py-2 px-3"
                value={tourId}
                onChange={(e) => setTourId(e.target.value)}
              />
            )}
          </div>
        </div>

        {agreements.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-md border border-gray-200">
            <p className="text-xl font-semibold text-gray-700">No agreements found.</p>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">
                      {agreementType === 'agents' ? 'Agent Name' : 'Customer Name'}
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">
                      Agreement Date
                    </th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">
                      User Type
                    </th>
                    {agreementType !== 'agents' && (
                      <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">
                        Document ID
                      </th>
                    )}
                    <th className="px-6 py-3 text-left font-semibold text-gray-600 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-center font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agreements.map((agreement) => (
                    <tr
                      key={agreement._id}
                      className="hover:bg-indigo-50 transition-all"
                    >
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {agreement.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(agreement.agreedAt)}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {agreement.userType || 'N/A'}
                      </td>
                      {agreementType !== 'agents' && (
                        <td className="px-6 py-4 text-gray-600 font-mono">
                          {agreement.termsId || 'N/A'}
                        </td>
                      )}
                      <td className="px-6 py-4 text-gray-600">
                        {agreement.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewDetails(agreement)}
                          className="text-indigo-600 hover:text-indigo-900 font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewAgreements;
