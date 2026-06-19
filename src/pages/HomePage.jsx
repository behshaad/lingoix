import React from "react";

import Hero from "../components/Home/Header/Hero";
import SmartLearnHero from "../components/Home/SmartLearnHero";
import StepbyStep from "../components/Home/Stepby/StepbyStep";
import Footer from "../components/Footer/Footer";
import Featur from "../components/Home/Featur/Featur";
import Product from "../components/Home/Product/Product";

const HomePage = () => {
  return (
    <div className="home-page top-4">

      <Hero />
      <SmartLearnHero />
      <Featur />
      <StepbyStep />
      <Product />
      <Footer />
      
    </div>
  );
};

export default HomePage;
