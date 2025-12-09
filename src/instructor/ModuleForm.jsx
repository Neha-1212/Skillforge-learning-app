import React, { useState } from "react";
import API from "../services/api";

export default function ModuleForm({ courseId, module = null, onModuleSaved, onCancel }) {
  const [title, setTitle] = useState(module?.title || "");
  const [description, setDescription] = useState(module?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const save = async (e) => {
    e && e.preventDefault();
    if (!title.trim()) return setError("Title required");
    setLoading(true);
    try {
      if (module && module.id) {
        const res = await API.put(`/modules/${module.id}`, { title: title.trim(), description });
        onModuleSaved && onModuleSaved(res.data);
      } else {
        // create module under course
        const res = await API.post(`/courses/${courseId}/modules`, { title: title.trim(), description });
        onModuleSaved && onModuleSaved(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save module");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white p-3 rounded border">
      <div className="mb-2">
        <label className="block text-sm font-medium">Module Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
      </div>

      {error && <div className="text-xs text-red-600 mb-2">{error}</div>}

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">
          {loading ? "Saving..." : module ? "Update" : "Save Module"}
        </button>
        <button type="button" onClick={onCancel} className="px-3 py-1 bg-gray-100 rounded text-sm">Cancel</button>
      </div>
    </form>
  );
}