import { useState } from "react";

// لیست کورس‌ها
const initialCourses = [
  { id: 1, name: "Lesson one", questions: [] },
  { id: 2, name: "Lesson two", questions: [] },
  { id: 3, name: "Lesson Three", questions: [] },
];

export default function FlashCards() {
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // وقتی کاربر یک کورس را انتخاب می‌کند، کورس انتخابی ذخیره می‌شود
  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
  };

  // اضافه کردن کورس جدید
  const handleAddCourse = () => {
    const newCourse = {
      id: courses.length + 1,
      name: newCourseName,
      questions: [],
    };
    setCourses([...courses, newCourse]);
    setNewCourseName(""); // Clear input after adding
  };

  // اضافه کردن سوالات به کورس
  const handleAddQuestion = () => {
    const updatedCourses = courses.map((course) => {
      if (course.id === selectedCourse) {
        course.questions.push({
          id: course.questions.length + 1,
          question: newQuestion,
          answer: newAnswer,
        });
      }
      return course;
    });
    setCourses(updatedCourses);
    setNewQuestion(""); // Clear input after adding question
    setNewAnswer(""); // Clear input after adding answer
  };

  // برای بازگشت به صفحه انتخاب کورس‌ها
  const handleBack = () => {
    setSelectedCourse(null);
  };

  const currentCourse = courses.find((course) => course.id === selectedCourse);

  return (
    <div className="">
      {!selectedCourse ? (
        <div className="course-selection flex flex-col items-center p-3">
          <h1 className="text-4xl font-bold mb-8">FlashCards selection</h1>
          <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="course-card p-6 bg-opacity-30 backdrop-blur-xl rounded-lg shadow-lg cursor-pointer transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-opacity-50"
                onClick={() => handleCourseSelect(course.id)}
              >
                <h2 className="text-xl font-semibold ">{course.name}</h2>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <input
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="New Course Name"
              className="p-2 border rounded"
            />
            <button
              onClick={handleAddCourse}
              className="bg-blue-500 text-white p-3 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 mt-4"
            >
              Add New Course
            </button>
          </div>
        </div>
      ) : (
        <FlashCard
          course={currentCourse}
          onBack={handleBack}
          handleAddQuestion={handleAddQuestion}
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          newAnswer={newAnswer}
          setNewAnswer={setNewAnswer}
        />
      )}
    </div>
  );
}

function FlashCard({
  course,
  onBack,
  handleAddQuestion,
  newQuestion,
  setNewQuestion,
  newAnswer,
  setNewAnswer,
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const handleClick = (id) => {
    setSelectedId(id !== selectedId ? id : null);
  };

  const handleAnswer = (isCorrect, questionId) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setIncorrectAnswers(incorrectAnswers + 1);
    }
    setSelectedId(null); // Deselect the card after answering
  };

  return (
    <div className="flex flex-col ">
      <div className="mt-8">
        <button
          onClick={onBack}
          className="bg-gray-700 text-white p-3 rounded-lg shadow-lg hover:bg-gray-800 transition duration-300"
        >
          back
        </button>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Course question cards</h1>
        <p className="text-lg">Correct Answers: {correctAnswers}</p>
        <p className="text-lg">Incorrect Answers: {incorrectAnswers}</p>
      </div>

      {/* فرم برای اضافه کردن سوال جدید */}
      <div className="add-question-form mb-8 ml-8">
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="New Question"
          className="p-2 border rounded"
        />
        <input
          type="text"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Answer"
          className="p-2 border rounded ml-4"
        />
        {/* <button
          onClick={handleAddQuestion}
          className="bg-green-500 text-white p-3 rounded-lg shadow-lg hover:bg-green-600 transition duration-300 ml-4"
        >
          Add Question
        </button> */}
      </div>
      <button
        onClick={handleAddQuestion}
        className="bg-blue-600 text-white p-3  shadow-lg hover:bg-green-600 transition duration-300 "
      >
        Add Question
      </button>

      <div className="flashcard-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {course.questions.map((question) => (
          <div
            key={question.id}
            onClick={() => handleClick(question.id)}
            className={`flashcard p-6 bg-opacity-20 backdrop-blur-xl rounded-xl shadow-md cursor-pointer transition-all duration-300 transform ${
              selectedId === question.id
                ? "bg-blue-500 text-white shadow-2xl scale-105"
                : "bg-white text-gray-800"
            } hover:scale-105 hover:shadow-xl hover:bg-blue-50`}
          >
            <p className="text-lg font-semibold text-center">
              {selectedId === question.id ? question.answer : question.question}
            </p>
            {selectedId === question.id && (
              <div className="answer-buttons mt-4 flex justify-center gap-4">
                <button
                  className="bg-green-500 text-white p-2 rounded-lg transition-transform duration-300 transform hover:scale-105"
                  onClick={() => handleAnswer(true, question.id)}
                >
                  Correct
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-lg transition-transform duration-300 transform hover:scale-105"
                  onClick={() => handleAnswer(false, question.id)}
                >
                  Wrong
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}