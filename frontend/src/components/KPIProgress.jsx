import React from 'react';

function KPIProgress() {
  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Monthly KPI progress</h3>
        <span className="text-sm text-gray-500">April 2022</span>
      </div> 

      <div className="space-y-4">
        {/* Sales Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Sales</span>
            <span className="text-sm font-medium">14/20</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
          </div>
        </div>

        {/* Inbound Calls Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Inbound calls</span>
            <span className="text-sm font-medium">50/64</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
          </div>
        </div>

        {/* Outbound Calls Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Outbound calls</span>
            <span className="text-sm font-medium">23/35</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Quality Score Progress */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Quality score</span>
            <span className="text-sm font-medium">17/20</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default KPIProgress;