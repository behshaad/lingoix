import React from "react";

import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import SignUpCallToAction from "../components/SignUpCallToAction";
// import Test from "../components/Test";

const HomePage = () => {
  return (
    <div className="home-page top-4">
      {/* <Test/> */}
      <Header />
      <FeaturesSection />
      <SignUpCallToAction />
    </div>
  );
};

export default HomePage;
