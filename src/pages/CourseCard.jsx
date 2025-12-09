import React, { useState } from "react";
import axios from "axios";
import ModuleForm from "./ModuleForm";
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";

const BASE_URL = "http://localhost:8085/api";
const token = localStorage.getItem("token") || "";
const headers = { Authorization: `Bearer ${token}` };

export default function CourseCard({ course, updateCourse, deleteCourse }) {
  const [addingModule, setAddingModule] = useState(false);
  const [expandedModule, setExpandedModule] = useState(null);

  // ------------------- DELETE COURSE -------------------
  const handleDelete = async () => {
    if (!window.confirm(`Delete "${course.title}"?`)) return;

    try {
      await axios.delete(`${BASE_URL}/courses/${course.id}`, { headers });
      deleteCourse(course.id);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting course");
    }
  };

  // ------------------- UPDATE COURSE -------------------
  const handleUpdate = async () => {
    try {
      const form = new FormData();
      form.append("title", course.title);
      form.append("description", course.description);
      form.append("category", course.category || "");
      form.append("difficulty", course.difficulty || "Beginner");
      form.append("duration", course.duration || "");

      const res = await axios.put(`${BASE_URL}/courses/${course.id}`, form, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      updateCourse(res.data);
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating course");
    }
  };

  // ------------------- FETCH LESSONS FOR MODULE -------------------
  const fetchModuleLessons = async (moduleId) => {
    try {
      const res = await axios.get(`${BASE_URL}/lessons/module/${moduleId}`, { headers });
      const updatedModules = course.modules.map((m) =>
        m.id === moduleId ? { ...m, lessons: res.data } : m
      );
      updateCourse({ ...course, modules: updatedModules });
    } catch (err) {
      console.error("Fetch lessons error:", err);
    }
  };

  // ------------------- DIFFICULTY COLOR -------------------
  const getDifficultyColor = (difficulty) => {
    if (difficulty === "Beginner") return "bg-green-100 text-green-700";
    if (difficulty === "Intermediate") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        {/* HEADER */}
        <div className="p-4 bg-white border-b">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{course.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">{course.description}</p>

          {/* TAGS */}
          <div className="flex gap-2 mt-3 flex-wrap justify-center">
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {course.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDifficultyColor(course.difficulty)}`}>
              {course.difficulty}
            </span>
            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">
              {course.duration}
            </span>
          </div>
        </div>

        {/* MODULES */}
        <div className="p-4 space-y-3">
          {course.modules?.length > 0 ? (
            <>
              <h4 className="text-sm font-semibold text-gray-800 text-center">
                Modules ({course.modules.length})
              </h4>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {course.modules.map((mod, modIndex) => (
                  <div key={mod.id ?? `mod-${modIndex}`} className="border border-gray-100 rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        setExpandedModule(expandedModule === mod.id ? null : mod.id);
                        if (mod.lessons?.length === 0) fetchModuleLessons(mod.id);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{mod.title}</p>
                        <p className="text-xs text-gray-500 truncate">{mod.description}</p>
                      </div>
                      {expandedModule === mod.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {expandedModule === mod.id && (
                      <div className="border-t bg-white px-3 py-2 text-sm space-y-2">
                        {mod.lessons?.length > 0 ? (
                          <>
                            <p className="font-medium text-gray-700 text-center">Lessons ({mod.lessons.length})</p>
                            <ul className="space-y-1 max-h-32 overflow-y-auto">
                              {mod.lessons.map((lesson, lessonIndex) => (
                                <li
                                  key={lesson.id ?? `lesson-${lessonIndex}`}
                                  className="text-gray-700 text-xs bg-blue-50 p-2 rounded flex items-center justify-between"
                                >
                                  <span>{lessonIndex + 1}. {lesson.title}</span>
                                  <span className="flex gap-1">
                                    {lesson.videoUrl && (
                                      <a href={lesson.videoUrl} target="_blank" rel="noreferrer" className="text-indigo-600">
                                        🎥
                                      </a>
                                    )}
                                    {lesson.pdfUrl && (
                                      <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" className="text-green-600">
                                        📄
                                      </a>
                                    )}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <p className="text-gray-500 text-xs text-center">No lessons yet</p>
                        )}

                        <button
                          className="w-full mt-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 font-semibold"
                          onClick={() => fetchModuleLessons(mod.id)}
                        >
                          📚 Refresh Lessons
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center">No modules added yet.</p>
          )}

          {/* ADD MODULE BUTTON */}
          {addingModule ? (
            <div className="bg-gray-50 p-3 border rounded-lg">
              <ModuleForm
                courseId={course.id}
                onCancel={() => setAddingModule(false)}
                onModuleSaved={(newModule) => {
                  updateCourse({
                    ...course,
                    modules: [...(course.modules || []), newModule],
                  });
                  setAddingModule(false);
                }}
              />
            </div>
          ) : (
            <button
              onClick={() => setAddingModule(true)}
              className="w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 flex items-center justify-center gap-2 font-semibold"
            >
              <Plus size={16} /> Add Module
            </button>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 px-4 py-3 bg-gray-50 border-t justify-center">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center justify-center gap-1 font-semibold"
          >
            <Edit2 size={16} /> Update
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 flex items-center justify-center gap-1 font-semibold"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
