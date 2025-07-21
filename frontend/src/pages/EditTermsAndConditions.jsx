import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api';

// CKEditor 5 imports
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default function EditTermsAndConditions() {
  const [terms, setTerms] = useState({
    mainTitle: 'Terms & Conditions',
    introText: 'By proceeding with the payment, you agree to the terms and conditions outlined by the company. Please read all the clauses carefully.',
    sections: [],
    footerText: 'These terms are subject to change without prior notice. By proceeding with the booking, you agree to all the conditions mentioned above.'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // CKEditor 5 configuration
  const editorConfig = {
    // Set licenseKey to null or 'gpl' to avoid the license-key-missing error
    // as you are not using commercial features and have the open-source build.
    licenseKey: 'gpl', // Or null
    // Optionally, you can customize the toolbar if the default ClassicEditor
    // includes features you don't want or which cause the error.
    // For example, to remove features known to be commercial:
    // toolbar: {
    //   items: [
    //     'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
    //     'indent', 'outdent', '|', 'blockQuote', 'insertTable', 'undo', 'redo'
    //   ]
    // },
    // image: {
    //     toolbar: [ 'imageTextAlternative', 'imageStyle:full', 'imageStyle:side' ]
    // },
    // table: {
    //     contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
    // },
    // mediaEmbed: {
    //     previewsInData: true // Set to false if you don't need rich media previews in data
    // }
  };

  // Fetch policy on component mount
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await axios.get('/api/terms-and-conditions');
        setTerms(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response && err.response.status === 404) {
          setMessage('No existing terms and conditions found. You can create a new one.');
          // Initialize with default values if not found
          setTerms({
            mainTitle: 'Terms & Conditions',
            introText: 'By proceeding with the payment, you agree to the terms and conditions outlined by the company. Please read all the clauses carefully.',
            sections: [],
            footerText: 'These terms are subject to change without prior notice. By proceeding with the booking, you agree to all the conditions mentioned above.'
          });
        } else {
          setError(`Failed to load terms for editing: ${axios.isAxiosError(err) ? err.response?.data?.message || err.message : err.message}`);
        }
        console.error("Failed to fetch terms and conditions for editing:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []); // Empty dependency array, runs once on mount

  // Handlers for top-level fields
  const handleMainTitleChange = (e) => setTerms({ ...terms, mainTitle: e.target.value });

  // Specific handler for introText
  const handleIntroTextChange = (event, editor) => {
    const data = editor.getData();
    setTerms(prev => ({ ...prev, introText: data }));
  };

  // Specific handler for footerText
  const handleFooterTextChange = (event, editor) => {
    const data = editor.getData();
    setTerms(prev => ({ ...prev, footerText: data }));
  };

  // SECTION management
  const handleSectionChange = useCallback((sectionIndex, field, value) => {
    const newSections = [...terms.sections];
    newSections[sectionIndex] = { ...newSections[sectionIndex], [field]: value };
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  const addSection = useCallback(() => {
    setTerms({
      ...terms,
      sections: [...terms.sections, { title: '', contentBlocks: [{ type: 'paragraph', text: '' }] }] // Default to paragraph
    });
  }, [terms]);

  const removeSection = useCallback((sectionIndex) => {
    const newSections = terms.sections.filter((_, i) => i !== sectionIndex);
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  // CONTENT BLOCK management within a section
  const addContentBlock = useCallback((sectionIndex, type) => {
    const newSections = [...terms.sections];
    if (type === 'paragraph') {
      newSections[sectionIndex].contentBlocks.push({ type: 'paragraph', text: '' });
    } else if (type === 'list') {
      newSections[sectionIndex].contentBlocks.push({ type: 'list', items: [''] });
    } else if (type === 'html') { // For raw HTML or complex blocks like tables
      newSections[sectionIndex].contentBlocks.push({ type: 'html', text: '' });
    }
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  const removeContentBlock = useCallback((sectionIndex, blockIndex) => {
    const newSections = [...terms.sections];
    newSections[sectionIndex].contentBlocks.splice(blockIndex, 1);
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  // CKEditor change handler for dynamic content blocks
  const handleContentBlockTextChange = useCallback((sectionIndex, blockIndex, event, editor) => {
    const data = editor.getData();
    const newSections = [...terms.sections];
    newSections[sectionIndex].contentBlocks[blockIndex] = { ...newSections[sectionIndex].contentBlocks[blockIndex], text: data };
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  // Handle change for block type (select dropdown)
  const handleContentBlockTypeChange = useCallback((sectionIndex, blockIndex, newType) => {
    const newSections = [...terms.sections];
    // Reset content based on new type
    if (newType === 'paragraph') {
      newSections[sectionIndex].contentBlocks[blockIndex] = { type: 'paragraph', text: '' };
    } else if (newType === 'list') {
      newSections[sectionIndex].contentBlocks[blockIndex] = { type: 'list', items: [''] };
    } else if (newType === 'html') {
      newSections[sectionIndex].contentBlocks[blockIndex] = { type: 'html', text: '' };
    }
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  // LIST ITEM management within a list content block
  const handleListItemChange = useCallback((sectionIndex, blockIndex, itemIndex, value) => {
    const newSections = [...terms.sections];
    newSections[sectionIndex].contentBlocks[blockIndex].items[itemIndex] = value;
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  const addListItem = useCallback((sectionIndex, blockIndex) => {
    const newSections = [...terms.sections];
    newSections[sectionIndex].contentBlocks[blockIndex].items.push('');
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  const removeListItem = useCallback((sectionIndex, blockIndex, itemIndex) => {
    const newSections = [...terms.sections];
    newSections[sectionIndex].contentBlocks[blockIndex].items.splice(itemIndex, 1);
    setTerms({ ...terms, sections: newSections });
  }, [terms]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const method = terms._id ? 'patch' : 'post';
      const url = terms._id
        ? `/api/terms-and-conditions/${terms._id}`
        : '/api/terms-and-conditions';

      const response = await axios[method](url, terms, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization token here if your API requires it
        },
      });

      setTerms(response.data);
      setMessage('Terms and Conditions updated successfully!');
    } catch (err) {
      console.error("Failed to save terms and conditions:", err);
      if (axios.isAxiosError(err) && err.response) {
        setError(`Failed to save terms: ${err.response.data.message || err.response.statusText}`);
      } else {
        setError(`Failed to save terms: ${err.message}`);
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
      <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center">Edit Terms & Conditions</h1>

      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-5 py-4 rounded-lg relative mb-6" role="alert">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-5 py-4 rounded-lg relative mb-6" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Main Title */}
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-md">
          <label htmlFor="mainTitle" className="block text-gray-800 text-xl font-bold mb-3">Main Title</label>
          <input
            type="text"
            id="mainTitle"
            className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-4 px-5 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl"
            value={terms.mainTitle}
            onChange={handleMainTitleChange}
            required
          />
        </div>

        {/* Introductory Text (now with CKEditor) */}
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-md">
          <label htmlFor="introText" className="block text-gray-800 text-xl font-bold mb-3">Introductory Paragraph</label>
          <CKEditor
            editor={ClassicEditor}
            data={terms.introText}
            onChange={handleIntroTextChange}
            config={editorConfig} // Apply the config with licenseKey
          />
          <p className="text-gray-500 text-sm mt-2">Use the editor above to format your text.</p>
        </div>

        {/* Dynamic Sections */}
        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Content Sections</h2>
        {terms.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-10 p-8 border border-gray-200 rounded-xl bg-white shadow-md relative">
            <h3 className="text-2xl font-bold text-gray-800 mb-5">Section {sectionIndex + 1}</h3>

            <button
              type="button"
              onClick={() => removeSection(sectionIndex)}
              className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-full text-sm focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
              title="Remove Section"
            >
              &times;
            </button>

            <div className="mb-6">
              <label htmlFor={`section-title-${sectionIndex}`} className="block text-gray-800 text-lg font-semibold mb-3">Section Title</label>
              <input
                type="text"
                id={`section-title-${sectionIndex}`}
                className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-3.5 px-4.5 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={section.title}
                onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                required
              />
            </div>

            {/* Content Blocks within Section */}
            <h4 className="text-xl font-bold text-gray-700 mb-4">Section Content Blocks</h4>
            {section.contentBlocks.map((block, blockIndex) => (
              <div key={blockIndex} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                <p className="text-sm text-gray-600 mb-2">Block {blockIndex + 1} (Type: {block.type})</p>
                <button
                  type="button"
                  onClick={() => removeContentBlock(sectionIndex, blockIndex)}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full text-xs"
                  title="Remove Content Block"
                >
                  &times;
                </button>

                <div className="mb-4">
                  <label htmlFor={`block-type-${sectionIndex}-${blockIndex}`} className="block text-gray-700 text-sm font-bold mb-2">Block Type</label>
                  <select
                    id={`block-type-${sectionIndex}-${blockIndex}`}
                    className="shadow-inner border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={block.type}
                    onChange={(e) => handleContentBlockTypeChange(sectionIndex, blockIndex, e.target.value)}
                  >
                    <option value="paragraph">Paragraph</option>
                    <option value="list">List</option>
                    <option value="html">Raw HTML (for complex structures like tables)</option>
                  </select>
                </div>

                {/* CKEditor for paragraph and HTML blocks */}
                {(block.type === 'paragraph' || block.type === 'html') && (
                  <div>
                    <label htmlFor={`content-text-${sectionIndex}-${blockIndex}`} className="block text-gray-700 text-sm font-bold mb-2">
                        {block.type === 'paragraph' ? 'Paragraph Text' : 'Raw HTML Content'}
                    </label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={block.text || ''}
                      onChange={(event, editor) => handleContentBlockTextChange(sectionIndex, blockIndex, event, editor)}
                      config={editorConfig} // Apply the config with licenseKey
                      key={`${sectionIndex}-${blockIndex}-${block.type}`} // Important: Unique key for dynamic editors
                    />
                    <p className="text-gray-500 text-xs mt-1">
                        {block.type === 'paragraph' ? 'Use the editor above to format your paragraph.' : 'Use this only for complex HTML structures like tables. Ensure valid HTML.'}
                    </p>
                  </div>
                )}

                {/* Separate handler for list items (as they are distinct items) */}
                {block.type === 'list' && (
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">List Items</label>
                    {block.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center mb-2">
                        <textarea
                          className="shadow-inner appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-800 leading-snug focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          value={item}
                          onChange={(e) => handleListItemChange(sectionIndex, blockIndex, itemIndex, e.target.value)}
                          rows="2"
                          placeholder="Enter list item (e.g., '1. Your item' or '• Your item')"
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem(sectionIndex, blockIndex, itemIndex)}
                          className="ml-2 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full text-xs"
                          title="Remove List Item"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addListItem(sectionIndex, blockIndex)}
                      className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg text-sm"
                    >
                      Add List Item
                    </button>
                    <p className="text-gray-500 text-xs mt-1">For numbered lists, type '1. ' to start. Basic HTML tags like &lt;strong&gt; can be used here.</p>
                  </div>
                )}

              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => addContentBlock(sectionIndex, 'paragraph')}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
              >
                Add Paragraph Block
              </button>
              <button
                type="button"
                onClick={() => addContentBlock(sectionIndex, 'list')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
              >
                Add List Block
              </button>
              <button
                type="button"
                onClick={() => addContentBlock(sectionIndex, 'html')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm"
              >
                Add Raw HTML Block (for Tables etc.)
              </button>
            </div>
          </div>
        ))}

        {/* Add Section Button */}
        <div className="mb-8 text-center">
          <button
            type="button"
            onClick={addSection}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Add New Section
          </button>
        </div>

        {/* Footer Text (now with CKEditor) */}
        <div className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50 shadow-md">
          <label htmlFor="footerText" className="block text-gray-800 text-xl font-bold mb-3">Footer Text</label>
          <CKEditor
            editor={ClassicEditor}
            data={terms.footerText}
            onChange={handleFooterTextChange}
            config={editorConfig} // Apply the config with licenseKey
          />
          <p className="text-gray-500 text-sm mt-2">Use the editor above to format your text.</p>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-4 px-8 rounded-lg focus:outline-none focus:shadow-outline w-full text-xl transition duration-300 ease-in-out transform hover:scale-105"
        >
          Save Terms and Conditions
        </button>
      </form>
    </div>
  );
}