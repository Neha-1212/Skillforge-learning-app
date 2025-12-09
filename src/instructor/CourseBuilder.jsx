import React, { useEffect, useState } from "react";
import API from "../services/api";
import ModuleForm from "./ModuleForm";
import LessonForm from "./LessonForm";

export default function CourseBuilder({ courseId, onCourseSaved }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingModuleForCourse, setAddingModuleForCourse] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null); // to add lesson
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!courseId) return;
    loadCourse();
    // eslint-disable-next-line
  }, [courseId, refreshKey]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/courses/${courseId}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Failed to load course", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSaved = (savedModule) => {
    setCourse((prev) => ({ ...prev, modules: [...(prev.modules || []), savedModule] }));
    // keep moduleForm open if desired, or reset flags:
    setAddingModuleForCourse(false);
  };

  const handleLessonAdded = (lesson, moduleId) => {
    setCourse((prev) => ({
      ...prev,
      modules: prev.modules.map((m) => (m.id === moduleId ? { ...m, lessons: [...(m.lessons || []), lesson] } : m)),
    }));
    setSelectedModuleId(null);
  };

  const deleteModule = async (moduleId) => {
    try {
      await API.delete(`/modules/${moduleId}`);
      setCourse((prev) => ({ ...prev, modules: prev.modules.filter((m) => m.id !== moduleId) }));
    } catch (err) {
      console.error("Failed to delete module", err);
    }
  };

  if (loading || !course) {
    return <div className="p-6 bg-white rounded shadow">Loading course...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">{course.title}</h2>
        <p className="text-sm text-gray-600">{course.description}</p>
      </div>

      <div className="mb-4">
        <button onClick={() => setAddingModuleForCourse((s) => !s)} className="px-3 py-2 bg-indigo-600 text-white rounded">
          {addingModuleForCourse ? "Close Module Form" : "+ Add Module"}
        </button>
      </div>

      {addingModuleForCourse && (
        <div className="mb-4">
          <ModuleForm
            courseId={courseId}
            onCancel={() => setAddingModuleForCourse(false)}
            onModuleSaved={(m) => {
              handleModuleSaved(m);
              // keep open to add more modules if needed
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        {course.modules?.map((mod) => (
          <div key={mod.id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{mod.title}</h4>
                <p className="text-xs text-gray-500">{mod.description}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSelectedModuleId(mod.id)} className="px-2 py-1 bg-green-600 text-white rounded text-xs">
                  + Add Lesson
                </button>
                <button onClick={() => deleteModule(mod.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs">
                  Delete Module
                </button>
              </div>
            </div>

            <div className="mt-3">
              <h5 className="text-xs text-gray-600 font-medium">Lessons</h5>
              {mod.lessons?.length ? (
                <ul className="mt-2 space-y-1">
                  {mod.lessons.map((lesson, i) => (
                    <li key={lesson.id || i} className="text-sm text-gray-700">
                      {i + 1}. {lesson.title} {lesson.videoUrl ? "(video)" : lesson.pdfUrl ? "(pdf)" : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-gray-500 mt-2">No lessons yet</div>
              )}
            </div>

            {selectedModuleId === mod.id && (
              <div className="mt-3">
                <LessonForm
                  moduleId={mod.id}
                  onLessonAdded={(lesson) => handleLessonAdded(lesson, mod.id)}
                  onCancel={() => setSelectedModuleId(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button onClick={() => { setRefreshKey((k) => k + 1); }} className="px-3 py-2 bg-gray-100 rounded">Refresh</button>
      </div>
    </div>
  );
}