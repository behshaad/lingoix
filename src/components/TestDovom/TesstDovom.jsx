import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FaArrowRight } from "react-icons/fa"; // FontAwesome
import { GiBrain } from "react-icons/gi"; // Glyphicons
import { AiOutlineGlobal } from "react-icons/ai"; // AntDesign
import { BsBook } from "react-icons/bs"; // Bootstrap Icons
import { FiMessageCircle } from "react-icons/fi"; // Feather Icons
import { RiSparklingLine } from "react-icons/ri"; // Remix Icon
export default function Herop() {
  const heroRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const buttonsRef = useRef(null);
  const iconsRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from(headingRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    })
      .from(
        subheadingRef.current,
        { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      )
      .from(
        buttonsRef.current,
        { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );

    const icons = iconsRef.current.children;
    gsap.from(icons, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "back.out(1.7)",
      delay: 0.8,
    });

    gsap.to(icons, {
      y: "random(-20, 20)",
      x: "random(-20, 20)",
      rotation: "random(-15, 15)",
      duration: "random(3, 5)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.1,
    });
  }, []);

  return (
    <section
      ref={heroRef}
      className="pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden relative"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1
          ref={headingRef}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600"
        >
          Learn languages faster with AI!
        </h1>
        <p
          ref={subheadingRef}
          className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
        >
          Master any language with personalized AI-powered lessons, interactive
          exercises, and a proven learning roadmap.
        </p>
        <div
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button className="text-lg px-8 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark transition">
            Start for Free
          </button>
          <button className="text-lg px-8 py-3 border border-gray-300 rounded-lg shadow-md flex items-center gap-2 hover:bg-gray-100 transition">
            Explore Roadmap <FaArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={iconsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 bg-primary/10 dark:bg-primary/20 p-3 rounded-xl">
          <AiOutlineGlobal className="h-8 w-8 text-primary" />
        </div>
        <div className="absolute top-1/3 right-1/5 bg-purple-100 dark:bg-purple-900/20 p-3 rounded-xl">
          <GiBrain className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="absolute bottom-1/4 left-1/5 bg-blue-100 dark:bg-blue-900/20 p-3 rounded-xl">
          <FiMessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="absolute top-2/3 right-1/4 bg-amber-100 dark:bg-amber-900/20 p-3 rounded-xl">
          <BsBook className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 bg-green-100 dark:bg-green-900/20 p-3 rounded-xl">
          <RiSparklingLine className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        {/*  */}
        <div className="absolute top-1/3 right-1/4 bg-amber-100 dark:bg-amber-900/20 p-3 rounded-xl">
          <RiSparklingLine className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        {/*  */}

        {/*  */}

        {/*  */}
        <div className="absolute top-1/4 left-2/4 bg-primary/10 dark:bg-blue-900/20 p-3 rounded-xl">
          <AiOutlineGlobal className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10 pointer-events-none"></div>
    </section>
  );
}
