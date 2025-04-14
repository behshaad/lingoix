import { useState, useEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMobile } from "../../hooks/use-mobile";

import ResourceFilter from "./ResourceFilter";
import ResourceCard from "./ResourceCard";
import SliderNavigation from "./SliderNavigation";

import CommunitySVG from "../../assets/logo/GLOGO.png";
import playfulcat from "../../assets/Headercards/playfulcat.svg";
import result from "../../assets/logo/logo.png";

const resources = [
  {
    id: "1",
    title: "Beginner's Guide to Spanish",
    description:
      "A comprehensive PDF guide for beginners learning Spanish vocabulary and grammar.",
    type: "book",
    thumbnail: CommunitySVG,
    date: "March 15, 2025",
  },
  {
    id: "2",
    title: "French Pronunciation Practice",
    description:
      "Audio lessons to help you perfect your French accent and pronunciation.",
    type: "audio",
    thumbnail: playfulcat,
    date: "February 28, 2025",
  },
  {
    id: "3",
    title: "Japanese Writing System Tutorial",
    description:
      "Video tutorial explaining the basics of Hiragana, Katakana, and Kanji.",
    type: "video",
    thumbnail: result,
    date: "March 10, 2025",
  },
  {
    id: "4",
    title: "Italian Vocabulary Flashcards",
    description:
      "Downloadable PDF with essential Italian vocabulary for everyday conversations.",
    type: "book",
    thumbnail: CommunitySVG,
    date: "March 5, 2025",
  },
  {
    id: "5",
    title: "German Conversation Practice",
    description:
      "Audio dialogues to improve your German speaking and listening skills.",
    type: "audio",
    thumbnail: playfulcat,
    date: "March 12, 2025",
  },
  {
    id: "6",
    title: "Mandarin Tone Mastery",
    description:
      "Video lessons focused on mastering the four tones in Mandarin Chinese.",
    type: "video",
    thumbnail: result,
    date: "February 20, 2025",
  },
  {
    id: "7",
    title: "Portuguese Grammar Guide",
    description:
      "Comprehensive PDF guide to Portuguese grammar rules and exceptions.",
    type: "book",
    thumbnail: CommunitySVG,
    date: "March 8, 2025",
  },
  {
    id: "8",
    title: "Russian Pronunciation Drills",
    description:
      "Audio exercises to help you master Russian pronunciation and accent.",
    type: "audio",
    thumbnail: playfulcat,
    date: "March 1, 2025",
  },
  {
    id: "9",
    title: "Korean Alphabet Introduction",
    description:
      "Video tutorial introducing Hangul, the Korean alphabet system.",
    type: "video",
    thumbnail: result,
    date: "March 18, 2025",
  },
];

export default function ResourcesPage() {
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
        <h1 className="text-4xl font-bold mb-2">Resources</h1>
        <p className="text-muted-foreground mb-8">
          Explore our collection of language learning materials
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
