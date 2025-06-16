import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const QuizDetails = () => {
  const { title } = useParams();
  const decodedTitle = decodeURIComponent(title);
  const userEmail = localStorage.getItem("userEmail");
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [quizCode, setQuizCode] = useState(null);
  const [participants, setParticipants] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: No token found. Please log in again.");
        return;
      }

      try {
        const [quizres, participantres] = await Promise.all([
          axios.post("https://fun-tutor-backend-production.up.railway.app/seequiz-form", {
            email: userEmail,
            quizTitle: decodedTitle,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.post("http://localhost:3000/get-participants", {
            email: userEmail,
            quizTitle: decodedTitle,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setQuizData(quizres.data);
        setQuizCode(participantres.data?.code || null);
        setParticipants(participantres.data?.participants || null);


      } catch (err) {
        console.error("Error fetching quiz data:", err);
      }
    };

    fetchData();
  }, [navigate, userEmail, decodedTitle]);

  if (!quizData) {
    return <div style={{ textAlign: "center", marginTop: "50px", fontSize: "1.2rem", color: "#576574" }}>Loading quiz data...</div>;
  }

  const styles = {
    layout: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      gap: "30px",
      margin: "40px auto",
      maxWidth: "1200px",
      padding: "20px",
    },
    leftPanel: {
      flex: "1 1 60%",
      backgroundColor: "#fdfefe",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    },
    rightPanel: {
      flex: "1 1 35%",
      backgroundColor: "#f0f3f5",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      fontSize: "2rem",
      color: "#3b3b98",
      marginBottom: "30px",
    },
    section: {
      marginBottom: "40px",
    },
    sectionTitle: {
      fontSize: "1.5rem",
      color: "#3c6382",
      marginBottom: "20px",
      borderBottom: "2px solid #82ccdd",
      paddingBottom: "8px",
    },
    questionCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      marginBottom: "20px",
      borderLeft: "5px solid #60a3bc",
      borderRadius: "10px",
      transition: "0.3s ease",
    },
    questionText: {
      fontSize: "1.1rem",
      fontWeight: "bold",
      color: "#2d3436",
    },
    optionsList: {
      listStyleType: "none",
      paddingLeft: 0,
      margin: "10px 0",
    },
    optionItem: {
      padding: "6px 10px",
      margin: "4px 0",
      backgroundColor: "#dff9fb",
      border: "1px solid #c7ecee",
      borderRadius: "6px",
    },
    answer: {
      marginTop: "10px",
      fontWeight: "500",
      color: "#10ac84",
    },
    score: {
      fontSize: "0.95rem",
      color: "#576574",
    },
    participantTitle: {
      fontSize: "1.5rem",
      color: "#3c6382",
      textAlign: "center",
      marginBottom: "20px",
    },
    participantButton: {
      display: "block",
      width: "100%",
      backgroundColor: "#3b3b98",
      color: "#fff",
      padding: "10px 14px",
      marginBottom: "10px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "1rem",
      textAlign: "center",
      transition: "background-color 0.2s",
    },
    noParticipants: {
      textAlign: "center",
      color: "#ff4757",
      fontSize: "1rem",
    }
  };

  return (
    <div style={styles.layout}>
      {/* Quiz Details Panel */}
      <div style={styles.leftPanel}>
        <h2 style={styles.title}>Quiz: {quizData[0].quizTitle}</h2>
        {quizData[0].sections.map((section, sectionIndex) => (
          <div key={sectionIndex} style={styles.section}>
            <h3 style={styles.sectionTitle}>
              Section {sectionIndex + 1}: {section.title || "Untitled"}
            </h3>
            {section.questions.map((question, questionIndex) => (
              <div key={question._id} style={styles.questionCard}>
                <p style={styles.questionText}>
                  <strong>Q{questionIndex + 1}:</strong> {question.question}
                </p>
                <ul style={styles.optionsList}>
                  {question.options.map((option, optIndex) => (
                    <li key={optIndex} style={styles.optionItem}>{option}</li>
                  ))}
                </ul>
                <p style={styles.answer}><strong>Correct Answer:</strong> {question.answer}</p>
                <p style={styles.score}>
                  <strong>Positive Score:</strong> {question.positiveScore} |{" "}
                  <strong>Negative Score:</strong> {question.negativeScore}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Participants Panel */}
      <div style={styles.rightPanel}>
        <h3 style={styles.participantTitle}>Participants</h3>

        {participants && participants.length > 0 ? (
          <button
            style={{ ...styles.participantButton, backgroundColor: "#20bf6b" }}
            onClick={() => navigate(
              `/quiz/${encodeURIComponent(decodedTitle)}/analysis?code=${quizCode}`
            )}
          >
            📊 Show Overall Analysis
          </button>
        ) : null}

        {participants && participants.length > 0 ? (
          participants.map((participantEmail, index) => (
            <button key={index} style={styles.participantButton}
              onClick={() => navigate(
                `/quiz/${encodeURIComponent(decodedTitle)}/${encodeURIComponent(participantEmail)}?code=${quizCode}`
              )}
            >
              {participantEmail}
            </button>
          ))

        ) : (
          <p style={styles.noParticipants}>No participants have joined yet.</p>
        )}
      </div>
    </div>
  );
};

export default QuizDetails;

