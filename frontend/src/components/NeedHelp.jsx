import React from "react";

const NeedHelp = ({ className = "" }) => (
    <div className={`mt-16 bg-[#E8F3FF] ${className}`}>
        <div className="max-w-[1500px] mx-auto px-4 py-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Need Help?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                        24/7 Support
                    </h3>
                    <p className="text-gray-600">
                        Our travel experts are available round the clock to assist you
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                        Secure Booking
                    </h3>
                    <p className="text-gray-600">
                        Your payments and personal information are protected
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                        Best Price Guarantee
                    </h3>
                    <p className="text-gray-600">
                        Find a lower price? We'll match it!
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default NeedHelp;