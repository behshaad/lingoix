import React from "react";

import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import Test from "./Testix";
import SmartLearnHero from "../components/SmartLearnHero"
const HomePage = () => {
  return (
    <div className="home-page top-4">
      <Header />
      <SmartLearnHero />
      <FeaturesSection />
      <Test />
    </div>
  );
};

export default HomePage;
