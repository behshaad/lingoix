// ResourceCard.jsx
import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const ResourceCard = ({ resource }) => {
  const cardRef = useRef(null);

  // GSAP hover animations
  useEffect(() => {
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

  return (
    <div ref={cardRef} className="resource-card">
      <div className="card-image">
        <img src={resource.thumbnail} alt={resource.title} />
      </div>
      <div className="card-content">
        <h3 className="card-title">{resource.title}</h3>
        <p>{resource.description}</p>
      </div>
    </div>
  );
};

export default ResourceCard;
