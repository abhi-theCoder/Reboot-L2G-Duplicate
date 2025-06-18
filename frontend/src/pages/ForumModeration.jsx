import { useState } from 'react';
import { FaCheck, FaTimes, FaTrash, FaSearch, FaComments, FaReply } from 'react-icons/fa';
import { FiAlertCircle } from 'react-icons/fi';

const ForumModeration = () => {
    const [comments, setComments] = useState([
        {
            id: '1',
            author: 'John Doe',
            email: 'john@example.com',
            content: 'This product is amazing! The quality exceeded my expectations.',
            date: '2023-05-15 10:30',
            status: 'pending',
            replies: [
                {
                    id: '1-1',
                    author: 'Admin Support',
                    email: 'support@company.com',
                    content: 'Thank you for your feedback! We appreciate your kind words.',
                    date: '2023-05-15 11:45',
                    status: 'approved'
                },
                {
                    id: '1-2',
                    author: 'Jane Smith',
                    email: 'jane@example.com',
                    content: 'I agree! The product is really worth the price.',
                    date: '2023-05-15 12:30',
                    status: 'pending'
                }
            ]
        },
        {
            id: '2',
            author: 'Sarah Smith',
            email: 'sarah@example.com',
            content: 'I had some issues with the delivery time, but the product itself is good.',
            date: '2023-05-16 14:45',
            status: 'pending',
            replies: []
        },
        {
            id: '3',
            author: 'Mike Johnson',
            email: 'mike@example.com',
            content: 'The customer service was very helpful when I had questions.',
            date: '2023-05-17 09:15',
            status: 'pending',
            replies: [
                {
                    id: '3-1',
                    author: 'Customer Rep',
                    email: 'rep@company.com',
                    content: 'We are happy to assist you anytime!',
                    date: '2023-05-17 10:30',
                    status: 'pending'
                }
            ]
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);
    const [expandedComments, setExpandedComments] = useState([]);

    const toggleCommentExpansion = (id) => {
        if (expandedComments.includes(id)) {
            setExpandedComments(expandedComments.filter(commentId => commentId !== id));
        } else {
            setExpandedComments([...expandedComments, id]);
        }
    };

    const updateCommentStatus = (commentId, replyId, status) => {
        if (replyId) {
            // Update a reply
            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.map(reply =>
                            reply.id === replyId ? { ...reply, status } : reply
                        )
                    };
                }
                return comment;
            }));
        } else {
            // Update a main comment
            setComments(comments.map(comment =>
                comment.id === commentId ? { ...comment, status } : comment
            ));
        }
    };

    const handleDeleteClick = (commentId, replyId = null) => {
        setCommentToDelete({ commentId, replyId });
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (commentToDelete.replyId) {
            // Delete a reply
            setComments(comments.map(comment => {
                if (comment.id === commentToDelete.commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.filter(reply => reply.id !== commentToDelete.replyId)
                    };
                }
                return comment;
            }));
        } else {
            // Delete a main comment
            setComments(comments.filter(comment => comment.id !== commentToDelete.commentId));
        }
        setShowDeleteModal(false);
        setCommentToDelete(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setCommentToDelete(null);
    };

    // Count all comments and replies
    const countAllComments = () => {
        return comments.reduce((total, comment) => total + 1 + comment.replies.length, 0);
    };

    const countByStatus = (status) => {
        let count = 0;
        comments.forEach(comment => {
            if (comment.status === status) count++;
            comment.replies.forEach(reply => {
                if (reply.status === status) count++;
            });
        });
        return count;
    };

    const filteredComments = comments.filter(comment => {
        const matchesSearch =
            comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comment.email.toLowerCase().includes(searchTerm.toLowerCase());

        const hasPendingReplies = comment.replies.some(reply => reply.status === 'pending');

        return (comment.status === 'pending' || hasPendingReplies) && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <FaComments className="text-indigo-600 text-3xl mr-3" />
                        <h1 className="text-2xl font-bold text-gray-800">Customer Forum Moderation</h1>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search comments..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Updated Statistics Cards */}
                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg shadow-sm border border-blue-50">
                        <h3 className="text-sm font-medium text-blue-800 mb-2">Total</h3>
                        <div className="text-2xl font-bold text-blue-900">
                            {countAllComments()}
                        </div>
                        <div className="mt-1 text-xs text-blue-600">All comments</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg shadow-sm border border-green-50">
                        <h3 className="text-sm font-medium text-green-800 mb-2">Approved</h3>
                        <div className="text-2xl font-bold text-green-900">
                            {countByStatus('approved')}
                        </div>
                        <div className="mt-1 text-xs text-green-600">Approved content</div>
                    </div>
                    <div className="bg-gradient-to-r from-amber-100 to-amber-200 p-4 rounded-lg shadow-sm border border-amber-50">
                        <h3 className="text-sm font-medium text-amber-800 mb-2">Pending</h3>
                        <div className="text-2xl font-bold text-amber-900">
                            {countByStatus('pending')}
                        </div>
                        <div className="mt-1 text-xs text-amber-600">Needs review</div>
                    </div>
                    <div className="bg-gradient-to-r from-rose-100 to-rose-200 p-4 rounded-lg shadow-sm border border-rose-50">
                        <h3 className="text-sm font-medium text-rose-800 mb-2">Rejected</h3>
                        <div className="text-2xl font-bold text-rose-900">
                            {countByStatus('rejected')}
                        </div>
                        <div className="mt-1 text-xs text-rose-600">Removed content</div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <FiAlertCircle className="text-yellow-500 mr-2" />
                            <span className="font-medium">
                                {countByStatus('pending')} comments/replies awaiting moderation
                            </span>
                        </div>
                    </div>

                    {filteredComments.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No pending comments to moderate
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-200">
                            {filteredComments.map((comment) => (
                                <li key={comment.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center mb-2">
                                                <h3 className="text-lg font-medium text-gray-900 mr-3">
                                                    {comment.author}
                                                </h3>
                                                <span className="text-sm text-gray-500">{comment.email}</span>
                                                {comment.status === 'pending' && (
                                                    <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                                        Pending
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-700 mb-3">{comment.content}</p>
                                            <span className="text-sm text-gray-500">
                                                Posted on {comment.date}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            {comment.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateCommentStatus(comment.id, null, 'approved')}
                                                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md"
                                                        title="Approve"
                                                    >
                                                        <FaCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => updateCommentStatus(comment.id, null, 'rejected')}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                                                        title="Reject"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDeleteClick(comment.id)}
                                                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                            <button
                                                onClick={() => toggleCommentExpansion(comment.id)}
                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md"
                                                title={expandedComments.includes(comment.id) ? "Hide replies" : "Show replies"}
                                            >
                                                <FaReply className={expandedComments.includes(comment.id) ? "transform rotate-180" : ""} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Replies section */}
                                    {expandedComments.includes(comment.id) && comment.replies.length > 0 && (
                                        <div className="mt-4 pl-8 border-l-2 border-gray-200">
                                            <h4 className="text-sm font-medium text-gray-500 mb-3">Replies ({comment.replies.length})</h4>
                                            <ul className="space-y-4">
                                                {comment.replies.map((reply) => (
                                                    <li key={reply.id} className="bg-gray-50 p-4 rounded-md">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center mb-2">
                                                                    <h5 className="text-md font-medium text-gray-800 mr-3">
                                                                        {reply.author}
                                                                    </h5>
                                                                    <span className="text-xs text-gray-500">{reply.email}</span>
                                                                    {reply.status === 'pending' && (
                                                                        <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-600 text-sm mb-2">{reply.content}</p>
                                                                <span className="text-xs text-gray-400">
                                                                    Replied on {reply.date}
                                                                </span>
                                                            </div>
                                                            <div className="flex space-x-2">
                                                                {reply.status === 'pending' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => updateCommentStatus(comment.id, reply.id, 'approved')}
                                                                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md"
                                                                            title="Approve"
                                                                        >
                                                                            <FaCheck size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => updateCommentStatus(comment.id, reply.id, 'rejected')}
                                                                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md"
                                                                            title="Reject"
                                                                        >
                                                                            <FaTimes size={14} />
                                                                        </button>
                                                                    </>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteClick(comment.id, reply.id)}
                                                                    className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md"
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
                            <p className="mb-6">Do you really want to delete this {commentToDelete?.replyId ? 'reply' : 'comment'}? This action cannot be undone.</p>
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={cancelDelete}
                                    className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForumModeration;