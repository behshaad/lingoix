// const Test = () => {
//   return (
//     <div>
//       <h1>ckkkckckk</h1>
//     </div>
//   );
// };

// export default Test;
// ??
// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";

// const HorizontalVerticalLine = () => {
//   const horizontalLineRef = useRef(null);
//   const verticalLineRef = useRef(null);

//   useEffect(() => {
//     // انیمیشن برای خط افقی
//     gsap.to(horizontalLineRef.current, {
//       width: "50%", // کاهش عرض به 50%
//       duration: 2, // مدت زمان حرکت
//       ease: "power2.inOut", // انیمیشن نرم
//     });

//     // انیمیشن برای خط عمودی
//     gsap.to(verticalLineRef.current, {
//       height: "50vh", // حرکت عمودی به سمت پایین
//       duration: 2, // مدت زمان حرکت
//       delay: 2, // تأخیر برای حرکت عمودی
//       ease: "power2.inOut", // انیمیشن نرم
//     });
//   }, []);

//   return (
//     <div
//       className="relative w-full h-screen bg-gray-100 flex justify-center items-center"
//       style={{ overflow: "hidden" }}
//     >
//       {/* خط افقی */}
//       <div
//         ref={horizontalLineRef}
//         style={{
//           position: "absolute",
//           top: "10%", // مکان قرار گیری در صفحه
//           left: "25%", // خط شروع از 25 درصد صفحه
//           height: "2px", // ضخامت خط
//           width: "0%", // شروع از صفر
//           backgroundColor: "#3498db", // رنگ خط
//         }}
//       ></div>

//       {/* خط عمودی */}
//       <div
//         ref={verticalLineRef}
//         style={{
//           position: "absolute",
//           top: "10%", // مکان شروع حرکت عمودی
//           left: "25%", // قرار گیری در کنار خط افقی
//           width: "2px", // ضخامت خط
//           height: "0%", // شروع از صفر
//           backgroundColor: "#3498db", // رنگ خط
//         }}
//       ></div>
//     </div>
//   );
// };

// export default HorizontalVerticalLine;
// ????
// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";

// const HorizontalVerticalLine = () => {
//   const horizontalLineRef = useRef(null);
//   const verticalLineRef = useRef(null);

//   useEffect(() => {
//     // انیمیشن برای خط افقی
//     gsap.to(horizontalLineRef.current, {
//       width: "50%", // کاهش عرض به 50%
//       duration: 2, // مدت زمان حرکت
//       ease: "power2.inOut", // انیمیشن نرم
//     });

//     // انیمیشن برای خط عمودی
//     gsap.to(verticalLineRef.current, {
//       height: "50vh", // حرکت عمودی به سمت پایین
//       duration: 2, // مدت زمان حرکت
//       delay: 2, // تأخیر برای حرکت عمودی
//       ease: "power2.inOut", // انیمیشن نرم
//     });
//   }, []);

//   return (
//     <div
//       className="relative w-full h-screen bg-gray-100 flex justify-center items-center"
//       style={{ overflow: "hidden" }}
//     >
//       {/* خط افقی */}
//       <div
//         ref={horizontalLineRef}
//         style={{
//           position: "absolute",
//           top: "10%", // مکان قرار گیری در صفحه
//           left: "25%", // خط شروع از 25 درصد صفحه
//           height: "2px", // ضخامت خط
//           width: "0%", // شروع از صفر
//           backgroundColor: "#3498db", // رنگ خط
//         }}
//       ></div>

//       {/* خط عمودی (گوشه راست خط افقی) */}
//       <div
//         ref={verticalLineRef}
//         style={{
//           position: "absolute",
//           top: "10%", // مکان شروع حرکت عمودی
//           left: "75%", // قرار گیری در کنار خط افقی از سمت راست
//           width: "2px", // ضخامت خط
//           height: "0%", // شروع از صفر
//           backgroundColor: "#3498db", // رنگ خط
//         }}
//       ></div>
//     </div>
//   );
// };

// export default HorizontalVerticalLine;

// ???
// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";

// const HorizontalVerticalLine = () => {
//   const lineRef = useRef(null);

//   useEffect(() => {
//     // انیمیشن برای خط افقی و عمودی
//     gsap.to(lineRef.current, {
//       width: "50%", // عرض خط افقی به 50% افزایش میابد
//       height: "50vh", // ارتفاع خط عمودی به 50vh افزایش میابد
//       duration: 2, // مدت زمان حرکت
//       ease: "power2.inOut", // انیمیشن نرم
//     });
//   }, []);

