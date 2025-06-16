import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles.css'; // Importing the CSS file

const QuizDashboard = () => {
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  const [quizTitle, setQuizTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    console.log(quizTitle);

    if (quizTitle.trim()) {
      axios
      .post("https://fun-tutor-backend-production.up.railway.app/api/quiz",
        { userEmail: email, title: quizTitle },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        })
      .then((response) =>{ 
        if (response.data.uniqueTitle) {
          localStorage.setItem("quizTitle", response.data.uniqueTitle); // Save the quiz title
        }
     
  })
      .catch((error) => {
        console.error("Error sending quiz title:", error.response?.data || error);
        alert("Error sending quiz title. Please try again.");
      });
      navigate("/format");
    } else {
      alert('Please enter a quiz title');
    }
  };

  return (
    <div className="container">
      <h2 className="quiz-header">Quiz Dashboard</h2>
      
      <input
        type="text"
        className="time-input"
        placeholder="Enter quiz title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
      />
      
      <button className="btn" onClick={handleCreateQuiz}>Create Quiz</button>
    </div>
  );
};

export default QuizDashboard;

