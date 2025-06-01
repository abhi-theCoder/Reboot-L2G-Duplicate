import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { XCircle } from 'lucide-react'; // Red cancel icon

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const agentID = searchParams.get('agentID');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full text-center space-y-4">
        <XCircle className="mx-auto text-red-500" size={60} strokeWidth={2.5} />
        <h1 className="text-3xl font-bold text-red-700">Payment Cancelled</h1>
        <p className="text-gray-700">It looks like the payment was not completed.</p>
        {agentID && (
          <p className="text-sm text-gray-500">
            Agent ID: <span className="font-medium text-black">{agentID}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentCancelled;