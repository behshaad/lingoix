import { useState, useEffect, useRef } from "react";

const Featur = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const counterRefs = useRef([null, null, null, null]);

  const targets = [200, 150, 300, 250]; // اهداف مختلف برای هر شمارنده
  const duration = 3; // مدت زمان انیمیشن به ثانیه
  const [counts, setCounts] = useState([0, 0, 0, 0]); // شمارنده‌ها

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    counterRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (hasStarted) {
      targets.forEach((targetNumber, index) => {
        let startTime;
        const updateCount = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = (timestamp - startTime) / 1000;
          const increment = Math.min(
            targetNumber,
            (targetNumber * progress) / duration
          );
          setCounts((prevCounts) => {
            const newCounts = [...prevCounts];
            newCounts[index] = Math.floor(increment);
            return newCounts;
          });

          if (progress < duration) {
            requestAnimationFrame(updateCount);
          }
        };

        requestAnimationFrame(updateCount);
      });
    }
  }, [hasStarted]);

  return (
    <div className="box-border p-8 m-0">
      <ul className="flex flex-wrap justify-center gap-12">
        {counts.map((count, index) => (
          <li
            key={index}
            ref={(el) => (counterRefs.current[index] = el)}
            className="relative flex justify-center items-center bg-blue-100 dark:bg-blue-900/30 w-[280px] h-[280px] text-center rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out  dark:text-white"
          >
            <div className="flex flex-col justify-center items-center">
              <h4 className="text-4xl font-semibold">{count}+</h4>
              <p className="text-sm mt-2">Trusted Clients</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Featur;