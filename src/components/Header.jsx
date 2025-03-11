import { Link } from "react-router-dom";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
const Header = () => {
  const { t } = useTranslation();

  return (
    <>
      <section>
        {/* نوبار دوم */}
        <header class="bg-white">
          <div class="px-4 mx-auto sm:px-6 lg:px-8 xl:px-12">
            <div class="flex items-center justify-between h-16 lg:h-[72px]">
              <div class="flex items-center flex-shrink-0">
                <a href="#" title="" class="inline-flex">
                  <span class="sr-only"> Rareblocks logo </span>
                  <img
                    class="w-auto h-8"
                    src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/logo.svg"
                    alt=""
                  />
                </a>
              </div>

              <div class="hidden lg:flex lg:justify-start lg:ml-16 lg:space-x-8 xl:space-x-14">
                <a
                  href="#"
                  title=""
                  class="text-base font-medium text-gray-900 transition-all duration-200 rounded focus:outline-none hover:text-gray-700 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  {" "}
                  All Artworks{" "}
                </a>

                <a
                  href="#"
                  title=""
                  class="text-base font-medium text-gray-900 transition-all duration-200 rounded hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  {" "}
                  All Artists{" "}
                </a>

                <a
                  href="#"
                  title=""
                  class="text-base font-medium text-gray-900 transition-all duration-200 rounded hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                >
                  {" "}
                  Sell Your Artwork{" "}
                </a>
              </div>

              <div class="flex items-center justify-end ml-auto">
                <div class="hidden lg:flex lg:items-center lg:space-x-8">
                  <a
                    href="#"
                    title=""
                    class="text-base font-medium text-gray-900 transition-all duration-200 rounded hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    {" "}
                    Create Free Account{" "}
                  </a>

                  <a
                    href="#"
                    title=""
                    class="text-base font-medium text-gray-900 transition-all duration-200 rounded hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                  >
                    {" "}
                    Login{" "}
                  </a>
                </div>

                <div class="flex items-center justify-end space-x-5">
                  <button
                    type="button"
                    class="p-2 -m-2 text-gray-900 transition-all duration-200 lg:hidden hover:text-gray-700"
                  >
                    <svg
                      class="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    class="relative p-2 -m-2 text-gray-900 transition-all duration-200 hover:text-gray-700"
                  >
                    <svg
                      class="w-6 h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>

                    <span class="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-indigo-600 rounded-full">
                      {" "}
                      3{" "}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* نوبار دوم */}

        <div class="relative py-12 overflow-hidden bg-gray-100 sm:py-16 lg:py-20 xl:py-24">
          <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div class="flex flex-col">
              {/* سمت راست هیرو */}
              <div class="max-w-md mx-auto text-center xl:max-w-lg lg:mx-0 lg:text-left">
                <h1 class="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl lg:leading-tight xl:text-6xl">
                  {t("hero.title")} ✨ digital artworks
                </h1>
                <p class="mt-5 text-lg font-medium text-gray-900 lg:mt-8">
                  {t("hero.subtitle")}
                </p>

                <div class="mt-8 lg:mt-10">
                  <a
                    href="#"
                    title=""
                    class="inline-flex items-center justify-center px-8 py-3 text-base font-bold leading-7 text-white transition-all duration-200 bg-gray-900 border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600"
                    role="button"
                  >
                    Explore all artwork
                  </a>
                </div>

                <div class="mt-8 lg:mt-12">
                  <svg
                    class="w-auto h-4 mx-auto text-gray-300 lg:mx-0"
                    viewBox="0 0 172 16"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 11 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 46 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 81 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 116 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 151 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 18 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 53 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 88 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 123 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 158 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 25 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 60 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 95 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 130 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 165 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 32 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 67 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 102 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 137 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 172 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 39 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 74 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 109 1)"
                    ></line>
                    <line
                      y1="-0.5"
                      x2="18.0278"
                      y2="-0.5"
                      transform="matrix(-0.5547 0.83205 0.83205 0.5547 144 1)"
                    ></line>
                  </svg>
                </div>

                <div class="inline-grid grid-cols-2 mt-8 gap-x-8">
                  <div>
                    <p class="text-4xl font-bold text-gray-900">50k+</p>
                    <p class="mt-2 text-base font-medium text-gray-500">
                      Artwork
                    </p>
                  </div>

                  <div>
                    <p class="text-4xl font-bold text-gray-900">17k+</p>
                    <p class="mt-2 text-base font-medium text-gray-500">
                      Artists
                    </p>
                  </div>
                </div>
              </div>
              {/* سمت راست هیرو */}

              {/* عکس های پروفایل ها */}
              <div class="relative mt-12 lg:mt-0 lg:absolute lg:-translate-y-1/2 lg:translate-x-1/2 lg:top-1/2">
                <div class="relative w-full overflow-auto">
                  <div class="flex gap-8 flex-nowrap">
                    <div class="flex-none w-full sm:w-2/3 lg:w-full lg:flex-1 whitespace-nowrap">
                      <div class="overflow-hidden bg-white rounded shadow-xl">
                        <div class="aspect-w-4 aspect-h-3">
                          <img
                            class="object-cover w-full h-full"
                            src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/hero/2/artwork-1.png"
                            alt=""
                          />
                        </div>
                        <div class="p-8">
                          <p class="text-lg font-bold text-gray-900">
                            Ely-The Angry Girl
                          </p>
                          <p class="mt-6 text-xs font-medium tracking-widest text-gray-500 uppercase">
                            Reserved Price
                          </p>
                          <div class="flex items-end mt-1">
                            <p class="text-lg font-bold text-gray-900">
                              2.00 ETH
                            </p>
                            <p class="ml-2 text-sm font-medium text-gray-500">
                              ($9,394)
                            </p>
                          </div>
                          <div class="grid grid-cols-2 mt-7 gap-x-4">
                            <a
                              href="#"
                              title=""
                              class="inline-flex items-center justify-center px-4 py-4 text-sm font-bold text-white transition-all duration-200 bg-gray-900 border border-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-700"
                              role="button"
                            >
                              Place a bid
                            </a>

                            <a
                              href="#"
                              title=""
                              class="inline-flex items-center justify-center px-4 py-4 text-sm font-bold text-gray-900 transition-all duration-200 bg-transparent border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                              role="button"
                            >
                              View artwork
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex-none w-full sm:w-2/3 lg:w-full lg:flex-1 whitespace-nowrap">
                      <div class="overflow-hidden bg-white rounded shadow-xl">
                        <div class="aspect-w-4 aspect-h-3">
                          <img
                            class="object-cover w-full h-full"
                            src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/hero/2/artwork-2.png"
                            alt=""
                          />
                        </div>
                        <div class="p-8">
                          <p class="text-lg font-bold text-gray-900">
                            Jenny-Retro Art
                          </p>
                          <p class="mt-6 text-xs font-medium tracking-widest text-gray-500 uppercase">
                            Reserved Price
                          </p>
                          <div class="flex items-end mt-1">
                            <p class="text-lg font-bold text-gray-900">
                              1.67 ETH
                            </p>
                            <p class="ml-2 text-sm font-medium text-gray-500">
                              ($7,627)
                            </p>
                          </div>
                          <div class="grid grid-cols-2 mt-7 gap-x-4">
                            <a
                              href="#"
                              title=""
                              class="inline-flex items-center justify-center px-4 py-4 text-sm font-bold text-white transition-all duration-200 bg-gray-900 border border-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-700"
                              role="button"
                            >
                              Place a bid
                            </a>

                            <a
                              href="#"
                              title=""
                              class="inline-flex items-center justify-center px-4 py-4 text-sm font-bold text-gray-900 transition-all duration-200 bg-transparent border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                              role="button"
                            >
                              View artwork
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex-none w-full sm:w-2/3 lg:w-full lg:flex-1 whitespace-nowrap">
                      <div class="overflow-hidden bg-white rounded shadow-xl">
                        <div class="aspect-w-4 aspect-h-3">
                          <img
                            class="object-cover w-full h-full"
                            src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/hero/2/artwork-3.png"
                            alt=""
                          />
                        </div>
                        <div class="p-8">
                          <p class="text-lg font-bold text-gray-900">
                            Naila-The Angry Girl
                          </p>
                          <p class="mt-6 text-xs font-medium tracking-widest text-gray-500 uppercase">
                            Reserved Price
                          </p>
                          <div class="flex items-end mt-1">
                            <p class="text-lg font-bold text-gray-900">
                              2.40 ETH
                            </p>
                          </div>
                          <div class="grid grid-cols-2 mt-7 gap-x-4">
                            <a
                              href="#"
                              title=""
                              class="inline-flex items-center justify-center px-4 py-4 text-sm font-bold text-white transition-all duration-200 bg-gray-900 border border-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-700"
                              role="button"
                            >
                              Place a bid
                            </a>

                            <a
                              href="#"
                              title=""
                              class="inline-flex items-center justify-center px-4 py-4 text-sm font-bold text-gray-900 transition-all duration-200 bg-transparent border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                              role="button"
                            >
                              View artwork
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* عکس های پروفایل ها */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;

// <header className="hero-section bg-blue-600 text-white p-6 md:p-10 text-center">
//   <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("hero.title")}</h1>
//   <p className="text-lg sm:text-xl">{t("hero.subtitle")}</p>
// </header>
