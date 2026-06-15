import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMobile } from "../../hooks/use-mobile";

import ResourceFilter from "./ResourceFilter";
import ResourceCard from "./ResourceCard";
import SliderNavigation from "./SliderNavigation";
import { getResources } from "../../services/learningDataService";
import bookThumbnail from "../../assets/logo/GLOGO.png";
import audioThumbnail from "../../assets/Headercards/playfulcat.svg";
import grammarThumbnail from "../../assets/logo/logo.png";

const thumbnailByType = {
  audio: audioThumbnail,
  book: bookThumbnail,
  grammar: grammarThumbnail,
  vocabulary: grammarThumbnail,
};

const resources = getResources().map((resource) => ({
  ...resource,
  thumbnail: thumbnailByType[resource.type] || grammarThumbnail,
  date: resource.cefrLevel,
}));

export default function ResourcesPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResources, setFilteredResources] = useState(resources);
  const cardsRef = useRef(null);
  const sliderRef = useRef(null);
  const isMobile = useMobile();
  const [sliderPosition, setSliderPosition] = useState(0);

  // Filter resources based on type and search query
  useEffect(() => {
    const filtered = resources.filter((resource) => {
      const matchesType =
        activeFilter === "all" || resource.type === activeFilter;
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
    setFilteredResources(filtered);
  }, [activeFilter, searchQuery]);

  // GSAP animations
  useEffect(() => {
    if (!cardsRef.current) return;

    // Clear any existing animations
    gsap.killTweensOf(".resource-card");

    // Animate cards on initial load and filter change
    gsap.fromTo(
      ".resource-card",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      }
    );

    // Set up scroll animations
    if (!isMobile) {
      ScrollTrigger.batch(".resource-card", {
        onEnter: (elements) => {
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power2.out",
          });
        },
        once: true,
      });
    }
  }, [filteredResources, isMobile]);

  // Handle slider navigation
  const handleSliderNav = (direction) => {
    if (!sliderRef.current) return;

    const cardWidth =
      sliderRef.current.querySelector(".resource-card")?.clientWidth || 300;
    const gap = 16; // gap between cards
    const containerWidth = sliderRef.current.clientWidth;
    const maxPosition = -(
      filteredResources.length * (cardWidth + gap) -
      containerWidth
    );

    let newPosition =
      direction === "next"
        ? sliderPosition - (cardWidth + gap)
        : sliderPosition + (cardWidth + gap);

    // Clamp the position
    newPosition = Math.max(Math.min(newPosition, 0), maxPosition);
    setSliderPosition(newPosition);

    gsap.to(".slider-container", {
      x: newPosition,
      duration: 0.5,
      ease: "power2.out",
    });
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{t("resourcePage.title")}</h1>
        <p className="text-muted-foreground mb-8">
          {t("resourcePage.subtitle")}
        </p>

        <ResourceFilter
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No resources found matching your criteria.
            </p>
          </div>
        ) : isMobile ? (
          <div className="relative">
            <div ref={sliderRef} className="overflow-hidden">
              <div
                className="slider-container flex gap-4"
                style={{ transform: `translateX(${sliderPosition}px)` }}
              >
                {filteredResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>

            {/* استفاده از کامپوننت SliderNavigation */}
            <SliderNavigation
              sliderPosition={sliderPosition}
              handleSliderNav={handleSliderNav}
              filteredResources={filteredResources}
              sliderRef={sliderRef}
            />
          </div>
        ) : (
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
