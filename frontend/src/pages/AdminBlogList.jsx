import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api'; // Your configured Axios instance
import LoadingSpinner from '../components/LoadingSpinner'; // Assuming you have this
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import Navbar from '../components/Navbar'; // Assuming admin pages also use a Navbar/Sidebar
import Footer from '../components/Footer'; // Assuming admin pages also use a Footer

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(''); // To show feedback after deletion
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    setError(null);
    setDeleteStatus('');
    try {
      const response = await axios.get('/api/blogs');
      setBlogs(response.data);
    } catch (err) {
      console.error('Error fetching blogs for admin:', err);
      setError('Failed to load blogs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        setDeleteStatus('Deleting...');
        await axios.delete(`/api/blogs/${blogId}`,{
            headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${localStorage.getItem('Token')}` 
                },
        });
        setDeleteStatus('Blog deleted successfully!');
        // Remove the deleted blog from the state
        setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
      } catch (err) {
        console.error('Error deleting blog:', err);
        setDeleteStatus(`Failed to delete blog: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <LoadingSpinner />
        <p className="text-gray-700 mt-4">Loading blog list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-600">
        <p className="text-xl">{error}</p>
        <button onClick={fetchBlogs} className="mt-4 text-blue-600 hover:underline">
          Retry Loading
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Assuming you have a Navbar for admin layout, adjust as needed */}
      {/* <Navbar /> */}

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Blog Management</h1>
          <Link
            to="/add-blog" // Link to your BlogPostEditor for new posts
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
          >
            <FaPlusCircle className="mr-2" /> Add New Blog
          </Link>
        </div>

        {deleteStatus && (
          <div className={`p-3 rounded-lg mb-4 ${deleteStatus.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {deleteStatus}
          </div>
        )}

        {blogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-xl text-gray-600">No blog posts found.</p>
            <p className="text-gray-500 mt-2">Click "Add New Blog" to create your first post.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">
                        {blog.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {blog.excerpt}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        blog.category === 'medical' ? 'bg-blue-100 text-blue-800' :
                        blog.category === 'wellness' ? 'bg-green-100 text-green-800' :
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.author || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/edit-blog/${blog._id}`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                        title="Edit Blog"
                      >
                        <FaEdit className="inline-block" />
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Blog"
                      >
                        <FaTrash className="inline-block" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default AdminBlogList;