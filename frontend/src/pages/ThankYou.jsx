import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const agentID = searchParams.get('agentID');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center space-y-4">
        <CheckCircle className="mx-auto text-green-500" size={60} strokeWidth={2.5} />
        <h1 className="text-3xl font-bold text-green-700">Payment Successful</h1>
        <p className="text-gray-700">Thank you for your payment. Your transaction has been completed successfully.</p>
        {agentID && (
          <p className="text-sm text-gray-500">
            Agent ID: <span className="font-medium text-black">{agentID}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default ThankYou;
