import React from 'react';

function StatCard({ title, value }) {
  return ( 
    <div className="bg-white p-20 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-4xl font-bold text-center">{value}</h3>
      <p className="text-center text-indigo-600 font-medium">{title}</p>
      {/* <p className="text-center text-gray-500">today</p> */}
    </div>
  );
}

export default StatCard;