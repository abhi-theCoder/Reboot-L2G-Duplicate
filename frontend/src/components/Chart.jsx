import React from 'react';

function Chart() {
  return (
    <> 
      <div className="bg-white p-6 rounded-xl shadow-sm lg:col-span-2">
      <h3 className="text-lg font-medium mb-4">Overall monthly performance</h3>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        {/* Chart placeholder - in a real app you would use Chart.js or similar */}
        <div className="w-full h-full relative">
          <div className="absolute bottom-0 left-0 w-full h-1/2 border-t border-gray-200">
            <div className="absolute bottom-0 left-0 w-full h-16 bg-indigo-100"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300"></div>
            <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
              <path
                d="M0,50 L0,35 C10,28 20,32 30,25 C40,18 50,15 60,5 C70,15 80,30 90,38 C95,42 100,40 100,35 L100,50 Z"
                fill="none" stroke="#4F46E5" strokeWidth="2"></path>
              <circle cx="60" cy="5" r="3" fill="#4F46E5"></circle>
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-full flex justify-between px-4 text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Chart;