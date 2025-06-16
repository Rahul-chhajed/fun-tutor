import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ParticipantPerform = () => {
  const { title, email } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const location = useLocation();
  const quizCode = new URLSearchParams(location.search).get("code");
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post("http://localhost:3000/get-participant-score", {
          quizCode,
          participantEmail: email
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPerformance(res.data);
      } catch (err) {
        console.error("Error fetching performance:", err);
      }
    };

    if (quizCode && email) fetchPerformance();
  }, [quizCode, email]);

  if (!performance) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading performance...</div>;
  }

  const styles = {
    container: {
      maxWidth: "1000px",
      margin: "40px auto",
      padding: "20px",
      backgroundColor: "#f7f9fa",
      borderRadius: "10px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      color: "#2f3542",
      marginBottom: "20px",
    },
    summary: {
      backgroundColor: "#dff9fb",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "25px",
      fontSize: "1.1rem",
    },
    sectionCard: {
      marginBottom: "25px",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      borderLeft: "5px solid #70a1ff",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
    },
    question: {
      marginBottom: "10px",
    },
    correct: {
      color: "#2ed573",
    },
    incorrect: {
      color: "#ff6b81",
    },
    score: {
      marginTop: "10px",
      fontSize: "0.95rem",
      color: "#576574",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Performance Summary</h2>
      
      <div style={styles.summary}>
        <p><strong>Quiz Title:</strong> {decodedTitle}</p>
        <p><strong>Participant:</strong> {performance.participantEmail}</p>
        <p><strong>Quiz Code:</strong> {performance.quizCode}</p>
        <p><strong>Total Score:</strong> {performance.totalScore}</p>
        <p><strong>Submitted At:</strong> {new Date(performance.createdAt).toLocaleString()}</p>
      </div>

      {performance.section.map((sec, idx) => (
        <div key={sec.sectionid} style={styles.sectionCard}>
          <h3>Section {idx + 1}</h3>
          {sec.answers.map((ans, i) => (
            <div key={ans._id} style={styles.question}>
              <p><strong>Q{i + 1}:</strong> {ans.questionText}</p>
              <p>
                <strong>Selected:</strong> <span style={ans.selectedOption === ans.correctAnswer ? styles.correct : styles.incorrect}>
                  {ans.selectedOption}
                </span>
              </p>
              <p><strong>Correct Answer:</strong> {ans.correctAnswer}</p>
              <p style={styles.score}><strong>Score:</strong> {ans.score}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ParticipantPerform;

