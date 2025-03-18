import React from "react";

const Test = () => {
  return (
    <div className="bg-[#001220] text-white">
      {/* Header Section */}
      <header className="sticky top-0 left-0 z-10 py-6 px-8">
        <nav className="w-full bg-opacity-40 bg-gray-600 text-black py-2 text-center flex justify-around rounded-full backdrop-blur-sm">
          <ul className="flex justify-between w-4/5">
            <li className="font-bold">
              <a href="#portfolio">Portfolio</a>
            </li>
            <li className="font-bold">
              <a href="#press">Press</a>
            </li>
            <li className="font-bold">
              <a href="#shop">Shop</a>
            </li>
            <li className="font-bold">
              <a href="#about">About</a>
            </li>
          </ul>
        </nav>
      </header>

      {/* Sections */}
      <section
        id="portfolio"
        className="h-screen flex justify-center items-center"
      >
        <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-900 to-green-400 bg-clip-text text-transparent">
          startenwir
        </h2>
      </section>

      <section id="press" className="h-screen flex justify-center items-center">
        <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-900 to-green-400 bg-clip-text text-transparent">
          Press
        </h2>
      </section>

      <section id="shop" className="h-screen flex justify-center items-center">
        <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-900 to-green-400 bg-clip-text text-transparent">
          Shop
        </h2>
      </section>

      <section id="about" className="h-screen flex justify-center items-center">
        <h2 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-900 to-green-400 bg-clip-text text-transparent">
          About
        </h2>
      </section>

      {/* Custom Cursor */}
      <div id="cursor" className="cursor-none">
        <div className="ring">
          <div />
        </div>
        <div className="ring">
          <div />
        </div>
      </div>
    </div>
  );
};

export default Test ;