import React, { useEffect } from "react";
import { gsap } from "gsap";

import FeatureCard from "../components/FeatureCard";
import SignUpCallToAction from "../components/SignUpCallToAction";
import Navbar from "../components/Navbar";
import BilingualText from "../components/BilingualText";

const HomePage = () => {
  useEffect(() => {
    gsap.from(".hero-section", {
      duration: 1.5,
      opacity: 0,
      y: -50,
      ease: "power4.out",
    });

    gsap.from(".feature-card", {
      duration: 1,
      opacity: 0,
      y: 30,
      stagger: 0.3,
      ease: "power4.out",
    });

    gsap.from(".cta-section", {
      duration: 1.5,
      opacity: 0,
      y: 50,
      ease: "power4.out",
      delay: 1.5,
    });
  }, []);

  return (
    <div className="home-page">
      {/* Navbar */}
      <Navbar />
      <BilingualText />

      {/* Hero Section */}
      <header className="hero-section bg-blue-600 text-white p-6 md:p-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Welcome to Lingoix
        </h1>
        <p className="text-lg sm:text-xl">
          The best platform for learning languages
        </p>
      </header>

      {/* Features Section */}
      <section className="features py-12 md:py-16 px-6 md:px-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 md:mb-8">
          Our Features
        </h2>
        <div className="feature-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <FeatureCard
            title="Interactive Lessons"
            description="Learn with engaging activities."
          />
          <FeatureCard
            title="Real-Time Progress Tracking"
            description="Track your learning journey."
          />
          <FeatureCard
            title="Expert Teachers"
            description="Learn from experienced instructors."
          />
        </div>
      </section>

      {/* CTA Section */}
      <div className="cta-section py-12 text-center bg-gray-100">
        <SignUpCallToAction />
      </div>
    </div>
  );
};

export default HomePage;