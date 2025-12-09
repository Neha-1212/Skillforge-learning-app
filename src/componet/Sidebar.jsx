import { BookOpen, PlusCircle, Layers, FilePlus2, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ setActiveTab, collapsed, setCollapsed }) {
  return (
    <div
      className={`
        h-full bg-gradient-to-b from-indigo-700 via-indigo-800 to-indigo-900
        text-white p-4 border-r border-indigo-500/30
        transition-all duration-300
      `}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-6 bg-indigo-700 p-1 rounded-full shadow-lg"
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>

      {/* Title */}
      {!collapsed && (
        <h2 className="text-2xl font-bold tracking-wide mb-10">
          Instructor Panel
        </h2>
      )}

      {/* Menu */}
      <nav className="flex flex-col gap-4">
        <button
          onClick={() => setActiveTab("mycourses")}
          className="flex items-center gap-3 p-3 rounded-xl bg-indigo-600/40 hover:bg-indigo-500/80 transition-all"
        >
          <BookOpen size={20} />
          {!collapsed && <span>My Courses</span>}
        </button>

        <button
          onClick={() => setActiveTab("courseform")}
          className="flex items-center gap-3 p-3 rounded-xl bg-indigo-600/40 hover:bg-indigo-500/80 transition-all"
        >
          <PlusCircle size={20} />
          {!collapsed && <span>Add Course</span>}
        </button>

        <button
          onClick={() => setActiveTab("moduleform")}
          className="flex items-center gap-3 p-3 rounded-xl bg-indigo-600/40 hover:bg-indigo-500/80 transition-all"
        >
          <Layers size={20} />
          {!collapsed && <span>Add Module</span>}
        </button>

        <button
          onClick={() => setActiveTab("lessonform")}
          className="flex items-center gap-3 p-3 rounded-xl bg-indigo-600/40 hover:bg-indigo-500/80 transition-all"
        >
          <FilePlus2 size={20} />
          {!collapsed && <span>Add Lesson</span>}
        </button>
      </nav>
    </div>
  );
}
