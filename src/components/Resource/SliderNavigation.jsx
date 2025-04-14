import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SliderNavigation({
  sliderPosition,
  handleSliderNav,
  filteredResources,
  sliderRef,
}) {
  return (
    <div className="relative">
      <button
        onClick={() => handleSliderNav("prev")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md z-10"
        disabled={sliderPosition >= 0}
      >
        <ChevronLeft
          className={`h-6 w-6 ${
            sliderPosition >= 0 ? "text-muted-foreground/40" : "text-foreground"
          }`}
        />
      </button>
      <button
        onClick={() => handleSliderNav("next")}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-background/80 backdrop-blur-sm p-2 rounded-full shadow-md z-10"
        disabled={
          sliderPosition <=
          -(filteredResources.length * 316 - sliderRef.current?.clientWidth)
        }
      >
        <ChevronRight
          className={`h-6 w-6 ${
            sliderPosition <=
            -(filteredResources.length * 316 - sliderRef.current?.clientWidth)
              ? "text-muted-foreground/40"
              : "text-foreground"
          }`}
        />
      </button>
    </div>
  );
}
