import React from "react";

import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import SignUpCallToAction from "../components/SignUpCallToAction";

const HomePage = () => {
  return (
    <div className="home-page top-4">
      <Header />
      <FeaturesSection />
      <SignUpCallToAction />
    </div>
  );
};

export default HomePage;
