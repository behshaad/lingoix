import React, { useState } from "react";
import { motion } from "framer-motion";

const initialAssignments = [
  { id: 1, title: "تکلیف 1", dueDate: "2025-03-28", status: "در حال بررسی" },
  { id: 2, title: "تکلیف 2", dueDate: "2025-03-30", status: "ارسال شده" },
];

export default function AssignmentManagement() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newStatus, setNewStatus] = useState("در حال بررسی");

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📝 مدیریت تکالیف</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">افزودن تکلیف جدید</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="عنوان تکلیف"
            className="p-2 border rounded"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
          />
          <select
            className="p-2 border rounded"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <option value="در حال بررسی">در حال بررسی</option>
            <option value="ارسال شده">ارسال شده</option>
            <option value="تمام شده">تمام شده</option>
          </select>
          <button
            onClick={addAssignment}
            className="p-2 bg-blue-500 text-white rounded"
          >
            افزودن
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">لیست تکالیف</h2>
        <motion.table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">عنوان</th>
              <th className="p-2">تاریخ تحویل</th>
              <th className="p-2">وضعیت</th>
              <th className="p-2">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id}>
                <td className="p-2">{assignment.title}</td>
                <td className="p-2">{assignment.dueDate}</td>
                <td className="p-2">{assignment.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteAssignment(assignment.id)}
                    className="p-2 bg-red-500 text-white rounded"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => editAssignment(assignment.id)}
                    className="ml-2 p-2 bg-yellow-500 text-white rounded"
                  >
                    ویرایش
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
