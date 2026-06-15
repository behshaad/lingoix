import React from "react";

const pricingPlans = [
  {
    title: "Basic",
    price: "$9.99",
    features: [
      "Access to standard workouts and nutrition plans",
      "Email support",
    ],
    cta: "Get Started",
    href: "#basic",
    color: "bg-teal-500",
  },
  {
    title: "Pro",
    price: "$19.99",
    features: [
      "Access to advanced workouts and nutrition plans",
      "Priority Email support",
      "Exclusive access to live Q&A sessions",
    ],
    cta: "Upgrade to Pro",
    href: "#pro",
    color: "bg-purple-500",
  },
  {
    title: "Ultimate",
    price: "$29.99",
    features: [
      "Access to all premium workouts and nutrition plans",
      "24/7 Priority support",
      "1-on-1 virtual coaching session every month",
      "Exclusive content and early access to new features",
    ],
    cta: "Go Ultimate",
    href: "#ultimate",
    color: "bg-red-500",
  },
];

const Pricing = () => {
  return (
    <main className="flex flex-col items-center py-12 px-4 bg-gray-900 text-white min-h-screen">
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
        {pricingPlans.map((plan, index) => (
          <div
            key={index}
            className="flex flex-col bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{plan.title}</h2>
            <p className="text-3xl font-bold">{plan.price}</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-400">✔</span>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href={plan.href}
              className={`${plan.color} mt-6 py-2 text-center text-white font-semibold rounded-lg hover:opacity-90 transition`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Pricing;
