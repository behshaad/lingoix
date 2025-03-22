// SliderNavigation.js
import { ChevronLeft, ChevronRight } from "lucide-react";

const SliderNavigation = ({
  sliderPosition,
  setSliderPosition,
  filteredResources,
  sliderRef,
}) => {
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

    newPosition = Math.max(Math.min(newPosition, 0), maxPosition);
    setSliderPosition(newPosition);
  };

  return (
    <div className="relative">
      <button
        onClick={() => handleSliderNav("prev")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4"
        disabled={sliderPosition >= 0}
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => handleSliderNav("next")}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4"
        disabled={
          sliderPosition <=
          -(filteredResources.length * 316 - sliderRef.current?.clientWidth)
        }
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default SliderNavigation;
