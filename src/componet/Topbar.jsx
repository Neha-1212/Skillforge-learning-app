import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, BookOpen, LayoutDashboard, LogOut, User } from "lucide-react";
import CourseForm from "../pages/CourseForm";

export default function Topbar() {
  const [showCreate, setShowCreate] = useState(false);
  const [user, setUser] = useState({ name: "Instructor", email: "instructor@email.com" });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (token) {
      try {
        // Standard JWT decoding
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({
          name: payload.name || "Instructor",
          email: payload.sub || payload.email || "instructor@email.com",
        });
      } catch (e) {
        console.error("JWT Decode Error:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    navigate("/login");
  };

  const handleCourseAdded = () => {
    setShowCreate(false);
  };

  return (
    <>
      {/* PROFESSIONAL TOPBAR */}
      <div className="w-full bg-white shadow-xl px-8 py-3 flex justify-between items-center border-b border-gray-100 sticky top-0 z-20">
        
        {/* Left - Branding & Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-base">
              SF
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-wider hidden sm:block">
              SkillForge
            </h1>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/instructor-dashboard"
              className="text-purple-700 hover:text-purple-800 border-b-2 border-purple-600 pb-1 flex items-center gap-1 transition"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              to="/instructor-dashboard"
              className="text-gray-600 hover:text-purple-700 transition flex items-center gap-1"
            >
              <BookOpen size={18} /> My Courses
            </Link>
          </nav>
        </div>

        {/* Right - Actions & Profile */}
        <div className="flex items-center gap-4">
          
          {/* Create Course Button */}
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg transition-all transform hover:scale-105"
          >
            <PlusCircle size={16} className="mr-1.5" /> 
            {showCreate ? "Close Form" : "Create Course"}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-30">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>

                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition"
                >
                  <User size={16} /> Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition border-t"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Form Section */}
      {showCreate && (
        <div className="w-full bg-gray-50 border-b p-6 mt-0">
          <CourseForm 
            onCourseAdded={handleCourseAdded}
            onCancel={() => setShowCreate(false)}
          />
        </div>
      )}
    </>
  );
}