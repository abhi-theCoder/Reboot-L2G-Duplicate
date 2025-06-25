import React from 'react';
import StatCard from './StatCard';
import Chart from './Chart';
import PieChart from './PieChart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faSearch, faUsers, faUserCheck, faUserTimes, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function MainContent({ collapsed }) {
  // Example stats, replace with real data from your backend if available
  const totalAgents = 120;
  const activeAgents = 95;
  const inactiveAgents = 25;
  const totalLocations = 34;

  return (
    <main className="p-4 transition-all duration-300 ease-in-out pl-6">
      <h1 className="text-2xl font-bold text-indigo-800 mb-2">Welcome to the L2G Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Manage your agents, monitor requests, and view key statistics for your business.
      </p>

      <div className="flex justify-between items-center mb-6">
        <div className="relative mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search agents, locations, or requests"
            className="bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-400"
          />
        </div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 rounded-lg px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50 transition-colors">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-600" />
            June 2025
          </button>
          <Link
            to="/agent-register"
            className="bg-gradient-to-r from-indigo-600 to-green-600 text-white rounded-lg px-4 py-2 flex items-center hover:opacity-90 transition-opacity"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Agent
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Agents"
          value={totalAgents}
          icon={<FontAwesomeIcon icon={faUsers} className="text-indigo-600 text-2xl" />}
        />
        <StatCard
          title="Active Agents"
          value={activeAgents}
          icon={<FontAwesomeIcon icon={faUserCheck} className="text-green-600 text-2xl" />}
        />
        <StatCard
          title="Inactive Agents"
          value={inactiveAgents}
          icon={<FontAwesomeIcon icon={faUserTimes} className="text-red-600 text-2xl" />}
        />
        <StatCard
          title="Locations Covered"
          value={totalLocations}
          icon={<FontAwesomeIcon icon={faMapMarkerAlt} className="text-yellow-600 text-2xl" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Chart />
        <PieChart />
        {/* You can add another chart or a summary component here */}
      </div>

      {/* You can add more dashboard widgets or tables below as needed */}
    </main>
  );
}

export default MainContent;
