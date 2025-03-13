import React from "react";
import Herop from "./TestDovom/TesstDovom";

const Test = () => {
  return (
    <div className="h-screen w-full overflow-y-scroll snap-mandatory snap-y scroll-smooth">
      <section className="h-screen flex items-center justify-center snap-start">
        <Herop />
      </section>
      <section className="h-screen flex items-center justify-center bg-white text-black snap-start">
        <h1 className="text-5xl font-bold">بخش سفید</h1>
      </section>
      <section className="h-screen flex items-center justify-center bg-red-500 text-white snap-start">
        <h1 className="text-5xl font-bold">بخش قرمز</h1>
      </section>
    </div>
  );
};

export default Test;
