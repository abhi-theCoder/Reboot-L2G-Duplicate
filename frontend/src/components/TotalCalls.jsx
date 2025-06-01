import React from 'react';

function TotalCalls() {
  return ( 
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-medium mb-4">Total calls from campaigns</h3>
      <div className="flex items-center justify-center mb-6">
        <h2 className="text-4xl font-bold">695 577</h2>
      </div>
      <h3 className="text-lg font-medium mb-4">Average from total</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></span>
          <span>Clients</span>
          <span className="ml-2 text-xs text-gray-500">67% users</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-indigo-400 rounded-full mr-2"></span>
          <span>Other</span>
          <span className="ml-2 text-xs text-gray-500">33% users</span>
        </div>
      </div>
    </div>
    </>
  );
}

export default TotalCalls;