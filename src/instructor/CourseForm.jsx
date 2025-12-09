import React, { useState } from "react";
import API from "../services/api";

export default function CourseForm({ course = null, onCourseAdded, onCourseUpdated, onCancel }) {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [category, setCategory] = useState(course?.category || "");
  const [duration, setDuration] = useState(course?.duration || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async (e) => {
    e && e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Title required");

    setLoading(true);
    try {
      if (course && course.id) {
        const res = await API.put(`/courses/${course.id}`, { title: title.trim(), description, category, duration });
        onCourseUpdated && onCourseUpdated(res.data);
      } else {
        const res = await API.post("/courses", { title: title.trim(), description, category, duration });
        onCourseAdded && onCourseAdded(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white p-4 rounded shadow">
      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" rows={3} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration (mins)</label>
          <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 block w-full px-3 py-2 border rounded" />
        </div>
      </div>

      {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-3 py-2 bg-indigo-600 text-white rounded">
          {loading ? "Saving..." : course ? "Update Course" : "Create Course"}
        </button>
        <button type="button" onClick={onCancel} className="px-3 py-2 bg-gray-100 rounded">Cancel</button>
      </div>
    </form>
  );
}