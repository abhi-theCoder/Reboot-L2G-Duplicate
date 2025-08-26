import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faUsers, faUserCheck, faUserTimes, faUserClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from '../api';

function MainContent({ collapsed }) {
  const now = new Date(Date.now());
  const month = now.toLocaleString('default', { month: 'short' });
  const year = now.getFullYear();

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/agents/status-count', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('Token')}`,
          },
        });
        const { total, active, inactive, pending } = response.data.counts;
        setStats({
          total,
          active,
          inactive,
          pending,
        });
      } catch (error) {
        console.error("Error fetching agent status summary:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8 transition-all duration-300 ease-in-out">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-12 max-w-7xl mx-auto">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-2 text-lg max-w-3xl">
            Welcome back! Here’s a quick overview of your agents. Use the sidebar to explore more operations and manage everything seamlessly.
          </p>
        </div>
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <button className="flex items-center justify-center border border-gray-300 rounded-xl px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 transition-colors shadow-sm">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-600" />
            <span>{month+" "+year}</span>
          </button>
          <Link
            to="/agent-register"
            className="flex items-center justify-center bg-indigo-600 text-white rounded-xl px-6 py-2 shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            <span>Add New Agent</span>
          </Link>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard
          title="Total Agents"
          value={stats.total}
          icon={<FontAwesomeIcon icon={faUsers} className="text-white text-3xl p-4 bg-indigo-500 rounded-full shadow-lg" />}
        />
        <StatCard
          title="Active Agents"
          value={stats.active}
          icon={<FontAwesomeIcon icon={faUserCheck} className="text-white text-3xl p-4 bg-green-500 rounded-full shadow-lg" />}
        />
        <StatCard
          title="Inactive Agents"
          value={stats.inactive}
          icon={<FontAwesomeIcon icon={faUserTimes} className="text-white text-3xl p-4 bg-red-500 rounded-full shadow-lg" />}
        />
        <StatCard
          title="Pending Agents"
          value={stats.pending}
          icon={<FontAwesomeIcon icon={faUserClock} className="text-white text-3xl p-4 bg-yellow-500 rounded-full shadow-lg" />}
        />
      </div>
    </main>
  );
}

export default MainContent;