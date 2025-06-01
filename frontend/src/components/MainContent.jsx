import React from 'react';
import StatCard from './StatCard';
import Chart from './Chart';
import PieChart from './PieChart';
import TotalCalls from './TotalCalls';
import KPIProgress from './KPIProgress';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

function MainContent({ collapsed }) {
  return (
    <main className="p-4 transition-all duration-300 ease-in-out pl-6">
      <p className="text-gray-600 mb-4">Welcome to your main dashboard. You can customize it to best fit your needs.</p>

      <div className="flex justify-between items-center mb-4">
        <div className="relative mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search"
            className="bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-gray-400"
          />
        </div>
        <div className="flex space-x-2">
          <button className="border border-gray-300 rounded-lg px-4 py-2 flex items-center text-gray-700 hover:bg-gray-50 transition-colors">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-600" />
            April 2022
          </button>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg px-4 py-2 flex items-center hover:opacity-90 transition-opacity">
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add new card
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Inbound calls" value="67" />
        <StatCard title="Outbound calls" value="53" />
        <StatCard title="AVG DURATION" value="12min 34s" />
        <StatCard title="AVG DURATION" value="5min 23s" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Chart />
        <PieChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TotalCalls />
        <KPIProgress />
      </div>
    </main>
  );
}

export default MainContent;
