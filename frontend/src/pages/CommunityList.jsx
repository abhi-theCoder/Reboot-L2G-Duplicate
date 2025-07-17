import { useState, useEffect } from 'react';
import { FaFilter, FaSearch, FaCalendarAlt, FaUser, FaArrowRight, FaMapMarkerAlt, FaHospital, FaPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from '../api'; // Import Axios

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';
import InnerBanner from '../components/InnerBanner';

const CommunityList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const [error, setError] = useState(null);

    // Fetch blogs from backend using Axios
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('/api/blogs'); 
                console.log(response)
                setBlogs(response.data); // Axios puts the response data in .data
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load articles. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const categories = ['all', ...new Set(blogs.map(blog => blog.category))];

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || blog.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const categoryColors = {
        'medical': 'bg-blue-100 text-blue-800',
        'wellness': 'bg-green-100 text-green-800',
        'travel': 'bg-teal-100 text-teal-800'
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <InnerBanner
                title="Travel & Medical Tourism Insights"
                subtitle="Explore our latest articles on travel and medical tourism"
                backgroundImage={'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <div className="relative w-full md:w-1/2">
                            <input
                                type="text"
                                placeholder="Search destinations or treatments..."
                                className="w-full py-2 px-4 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="relative w-full md:w-auto bg-gray-600 rounded-lg">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                <FaFilter /> Filter by Category
                            </button>

                            {showFilters && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                    <div className="py-1">
                                        {categories.map(category => (
                                            <button
                                                key={category}
                                                onClick={() => {
                                                    setCategoryFilter(category);
                                                    setShowFilters(false);
                                                }}
                                                className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${categoryFilter === category ? 'bg-primary bg-opacity-10 text-primary' : 'text-gray-700'}`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {categoryFilter !== 'all' && (
                        <div className="mb-4 flex items-center">
                            <span className="text-gray-600 mr-2">Filtering by:</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[categoryFilter] || 'bg-gray-100 text-gray-800'}`}>
                                {categoryFilter}
                            </span>
                            <button
                                onClick={() => setCategoryFilter('all')}
                                className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                            >
                                (Clear)
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="text-center py-12 text-red-600">
                        <p className="text-xl font-medium">{error}</p>
                    </div>
                ) : filteredBlogs.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-600">No articles found matching your criteria</h3>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCategoryFilter('all');
                            }}
                            className="mt-4 text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map(blog => (
                            <div
                                key={blog._id}
                                className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeIn ${blog.type === 'medical' ? 'border-t-4 border-blue-500' :
                                        blog.type === 'wellness' ? 'border-t-4 border-green-500' :
                                            'border-t-4 border-teal-500'
                                    }`}
                            >
                                <div className="h-[220px] overflow-hidden relative">
                                    <img
                                        src={blog.image || 'https://via.placeholder.com/1200x630?text=No+Image'}
                                        alt={blog.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${categoryColors[blog.category] ? categoryColors[blog.category].replace('100', '600').replace('800', 'white') : 'bg-gray-600 text-white'}`}>
                                            {blog.category.charAt(0).toUpperCase() + blog.category.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 bg-white">
                                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                                        <span className="flex items-center">
                                            <FaCalendarAlt className="mr-1" />
                                            {blog.date}
                                        </span>
                                        <span className="flex items-center">
                                            {blog.type === 'medical' ? <FaHospital className="mr-1" /> : <FaPlane className="mr-1" />}
                                            {blog.location}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">{blog.title}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>

                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center text-sm text-gray-500">
                                            <FaUser className="mr-1" />
                                            {blog.author}
                                        </span>

                                        <Link
                                            to={`/community-list/${blog._id}`}
                                            className="flex items-center text-primary hover:text-primary-dark font-medium group"
                                        >
                                            Read More
                                            <FaArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default CommunityList;