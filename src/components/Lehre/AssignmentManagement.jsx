import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// تابع برای گرفتن جهت متن بر اساس زبان
function useTextDirection() {
  const { i18n } = useTranslation();
  return i18n.language === "fa" ? "text-right" : "text-left";
}

const initialAssignments = [
  { id: 1, title: "تکلیف 1", dueDate: "2025-03-28", status: "در حال بررسی" },
  { id: 2, title: "تکلیف 2", dueDate: "2025-03-30", status: "ارسال شده" },
];

export default function AssignmentManagement() {
  const { t, i18n } = useTranslation();
  const [assignments, setAssignments] = useState(initialAssignments);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState("در حال بررسی");

  // جهت صفحه را تغییر می‌دهد
  useEffect(() => {
    document.body.dir = i18n.language === "fa" ? "rtl" : "ltr";
  }, [i18n.language]);

  // افزودن تکلیف جدید
  const addAssignment = () => {
    const newAssignment = {
      id: assignments.length + 1,
      title: newTitle,
      dueDate: newDueDate,
      status: newStatus,
    };
    setAssignments([...assignments, newAssignment]);
    setNewTitle("");
    setNewDueDate("");
    setNewStatus("در حال بررسی");
  };

  // حذف تکلیف
  const deleteAssignment = (id) => {
    setAssignments(assignments.filter((assignment) => assignment.id !== id));
  };

  // ویرایش تکلیف
  const editAssignment = (id) => {
    const updatedAssignments = assignments.map((assignment) =>
      assignment.id === id
        ? {
            ...assignment,
            title: newTitle,
            dueDate: newDueDate,
            status: newStatus,
          }
        : assignment
    );
    setAssignments(updatedAssignments);
    setNewTitle("");
    setNewDueDate("");
    setNewStatus("در حال بررسی");
  };

  // گرفتن جهت متن
  const textDirection = useTextDirection();

  return (
    <div className="p-2 sm:p-4  text-gray-900 dark:text-white ">
      {/* عنوان */}
      <h1 className={`text-2xl sm:text-3xl font-bold mb-3 ${textDirection}`}>
        {t("assignmentManagement")}
      </h1>

      {/* افزودن تکلیف جدید */}
      <div className="mb-4">
        <h2
          className={`text-lg sm:text-xl font-semibold mb-2 ${textDirection}`}
        >
          {t("addAssignment")}
        </h2>
        <div className="flex flex-col md:flex-row flex-wrap gap-2 mb-2">
          <input
            type="text"
            placeholder={t("assignmentTitlePlaceholder")}
            className="p-2 border rounded w-full md:w-auto"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded w-full md:w-auto"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <select
            className="p-2 border rounded w-full md:w-auto"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="در حال بررسی">{t("underReview")}</option>
            <option value="ارسال شده">{t("submitted")}</option>
            <option value="تمام شده">{t("completed")}</option>
          </select>
          <button
            onClick={addAssignment}
            className="p-2 bg-blue-500 text-white rounded w-full md:w-auto"
          >
            {t("add")}
          </button>
        </div>
      </div>

      {/* لیست تکالیف */}
      <div className="text-gray-900 dark:text-white p-2 sm:p-4 rounded-xl shadow-lg overflow-x-auto">
        <h2
          className={`text-lg sm:text-xl font-semibold mb-2 ${textDirection}`}
        >
          {t("assignmentList")}
        </h2>
        <motion.table className={`w-full min-w-[600px] ${textDirection}`}>
          <thead>
            <tr>
              <th className="p-1 text-left">{t("title")}</th>
              <th className="p-1 text-left">{t("dueDate")}</th>
              <th className="p-1 text-left">{t("status")}</th>
              <th className="p-1 text-left">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-t">
                <td className="p-1">{assignment.title}</td>
                <td className="p-1">{assignment.dueDate}</td>
                <td className="p-1">{assignment.status}</td>
                <td className="p-1 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => deleteAssignment(assignment.id)}
                    className="p-2 bg-red-500 text-white rounded"
                  >
                    {t("delete")}
                  </button>
                  <button
                    onClick={() => editAssignment(assignment.id)}
                    className="p-2 bg-yellow-500 text-white rounded"
                  >
                    {t("edit")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
}
