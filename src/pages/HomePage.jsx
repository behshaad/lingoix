import React, { useEffect } from "react";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";

import FeatureCard from "../components/FeatureCard";
import SignUpCallToAction from "../components/SignUpCallToAction";

const HomePage = () => {
  const { t } = useTranslation(); // هوک ترجمه برای دسترسی به متن‌ها

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
    <div className="home-page top-4 ">
      {/* Hero Section */}
      <header className="hero-section bg-blue-600 text-white p-6 md:p-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          {t("hero.title")} {/* استفاده از ترجمه */}
        </h1>
        <p className="text-lg sm:text-xl">{t("hero.subtitle")}</p>
      </header>

      {/* Features Section */}
      <section className="features py-12 md:py-16 px-6 md:px-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-6 md:mb-8">
          {t("features")}
        </h2>
        <div className="feature-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {t("featureCards", { returnObjects: true }).map((card, index) => (
            <FeatureCard
              key={index}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <div className="cta-section py-12 text-center">
        <SignUpCallToAction ctaText={t("cta")} />
      </div>
    </div>
  );
};

export default HomePage;
