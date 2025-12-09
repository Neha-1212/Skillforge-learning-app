import { useState } from "react"
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import InstructorDashboard from "./pages/InstructorDashboard.jsx"
import Login from "./login.jsx"
import Register from "./registration.jsx"
import { BrowserRouter, Routes, Route, Link ,Navigate } from "react-router-dom";


function App() {
  

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(""); // e.g., "INSTRUCTOR" or "STUDENT"
  return (
   
     
         
        
     
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* ✅ Login में setRole भी भेजना जरूरी */}
        <Route 
          path="/login" 
          element={
            <Login 
              setIsAuthenticated={setIsAuthenticated} 
              setRole={setRole} 
            />
          } 
        />

        <Route path="/registration" element={<Register />} />

        ✅ PROTECTED INSTRUCTOR ROUTE
        <Route
          path="/instructor-dashboard"
          element={
            isAuthenticated && role === "INSTRUCTOR" ? (
              <InstructorDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
          {/* Instructor courses route */}
        <Route
          path="/instructor/courses"
          element={
            isAuthenticated && role === "INSTRUCTOR" ? (
              <InstructorDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        
      </Routes>
    </BrowserRouter>

  )
}

export default App;
