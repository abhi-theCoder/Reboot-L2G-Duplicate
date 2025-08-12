import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';

export default function EditCancellationPolicy() {
  const [policy, setPolicy] = useState({
    title: '',
    introText: '',
    sections: [],
    footerNotes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const response = await axios.get('/api/cancellation-policy');
        setPolicy(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
          setMessage('No existing policy found. You can create a new one.');
          setPolicy({
            title: 'Cancellation & Refund Policy',
            introText: '',
            sections: [],
            footerNotes: []
          });
        } else {
          setError(`Failed to load policy for editing: ${axios.isAxiosError(err) ? err.response?.data?.message || err.message : err.message}`);
        }
        console.error("Failed to fetch cancellation policy for editing:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicy();
  }, []);

  const handleTitleChange = (e) => {
    setPolicy({ ...policy, title: e.target.value });
  };

  const handleIntroTextChange = (e) => {
    setPolicy({ ...policy, introText: e.target.value });
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    const newSections = [...policy.sections];
    newSections[sectionIndex] = { ...newSections[sectionIndex], [field]: value };
    setPolicy({ ...policy, sections: newSections });
  };

  const addSection = (type) => {
    if (type === 'paragraph') {
      setPolicy({
        ...policy,
        sections: [...policy.sections, { heading: '', type: 'paragraph', content: '' }]
      });
    } else if (type === 'table') {
      setPolicy({
        ...policy,
        sections: [...policy.sections, { heading: '', type: 'table', tableData: { headers: ['Column 1', 'Column 2'], rows: [['', '']] } }]
      });
    }
  };

  const removeSection = (sectionIndex) => {
    const newSections = policy.sections.filter((_, i) => i !== sectionIndex);
    setPolicy({ ...policy, sections: newSections });
  };

  const handleTableHeaderChange = (sectionIndex, headerIndex, value) => {
    const newSections = [...policy.sections];
    newSections[sectionIndex].tableData.headers[headerIndex] = value;
    setPolicy({ ...policy, sections: newSections });
  };

  const addTableHeader = (sectionIndex) => {
    const newSections = [...policy.sections];
    newSections[sectionIndex].tableData.headers.push('');
    // Also add empty cells to each row for the new column
    newSections[sectionIndex].tableData.rows.forEach(row => row.push(''));
    setPolicy({ ...policy, sections: newSections });
  };

  const removeTableHeader = (sectionIndex, headerIndex) => {
    const newSections = [...policy.sections];
    newSections[sectionIndex].tableData.headers.splice(headerIndex, 1);
    // Also remove the corresponding cell from each row
    newSections[sectionIndex].tableData.rows.forEach(row => row.splice(headerIndex, 1));
    setPolicy({ ...policy, sections: newSections });
  };

  const handleTableCellChange = (sectionIndex, rowIndex, colIndex, value) => {
    const newSections = [...policy.sections];
    newSections[sectionIndex].tableData.rows[rowIndex][colIndex] = value;
    setPolicy({ ...policy, sections: newSections });
  };

  const addTableRow = (sectionIndex) => {
    const newSections = [...policy.sections];
    const numColumns = newSections[sectionIndex].tableData.headers.length;
    newSections[sectionIndex].tableData.rows.push(Array(numColumns).fill(''));
    setPolicy({ ...policy, sections: newSections });
  };

  const removeTableRow = (sectionIndex, rowIndex) => {
    const newSections = [...policy.sections];
    newSections[sectionIndex].tableData.rows.splice(rowIndex, 1);
    setPolicy({ ...policy, sections: newSections });
  };

  const handleFooterNoteChange = (index, value) => {
    const newNotes = [...policy.footerNotes];
    newNotes[index] = value;
    setPolicy({ ...policy, footerNotes: newNotes });
  };

  const addFooterNote = () => {
    setPolicy({ ...policy, footerNotes: [...policy.footerNotes, ''] });
  };

  const removeFooterNote = (index) => {
    const newNotes = policy.footerNotes.filter((_, i) => i !== index);
    setPolicy({ ...policy, footerNotes: newNotes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const method = policy._id ? 'patch' : 'post';
      const url = policy._id
        ? `/api/cancellation-policy/${policy._id}`
        : '/api/cancellation-policy';

      const response = await axios[method](url, policy, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization token here if your API requires it
        },
      });

      setPolicy(response.data);
      setMessage('Cancellation policy updated successfully!');
    } catch (err) {
      console.error("Failed to save cancellation policy:", err);
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
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden p-10 my-10">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center">Edit Cancellation & Refund Policy</h1>
      
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-4 rounded-lg relative mb-6" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg relative mb-6" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Policy Title */}
        <div className="mb-8">
          <label htmlFor="policyTitle" className="block text-gray-800 text-xl font-bold mb-3">Policy Title</label>
          <input
            type="text"
            id="policyTitle"
            className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-4 px-5 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
            value={policy.title}
            onChange={handleTitleChange}
            required
          />
        </div>

        {/* Intro Text */}
        <div className="mb-8">
          <label htmlFor="introText" className="block text-gray-800 text-xl font-bold mb-3">Introductory Paragraph</label>
          <textarea
            id="introText"
            className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-4 px-5 text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-48 resize-y text-lg"
            value={policy.introText}
            onChange={handleIntroTextChange}
          ></textarea>
          <p className="text-gray-500 text-sm mt-2">HTML tags like &lt;strong&gt; can be used for formatting.</p>
        </div>

        {/* Dynamic Sections */}
        {policy.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-10 p-8 border border-gray-200 rounded-xl bg-gray-50 shadow-md relative">
            <h3 className="text-2xl font-bold text-gray-800 mb-5">Section {sectionIndex + 1} ({section.type === 'paragraph' ? 'Paragraph' : 'Table'})</h3>
            
            <button
              type="button"
              onClick={() => removeSection(sectionIndex)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-sm focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
              title="Remove Section"
            >
              &times;
            </button>

            <div className="mb-6">
              <label htmlFor={`section-heading-${sectionIndex}`} className="block text-gray-800 text-lg font-semibold mb-3">Section Heading</label>
              <input
                type="text"
                id={`section-heading-${sectionIndex}`}
                className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-3.5 px-4.5 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={section.heading}
                placeholder='Give a blank space if you dont want to enter any heading'
                onChange={(e) => handleSectionChange(sectionIndex, 'heading', e.target.value)}
                required
              />
            </div>

            {section.type === 'paragraph' && (
              <div className="mb-6">
                <label htmlFor={`section-content-${sectionIndex}`} className="block text-gray-800 text-lg font-semibold mb-3">Paragraph Content</label>
                <textarea
                  id={`section-content-${sectionIndex}`}
                  className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-4 px-5 text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-72 resize-y text-lg"
                  value={section.content}
                  onChange={(e) => handleSectionChange(sectionIndex, 'content', e.target.value)}
                  required
                ></textarea>
                <p className="text-gray-500 text-sm mt-2">HTML tags like &lt;strong&gt; can be used for formatting.</p>
              </div>
            )}

            {section.type === 'table' && section.tableData && (
              <div className="mb-6">
                <h4 className="text-xl font-bold text-gray-700 mb-4">Table Data</h4>
                
                {/* Table Headers */}
                <div className="mb-4">
                  <label className="block text-gray-800 text-lg font-semibold mb-3">Table Headers</label>
                  <div className="flex flex-wrap gap-2">
                    {section.tableData.headers.map((header, headerIndex) => (
                      <div key={headerIndex} className="flex items-center space-x-2">
                        <input
                          type="text"
                          className="shadow-inner appearance-none border border-gray-300 rounded-lg py-2 px-3 text-gray-800 text-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={header}
                          onChange={(e) => handleTableHeaderChange(sectionIndex, headerIndex, e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeTableHeader(sectionIndex, headerIndex)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full text-xs"
                          title="Remove Column"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addTableHeader(sectionIndex)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
                    >
                      Add Column
                    </button>
                  </div>
                </div>

                {/* Table Rows */}
                <div className="overflow-x-auto border rounded-lg bg-white p-4">
                  <label className="block text-gray-800 text-lg font-semibold mb-3">Table Rows</label>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      {/* VERY CRITICAL: Put the map output immediately after <tr> and then the next <th> immediately after the map's closing parenthesis */}
                      <tr>{section.tableData.headers.map((header, hIndex) => (
                          <th key={hIndex} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{header}</th>
                        ))}<th className="px-3 py-2"></th> {/* For remove row button */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {section.tableData.rows.map((row, rowIndex) => (
                        // VERY CRITICAL: Put the map output immediately after <tr> and then the next <td> immediately after the map's closing parenthesis
                        <tr key={rowIndex}>{row.map((cell, colIndex) => (
                            <td key={colIndex} className="px-3 py-2 whitespace-nowrap">
                              <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                value={cell}
                                onChange={(e) => handleTableCellChange(sectionIndex, rowIndex, colIndex, e.target.value)}
                              />
                            </td>
                          ))}<td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => removeTableRow(sectionIndex, rowIndex)}
                              className="text-red-600 hover:text-red-900 ml-2"
                              title="Remove Row"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    type="button"
                    onClick={() => addTableRow(sectionIndex)}
                    className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
                  >
                    Add Row
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Section Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            onClick={() => addSection('paragraph')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Paragraph Section
          </button>
          <button
            type="button"
            onClick={() => addSection('table')}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add Table Section
          </button>
        </div>

        {/* Footer Notes */}
        <div className="mb-8 p-8 border border-gray-200 rounded-xl bg-gray-50 shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-5">Footer Notes</h3>
          {policy.footerNotes.map((note, index) => (
            <div key={index} className="mb-4 flex items-center">
              <textarea
                className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-y text-md"
                value={note}
                onChange={(e) => handleFooterNoteChange(index, e.target.value)}
              ></textarea>
              <button
                type="button"
                onClick={() => removeFooterNote(index)}
                className="ml-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFooterNote}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-5 rounded-lg focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
          >
            Add Footer Note
          </button>
          <p className="text-gray-500 text-sm mt-2">HTML tags like &lt;strong&gt; can be used for formatting.</p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline w-full text-xl transition duration-300 ease-in-out transform hover:scale-105"
        >
          Save Policy
        </button>
      </form>
    </div>
  );
}