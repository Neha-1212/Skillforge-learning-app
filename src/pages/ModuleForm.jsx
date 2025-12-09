import React, { useState, useMemo } from "react";
import LessonForm from "./LessonForm";
import API from "../services/api";

export default function ModuleForm({ courseId, existingModule, onModuleSaved, onCancel }) {
  const [title, setTitle] = useState(existingModule?.title || "");
  const [description, setDescription] = useState(existingModule?.description || "");
  const [lessons, setLessons] = useState(existingModule?.lessons || []);
  const [addingLesson, setAddingLesson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savedModuleId, setSavedModuleId] = useState(existingModule?.id || null);

  const totalDuration = useMemo(
    () => lessons.reduce((sum, l) => sum + (parseInt(l.duration) || 0), 0),
    [lessons]
  );

  const validate = () => {
    if (!title.trim()) { setError("Module title required"); return false; }
    if (!description.trim()) { setError("Module description required"); return false; }
    return true;
  };

  const handleSaveModule = async () => {
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      const payload = { title: title.trim(), description: description.trim(), courseId, lessons, duration: totalDuration };
      const res = savedModuleId
        ? await API.put(`/modules/${savedModuleId}`, payload)
        : await API.post(`/modules`, payload);

      setSavedModuleId(res.data.id);
      setSuccess(`Module ${savedModuleId ? "updated" : "created"}!`);
      setTimeout(() => setSuccess(""), 2000);

      // Update parent
      onModuleSaved({ id: res.data.id, title, description, lessons });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save module");
    } finally {
      setLoading(false);
    }
  };

  const handleLessonAdded = (newLesson) => {
    setLessons((prevLessons) => {
      const updated = [...prevLessons, newLesson];
      onModuleSaved({ id: savedModuleId, title, description, lessons: updated });
      return updated;
    });

    setSuccess("Lesson added!");
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border space-y-4">
      <h3 className="text-xl font-bold text-gray-800">{existingModule ? "Edit Module" : "Add Module"}</h3>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded text-sm">{success}</div>}

      <input
        type="text"
        placeholder="Module Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      <textarea
        placeholder="Module Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="2"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
      />

      {/* Lessons Section */}
      <div className="bg-gray-50 p-3 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-800">Lessons ({lessons.length})</h4>
          {lessons.length > 0 && <span className="text-xs text-gray-600">Total: {totalDuration}m</span>}
        </div>

        {lessons.length > 0 ? (
          <ul className="space-y-1 mb-2 max-h-32 overflow-y-auto">
            {lessons.map((l) => (
              <li key={l.id} className="flex justify-between text-xs bg-white p-2 rounded border">
                <span className="font-medium">{l.title}</span>
                <span className="text-gray-500">{l.duration}m</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-gray-400 text-xs py-2">No lessons yet</p>}

        {/* Lesson Form */}
        {addingLesson && savedModuleId ? (
          <LessonForm
            moduleId={savedModuleId}
            onLessonAdded={handleLessonAdded}
            onCancel={() => setAddingLesson(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => savedModuleId ? setAddingLesson(true) : setError("Save module first to add lessons")}
            disabled={!savedModuleId}
            className={`w-full py-2 rounded text-white text-sm font-semibold ${savedModuleId ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            + Add Lesson
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSaveModule}
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
        >
          {loading ? "Saving..." : (savedModuleId ? "Update Module" : "Save Module")}
        </button>
        <button onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 font-semibold">
          Cancel
        </button>
      </div>
    </div>
  );
}
