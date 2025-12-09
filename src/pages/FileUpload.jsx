import React, { useState } from "react";
import API from "../services/api";
import FileUpload from "./FileUpload";

export default function CourseForm({ onCourseAdded = () => {}, onCancel = () => {} }) {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    duration: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const validate = () => {
    if (!course.title.trim() || course.title.length < 3) {
      setError("Title required (min 3 chars)");
      return false;
    }
    if (!course.description.trim() || course.description.length < 10) {
      setError("Description required (min 10 chars)");
      return false;
    }
    if (!course.category.trim()) {
      setError("Category required");
      return false;
    }
    if (!course.duration.trim()) {
      setError("Duration required");
      return false;
    }
    if (!thumbnail) {
      setError("Thumbnail required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", course.title.trim());
      formData.append("description", course.description.trim());
      formData.append("category", course.category.trim());
      formData.append("duration", course.duration.trim());
      formData.append("difficulty", course.difficulty);
      formData.append("thumbnail", thumbnail);

      const res = await API.post("/courses", formData);
      setSuccess("✅ Course created successfully!");
      onCourseAdded(res.data);
      
      // Reset form
      setCourse({
        title: "",
        description: "",
        category: "",
        difficulty: "Beginner",
        duration: "",
      });
      setThumbnail(null);
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg border space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">📚 Create Course</h2>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded text-sm">{success}</div>}

      {/* Course Title */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={course.title}
          onChange={handleChange}
          placeholder="Course title"
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          maxLength={100}
        />
        <p className="text-xs text-gray-500 mt-1">{course.title.length}/100</p>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-gray-700">Description</label>
        <textarea
          name="description"
          value={course.description}
          onChange={handleChange}
          placeholder="Course description"
          rows="3"
          className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{course.description.length}/500</p>
      </div>

      {/* Category, Duration, Difficulty */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700">Category</label>
          <input
            type="text"
            name="category"
            value={course.category}
            onChange={handleChange}
            placeholder="e.g., Programming"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">Duration</label>
          <input
            type="text"
            name="duration"
            value={course.duration}
            onChange={handleChange}
            placeholder="e.g., 8 hours"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div className="col-span-2">
          <label className="text-sm font-semibold text-gray-700">Difficulty Level</label>
          <select
            name="difficulty"
            value={course.difficulty}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="Beginner">🟢 Beginner</option>
            <option value="Intermediate">🟡 Intermediate</option>
            <option value="Advanced">🔴 Advanced</option>
          </select>
        </div>
      </div>

      {/* Thumbnail using FileUpload component */}
      <FileUpload 
        label="Course Thumbnail" 
        file={thumbnail} 
        setFile={setThumbnail}
        accept="image/*"
      />

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 font-semibold transition"
        >
          {loading ? "Creating..." : "🚀 Create Course"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}