import React, { useEffect } from "react";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";

import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import SignUpCallToAction from "../components/SignUpCallToAction";

const HomePage = () => {
  const { t } = useTranslation(); // هوک ترجمه برای دسترسی به متن‌ها

  return (
    <div className="home-page top-4 ">
      {/* Hero Section */}
      <Header />
      {/* Features Section */}
      <FeaturesSection />
      {/* CTA Section */}
      <div className="cta-section py-12 text-center">
        <SignUpCallToAction ctaText={t("cta")} />
      </div>
    </div>
  );
};

export default HomePage;
