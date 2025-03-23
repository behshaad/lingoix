// const LehrePage = () => {
//   return (
//     <>
//       <h1>hello LehrePage</h1>
//     </>
//   );
// };

// // export default LehrePage;
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import GSAP from "gsap";
import AssignmentManagement from "../components/Lehre/AssignmentManagement";

const data = [
  { name: "Week 1", progress: 40 },
  { name: "Week 2", progress: 55 },
  { name: "Week 3", progress: 70 },
  { name: "Week 4", progress: 85 },
];

export default function LehrePage() {
  const [activeStudents, setActiveStudents] = useState(120);
  const [averageScore, setAverageScore] = useState(85);
  const [completionPercentage, setCompletionPercentage] = useState(72);

  useEffect(() => {
    GSAP.fromTo(
      ".info-card",
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2 }
    );
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📊 داشبورد اساتید</h1>
      <div className="grid grid-cols-3 gap-6">
        <motion.div className="p-4 bg-white rounded-xl shadow-lg info-card">
          <h2 className="text-xl font-semibold">👨‍🎓 دانشجویان فعال</h2>
          <p className="text-3xl font-bold">{activeStudents}</p>
        </motion.div>
        <motion.div className="p-4 bg-white rounded-xl shadow-lg info-card">
          <h2 className="text-xl font-semibold">📈 میانگین نمرات</h2>
          <p className="text-3xl font-bold">{averageScore}%</p>
        </motion.div>
        <motion.div className="p-4 bg-white rounded-xl shadow-lg info-card">
          <h2 className="text-xl font-semibold">🎯 درصد تکمیل دوره</h2>
          <p className="text-3xl font-bold">{completionPercentage}%</p>
        </motion.div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">📊 نمودار پیشرفت کلی</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" fill="#4F46E5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <AssignmentManagement/>
    </div>
  );
}