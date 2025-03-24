import React from "react";

import Hero from "../components/Home/Header/Hero";
import FeaturesSection from "../components/Home/FeaturesSection";
import SmartLearnHero from "../components/Home/SmartLearnHero";
import StepbyStep from "../components/Home/Stepby/StepbyStep";

import Test from "./Test";

import ResourcesPage from "./ResourcesPage";
import LehrePage from "./LehrePage";
import Dictionary from "../components/Dictionary/Dictionary";
import WordSearch from "../components/test/Test";


const HomePage = () => {
  return (
    <div className="home-page top-4">
      {/* <Hero />
      <SmartLearnHero />
      <StepbyStep />
      <FeaturesSection /> */}
      <Dictionary />
      <WordSearch/>

      {/* <Test /> */}
      {/* <Resources />{" "} */}
      {/* <ResourcesPage/> */}
      {/* <LehrePage/> */}
    </div>
  );
};

export default HomePage;
