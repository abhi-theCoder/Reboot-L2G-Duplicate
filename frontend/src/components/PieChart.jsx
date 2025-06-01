import React from 'react';

function PieChart() { 
  return ( 
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Users by campaigns</h3>
        <span className="text-xs text-gray-500">Start of year - till today</span>
      </div>
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-32 h-32 transform -rotate-90">
            <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3.6"></circle>
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="3.6"
              strokeDasharray="80 100"
              strokeLinecap="round"
            ></circle>
          </svg>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></span>
          <span className="text-sm">Campaign 1</span>
          <span className="ml-auto text-sm font-medium">524 213</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></span>
          <span className="text-sm">Campaign 2</span>
          <span className="ml-auto text-sm font-medium">123 151</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-indigo-200 rounded-full mr-2"></span>
          <span className="text-sm">Campaign 3</span>
          <span className="ml-auto text-sm font-medium">48 213</span>
        </div>
      </div>
    </div>
    </>
  );
}

export default PieChart;