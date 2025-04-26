"use client";

import { useState } from "react";
import { ChevronLeft, Plus, Check, X } from "lucide-react";

export default function FlashcardApp() {
  // Initial courses data
  const initialCourses = [
    {
      id: "1",
      name: "Mathematics",
      questions: [
        {
          id: "m1",
          question: "What is the formula for the area of a circle?",
          answer: "πr²",
          correctCount: 0,
          wrongCount: 0,
        },
        {
          id: "m2",
          question: "What is the Pythagorean theorem?",
          answer: "a² + b² = c²",
          correctCount: 0,
          wrongCount: 0,
        },
      ],
    },
    {
      id: "2",
      name: "Science",
      questions: [
        {
          id: "s1",
          question: "What is the chemical symbol for water?",
          answer: "H₂O",
          correctCount: 0,
          wrongCount: 0,
        },
        {
          id: "s2",
          question: "What is the first element on the periodic table?",
          answer: "Hydrogen (H)",
          correctCount: 0,
          wrongCount: 0,
        },
      ],
    },
  ];

  // State management
  const [courses, setCourses] = useState(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newCourseName, setNewCourseName] = useState("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [flippedCardId, setFlippedCardId] = useState(null);

  // Add a new course
  const handleAddCourse = () => {
    if (!newCourseName.trim()) return;

    const newCourse = {
      id: Date.now().toString(),
      name: newCourseName,
      questions: [],
    };

    setCourses([...courses, newCourse]);
    setNewCourseName("");
  };

  // Add a new question to the selected course
  const handleAddQuestion = () => {
    if (!selectedCourse || !newQuestion.trim() || !newAnswer.trim()) return;

    const newQuestionObj = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      correctCount: 0,
      wrongCount: 0,
    };

    const updatedCourses = courses.map((course) => {
      if (course.id === selectedCourse.id) {
        return {
          ...course,
          questions: [...course.questions, newQuestionObj],
        };
      }
      return course;
    });

    setCourses(updatedCourses);
    setSelectedCourse({
      ...selectedCourse,
      questions: [...selectedCourse.questions, newQuestionObj],
    });
    setNewQuestion("");
    setNewAnswer("");
  };

  // Handle card flip
  const handleCardFlip = (questionId) => {
    setFlippedCardId(flippedCardId === questionId ? null : questionId);
  };

  // Handle answer feedback (correct/wrong)
  const handleAnswerFeedback = (questionId, isCorrect) => {
    if (!selectedCourse) return;

    const updatedCourses = courses.map((course) => {
      if (course.id === selectedCourse.id) {
        const updatedQuestions = course.questions.map((q) => {
          if (q.id === questionId) {
            return {
              ...q,
              correctCount: isCorrect ? q.correctCount + 1 : q.correctCount,
              wrongCount: isCorrect ? q.wrongCount : q.wrongCount + 1,
            };
          }
          return q;
        });
        return { ...course, questions: updatedQuestions };
      }
      return course;
    });

    setCourses(updatedCourses);

    // Update the selected course as well
    const updatedSelectedCourse = updatedCourses.find(
      (course) => course.id === selectedCourse.id
    );
    if (updatedSelectedCourse) {
      setSelectedCourse(updatedSelectedCourse);
    }

    // Reset the flipped state
    setFlippedCardId(null);
  };

  // Go back to course list
  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setFlippedCardId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">
        Flashcard Study App
      </h1>

      {!selectedCourse ? (
        // Course List View
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Add New Course</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter course name"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                onClick={handleAddCourse}
                className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700"
                  onClick={() => setSelectedCourse(course)}
                >
                  <h3 className="text-lg font-medium">{course.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {course.questions.length} flashcards
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Course Detail View
        <div className="space-y-6">
          <div className="flex items-center mb-6">
            <button
              onClick={handleBackToCourses}
              className="flex items-center justify-center mr-4 px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </button>
            <h2 className="text-2xl font-semibold">{selectedCourse.name}</h2>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-4">Add New Flashcard</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Question
                </label>
                <input
                  type="text"
                  placeholder="Enter your question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Answer</label>
                <input
                  type="text"
                  placeholder="Enter the answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <button
                onClick={handleAddQuestion}
                className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Flashcard
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
            <h3 className="text-xl font-semibold mb-4">Flashcards</h3>
            {selectedCourse.questions.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No flashcards yet. Add your first one above!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedCourse.questions.map((question) => (
                  <div
                    key={question.id}
                    className={`relative h-48 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
                      flippedCardId === question.id
                        ? "bg-gray-100 dark:bg-gray-700"
                        : "bg-white dark:bg-gray-800"
                    } border border-gray-200 dark:border-gray-700`}
                    onClick={() => handleCardFlip(question.id)}
                  >
                    <div className="absolute inset-0 p-6 flex flex-col">
                      {flippedCardId === question.id ? (
                        // Answer side
                        <div className="flex flex-col h-full">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Answer:
                          </p>
                          <p className="text-lg font-medium flex-1">
                            {question.answer}
                          </p>
                          <div className="flex justify-between mt-4">
                            <button
                              className="flex-1 mr-2 flex items-center justify-center px-3 py-1 border border-green-500 rounded-md text-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors dark:hover:bg-green-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAnswerFeedback(question.id, true);
                              }}
                            >
                              <Check className="h-4 w-4 mr-1 text-green-500" />
                              Correct
                            </button>
                            <button
                              className="flex-1 ml-2 flex items-center justify-center px-3 py-1 border border-red-500 rounded-md text-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors dark:hover:bg-red-900"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAnswerFeedback(question.id, false);
                              }}
                            >
                              <X className="h-4 w-4 mr-1 text-red-500" />
                              Wrong
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Question side
                        <div className="flex flex-col h-full">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            Question:
                          </p>
                          <p className="text-lg font-medium flex-1">
                            {question.question}
                          </p>
                          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Correct: {question.correctCount}</span>
                            <span>Wrong: {question.wrongCount}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
