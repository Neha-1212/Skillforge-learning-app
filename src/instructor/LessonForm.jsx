import React, { useState, useRef, useEffect } from "react";
import API from "../services/api";

export default function LessonForm({ moduleId, onLessonAdded, onCancel, autoClose = false }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [duration, setDuration] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [resourceFile, setResourceFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const titleRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => { if (titleRef.current) titleRef.current.focus(); }, []);

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    setTags((p) => [...p, t]);
    setTagInput("");
  };
  const removeTag = (i) => setTags((p) => p.filter((_, idx) => idx !== i));

  const handleFile = (e) => {
    const f = e.target.files[0];
    setResourceFile(f || null);
  };

  const validate = () => {
    setError("");
    if (!title.trim() || title.trim().length < 3) return setError("Title min 3 chars");
    if (!moduleId) return setError("Save module first");
    if (!duration || Number(duration) <= 0) return setError("Duration required");
    return true;
  };

  const save = async (e) => {
    e && e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError("");
    setUploadProgress(0);

    try {
      let res;
      if (resourceFile) {
        const form = new FormData();
        form.append("title", title.trim());
        form.append("description", description.trim());
        form.append("externalLink", externalLink.trim());
        form.append("difficulty", difficulty);
        form.append("duration", Number(duration));
        tags.forEach((t) => form.append("tags", t));
        form.append("resource", resourceFile);

        res = await API.post(`/modules/${moduleId}/lessons`, form, {
          onUploadProgress: (ev) => { if (ev.total) setUploadProgress(Math.round((ev.loaded * 100) / ev.total)); }
        });
      } else {
        const payload = { title: title.trim(), description: description.trim() || undefined, externalLink: externalLink.trim() || undefined, difficulty, duration: Number(duration), tags };
        res = await API.post(`/modules/${moduleId}/lessons`, payload);
      }

      onLessonAdded && onLessonAdded(res.data);
      // reset
      setTitle(""); setDescription(""); setExternalLink(""); setDifficulty("Beginner"); setDuration(""); setTags([]); setResourceFile(null);
      if (fileRef.current) fileRef.current.value = "";
      if (autoClose) onCancel && onCancel();
    } catch (err) {
      console.error("Failed to save lesson", err);
      setError(err?.response?.data?.message || err?.message || "Failed to add lesson");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={save} className="bg-white p-3 rounded border">
      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" rows={2} />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Upload resource (video/pdf) - optional</label>
        <input ref={fileRef} type="file" onChange={handleFile} className="mt-1" accept="video/*,application/pdf" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div>
          <label className="block text-sm font-medium">External Link / PDF URL</label>
          <input value={externalLink} onChange={(e) => setExternalLink(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded">
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Duration (minutes)</label>
        <input type="number" min={1} value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-1 block w-full px-2 py-1 border rounded" />
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium">Tags (press Add)</label>
        <div className="flex gap-2 mt-1">
          <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} className="flex-1 px-2 py-1 border rounded" />
          <button type="button" onClick={addTag} className="px-2 py-1 bg-indigo-600 text-white rounded">Add</button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm flex items-center gap-2">
              {t} <button type="button" onClick={() => removeTag(i)} className="text-xs text-red-600">×</button>
            </span>
          ))}
        </div>
      </div>

      {uploadProgress > 0 && <div className="w-full bg-gray-100 h-2 rounded overflow-hidden mb-2"><div className="h-full bg-indigo-500" style={{ width: `${uploadProgress}%` }} /></div>}
      {error && <div className="text-xs text-red-600 mb-2">{error}</div>}

      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="px-3 py-1 bg-indigo-600 text-white rounded">{loading ? "Saving..." : "Add Lesson"}</button>
        <button type="button" onClick={onCancel} disabled={loading} className="px-3 py-1 bg-gray-100 rounded">Cancel</button>
      </div>
    </form>
  );
}