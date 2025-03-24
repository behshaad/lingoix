// import { useState } from "react";

// const translateText = async (text, sourceLang, targetLang) => {
//   const url = "https://libretranslate.de/translate"; // سرور عمومی رایگان

//   const response = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       q: text,
//       source: sourceLang,
//       target: targetLang,
//       format: "text",
//     }),
//   });

//   const data = await response.json();
//   return data?.translatedText || "ترجمه‌ای یافت نشد";
// };

// const WordSearch = () => {
//   const [input, setInput] = useState("");
//   const [translation, setTranslation] = useState("");

//   const searchWord = async () => {
//     if (!input) {
//       setTranslation("");
//       return;
//     }

//     // تشخیص زبان ورودی (فارسی یا آلمانی)
//     const isGerman = /^[a-zA-ZäöüÄÖÜß]+$/.test(input);
//     const sourceLang = isGerman ? "de" : "fa";
//     const targetLang = isGerman ? "fa" : "de";

//     const result = await translateText(input, sourceLang, targetLang);
//     setTranslation(result);
//   };

//   return (
//     <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
//       <input
//         type="text"
//         className="w-full p-2 border rounded-md"
//         placeholder="کلمه را وارد کنید..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />
//       <button
//         className="mt-2 w-full bg-blue-500 text-white p-2 rounded-md"
//         onClick={searchWord}
//       >
//         ترجمه کن
//       </button>
//       {translation && (
//         <p className="mt-4 p-2 bg-gray-100 rounded-md">{translation}</p>
//       )}
//     </div>
//   );
// };

// export default WordSearch;
