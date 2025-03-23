import React, { useState } from "react";
import { motion } from "framer-motion";

const initialAttendance = [
  { id: 1, student: "علی", date: "2025-03-21", status: "حضور" },
  { id: 2, student: "زهرا", date: "2025-03-21", status: "غیبت" },
  { id: 3, student: "حسین", date: "2025-03-22", status: "تاخیر" },
  // ... سایر داده‌ها
];

export default function AttendanceManagement() {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [status, setStatus] = useState("حضور");

  // فیلتر کردن داده‌ها
  const filteredAttendance = attendance.filter((entry) => {
    return (
      (selectedDate ? entry.date === selectedDate : true) &&
      (selectedStudent ? entry.student.includes(selectedStudent) : true) &&
      (status !== "همه" ? entry.status === status : true)
    );
  });

  // گزارش‌گیری
  const generateReport = () => {
    const report = {
      totalPresent: filteredAttendance.filter(
        (entry) => entry.status === "حضور"
      ).length,
      totalAbsent: filteredAttendance.filter((entry) => entry.status === "غیبت")
        .length,
      totalLate: filteredAttendance.filter((entry) => entry.status === "تاخیر")
        .length,
    };
    alert(
      `گزارش: حضور - ${report.totalPresent}, غیبت - ${report.totalAbsent}, تاخیر - ${report.totalLate}`
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📅 مدیریت حضور و غیاب</h1>

      {/* فرم فیلتر کردن */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">فیلتر کردن وضعیت‌ها</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="date"
            className="p-2 border rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="نام دانشجو"
            className="p-2 border rounded"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="همه">همه</option>
            <option value="حضور">حضور</option>
            <option value="غیبت">غیبت</option>
            <option value="تاخیر">تاخیر</option>
          </select>
          <button
            onClick={generateReport}
            className="p-2 bg-blue-500 text-white rounded"
          >
            گزارش‌گیری
          </button>
        </div>
      </div>

      {/* نمایش وضعیت حضور و غیاب */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">لیست حضور و غیاب</h2>
        <motion.table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">نام دانشجو</th>
              <th className="p-2">تاریخ</th>
              <th className="p-2">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map((entry) => (
              <tr key={entry.id}>
                <td className="p-2">{entry.student}</td>
                <td className="p-2">{entry.date}</td>
                <td className="p-2">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
}