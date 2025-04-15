import React from "react";

import Hero from "../components/Home/Header/Hero";
import FeaturesSection from "../components/Home/FeaturesSection";
import SmartLearnHero from "../components/Home/SmartLearnHero";
import StepbyStep from "../components/Home/Stepby/StepbyStep";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import Footer from "../components/Footer/Footer";
import Test from "../components/test/Test";
import Featur from "../components/Home/Featur/Featur";
import Product from "../components/Home/Product/Product";
import Are from "../components/test/Flashcardanki";

const HomePage = () => {
  return (
    <div className="home-page top-4">

      <Hero />
      <SmartLearnHero />
      <Featur />
      <StepbyStep />
      <Product />
      <Footer />


      {/* <FeaturesSection /> */}
      {/* <DashboardLayout /> */}
      {/* <Test/> */}
      {/* <Are/> */}
    </div>
  );
};

export default HomePage;
