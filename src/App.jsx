import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
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
import JoinAndGiveQuiz from "./COMPONENTS/JoinAndGiveQuiz";
import QuizDetails from "./COMPONENTS/QuizDetails";
import ParticipantPerform from "./COMPONENTS/ParticipantPerform";
import OverallAnalysis from "./COMPONENTS/OverallAnalysis";
import Game from "./COMPONENTS/Game";
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
