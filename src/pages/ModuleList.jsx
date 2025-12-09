import React, { useState, useMemo } from "react";
import ModuleForm from "./ModuleForm";
import LessonForm from "./LessonForm";

export default function ModuleList({ courseId, token, module, onModuleUpdated }) {
  const [open, setOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);

  const totalDuration = useMemo(() => {
    return module.lessons?.reduce((sum, l) => sum + (parseInt(l.duration) || 0), 0) || 0;
  }, [module.lessons]);

  const totalLessons = module.lessons?.length || 0;

  return (
    <div className="max-w-xl mx-auto mb-3 border rounded-lg shadow-sm bg-white overflow-hidden">

      {/* Module Header */}
      <div
        className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-1">
          <h3 className="text-md font-semibold text-gray-800">{module.title}</h3>
          <p className="text-xs text-gray-500 truncate">{module.description}</p>
          <p className="text-xs text-indigo-700 font-semibold mt-0.5">
            {totalLessons} Lessons • {totalDuration} min
          </p>
        </div>
        <span className="text-gray-400 text-lg ml-2">{open ? "▲" : "▼"}</span>
      </div>

      {/* Lessons List */}
      {open && (
        <div className="px-4 pb-3 pt-2 bg-gray-50 space-y-2">
          {totalLessons > 0 ? (
            <ul className="space-y-1">
              {module.lessons.map((lesson, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-xs bg-white px-3 py-2 rounded border"
                >
                  <span className="font-medium">
                    {index + 1}. {lesson.title}
                  </span>
                  <span className="text-gray-500">{lesson.duration}m</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-xs py-1">No lessons added</p>
          )}
        </div>
      )}

      {/* Add Lesson Button */}
      <div className="px-4 pb-2 pt-1 bg-white border-t flex justify-end">
        <button
          onClick={() => setShowLessonModal(true)}
          className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
        >
          + Add Lesson
        </button>
      </div>

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowLessonModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
            {/* Lesson Form */}
            <LessonForm
              moduleId={module.id}
              token={token}
              onLessonAdded={(newLesson) => {
                onModuleUpdated({
                  ...module,
                  lessons: [...(module.lessons || []), newLesson],
                });
                setShowLessonModal(false);
              }}
              onCancel={() => setShowLessonModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Module Form */}
      {editingModule && (
        <ModuleForm
          courseId={courseId}
          token={token}
          existingModule={module}
          onModuleSaved={(updatedModule) => {
            onModuleUpdated(updatedModule);
            setEditingModule(false);
          }}
          onCancel={() => setEditingModule(false)}
        />
      )}
    </div>
  );
}
