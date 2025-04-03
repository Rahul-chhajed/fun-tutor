import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const Format = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const quizTitle= localStorage.getItem("quizTitle"); // Retrieve quiz title from localStorage
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
   


  const handleChange = (event) => {
    setTime(event.target.value);
  };

  const handleDeploy = () => {
    if (!time) {
      setError("Please select a time before deploying the quiz.");
    } else {
      navigate("/deploy", { state: { quizTime: time } });
    }
  };

  return (
    <>
     
      
        <div className="container">
          <h2>Quiz Format</h2>
          <p>Quiz Title: {quizTitle}</p>

          <div className="add-buttons">
            <button onClick={() => navigate("/")} className="btn">
              Add MCQ SECTION
            </button>
            <button onClick={() => navigate("/Tf")} className="btn">
              Add TRUE/FALSE question SECTION
            </button>
          </div>

          <div className="horizontal-group">
            <button onClick={() => navigate("/see-quiz")} className="btn small-btn">
              See Quiz
            </button>
            <br></br>
            <label htmlFor="quiz-time">Select Time (HH:MM): </label>
            <input
              type="time"
              id="quiz-time"
              value={time}
              onChange={handleChange}
              className="time-input"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button onClick={handleDeploy} className="btn deploy-btn">
            Deploy Quiz
          </button>
        </div>
      
    </>
  );
};

export default Format;

