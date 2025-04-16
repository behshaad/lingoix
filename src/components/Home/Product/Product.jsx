import {
  MdHeadsetMic,
  MdBarChart,
  MdMenuBook,
  MdInventory,
  MdAutorenew,
  MdTrendingUp,
} from "react-icons/md";

const items = [
  {
    title: "پشتیبانی",
    description:
      "تیم ما همیشه آماده پاسخ‌گویی به سوالات و مشکلات شماست. پشتیبانی سریع و موثر را تجربه کنید.",
    icon: (
      <MdHeadsetMic
        size={46}
        className="mx-auto text-gray-900 dark:text-white"
      />
    ),
  },
  {
    title: "فروش",
    description:
      "ما به شما کمک می‌کنیم تا فروش خود را افزایش دهید و بازار هدف خود را بهتر بشناسید.",
    icon: (
      <MdBarChart size={46} className="mx-auto text-gray-900 dark:text-white" />
    ),
  },
  {
    title: "آموزش اولیه",
    description:
      "فرآیند آشنایی با پلتفرم ما ساده و سریع است. با ما همراه شوید و شروعی حرفه‌ای داشته باشید.",
    icon: (
      <MdMenuBook size={46} className="mx-auto text-gray-900 dark:text-white" />
    ),
  },
  {
    title: "محصول",
    description:
      "محصولات ما با کیفیت بالا و طراحی کاربرمحور ساخته شده‌اند تا بهترین تجربه را ارائه دهند.",
    icon: (
      <MdInventory
        size={46}
        className="mx-auto text-gray-900 dark:text-white"
      />
    ),
  },
  {
    title: "نگه‌داری کاربران",
    description:
      "با استراتژی‌های هوشمند، مشتریان وفادار خود را حفظ کنید و تعامل آن‌ها را افزایش دهید.",
    icon: (
      <MdAutorenew
        size={46}
        className="mx-auto text-gray-900 dark:text-white"
      />
    ),
  },
  {
    title: "رشد",
    description:
      "ما مسیر رشد شما را هموار می‌کنیم. از داده‌ها استفاده کنید و رشد پایدار را تجربه کنید.",
    icon: (
      <MdTrendingUp
        size={46}
        className="mx-auto text-gray-900 dark:text-white"
      />
    ),
  },
];

const Product = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl xl:text-5xl font-pj">
            هر مرحله را کاربرمحور طراحی کنید
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-300 sm:mt-8 font-pj">
            با خدمات و امکانات ما، تجربه‌ای حرفه‌ای و رضایت‌بخش برای کاربران خود
            بسازید.
          </p>
        </div>

        <div className="grid grid-cols-1 mt-10 text-center sm:mt-16 sm:grid-cols-2 sm:gap-x-12 gap-y-12 md:grid-cols-3 xl:grid-cols-3 xl:gap-x-16 xl:mt-24">
          {items.map((item, index) => (
            <div
              key={index}
              className={`md:p-8 lg:p-14 ${
                index % 3 !== 0
                  ? "md:border-l md:border-gray-200 dark:border-gray-700"
                  : ""
              } ${
                index >= 3
                  ? "md:border-t md:border-gray-200 dark:border-gray-700"
                  : ""
              } transition-all transform hover:scale-105 duration-300`}
            >
              {item.icon}
              <h3 className="mt-12 text-xl font-bold text-gray-900 dark:text-white font-pj">
                {item.title}
              </h3>
              <p className="mt-5 text-base text-gray-600 dark:text-gray-300 font-pj">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Product;
