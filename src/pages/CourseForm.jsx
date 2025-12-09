import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:8085/api";

export default function CourseForm({ onCourseAdded = () => {}, onCancel = () => {} }) {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Beginner",
    duration: "",
    thumbnail: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token") || "";
  const headers = { Authorization: `Bearer ${token}` };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file");
        return;
      }
      setCourse((p) => ({ ...p, [name]: file }));
      setPreview(URL.createObjectURL(file));
    } else {
      setCourse((p) => ({ ...p, [name]: value }));
    }
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
    if (!course.thumbnail) {
      setError("Thumbnail image required");
      return false;
    }
    return true;
  };

  // CREATE COURSE using multipart/form-data (matches Spring controller)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("title", course.title.trim());
      formData.append("description", course.description.trim());
      formData.append("category", course.category.trim());
      formData.append("difficulty", course.difficulty);
      formData.append("duration", course.duration.trim());
      formData.append("thumbnail", course.thumbnail); // file

      const res = await axios.post(`${BASE_URL}/courses`, formData, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });

      setSuccess("✅ Course created successfully!");
      onCourseAdded(res.data);

      // Reset form
      setCourse({
        title: "",
        description: "",
        category: "",
        difficulty: "Beginner",
        duration: "",
        thumbnail: null,
      });
      setPreview(null);

      // Optional: auto-close after 2 seconds
      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Course creation error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to create course";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* COURSE FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border space-y-4">
        <h2 className="text-2xl font-bold">📚 Create Course</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded text-sm">{success}</div>}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            name="title"
            value={course.title}
            onChange={handleChange}
            placeholder="e.g., Learn React"
            className="mt-1 w-full border rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            placeholder="e.g., Master React fundamentals..."
            rows={3}
            className="mt-1 w-full border rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            name="category"
            value={course.category}
            onChange={handleChange}
            placeholder="e.g., Programming"
            className="mt-1 w-full border rounded px-3 py-2"
            disabled={loading}
          />
        </div>

        {/* Difficulty & Duration */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              name="difficulty"
              value={course.difficulty}
              onChange={handleChange}
              className="mt-1 w-full border rounded px-3 py-2"
              disabled={loading}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <input
              name="duration"
              value={course.duration}
              onChange={handleChange}
              placeholder="e.g., 120"
              type="number"
              className="mt-1 w-full border rounded px-3 py-2"
              disabled={loading}
            />
          </div>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Thumbnail (required)</label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            className="mt-1 w-full"
            disabled={loading}
          />
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="preview" className="h-32 rounded border object-cover" />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-60 font-semibold"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}