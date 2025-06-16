import axios from "axios";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";

function Deployment() {
  const location = useLocation();
  const quizTime = location.state?.quizTime || "Not Set";
  const quizTitle = localStorage.getItem("quizTitle") || "Not Set";
  const email = localStorage.getItem("userEmail");
  const [roomCode, setRoomCode] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const navigate = useNavigate();

  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios.post("https://fun-tutor-backend-production.up.railway.app/generate-code", {
      quizTitle,
      quizTime,
      email,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    .then((response) => {
      setRoomCode(response.data.code);
    })
    .catch((error) => {
      console.error("Error generating room code:", error);
    });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isQuizStarted) {
        endQuiz(false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      if (isQuizStarted) {
        endQuiz(false);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isQuizStarted]);

  const StartQuiz = () => {
    axios.post("http://localhost:3000/start-quiz", {
      quizTitle,
      roomCode,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    .then(() => {
      toast.success("🎉 Quiz has been started!");
      setIsQuizStarted(true);
    })
    .catch((error) => {
      console.error("Error starting quiz:", error);
      toast.error("⚠️ Failed to start quiz. Try again.");
    });
  };

  const endQuiz = (showToast = true) => {
    axios.post("http://localhost:3000/end-quiz", {
      quizTitle,
      roomCode,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
    .then(() => {
      if (showToast) toast.success("🎉 Quiz has been ended!");
      setIsQuizStarted(false);
      setTimeout(() => routeChange("/dashboard"), 2000);
    })
    .catch((error) => {
      console.error("Error ending quiz:", error);
      if (showToast) toast.error("⚠️ Failed to end quiz. Try again.");
    });
  };

  const styles = {
    container: {
      backgroundColor: "#e9f2ff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Roboto', sans-serif",
      padding: "40px",
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      width: "90%",
      maxWidth: "500px",
    },
    heading: {
      fontSize: "2rem",
      color: "#003366",
      marginBottom: "20px",
    },
    label: {
      fontSize: "1.1rem",
      color: "#333",
      margin: "8px 0",
    },
    highlight: {
      color: "#007bff",
      fontWeight: "600",
    },
    subheading: {
      fontSize: "1.4rem",
      color: "#004080",
      margin: "20px 0 10px",
    },
    button: {
      margin: "10px",
      padding: "12px 24px",
      fontSize: "1rem",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background-color 0.3s ease-in-out",
    },
    buttonDisabled: {
      backgroundColor: "#a0c4ff",
      cursor: "not-allowed",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Welcome to the Quiz Room</h2>

        <p style={styles.label}>
          Quiz Title: <span style={styles.highlight}>{quizTitle}</span>
        </p>

        <p style={styles.label}>
          Quiz Time: <span style={styles.highlight}>{quizTime}</span>
        </p>

        <h3 style={styles.subheading}>Room Code</h3>
        <p style={styles.label}>
          Your Room Code: <span style={styles.highlight}>{roomCode}</span>
        </p>

        <div>
          <button
            style={{
              ...styles.button,
              ...(isQuizStarted ? styles.buttonDisabled : {}),
            }}
            onClick={StartQuiz}
            disabled={isQuizStarted}
          >
            {isQuizStarted ? "Quiz Started" : "Start Quiz"}
          </button>

          <button
            style={styles.button}
            onClick={() => endQuiz()}
          >
            End Quiz
          </button>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default Deployment;
