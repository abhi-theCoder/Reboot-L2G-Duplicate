import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api'; // Import Axios to fetch from your backend
import {
  FaCalendarAlt,
  FaUser,
  FaArrowLeft,
  FaShareAlt,
  FaBookmark,
  FaRegBookmark,
  FaMapMarkerAlt,
  FaHospital,
  FaPlane,
  FaMoneyBillWave,
  FaStar,
  // FaClinicMedical, // Removed as we are using MdCheckCircle and MdError for general pros/cons
  FaArrowRight
} from 'react-icons/fa';
// Import new icons for Advantages/Considerations
import { MdCheckCircle, MdError } from 'react-icons/md';


import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoadingSpinner from '../components/LoadingSpinner';

const CommunityListDetails = () => {
  const { id } = useParams(); // This 'id' will be the blog's _id from the URL
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState([]); // Will fetch from backend eventually

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blogs/${id}`);
        setBlog(response.data);

        // --- Important Note for Related Blogs ---
        // To make "You Might Also Like" section beautiful and functional,
        // you'll need a backend API endpoint that provides related blogs.
        // For example, fetching by category excluding the current blog ID.
        // For now, it will remain empty to focus on the main article details.
        setRelatedBlogs([]); // Keeping this empty until you implement backend for related blogs

      } catch (error) {
        console.error('Error fetching blog details:', error);
        setBlog(null); // Ensure blog state is null if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]); // Re-run effect whenever the ID in the URL changes

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <button
            onClick={() => navigate('/community-list')}
            className="text-primary hover:underline flex items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Back to all articles
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)} // Go back to the previous page in history
          className="inline-flex items-center text-primary hover:text-primary-dark mb-6 transition-colors"
        >
          <FaArrowLeft className="mr-2" /> Back to all articles
        </button>

        <article className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Hero Image with Gradient Overlay */}
          <div className="h-64 md:h-96 overflow-hidden relative">
            <img
              src={blog.image || 'https://via.placeholder.com/1200x630?text=No+Image+Available'} // Fallback for missing/bad image
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
              <div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  blog.type === 'medical' ? 'bg-blue-600 text-white' :
                  blog.type === 'wellness' ? 'bg-green-600 text-white' :
                  'bg-teal-600 text-white'
                }`}>
                  {blog.category}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center flex-wrap gap-4 text-gray-500 text-sm">
                <span className="flex items-center">
                  <FaCalendarAlt className="mr-1" />
                  {blog.date}
                </span>
                <span className="flex items-center">
                  {/* Changed icon based on type for consistency */}
                  {blog.type === 'medical' ? <FaHospital className="mr-1" /> : <FaMapMarkerAlt className="mr-1" />}
                  {blog.location}
                </span>
                {blog.rating && (
                  <span className="flex items-center">
                    <FaStar className="mr-1 text-yellow-400" />
                    {blog.rating}/5
                  </span>
                )}
                {blog.cost && (
                  <span className="flex items-center">
                    <FaMoneyBillWave className="mr-1" />
                    {blog.cost}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className="text-gray-500 hover:text-primary transition-colors"
                  aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  {bookmarked ? <FaBookmark className="text-primary" /> : <FaRegBookmark />}
                </button>
                <button className="text-gray-500 hover:text-primary transition-colors" aria-label="Share">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">{blog.title}</h1>

            {/* Author Bio */}
            {blog.authorTitle && (
              <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="mr-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                    <FaUser size={20} />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{blog.author}</h4>
                  <p className="text-sm text-gray-600">{blog.authorTitle}</p>
                </div>
              </div>
            )}

            {/* Main Content */}
            {/* Using dangerouslySetInnerHTML as content is expected to be HTML */}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }}></div>

            {/* Pros/Cons Section (now with MdCheckCircle and MdError for general appeal) */}
            {blog.pros && blog.pros.length > 0 && blog.cons && blog.cons.length > 0 && (
              <div className="mt-10 grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center">
                    <MdCheckCircle className="mr-2 text-2xl" /> Advantages {/* Changed icon */}
                  </h3>
                  <ul className="space-y-3">
                    {blog.pros.map((pro, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span> {/* Visual checkmark */}
                        <span className="text-gray-700">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                    <MdError className="mr-2 text-2xl" /> Considerations {/* Changed icon */}
                  </h3>
                  <ul className="space-y-3">
                    {blog.cons.map((con, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">⚠️</span> {/* Visual warning sign */}
                        <span className="text-gray-700">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* If only pros or cons exist, you might want to render them individually */}
            {/* Example for only pros */}
            {(!blog.cons || blog.cons.length === 0) && blog.pros && blog.pros.length > 0 && (
                 <div className="mt-10 bg-green-50 p-6 rounded-lg">
                     <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center">
                         <MdCheckCircle className="mr-2 text-2xl" /> Advantages
                     </h3>
                     <ul className="space-y-3">
                         {blog.pros.map((pro, index) => (
                             <li key={index} className="flex items-start">
                                 <span className="text-green-500 mr-2">✓</span>
                                 <span className="text-gray-700">{pro}</span>
                             </li>
                         ))}
                     </ul>
                 </div>
            )}
            {/* Example for only cons */}
            {(!blog.pros || blog.pros.length === 0) && blog.cons && blog.cons.length > 0 && (
                <div className="mt-10 bg-red-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-4 text-red-800 flex items-center">
                        <MdError className="mr-2 text-2xl" /> Considerations
                    </h3>
                    <ul className="space-y-3">
                        {blog.cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-red-500 mr-2">⚠️</span>
                                <span className="text-gray-700">{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

          </div>
        </article>

        {/* You Might Also Like Section - Currently empty, but ready for backend integration */}
        {relatedBlogs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map(rb => (
                <div
                  key={rb._id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                    rb.type === 'medical' ? 'border-t-4 border-blue-500' :
                    rb.type === 'wellness' ? 'border-t-4 border-green-500' :
                    'border-t-4 border-teal-500'
                  }`}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img src={rb.image || 'https://via.placeholder.com/1200x630?text=No+Image'} alt={rb.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        rb.type === 'medical' ? 'bg-blue-600 text-white' :
                        rb.type === 'wellness' ? 'bg-green-600 text-white' :
                        'bg-teal-600 text-white'
                      }`}>
                        {rb.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{rb.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{rb.excerpt}</p>
                    <Link
                      to={`/community-list/${rb._id}`}
                      className="text-primary hover:underline font-medium flex items-center group"
                    >
                      Read more
                      <FaArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CommunityListDetails;