import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

const languages = [
  {
    language: "Spanish",
    flag: "🇪🇸",
    level: "Beginner",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    language: "French",
    flag: "🇫🇷",
    level: "Intermediate",
    color: "bg-red-100 dark:bg-red-900/30",
  },
  {
    language: "German",
    flag: "🇩🇪",
    level: "Advanced",
    color: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    language: "Italian",
    flag: "🇮🇹",
    level: "Beginner",
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    language: "Japanese",
    flag: "🇯🇵",
    level: "Intermediate",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    language: "Chinese",
    flag: "🇨🇳",
    level: "Advanced",
    color: "bg-red-100 dark:bg-red-900/30",
  },
  {
    language: "Spanish",
    flag: "🇪🇸",
    level: "Beginner",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    language: "French",
    flag: "🇫🇷",
    level: "Intermediate",
    color: "bg-red-100 dark:bg-red-900/30",
  },
  {
    language: "German",
    flag: "🇩🇪",
    level: "Advanced",
    color: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    language: "Italian",
    flag: "🇮🇹",
    level: "Beginner",
    color: "bg-green-100 dark:bg-green-900/30",
  }
];

export default function LanguageCards() {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Draggable);
    if (!containerRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const containerWidth = containerRef.current.offsetWidth;
    const totalWidth = wrapper.scrollWidth;

    gsap.to(wrapper, {
      x: -(totalWidth - containerWidth),
      duration: 3,
      ease: "none",
      repeat: 1,
      yoyo: true,
    });

    Draggable.create(wrapper, {
      type: "x",
      bounds: { minX: -totalWidth + containerWidth, maxX: 0 },
      inertia: true,
    });
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden py-36 ">


      <div ref={wrapperRef} className="flex gap-4 px-4">
        {languages.map((lang, index) => (
          <div
            key={index}
            className={`${lang.color} rounded-xl p-4 shadow-lg flex flex-col min-w-[200px] transition-transform hover:scale-105 `}
          >
            <div className="text-4xl mb-2">{lang.flag}</div>
            <h3 className="font-bold text-lg">{lang.language}</h3>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {lang.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


