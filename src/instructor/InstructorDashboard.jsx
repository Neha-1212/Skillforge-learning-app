// src/instructor/InstructorDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import CourseForm from "./CourseForm";
import { Link } from "react-router-dom";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("fetch courses", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = (course) => {
    setCourses(prev => [course, ...prev]);
    setShowCreate(false);
  };

  const totalStudents = courses.reduce((s, c) => s + (c.students || 0), 0);
  const revenue = courses.reduce((s, c) => s + (c.revenue || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <section className="lg:col-span-1 bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Overview</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Courses</div>
            <div className="text-xl font-bold">{courses.length}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Students</div>
            <div className="text-xl font-bold">{totalStudents}</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Revenue</div>
            <div className="text-xl font-bold">₹{revenue}</div>
          </div>

          <button
            onClick={() => setShowCreate(prev => !prev)}
            className="w-full mt-4 bg-indigo-600 text-white py-2 rounded"
          >
            + Create Course
          </button>

          <Link to="/instructor/courses" className="block mt-3 text-center text-sm text-indigo-600">Manage courses</Link>
        </div>
      </section>

      <section className="lg:col-span-3 space-y-6">
        {showCreate && (
          <div className="bg-white p-6 rounded shadow">
            <CourseForm onCourseAdded={handleAddCourse} onCancel={() => setShowCreate(false)} />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 p-6 bg-white rounded shadow">Loading...</div>
          ) : (
            courses.slice(0, 6).map(c => (
              <div key={c.id} className="bg-white p-4 rounded shadow">
                <div className="flex items-center gap-4">
                  {c.thumbnailUrl ? (
                    <img src={c.thumbnailUrl} alt="" className="h-16 w-24 object-cover rounded" />
                  ) : (
                    <div className="h-16 w-24 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-400">No Image</div>
                  )}

                  <div className="flex-1">
                    <div className="font-semibold">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.description?.slice(0,80)}</div>
                    <div className="mt-2 text-xs">
                      <Link to={`/instructor/courses/${c.id}/builder`} className="text-indigo-600">Edit / Builder</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
