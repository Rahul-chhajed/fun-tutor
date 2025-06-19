import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Format = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");
  const quizTitle = localStorage.getItem("quizTitle");
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

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontFamily: "'Roboto', sans-serif",
      color: "#333",
    },
    heading: {
      fontSize: "24px",
      fontWeight: "600",
      color: "#333",
      marginBottom: "20px",
      textAlign: "center",
    },
    paragraph: {
      fontSize: "18px",
      marginBottom: "20px",
      color: "#555",
    },
    button: {
      backgroundColor: "#007BFF",
      color: "#fff",
      border: "none",
      padding: "12px 18px",
      margin: "10px 0",
      borderRadius: "5px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    smallBtn: {
      padding: "10px 15px",
      fontSize: "14px",
    },
    inputGroup: {
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
    label: {
      fontSize: "16px",
      color: "#555",
      marginBottom: "8px",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      width: "200px",
      marginBottom: "20px",
    },
    error: {
      color: "#d9534f",
      fontSize: "14px",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Quiz Format</h2>
      <p style={styles.paragraph}>Quiz Title: {quizTitle}</p>

      <div>
        <button
          style={styles.button}
          onClick={() => navigate("/")}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Add MCQ SECTION
        </button>
        <button
          style={styles.button}
          onClick={() => navigate("/Tf")}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Add TRUE/FALSE SECTION
        </button>
      </div>

      <div style={styles.inputGroup}>
        <button
          style={{ ...styles.button, ...styles.smallBtn }}
          onClick={() => navigate("/see-quiz")}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          See Quiz
        </button>
        <label htmlFor="quiz-time" style={styles.label}>
          Select Time (HH:MM)
        </label>
        <input
          type="time"
          id="quiz-time"
          value={time}
          onChange={handleChange}
          style={styles.input}
          required
        />
      </div>

      {error && <p style={styles.error}>{error}</p>}

      <button
        style={styles.button}
        onClick={handleDeploy}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Deploy Quiz
      </button>
    </div>
  );
};

export default Format;
