"use client";

import { useState, useEffect, useRef } from "react";
import {
  Book,
  Headphones,
  Video,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMobile } from "../../hooks/use-mobile";

// import Image from "../assets/Headercards/lesen.svg";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Sample resources data
const resources = [
  {
    id: "1",
    title: "Beginner's Guide to Spanish",
    description:
      "A comprehensive PDF guide for beginners learning Spanish vocabulary and grammar.",
    type: "book",
    thumbnail: "/placeholder.svg?height=200&width=300",
    date: "March 15, 2025",
  },
  {
    id: "2",
    title: "French Pronunciation Practice",
    description:
      "Audio lessons to help you perfect your French accent and pronunciation.",
    type: "audio",
    thumbnail: "/placeholder.svg?height=200&width=300",
    date: "February 28, 2025",
  },
  {
    id: "3",
    title: "Japanese Writing System Tutorial",
    description:
      "Video tutorial explaining the basics of Hiragana, Katakana, and Kanji.",
    type: "video",
    thumbnail: "/placeholder.svg?height=200&width=300",
    date: "March 10, 2025",
  },
  {
    id: "4",
    title: "Italian Vocabulary Flashcards",
    description:
      "Downloadable PDF with essential Italian vocabulary for everyday conversations.",
    type: "book",
    thumbnail: "/placeholder.svg?height=200&width=300",
    date: "March 5, 2025",
  },
  {
    id: "5",
    title: "German Conversation Practice",
    description:
      "Audio dialogues to improve your German speaking and listening skills.",
    type: "audio",
    thumbnail: "/placeholder.svg?height=200&width=300",
    date: "March 12, 2025",
  },
  {
    id: "6",
    title: "Mandarin Tone Mastery",
    description:
      "Video lessons focused on mastering the four tones in Mandarin Chinese.",
    type: "video",
    thumbnail: "/placeholder.svg?height=200&width=300",
    date: "February 20, 2025",
  },
  {
    id: "7",
    title: "Portuguese Grammar Guide",
    description:
      "Comprehensive PDF guide to Portuguese grammar rules and exceptions.",
    type: "book",
    thumbnail: "/placeholder.svg?height=200&width=300",
    date: "March 8, 2025",
  },
  {
    id: "8",
    title: "Russian Pronunciation Drills",
    description:
      "Audio exercises to help you master Russian pronunciation and accent.",
    type: "audio",
    thumbnail: "/placeholder.svg?height=200&width=300",
    date: "March 1, 2025",
  },
  {
    id: "9",
    title: "Korean Alphabet Introduction",
    description:
      "Video tutorial introducing Hangul, the Korean alphabet system.",
    type: "video",
    thumbnail: "/placeholder.svg?height=200&width=300",
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

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              type="text"
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-md transition-all duration-300 whitespace-nowrap ${
                activeFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              All Resources
            </button>
            <button
              onClick={() => setActiveFilter("book")}
              className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                activeFilter === "book"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Book className="h-4 w-4" /> Books
            </button>
            <button
              onClick={() => setActiveFilter("audio")}
              className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                activeFilter === "audio"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Headphones className="h-4 w-4" /> Audio
            </button>
            <button
              onClick={() => setActiveFilter("video")}
              className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                activeFilter === "video"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <Video className="h-4 w-4" /> Video
            </button>
          </div>
        </div>

        {/* Resources Display */}
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No resources found matching your criteria.
            </p>
          </div>
        ) : isMobile ? (
          // Mobile Slider Layout
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

            {/* Slider Navigation */}
            <button
              onClick={() => handleSliderNav("prev")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md z-10"
              disabled={sliderPosition >= 0}
            >
              <ChevronLeft
                className={`h-6 w-6 ${
                  sliderPosition >= 0
                    ? "text-muted-foreground/40"
                    : "text-foreground"
                }`}
              />
            </button>
            <button
              onClick={() => handleSliderNav("next")}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md z-10"
              disabled={
                sliderPosition <=
                -(
                  filteredResources.length * 316 -
                  sliderRef.current?.clientWidth
                )
              }
            >
              <ChevronRight
                className={`h-6 w-6 ${
                  sliderPosition <=
                  -(
                    filteredResources.length * 316 -
                    sliderRef.current?.clientWidth
                  )
                    ? "text-muted-foreground/40"
                    : "text-foreground"
                }`}
              />
            </button>
          </div>
        ) : (
          // Desktop Grid Layout
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

function ResourceCard({ resource }) {
  const cardRef = useRef(null);

  // GSAP hover animations
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const image = card.querySelector(".card-image");
    const content = card.querySelector(".card-content");
    const title = card.querySelector(".card-title");

    card.addEventListener("mouseenter", () => {
      gsap.to(card, { y: -10, duration: 0.3, ease: "power2.out" });
      gsap.to(image, { scale: 1.05, duration: 0.5, ease: "power2.out" });
      gsap.to(title, { color: "var(--color-primary)", duration: 0.3 });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, { y: 0, duration: 0.5, ease: "power2.out" });
      gsap.to(image, { scale: 1, duration: 0.5, ease: "power2.out" });
      gsap.to(title, { color: "var(--color-foreground)", duration: 0.3 });
    });

    return () => {
      card.removeEventListener("mouseenter", () => {});
      card.removeEventListener("mouseleave", () => {});
    };
  }, []);

  // Get the appropriate icon based on resource type
  const getTypeIcon = () => {
    switch (resource.type) {
      case "book":
        return <Book className="h-4 w-4" />;
      case "audio":
        return <Headphones className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={cardRef}
      className="resource-card bg-card rounded-lg overflow-hidden shadow-md border border-border hover:shadow-lg transition-shadow duration-300 flex flex-col min-w-[300px]"
    >
      <div className="overflow-hidden">
        <img
          src={resource.thumbnail || "/placeholder.svg"}
          alt={resource.title}
          className="card-image w-full h-48 object-cover transition-transform duration-300"
        />
      </div>
      <div className="card-content p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
            {getTypeIcon()}
            <span className="capitalize">{resource.type}</span>
          </span>
          <span>{resource.date}</span>
        </div>
        <h3 className="card-title text-xl font-semibold mb-2 transition-colors duration-300">
          {resource.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1">
          {resource.description}
        </p>
        <button className="mt-auto self-start px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-300">
          View Resource
        </button>
      </div>
    </div>
  );
}
