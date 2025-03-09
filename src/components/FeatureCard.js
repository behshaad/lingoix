import React from "react";

const FeatureCard = ({ title, description }) => {
  return (
    <div className="feature-card bg-white p-6 rounded-lg shadow-lg w-64 text-center">
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-lg">{description}</p>
    </div>
  );
};

export default FeatureCard;
