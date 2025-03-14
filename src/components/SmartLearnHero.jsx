import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaArrowRight } from "react-icons/fa";
import { GiBrain } from "react-icons/gi";
import { AiOutlineGlobal } from "react-icons/ai";
import { BsBook, BsLightningFill } from "react-icons/bs";
import { FiMessageCircle } from "react-icons/fi";
import { RiSparklingLine, RiLightbulbFlashFill } from "react-icons/ri";
import { IoMdChatbubbles } from "react-icons/io";

export default function SmartLearnHero() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const buttonsRef = useRef(null);
  const iconsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.from([headingRef.current, subheadingRef.current, buttonsRef.current], {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
    });

    const icons = iconsRef.current.children;
    gsap.from(icons, {
      scale: 0,
      opacity: 0.6,
      duration: 0.8,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 0.8,
    });

    gsap.to(icons, {
      y: "random(-100, 100)",
      x: "random(-80, 80)", // فاصله در X کمتر شد
      duration: "random(4, 8)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden pt-40 pb-32 md:pt-48 md:pb-40"
    >
      <div className="container mx-auto px-6 text-center relative z-10">
        <h1
          ref={headingRef}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 "
        >
          Learn languages faster with AI!
        </h1>
        <p
          ref={subheadingRef}
          className="text-xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto"
        >
          Master any language with personalized AI-powered lessons and a proven
          learning roadmap.
        </p>
        <div
          ref={buttonsRef}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="text-lg px-8 py-3 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 active:scale-95 transition transform">
            Start for Free
          </button>
          <button className="text-lg px-8 py-3 border dark:text-gray-900 border-gray-300 rounded-lg shadow-md flex items-center gap-2 bg-white hover:bg-gray-100 transition">
            Explore Roadmap <FaArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Bubble Icons Section */}
      <div
        ref={iconsRef}
        className="absolute inset-0 pointer-events-none flex flex-wrap justify-center "
      >
        {[
          {
            icon: <AiOutlineGlobal className="text-blue-500" />,
            color: "bg-blue-200/30",
            size: "w-14 h-14",
            top: "top-10",
            left: "left-60",
          },
          {
            icon: <GiBrain className="text-purple-500" />,
            color: "bg-purple-200/30",
            size: "w-16 h-16",
            top: "top-32",
            right: "right-50",
          },
          {
            icon: <FiMessageCircle className="text-green-500" />,
            color: "bg-green-200/30",
            size: "w-12 h-12",
            bottom: "bottom-20",
            left: "left-36",
          },
          {
            icon: <BsBook className="text-amber-500" />,
            color: "bg-amber-200/30",
            size: "w-14 h-14",
            bottom: "bottom-10",
            right: "right-16",
          },
          {
            icon: <RiSparklingLine className="text-red-500" />,
            color: "bg-red-200/30",
            size: "w-12 h-12",
            top: "top-16",
            right: "right-20",
          },
          {
            icon: <IoMdChatbubbles className="text-cyan-500" />,
            color: "bg-cyan-200/30",
            size: "w-16 h-16",
            bottom: "bottom-32",
            left: "left-10",
          },
          {
            icon: <BsLightningFill className="text-yellow-500" />,
            color: "bg-yellow-200/30",
            size: "w-14 h-14",
            top: "top-5",
            right: "right-10",
          },
          {
            icon: <RiLightbulbFlashFill className="text-orange-500" />,
            color: "bg-orange-200/30",
            size: "w-18 h-18",
            bottom: "bottom-5",
            left: "left-14",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`absolute ${item.top || ""} ${item.bottom || ""} ${
              item.left || ""
            } ${item.right || ""}
              ${item.size} ${
              item.color
            } rounded-full backdrop-blur-lg bg-opacity-50 flex items-center justify-center shadow-lg`}
          >
            {item.icon}
          </div>
        ))}
      </div>
    </section>
  );
}
