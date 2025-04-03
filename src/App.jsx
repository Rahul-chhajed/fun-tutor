import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./COMPONENTS/ProtectedRoute";
import SeeQuiz from "./COMPONENTS/SeeQuiz";
import Format from "./COMPONENTS/Format";
import Tf from "./COMPONENTS/Tf";
import Home from "./COMPONENTS/Home";
import Login from "./COMPONENTS/Login";
import Signup from "./COMPONENTS/Signup";
import Dashboard from "./COMPONENTS/Dashboard";
import Deployment from "./COMPONENTS/Deployment";
import QuizDashboard from "./COMPONENTS/QuizDashboard";
import JoinQuize from "./COMPONENTS/JoinQuize";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
             <QuizDashboard />
            </ProtectedRoute>
          }
        />
         <Route
          path="/format"
          element={
            <ProtectedRoute>
              <Format />
            </ProtectedRoute>
          }
        />
        <Route
          path="/joinQuize"
          element={
            <ProtectedRoute>
              <JoinQuize />
            </ProtectedRoute>
          }
        <Route
          path="/tf"
          element={
            <ProtectedRoute>
              <Tf />
            </ProtectedRoute>
          }
        />
        <Route path="/see-quiz" element={
          <ProtectedRoute>
            <SeeQuiz />
          </ProtectedRoute>
        } />   
        <Route path="/deploy" element={
          <ProtectedRoute>
            <Deployment />
          </ProtectedRoute>
        } />   
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
