import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { initialAttendance } from "./attendanceData";

export default function AttendanceManagement() {
  const { t, i18n } = useTranslation();
  const [attendance, setAttendance] = useState(initialAttendance);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [status, setStatus] = useState("همه");

  // جهت نوشتار بر اساس زبان
  const textDirection = i18n.language === "fa" ? "text-right" : "text-left";

  // تغییر dir صفحه
  useEffect(() => {
    document.body.dir = i18n.language === "fa" ? "rtl" : "ltr";
  }, [i18n.language]);

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
      `${t("report")}: ${t("present")} - ${report.totalPresent}, ${t(
        "absent"
      )} - ${report.totalAbsent}, ${t("late")} - ${report.totalLate}`
    );
  };

  return (
    <div
      className={`p-6 text-gray-900 dark:text-white min-h-screen ${textDirection}`}
    >
      <h1 className="text-3xl font-bold mb-6">
        📅 {t("attendanceManagement")}
      </h1>

      {/* فرم فیلتر کردن */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{t("filterStatus")}</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            type="date"
            className="p-2 border rounded"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <input
            type="text"
            placeholder={t("studentName")}
            className="p-2 border rounded"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="همه">{t("all")}</option>
            <option value="حضور">{t("present")}</option>
            <option value="غیبت">{t("absent")}</option>
            <option value="تاخیر">{t("late")}</option>
          </select>
          <button
            onClick={generateReport}
            className="p-2 bg-blue-500 text-white rounded"
          >
            {t("generateReport")}
          </button>
        </div>
      </div>

      {/* نمایش وضعیت حضور و غیاب */}
      <div className="p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">{t("attendanceList")}</h2>
        <motion.table className="w-full">
          <thead>
            <tr>
              <th className="p-2">{t("student")}</th>
              <th className="p-2">{t("date")}</th>
              <th className="p-2">{t("status")}</th>
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
