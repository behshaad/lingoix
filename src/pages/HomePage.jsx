import React from "react";

import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import SignUpCallToAction from "../components/SignUpCallToAction";
import Test from "../components/MainHomPage";

const HomePage = () => {
  return (
    <div className="home-page top-4">
      <Header />
      <FeaturesSection />
      {/* <SignUpCallToAction /> */}
      <Test />
    </div>
  );
};

export default HomePage;
