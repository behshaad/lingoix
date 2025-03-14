import React from "react";

import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import Test from "./Testix";
import SmartLearnHero from "../components/SmartLearnHero";
import StepbyStep from "../components/Stepby/StepbyStep";
const HomePage = () => {
  return (
    <div className="home-page top-4">
      <Header />
      <SmartLearnHero />
      <StepbyStep />
      {/* <FeaturesSection /> */}
      {/* <Test /> */}
      <FeaturesSection />
    </div>
  );
};

export default HomePage;

// Add a step-by-step guide
