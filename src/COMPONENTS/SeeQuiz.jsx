import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SeeQuiz() {
  const userEmail = localStorage.getItem("userEmail");
  const quizTitle = localStorage.getItem("quizTitle");
  let navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      navigate("/login"); // Redirect if no user email found
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token"); // Retrieve token

      if (!token) {
        alert("Unauthorized: No token found. Please log in again.");
        return;
      }

      try {
        const response = await axios.post("http://localhost:3000/seequiz-form", {
          email: userEmail,
          quizTitle: quizTitle, // Pass the quiz title
        }, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        });
        setQuizData(response.data);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
      }
    };

    fetchData();
  }, [navigate, userEmail]);

  const handleDeleteQuestion = async (questionId, sectionId) => {
    const token = localStorage.getItem("token"); // Retrieve token

    if (!token) {
      alert("Unauthorized: No token found. Please log in again.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/delete-question",
        { quizTitle, sectionId, questionId }, // Pass quizId and sectionId
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        }
      );

      // Update the quizData state to remove the deleted question
      setQuizData((prevData) =>
        prevData.map((quiz) => ({
          ...quiz,
          sections: quiz.sections.map((section) =>
            section._id === sectionId
              ? {
                  ...section,
                  questions: section.questions.filter((q) => q._id !== questionId),
                }
              : section
          ),
        }))
      );
    } catch (err) {
      console.error("Error deleting question:", err);
      alert("Failed to delete question.");
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#f4f7fc',
    },
    quizCard: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      marginBottom: '2rem',
    },
    quizHeader: {
      fontSize: '2rem',
      color: '#333',
      marginBottom: '1rem',
    },
    quizDetails: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '1rem',
    },
    sectionBox: {
      backgroundColor: '#fafafa',
      borderRadius: '8px',
      padding: '1.5rem',
      marginTop: '1.5rem',
      border: '1px solid #e0e0e0',
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#333',
    },
    questionList: {
      listStyleType: 'none',
      paddingLeft: '0',
      marginTop: '1rem',
    },
    questionItem: {
      padding: '1rem',
      borderBottom: '1px solid #eee',
      marginBottom: '1rem',
    },
    questionText: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#333',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: '#fff',
      border: 'none',
      padding: '0.8rem 1.2rem',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s',
    },
    deleteButtonHover: {
      backgroundColor: '#c0392b',
    },
    noQuestions: {
      color: '#999',
    },
    loading: {
      textAlign: 'center',
      fontSize: '1.5rem',
      color: '#666',
    },
  };

  return (
    <div style={styles.container}>
      {quizData && quizData.length > 0 ? (
        quizData.map((quiz, quizIndex) => (
          <div key={quizIndex} style={styles.quizCard}>
            <h2 style={styles.quizHeader}>Quiz Title: {quiz.quizTitle}</h2>
            <p style={styles.quizDetails}>Created At: {new Date(quiz.createdAt).toLocaleString()}</p>
            <p style={styles.quizDetails}>Email: {quiz.email}</p>

            {/* Sections */}
            {quiz.sections && quiz.sections.length > 0 ? (
              quiz.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} style={styles.sectionBox}>
                  <h3 style={styles.sectionTitle}>{section.title}</h3>
                  <h3 style={styles.sectionTitle}>Type: {section.type}</h3>
                  {/* Questions */}
                  <ul style={styles.questionList}>
                    {section.questions && section.questions.length > 0 ? (
                      section.questions.map((q, questionIndex) => (
                        <li key={questionIndex} style={styles.questionItem}>
                          <p style={styles.questionText}>
                            {questionIndex + 1}. {q.question}
                          </p>
                          <p>Answer: <span>{q.answer}</span></p>
                          <p>Positive Score: {q.positiveScore}</p>
                          <p>Negative Score: {q.negativeScore}</p>

                          {/* Display Options for True/False or Multiple Choice */}
                          {q.options && q.options.length > 0 && (
                            <div>
                              <strong>Options:</strong>
                              <ul>
                                {q.options.map((option, optionIndex) => (
                                  <li key={optionIndex}>{option}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Delete Button */}
                          <button
                            style={styles.deleteButton}
                            onClick={() => handleDeleteQuestion(q._id, section._id)}
                            onMouseEnter={(e) => e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor}
                            onMouseLeave={(e) => e.target.style.backgroundColor = styles.deleteButton.backgroundColor}
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <p style={styles.noQuestions}>No questions in this section.</p>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p style={styles.noQuestions}>No sections available.</p>
            )}
          </div>
        ))
      ) : (
        <p style={styles.loading}>Loading quiz data...</p>
      )}
    </div>
  );
}

export default SeeQuiz;
