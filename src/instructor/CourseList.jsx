import React from "react";

export default function CourseList({ courses = [], loading, onRefresh, onEdit, onDelete }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm text-gray-600">{loading ? "Loading..." : `${courses.length} courses`}</div>
        <div>
          <button onClick={onRefresh} className="px-3 py-1 bg-gray-100 rounded">Refresh</button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-6 rounded shadow">Loading...</div>
      ) : courses.length === 0 ? (
        <div className="bg-white p-6 rounded shadow">You have no courses yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{c.title}</h4>
                  <p className="text-xs text-gray-500">{c.category || ""}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => onEdit(c.id)} className="text-sm px-2 py-1 bg-indigo-600 text-white rounded">Edit</button>
                  <button onClick={() => onDelete(c.id)} className="text-sm px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-700 line-clamp-3">{c.description}</p>
              <div className="mt-3 text-xs text-gray-500">Modules: {c.modules?.length || 0}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}