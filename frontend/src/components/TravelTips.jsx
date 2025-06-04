import React from "react";
import { FaCalendarAlt, FaUsers, FaFileAlt } from "react-icons/fa";

const TravelTips = () => {
  const tips = [
    {
      title: "Best Time to Visit",
      description: "Learn about the ideal seasons and weather conditions for your chosen destination",
      icon: <FaCalendarAlt className="text-blue-500" />
    },
    {
      title: "Local Culture",
      description: "Understand local customs, traditions, and etiquette to make the most of your visit",
      icon: <FaUsers className="text-blue-500" />
    },
    {
      title: "Travel Requirements",
      description: "Get information about necessary documents, permits, and health requirements",
      icon: <FaFileAlt className="text-blue-500" />
    }
  ];

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1500px] w-full mx-auto">
        <h2 className="xl:text-4xl font-extrabold text-gray-900 mb-8">
          Travel Tips & Information
        </h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, index) => (
            <div 
              key={index}
              className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              <div className="flex items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {tip.title}
                </h3>
              </div>
              <p className="text-gray-600 mt-1 flex-grow">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TravelTips;