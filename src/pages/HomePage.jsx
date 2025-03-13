import React from "react";

import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import SignUpCallToAction from "../components/SignUpCallToAction";
// import TestDovom from "../components/TestDovom/TesstDovom";
// import Test from "./Test";
// import Herop from "../components/TestDovom/TesstDovom";

const HomePage = () => {
  return (
    <div className="home-page top-4">
      {/* <Herop/> */}
      {/* <Test/> */}
      {/* <TestDovom/> */}
      <Header />
      <FeaturesSection />
      <SignUpCallToAction />
    </div>
  );
};

export default HomePage;
