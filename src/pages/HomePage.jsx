import React from "react";

import Hero from "../components/Home/Header/Hero";
import FeaturesSection from "../components/Home/FeaturesSection";
import SmartLearnHero from "../components/Home/SmartLearnHero";
import StepbyStep from "../components/Home/Stepby/StepbyStep";




const HomePage = () => {
  return (
    <div className="home-page top-4">
      <Hero />
      <SmartLearnHero />
      <StepbyStep />
      <FeaturesSection />

  
    </div>
  );
};

export default HomePage;