//   return (
//     <div
//       className="relative w-full h-screen bg-gray-100 flex justify-center items-center"
//       style={{ overflow: "hidden" }}
//     >
//       {/* خط ترکیبی افقی و عمودی */}
//       <div
//         ref={lineRef}
//         style={{
//           position: "absolute",
//           top: "10%", // مکان شروع حرکت
//           left: "25%", // مکان شروع حرکت افقی
//           width: "0%", // شروع از صفر عرض
//           height: "0%", // شروع از صفر ارتفاع
//           backgroundColor: "#3498db", // رنگ خط
//           borderRadius: "10px", // گوشه‌های منحنی
//         }}
//       ></div>
//     </div>
//   );
// };

// export default HorizontalVerticalLine;

// ?

// import React, { useEffect, useRef } from "react";
// import gsap from "gsap";

// const HorizontalVerticalLine = () => {
//   const lineRef = useRef(null);

//   useEffect(() => {
//     // انیمیشن برای خط افقی و عمودی
//     gsap.to(lineRef.current, {
//       width: "50%", // عرض خط افقی به 50% افزایش میابد
//       height: "50vh", // ارتفاع خط عمودی به 50vh افزایش میابد
//       duration: 2, // مدت زمان حرکت
//       ease: "power2.inOut", // انیمیشن نرم
//     });
//   }, []);

//   return (
//     <div
//       className="relative w-full h-screen bg-gray-100 flex justify-center items-center"
//       style={{ overflow: "hidden" }}
//     >
//       {/* خط ترکیبی افقی و عمودی (فقط حاشیه بالا و راست نمایش داده می‌شود) */}
//       <div
//         ref={lineRef}
//         style={{
//           position: "absolute",
//           top: "10%", // مکان شروع حرکت
//           left: "25%", // مکان شروع حرکت افقی
//           borderTop: "2px solid #3498db", // حاشیه بالای خط
//           borderRight: "2px solid #3498db", // حاشیه سمت راست خط
//           width: "0%", // شروع از صفر عرض
//           height: "0%", // شروع از صفر ارتفاع
//           borderRadius: "10px", // گوشه‌های منحنی
//         }}
//       ></div>
//     </div>
//   );
// };

// export default HorizontalVerticalLine;
// ?
import React, { useRef } from "react";

const HorizontalVerticalLine = () => {
  const lineRef = useRef(null);

  return (
    <div
      className="relative w-full h-screen flex justify-center items-center"
      style={{
        overflow: "hidden",
        background: "rgba(255, 255, 255, 0.1)", // رنگ پس‌زمینه شفاف
        backdropFilter: "blur(10px)", // تاری پس‌زمینه
      }}
    >
      {/* خط ترکیبی افقی و عمودی (فقط حاشیه بالا و راست نمایش داده می‌شود) */}
      <div
        ref={lineRef}
        style={{
          position: "absolute",
          top: "10%", // مکان شروع حرکت
          left: "25%", // مکان شروع حرکت افقی
          borderTop: "2px solid #3498db", // حاشیه بالای خط
          borderRight: "2px solid #3498db", // حاشیه سمت راست خط
          width: "50%", // عرض خط افقی
          height: "50vh", // ارتفاع خط عمودی
          borderBottom: "none", // حذف کامل حاشیه پایین
          borderLeft: "none", // حذف کامل حاشیه چپ
          borderTopRightRadius: "10px", // گوشه بالا راست گرد
          borderBottomRightRadius: "10px", // گوشه پایین راست گرد
        }}
      >
        <h1>jjjjj</h1>
      </div>
         <div
        ref={lineRef}
        style={{
          position: "absolute",
          top: "10%", // مکان شروع حرکت
          left: "25%", // مکان شروع حرکت افقی
          borderTop: "2px solid #3498db", // حاشیه بالای خط
          borderRight: "2px solid #3498db", // حاشیه سمت راست خط
          width: "50%", // عرض خط افقی
          height: "50vh", // ارتفاع خط عمودی
          borderBottom: "none", // حذف کامل حاشیه پایین
          borderLeft: "none", // حذف کامل حاشیه چپ
          borderTopRightRadius: "10px", // گوشه بالا راست گرد
          borderBottomRightRadius: "10px", // گوشه پایین راست گرد
        }}
      >
        <h1>jjjjj</h1>
      </div>
      
    </div>
  );
};

export default HorizontalVerticalLine;
