import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

import CommunitySVG from "../../../assets/Headercards/community.svg";
import lesen from "../../../assets/Headercards/lesen.svg";
import location from "../../../assets/Headercards/location.svg";
import ontheway from "../../../assets/Headercards/ontheway.svg";
import playfulcat from "../../../assets/Headercards/playfulcat.svg";
import result from "../../../assets/Headercards/result.svg";

export default function LanguageCards() {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  const flags = [CommunitySVG, lesen, location, ontheway, playfulcat, result];

  const colors = [
    "bg-blue-100 dark:bg-blue-900/30",
    "bg-red-100 dark:bg-red-900/30",
    "bg-yellow-100 dark:bg-yellow-900/30",
    "bg-green-100 dark:bg-green-900/30",
    "bg-purple-100 dark:bg-purple-900/30",
    "bg-green-100 dark:bg-green-900/30",
  ];

  const translations = t("languages", { returnObjects: true });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, Draggable);
    if (!containerRef.current || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;
    const containerWidth = containerRef.current.offsetWidth;
    const totalWidth = wrapper.scrollWidth;

    const tl = gsap.timeline({ repeat: 1 });

    tl.to(wrapper, {
      x: -(totalWidth - containerWidth),
      duration: 6,
      ease: "power2.inOut",
    });

    tl.to(wrapper, {
      x: 0,
      duration: 1,
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
        {translations.map((lang, index) => (
          <div
            key={index}
            className={`group ${colors[index]} rounded-xl p-6 shadow-lg flex flex-col justify-evenly min-w-[290px] min-h-[380px] transition-transform hover:scale-105`}
          >
            {/* عنوان زبان */}
            <h3 className="font-bold text-lg dark:text-white">{lang.title}</h3>

            {/* پرچم بزرگ‌تر */}
            <div className="flex justify-center items-center">
              <img
                src={flags[index]}
                alt="flag"
                className="w-32 h-52 rounded"
              />
            </div>

            {/* توضیحات */}
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {lang.caption}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
