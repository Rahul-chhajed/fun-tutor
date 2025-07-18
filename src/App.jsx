import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import ProtectedRoute from "./components/ProtectedRoute";
import SeeQuiz from "./components/SeeQuiz";
import Format from "./components/Format";
import Tf from "./components/Tf";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Deployment from "./components/Deployment";
import QuizDashboard from "./components/QuizDashboard";
import JoinAndGiveQuiz from "./components/JoinAndGiveQuiz";
import QuizDetails from "./components/QuizDetails";
import ParticipantPerform from "./components/ParticipantPerform";
import OverallAnalysis from "./components/OverallAnalysis";
import Game from "./components/Game";
import './App.css';
function AppWrapper() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {

        const decoded = jwtDecode(token);
        
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          alert("Session expired. Please log in again.");
          localStorage.clear();
          navigate('/login');
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.clear();
        navigate('/login');
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/quiz" element={<ProtectedRoute><QuizDashboard /></ProtectedRoute>} />
      <Route path="/format" element={<ProtectedRoute><Format /></ProtectedRoute>} />
      <Route path="/JoinAndGiveQuiz" element={<ProtectedRoute><JoinAndGiveQuiz /></ProtectedRoute>} />
      <Route path="/tf" element={<ProtectedRoute><Tf /></ProtectedRoute>} />
      <Route path="/see-quiz" element={<ProtectedRoute><SeeQuiz /></ProtectedRoute>} />
      <Route path="/deploy" element={<ProtectedRoute><Deployment /></ProtectedRoute>} />
      <Route path="/quiz/:title" element={<ProtectedRoute><QuizDetails /></ProtectedRoute>} />
      <Route path="/quiz/:title/:email" element={<ProtectedRoute><ParticipantPerform /></ProtectedRoute>} />
      <Route path="/quiz/:title/analysis" element={<ProtectedRoute><OverallAnalysis/></ProtectedRoute>} />
      <Route path="/dashboard/game" element={<ProtectedRoute><Game/></ProtectedRoute>} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
