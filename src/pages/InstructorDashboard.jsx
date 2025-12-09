import React, { useState, useEffect } from "react";
import axios from "axios";

import CourseForm from "./CourseForm";
import CourseCard from "./CourseCard";
import Topbar from "../componet/Topbar";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token") || "";

  // Fetch all courses for instructor
  const loadCourses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8085/api/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data || []);
    } catch (err) {
      console.error("Error loading courses:", err);
      // prefer non-blocking UI message in dev
      alert("❌ Error loading courses (see console)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add new course
  const handleCourseAdded = (course) => {
    setCourses((prev) => [course, ...prev]);
  };

  // Update course in list
  const updateCourseInList = (updatedCourse) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
  };

  // Delete course from list
  const deleteCourseFromList = (id) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6">
      {/* Top bar */}
      <Topbar />

      {/* Course area */}
      <div className="mt-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
          <div>
            <button onClick={loadCourses} className="px-3 py-2 bg-gray-100 rounded mr-2">
              Refresh
            </button>
          </div>
        </div>

        {/* ================= COURSE LIST ================= */}
        <div className="bg-gray-200 shadow-lg rounded-xl p-6 border border-purple-400">
          <h2 className="text-xl font-semibold text-gray-700 mb-5">📘 All Courses</h2>

          {loading ? (
            <p className="text-center text-gray-600">Loading courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-red-500 font-medium">No courses found. Add a new course!</p>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  token={token}
                  updateCourse={updateCourseInList}
                  deleteCourse={deleteCourseFromList}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}