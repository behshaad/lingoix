import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  CartesianGrid,
  Legend,
  Label,
} from "recharts"; // افزودن کامپوننت‌های جدید

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 200 },
  { name: "Apr", value: 278 },
  { name: "May", value: 189 },
  { name: "Jun", value: 239 },
];

const LearningStatistics = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2 text-center">
        Learning Statistics
      </h2>

      {/* اضافه کردن بخش برای نمایش ساعات یادگیری */}
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-6">
        <div className="text-center">
          <h3 className="font-semibold text-lg">Your Top Week</h3>
          <p className="text-xl font-bold">12 hours 30 mins</p>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg">This Week</h3>
          <p className="text-xl font-bold">8 hours 45 mins</p>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-lg">Avg Learner</h3>
          <p className="text-xl font-bold">10 hours 15 mins</p>
        </div>
      </div>

      {/* نمایش تفاوت ساعات یادگیری */}
      <div className="bg-yellow-100 p-3 rounded-lg mb-6">
        <p className="text-sm text-yellow-800">
          So far this week, you have learned <strong>3 hours 19 mins</strong>{" "}
          less than the average Alison Learner last week.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-6">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            {/* افزودن خطوط شبکه برای خوانایی بیشتر */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* تنظیمات محور X */}
            <XAxis dataKey="name">
              <Label value="Months" offset={0} position="insideBottom" />
            </XAxis>
            {/* تنظیمات محور Y */}
            <YAxis>
              <Label value="Values" angle={-90} position="insideLeft" />
            </YAxis>
            {/* شخصی‌سازی Tooltip */}
            <Tooltip
              contentStyle={{ backgroundColor: "#f5f5f5", borderRadius: "5px" }}
            />
            {/* افزودن Legend برای توضیحات بیشتر */}
            <Legend />
            {/* تنظیم بارها */}
            <Bar
              dataKey="value"
              fill="#8884d8"
              barSize={30}
              radius={[10, 10, 0, 0]} // گوشه‌های گرد برای بارها
              animationDuration={800} // انیمیشن جذاب
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LearningStatistics;