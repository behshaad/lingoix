import React from "react";

import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import Test from "./Testix";
import SmartLearnHero from "../components/SmartLearnHero";
import StepbyStep from "../components/Stepby/StepbyStep";
import UserMenu from "../components/UserMenu";
import SignUp from "./Testix";
const HomePage = () => {
  return (
    <div className="home-page top-4">
      <Header />
      <SmartLearnHero />
      <StepbyStep />
      <FeaturesSection />
      {/* <Test /> */}
      {/* <SignUp/> */}
    </div>
  );
};

export default HomePage;

// Add a step-by-step guide
