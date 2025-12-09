import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyCourses({ token }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8085/api/courses/mycourse", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:8085/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete course");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading courses...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-indigo-700">My Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Thumbnail */}
            <img
              src={course.thumbnail || "https://via.placeholder.com/400x200?text=No+Image"}
              alt={course.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4 space-y-2">
              {/* Title */}
              <h3 className="text-xl font-semibold">{course.title}</h3>
              
              {/* Instructor */}
              <p className="text-gray-600 text-sm">By {course.instructorName || "N/A"}</p>

              {/* Difficulty & Duration */}
              <p className="text-gray-700 text-sm">
                Difficulty: <span className="font-medium">{course.difficulty}</span> | Duration: <span className="font-medium">{course.duration}</span>
              </p>

              {/* Status */}
              <p
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  course.status === "Published"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {course.status || "Draft"}
              </p>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  onClick={() => alert("Edit course " + course.id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  onClick={() => handleDelete(course.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
