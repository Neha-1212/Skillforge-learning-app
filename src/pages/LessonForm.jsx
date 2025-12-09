import React, { useState } from "react";
import axios from "axios";

export default function LessonForm({ moduleId, token, onLessonAdded, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    externalLink: "",
    difficulty: "",
    tags: [],
    duration: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -------------------------
  // Input Handlers
  // -------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  // -------------------------
  // Submit Lesson
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const authToken = token || localStorage.getItem("token");
    if (!authToken) {
      setError("Login expired. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("description", form.description);
      data.append("moduleId", moduleId);
      data.append("externalLink", form.externalLink || "");
      data.append("difficulty", form.difficulty || "");
      data.append("duration", form.duration || "");
      data.append("tags", JSON.stringify(form.tags));

      if (videoFile) data.append("video", videoFile);
      if (pdfFile) data.append("pdf", pdfFile);

      const res = await axios.post(
        "http://localhost:8085/api/lessons",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      // Send new lesson back to parent
      onLessonAdded(res.data);

      // Reset form
      setForm({
        title: "",
        description: "",
        externalLink: "",
        difficulty: "",
        tags: [],
        duration: "",
      });
      setVideoFile(null);
      setPdfFile(null);
    } catch (err) {
      console.error(err.response || err);
      setError(err.response?.data?.message || "Lesson save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-5">➕ Add New Lesson</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="title"
          placeholder="Lesson Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <textarea
          name="description"
          placeholder="Lesson Description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <input
          name="duration"
          placeholder="Duration (in minutes)"
          value={form.duration}
          onChange={handleChange}
          type="number"
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <div>
          <label className="block font-medium mb-1">Video File</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="w-full"
          />
          {videoFile && <p className="text-sm text-gray-600 mt-1">Selected: {videoFile.name}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="w-full"
          />
          {pdfFile && <p className="text-sm text-gray-600 mt-1">Selected: {pdfFile.name}</p>}
        </div>

        <input
          name="externalLink"
          placeholder="External Video Link"
          value={form.externalLink}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <select
          name="difficulty"
          value={form.difficulty}
          onChange={handleChange}
          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Select Difficulty</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Add tag"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-indigo-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                type="button"
                className="text-red-600"
              >
                ❌
              </button>
            </span>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onCancel}
            className="border px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          >
            {loading ? "Saving..." : "Save Lesson"}
          </button>
        </div>
      </form>
    </div>
  );
}
