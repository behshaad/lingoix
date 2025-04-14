"use client";

import { useEffect, useRef } from "react";
import { Book, Headphones, Video } from "lucide-react";
import { gsap } from "gsap";

export default function ResourceCard({ resource }) {
  const cardRef = useRef(null);

  // GSAP hover animations
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const image = card.querySelector(".card-image");
    const content = card.querySelector(".card-content");
    const title = card.querySelector(".card-title");

    const handleMouseEnter = () => {
      gsap.to(card, { y: -10, duration: 0.3, ease: "power2.out" });
      gsap.to(image, { scale: 1.05, duration: 0.5, ease: "power2.out" });
      gsap.to(title, { color: "var(--color-primary)", duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(card, { y: 0, duration: 0.5, ease: "power2.out" });
      gsap.to(image, { scale: 1, duration: 0.5, ease: "power2.out" });
      gsap.to(title, { color: "var(--color-foreground)", duration: 0.3 });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

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
          className="card-image w-full h-48 object-contain transition-transform duration-300"
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
