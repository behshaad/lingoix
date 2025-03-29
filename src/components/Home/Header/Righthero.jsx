import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

import CommunitySVG from "../../../assets/Headercards/community.svg";
import lesen from "../../../assets/Headercards/lesen.svg";
import location from "../../../assets/Headercards/location.svg";
import ontheway from "../../../assets/Headercards/ontheway.svg";
import playfulcat from "../../../assets/Headercards/playfulcat.svg";
import result from "../../../assets/Headercards/result.svg";

const languages = [
  {
    Title: "The smart path to language learning",
    flag: CommunitySVG,
    Caption: "from beginning to mastery",
    color: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    Title: "personalized and smart!",
    flag: lesen,
    Caption: "Intermediate",
    color: "bg-red-100 dark:bg-red-900/30",
  },
  {
    Title: "Learn languages ​faster, better",
    flag: location,
    Caption: "and more purposefully",
    color: "bg-yellow-100 dark:bg-yellow-900/30",
  },
  {
    Title: "Smart tools for teachers",
    flag: ontheway,
    Caption: "effective learning for students",
    color: "bg-green-100 dark:bg-green-900/30",
  },
  {
    Title: "The future of language learning is here",
    flag: playfulcat,
    Caption: "Intermediate",
    color: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    Title: "“The future of language learning is here .”",
    flag: result,
    Caption: "a different experience with AI",
    color: "bg-green-100 dark:bg-green-900/30",
  },
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

    const tl = gsap.timeline({ repeat: 1 });

    // حرکت به سمت چپ
    tl.to(wrapper, {
      x: -(totalWidth - containerWidth),
      duration: 6, // حرکت رفت
      ease: "power2.inOut",
    });

    // حرکت بازگشت سریع‌تر
    tl.to(wrapper, {
      x: 0,
      duration: 1, // حرکت برگشت (۳ برابر سریع‌تر)
      ease: "power2.inOut",
    });

    Draggable.create(wrapper, {
      type: "x",
      bounds: { minX: -totalWidth + containerWidth, maxX: 0 },
      inertia: true,
    });
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={wrapperRef} className="flex gap-8 py-14">
        {languages.map((lang, index) => (
          <div
            key={index}
            className={`group ${lang.color} rounded-xl p-6 shadow-lg flex flex-col justify-evenly min-w-[290px] min-h-[380px] transition-transform hover:scale-105 `}
          >
            {/* عنوان زبان */}
            <h3 className="font-bold text-lg  dark:text-white">{lang.Title}</h3>

            {/* پرچم بزرگ‌تر */}
            <div className="flex justify-center items-center">
              <img
                src={lang.flag}
                alt="flag"
                className="w-32 h-52 rounded "
              />
            </div>

            {/* توضیحات */}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {lang.Caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
