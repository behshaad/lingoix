import React, { useState, useEffect } from "react";
import { gsap } from "gsap";

const StudyReminder = () => {
  const [studyDays, setStudyDays] = useState({
    Sunday: false,
    Monday: false,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
  });

  useEffect(() => {
    // شبیه‌سازی داده‌های وضعیت مطالعه
    const fetchedStudyDays = {
      Sunday: true,
      Monday: false,
      Tuesday: true,
      Wednesday: true,
      Thursday: false,
      Friday: false,
      Saturday: true,
    };
    setStudyDays(fetchedStudyDays);

    // انیمیشن ورودی آهسته‌تر
    gsap.fromTo(
      ".day-circle",
      { opacity: 0, scale: 0.6 },
      { opacity: 1, scale: 1, duration: 1.2, stagger: 0.2 }
    );
  }, []);

  return (
    <div className="study-reminder-container p-6 text-center">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">
        Study Reminder
      </h2>
      <div className="flex justify-center gap-6">
        {Object.keys(studyDays).map((day) => (
          <div
            key={day}
            className={`day-circle relative flex justify-center items-center w-10 h-10 rounded-full
              ${
                studyDays[day]
                  ? "bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 shadow-lg"
                  : "bg-gray-300"
              }
              transition-all duration-300 ease-in-out transform hover:scale-110 cursor-pointer`}
            onMouseEnter={() =>
              gsap.to(`.${day}-circle`, { scale: 1.1, duration: 0.3 })
            }
            onMouseLeave={() =>
              gsap.to(`.${day}-circle`, { scale: 1, duration: 0.3 })
            }
          >
            {/* {studyDays[day] && (
              <span className="absolute text-white text-2xl">✔</span>
            )} */}
            <span className="text-white font-semibold text-lg">
              {day.substring(0, 3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyReminder;