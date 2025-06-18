import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizDashboard = () => {
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");
  const [quizTitle, setQuizTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    if (quizTitle.trim()) {
      axios.post(
        "http://localhost:3000/api/quiz",
        { userEmail: email, title: quizTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        if (response.data.uniqueTitle) {
          localStorage.setItem("quizTitle", response.data.uniqueTitle);
        }
      })
      .catch((error) => {
        alert("Error sending quiz title. Please try again.");
      });
      navigate("/format");
    } else {
      alert('Please enter a quiz title');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f4f7fc',
      padding: '0 2rem',
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      width: '100%',
      maxWidth: '500px',
      textAlign: 'center',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '0.5rem',
      color: '#333',
    },
    subtitle: {
      fontSize: '1rem',
      marginBottom: '1.5rem',
      color: '#777',
    },
    input: {
      width: '100%',
      padding: '1rem',
      marginBottom: '1.5rem',
      borderRadius: '8px',
      border: '1px solid #ccc',
      fontSize: '1rem',
      outline: 'none',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '1rem',
      backgroundColor: '#4caf50',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1.2rem',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#45a049',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create a New Quiz</h2>
        <p style={styles.subtitle}>
          Give your quiz a memorable name and start building questions!
        </p>
        <input
          type="text"
          style={styles.input}
          placeholder="Enter quiz title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />
        <button
          style={styles.button}
          onClick={handleCreateQuiz}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizDashboard;
