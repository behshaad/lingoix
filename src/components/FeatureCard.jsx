import React from "react";

const FeatureCard = ({ title, description }) => {
  return (
    <div className="feature-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 text-center">
      <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
        {title}
      </h3>
      <p className="text-lg text-gray-800 dark:text-gray-200">{description}</p>
    </div>
  );
};

export default FeatureCard;

