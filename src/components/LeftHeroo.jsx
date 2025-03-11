import { useTranslation } from "react-i18next";

const LeftHero = () => {
  const { t } = useTranslation();
  return (
    <div>
      {" "}
      <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl ">
        <div class="flex flex-col">
          {/* سمت چپ هیرو*/}
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
                        <p class="text-lg font-bold text-gray-900">2.00 ETH</p>
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
                        <p class="text-lg font-bold text-gray-900">1.67 ETH</p>
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
                        <p class="text-lg font-bold text-gray-900">2.40 ETH</p>
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
          {/* سمت چپ هیرو*/}
        </div>
      </div>
    </div>
  );
};

export default LeftHero;
