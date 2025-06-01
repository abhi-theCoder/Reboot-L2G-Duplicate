import React, { useEffect, useState } from 'react';
import axios from '../api';
import { ChevronDown, ChevronUp } from 'lucide-react';

const BookingHistory = () => {
  const [filter, setFilter] = useState('active');
  const [bookings, setBookings] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const currentAgentID = localStorage.getItem("agentID");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get('/api/agents/booking-history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
          },
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch booking history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const toggleExpand = (txnId) => {
    setExpanded((prev) => ({ ...prev, [txnId]: !prev[txnId] }));
  };

  const handleCancel = async (txnId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.put(`/api/agents/cancel-booking/${txnId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Token')}`,
        },
      });
      alert('Booking cancellation request sent successfully.');
      setBookings((prev) =>
        prev.map((b) =>
          b.transactionId === txnId
            ? { ...b, cancellationRequested: true }
            : b
        )
      );
    } catch (err) {
      console.error('Cancellation failed:', err);
      alert('Failed to cancel booking.');
    }
  };

  const parseCustomDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('-')) return new Date();
    const [yyyy, mm, dd] = dateStr.split('-');
    return new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  };

  if (loading) return <div className="p-4 text-center">Loading booking history...</div>;

  const grouped = {
  active: bookings.filter(b => !b.cancellationRequested && !b.cancellationApproved && !b.cancellationRejected),
  requested: bookings.filter(b => b.cancellationRequested === true && !b.cancellationApproved && !b.cancellationRejected),
  approved: bookings.filter(b => b.cancellationApproved === true),
  rejected: bookings.filter(b => b.cancellationRejected === true),
};
  const getFilteredBookings = () => {
    switch (filter) {
      case 'requested': return { title: 'Cancellation Requested', items: grouped.requested, color: 'yellow' };
      case 'approved': return { title: 'Cancellation Approved', items: grouped.approved, color: 'green' };
      case 'rejected': return { title: 'Cancellation Rejected', items: grouped.rejected, color: 'red' };
      case 'active':
      default: return { title: 'Active Bookings', items: grouped.active, color: 'blue' };
    }
  };

  const filtered = getFilteredBookings();


  const renderSection = (title, items, color = 'gray') => (
    <div className="mb-12">
      <h3 className={`text-2xl font-bold mb-4 text-${color}-700 border-b pb-2`}>
        {title} ({items.length})
      </h3>
      {items.length === 0 ? (
        <div className="text-sm text-gray-500">No bookings in this section.</div>
      ) : (
        <div className="space-y-6">
          {items.map(txn => {
            const tourDate = parseCustomDate(txn.tourStartDate);
            const now = new Date();
            const isCancelable = tourDate > now;

            return (
              <div
                key={txn.transactionId}
                className="bg-white border border-gray-200 shadow-md rounded-xl p-5 hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold text-indigo-800">🎟️ Tour ID: {txn.tourID}</div>
                    <div className="text-sm text-gray-600">👥 Occupancy: {txn.tourGivenOccupancy}/{txn.tourActualOccupancy}</div>
                    <div className="text-sm text-gray-600">📅 Tour Date: {tourDate.toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">💵 Price/Head: ₹{txn.tourPricePerHead}</div>
                    <div className="text-sm text-green-700 font-medium">📦 Total: ₹{(txn.tourGivenOccupancy * txn.tourPricePerHead).toFixed(2)}</div>
                  </div>

                  <div className="flex flex-col items-start md:items-end">
                    <button
                      onClick={() => toggleExpand(txn.transactionId)}
                      className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      {expanded[txn.transactionId] ? (
                        <>Hide Details <ChevronUp size={16} /></>
                      ) : (
                        <>View Details <ChevronDown size={16} /></>
                      )}
                    </button>
                    {title === "Active Bookings" && isCancelable && (
                    <button
                      onClick={() => handleCancel(txn.transactionId)}
                      className="mt-2 bg-red-600 text-white text-sm px-4 py-1 rounded hover:bg-red-700 transition"
                    >
                        Cancel Booking
                    </button>
                    )}

                    {title === "Cancellation Requested" && (
                      <span className="text-yellow-600 mt-1 text-sm font-semibold">⏳ Pending</span>
                    )}
                    {title === "Cancellation Approved" && (
                      <span className="text-green-600 mt-1 text-sm font-semibold">✅ Approved</span>
                    )}
                    {title === "Cancellation Rejected" && (
                      <span className="text-red-600 mt-1 text-sm font-semibold">❌ Rejected</span>
                    )}
                  </div>
                </div>

                {expanded[txn.transactionId] && (
                  <div className="mt-4 border-t pt-4 text-sm text-gray-700 space-y-2">
                    <div>📧 <strong>Customer Email:</strong> {txn.customerEmail}</div>
                    <div>🆔 <strong>Transaction ID:</strong> {txn.transactionId}</div>
                    <div>📆 <strong>Booking Date:</strong> {new Date(txn.createdAt).toLocaleDateString()}</div>
                    <div>🧑‍💼 <strong>Agent:</strong> {txn.agentName} ({txn.agentID})</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
    <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700 border-b pb-4">
      Booking History
    </h2>

    <div className="mb-8 flex justify-center">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-gray-300 rounded-md px-4 py-2 shadow-sm text-gray-700"
      >
        <option value="active">Active Bookings</option>
        <option value="requested">Pending Cancellations</option>
        <option value="approved">Approved Cancellations</option>
        <option value="rejected">Rejected Cancellations</option>
      </select>
    </div>

    {renderSection(filtered.title, filtered.items, filtered.color)}
  </div>
  );
};

export default BookingHistory;
