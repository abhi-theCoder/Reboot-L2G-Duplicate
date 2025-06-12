import { useState, useEffect } from 'react';
import axios from '../api';
import {
    FiSearch,
    FiPlusCircle,
    FiHeart,
    FiMessageSquare,
    FiShare2,
    FiBookmark
} from 'react-icons/fi';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Navigate, useNavigate } from 'react-router-dom';

const ReplyComponent = ({ reply, postId, loggedInUser, onReplySubmit, level = 0 }) => {
    const [showNestedReplies, setShowNestedReplies] = useState(false);
    const [showSubReplyForm, setShowSubReplyForm] = useState(false);
    const [subReplyText, setSubReplyText] = useState('');
    const userRole = localStorage.getItem('role');

    const handleSubReplySubmit = async (e) => {
        e.preventDefault();
        if (!loggedInUser) {
            window.confirm('Please log in to reply.');
            return;
        }
        await onReplySubmit(e, postId, reply._id, subReplyText);
        setSubReplyText('');
        setShowSubReplyForm(false); 
        setShowNestedReplies(true);
    };

    const indentClass = `pl-${Math.min(level * 4, 20)}`;

    return (
        <div className={`bg-white p-3 rounded-lg border border-gray-200 mt-3 ${indentClass}`}>
            <div className="flex items-center text-sm text-gray-600 mb-1">
                <span className="font-medium text-gray-800">{reply.author}</span>
                <span className="mx-1">•</span>
                <span>{new Date(reply.date).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700">{reply.content}</p>

            <div className="flex items-center gap-4 mt-2">
                {loggedInUser && (
                    <button
                        onClick={() => setShowSubReplyForm(!showSubReplyForm)}
                        className="text-blue-600 hover:underline text-sm"
                    >
                        {showSubReplyForm ? 'Cancel Reply' : 'Reply'}
                    </button>
                )}

                {reply.replies && reply.replies.length > 0 && (
                    <button
                        onClick={() => setShowNestedReplies(!showNestedReplies)}
                        className="text-gray-600 hover:underline text-sm"
                    >
                        {showNestedReplies ? `Hide ${reply.replies.length} replies` : `View ${reply.replies.length} replies`}
                    </button>
                )}
            </div>


            {showSubReplyForm && loggedInUser && (
                <form onSubmit={handleSubReplySubmit} className="mt-3">
                    <textarea
                        value={subReplyText}
                        onChange={(e) => setSubReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        rows="2"
                        required
                    ></textarea>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                            Post Reply
                        </button>
                    </div>
                </form>
            )}

            {/* Recursively render sub-replies only if showNestedReplies is true */}
            {showNestedReplies && reply.replies && reply.replies.length > 0 && (
                <div className="mt-3">
                    {reply.replies.map(subReply => (
                        <ReplyComponent
                            key={subReply._id}
                            reply={subReply}
                            postId={postId}
                            loggedInUser={loggedInUser}
                            onReplySubmit={onReplySubmit}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};


const ForumPage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('All Topics');
    const [searchQuery, setSearchQuery] = useState('');
    const [showNewPostForm, setShowNewPostForm] = useState(false);
    const [expandedPosts, setExpandedPosts] = useState([]);
    const [showTopLevelReplyForm, setShowTopLevelReplyForm] = useState({});
    const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [allPosts, setAllPosts] = useState([]);

    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('Destination Tips');
    const [newPostContent, setNewPostContent] = useState('');
    const [topLevelReplyTexts, setTopLevelReplyTexts] = useState({});

    const [loggedInUser, setLoggedInUser] = useState(null);

    const token = localStorage.getItem('Token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    const forumCategories = [
        'All Topics',
        'Destination Tips',
        'Travel Deals',
        'Accommodation',
        'Transportation',
        'Travel Stories',
        'Questions'
    ];

    useEffect(() => {
        if (token && username) {
            setLoggedInUser(username);
        }
    }, [token, username]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/api/posts');
            setAllPosts(response.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const filteredPosts = allPosts.filter(post => {
        const matchesCategory = activeCategory === 'All Topics' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const togglePostExpansion = (postId) => {
        if (expandedPosts.includes(postId)) {
            setExpandedPosts(expandedPosts.filter(id => id !== postId));
        } else {
            setExpandedPosts([...expandedPosts, postId]);
        }
    };

    const toggleTopLevelReplyForm = (postId) => {
        setShowTopLevelReplyForm(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    const toggleBookmark = (postId) => {
        if (bookmarkedPosts.includes(postId)) {
            setBookmarkedPosts(bookmarkedPosts.filter(id => id !== postId));
        } else {
            setBookmarkedPosts([...bookmarkedPosts, postId]);
        }
    };

    const toggleLike = async (postId) => {
        if (!loggedInUser) {
            const response = window.confirm('Please log in to like posts. Do you want to go to the login page?');
            if (response) {
                navigate('/login');
                console.log("User wants to go to login page.");
            }
            return;
        }

        const currentToken = localStorage.getItem('Token');
        const isCurrentlyLiked = likedPosts.includes(postId);

        try {
            const response = await axios.post(`/api/posts/${postId}/toggle-like`, { isLiked: isCurrentlyLiked }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                }
            });

            if (isCurrentlyLiked) {
                setLikedPosts(likedPosts.filter(id => id !== postId));
            } else {
                setLikedPosts([...likedPosts, postId]);
            }

            setAllPosts(prevPosts => prevPosts.map(post =>
                post._id === postId ? { ...post, likes: response.data.likes } : post
            ));

        } catch (error) {
            console.error('Error toggling like:', error);
            window.confirm('Failed to toggle like. Please try again.');
        }
    };

    const handleNewPostSubmit = async (e) => {
        e.preventDefault();

        if (!loggedInUser) {
            const response = window.confirm('Please log in to create a new post. Do you want to go to the login page?');
            if (response) {
                navigate('/login');
                console.log("User wants to go to login page.");
            }
            return;
        }

        const currentToken = localStorage.getItem('Token');

        try {
            const response = await axios.post('/api/posts', {
                title: newPostTitle,
                category: newPostCategory,
                content: newPostContent,
                role,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                }
            });

            const newPost = response.data;
            setAllPosts([newPost, ...allPosts]);
            setNewPostTitle('');
            setNewPostContent('');
            setShowNewPostForm(false);
            window.confirm('Post created successfully!');

        } catch (error) {
            console.error('Error creating post:', error);
            window.confirm('Failed to create post. Please try again.');
        }
    };

    const handleReplySubmit = async (e, postId, parentReplyId = null, replyContent) => {
        e.preventDefault();

        if (!loggedInUser) {
            window.confirm('Please log in to reply.');
            return;
        }

        const currentToken = localStorage.getItem('Token');
        // Ensure content is not empty
        if (!replyContent || replyContent.trim() === '') {
            window.confirm('Reply content cannot be empty.');
            return;
        }

        try {
            let apiEndpoint;
            let payload = { replyContent: replyContent, role };

            if (parentReplyId) {
                apiEndpoint = `/api/posts/${postId}/replies/${parentReplyId}`;
            } else {
                apiEndpoint = `/api/posts/${postId}/reply`;
            }

            await axios.post(apiEndpoint, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                }
            });

            // Re-fetch posts to get the latest replies structure after a successful post
            fetchPosts();

            if (!parentReplyId) {
                setTopLevelReplyTexts(prev => ({ ...prev, [postId]: '' }));
                setShowTopLevelReplyForm(prev => ({ ...prev, [postId]: false }));
            }
            
            window.confirm('Reply posted successfully!');

        } catch (error) {
            console.error('Error posting reply:', error);
            window.confirm('Failed to post reply. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    {!loggedInUser && (
                        <div className="mb-8 p-6 bg-red-100 border border-yellow-200 text-yellow-800 rounded-lg text-center">
                            <p className="font-semibold text-lg">You are not logged in.</p>
                            <p className="mt-2">Please <a href="/login" className="text-blue-600 hover:underline font-medium">log in</a> to create new posts, like, or reply to discussions.</p>
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="w-full md:w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                                <h3 className="font-bold text-lg mb-4 text-gray-800">Categories</h3>
                                <ul className="space-y-2">
                                    {forumCategories.map(category => (
                                        <li key={category}>
                                            <button
                                                onClick={() => setActiveCategory(category)}
                                                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${activeCategory === category ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'}`}
                                            >
                                                {category}
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8">
                                    <h3 className="font-bold text-lg mb-3 text-gray-800">Forum Rules</h3>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li>• Be respectful to others</li>
                                        <li>• No spam or self-promotion</li>
                                        <li>• Keep discussions travel-related</li>
                                        <li>• Share your experiences</li>
                                    </ul>
                                </div>

                                <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-100">
                                    <p className="text-sm text-blue-800">
                                        Need help? Our travel experts are happy to answer your questions!
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">Travel Community Forum</h1>

                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                                    <div className="relative flex-1">
                                        <FiSearch className="absolute left-3 top-3 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search forum posts..."
                                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    {loggedInUser && (
                                        <button
                                            onClick={() => setShowNewPostForm(true)}
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <FiPlusCircle /> New Post
                                        </button>
                                    )}
                                </div>

                                {showNewPostForm && loggedInUser && (
                                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                        <h3 className="text-lg font-semibold mb-3">Create New Post</h3>
                                        <form onSubmit={handleNewPostSubmit}>
                                            <div className="mb-3">
                                                <label className="block text-gray-700 mb-1">Title</label>
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    value={newPostTitle}
                                                    onChange={(e) => setNewPostTitle(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label className="block text-gray-700 mb-1">Category</label>
                                                <select
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    value={newPostCategory}
                                                    onChange={(e) => setNewPostCategory(e.target.value)}
                                                >
                                                    {forumCategories.filter(cat => cat !== 'All Topics').map(category => (
                                                        <option key={category} value={category}>{category}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="block text-gray-700 mb-1">Content</label>
                                                <textarea
                                                    rows="4"
                                                    className="w-full p-2 border border-gray-300 rounded"
                                                    value={newPostContent}
                                                    onChange={(e) => setNewPostContent(e.target.value)}
                                                    required
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPostForm(false)}
                                                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >
                                                    Post
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {filteredPosts.length > 0 ? (
                                        filteredPosts.map(post => (
                                            <div key={post._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
                                                <div className="bg-white p-5">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                                                                {post.category}
                                                            </span>
                                                            <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleBookmark(post._id)}
                                                            className={`p-2 rounded-full ${bookmarkedPosts.includes(post._id) ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
                                                        >
                                                            <FiBookmark />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                                        <span className="font-medium text-gray-700">{post.author}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{new Date(post.date).toLocaleDateString()}</span>
                                                    </div>

                                                    <p className={`text-gray-700 mb-4 ${!expandedPosts.includes(post._id) ? 'line-clamp-3' : ''}`}>
                                                        {post.content}
                                                    </p>

                                                    {post.content.length > 150 && (
                                                        <button
                                                            onClick={() => togglePostExpansion(post._id)}
                                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-4"
                                                        >
                                                            {expandedPosts.includes(post._id) ? 'Show less' : 'Read more'}
                                                        </button>
                                                    )}

                                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                                        <div className="flex items-center space-x-4">
                                                            <button
                                                                onClick={() => toggleLike(post._id)}
                                                                className={`flex items-center space-x-1 ${likedPosts.includes(post._id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                                                            >
                                                                <FiHeart className={likedPosts.includes(post._id) ? 'fill-current' : ''} />
                                                                <span>{post.likes || 0}</span>
                                                            </button>
                                                            <button
                                                                onClick={() => toggleTopLevelReplyForm(post._id)}
                                                                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                                                            >
                                                                <FiMessageSquare />
                                                                <span>{post.replies ? post.replies.length : 0}</span>
                                                            </button>
                                                        </div>
                                                        <button className="text-gray-500 hover:text-gray-700">
                                                            <FiShare2 />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Top-Level Reply Form */}
                                                {showTopLevelReplyForm[post._id] && loggedInUser && (
                                                    <div className="bg-gray-50 p-5 border-t border-gray-200">
                                                        <form onSubmit={(e) => handleReplySubmit(e, post._id, null, topLevelReplyTexts[post._id])}>
                                                            <textarea
                                                                value={topLevelReplyTexts[post._id] || ''}
                                                                onChange={(e) => setTopLevelReplyTexts({ ...topLevelReplyTexts, [post._id]: e.target.value })}
                                                                placeholder="Write your reply..."
                                                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                                                                rows="3"
                                                                required
                                                            ></textarea>
                                                            <div className="flex justify-end space-x-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleTopLevelReplyForm(post._id)}
                                                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                                >
                                                                    Post Reply
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                )}

                                                {/* Display Replies Section (top-level and nested) */}
                                                {(expandedPosts.includes(post._id) || showTopLevelReplyForm[post._id]) && post.replies && post.replies.length > 0 && (
                                                    <div className="bg-gray-100 p-5 border-t border-gray-200">
                                                        <h4 className="font-semibold text-lg mb-3">Replies ({post.replies.length})</h4>
                                                        <div className="space-y-3">
                                                            {post.replies.map((reply) => (
                                                                <ReplyComponent
                                                                    key={reply._id}
                                                                    reply={reply}
                                                                    postId={post._id}
                                                                    loggedInUser={loggedInUser}
                                                                    onReplySubmit={handleReplySubmit}
                                                                    level={0}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-500">No posts found. Try a different search or category.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ForumPage;