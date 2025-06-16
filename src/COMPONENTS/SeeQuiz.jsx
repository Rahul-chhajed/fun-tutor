import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css"; // Updated CSS file with new class names

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
        const response = await axios.post("https://fun-tutor-backend-production.up.railway.app/seequiz-form", {
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
        "https://fun-tutor-backend-production.up.railway.app/delete-question",
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

  return (
    <div className="quiz-container">
      {quizData && quizData.length > 0 ? (
        quizData.map((quiz, quizIndex) => (
          <div key={quizIndex} className="quiz-card-box">
            {/* Quiz Title */}
            <h2 className="quiz-header">Quiz Title: {quiz.quizTitle}</h2>
            <p className="quiz-details">Created At: {new Date(quiz.createdAt).toLocaleString()}</p>
            <p className="quiz-details">Email: {quiz.email}</p>

            {/* Sections */}
            {quiz.sections && quiz.sections.length > 0 ? (
              quiz.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="quiz-section-box">
                  {/* Section Title */}
                  <h3 className="quiz-section-title">{section.title}</h3>

                  {/* Questions */}
                  <ul className="quiz-question-list">
                    {section.questions && section.questions.length > 0 ? (
                      section.questions.map((q, questionIndex) => (
                        <li key={questionIndex} className="quiz-question-item">
                          <strong>{questionIndex + 1}. {q.question}</strong>
                          <p>Answer: <span className="quiz-answer">{q.answer}</span></p>
                          <p className="quiz-positive-score">Positive Score: {q.positiveScore}</p>
                          <p className="quiz-negative-score">Negative Score: {q.negativeScore}</p>

                          {/* Display Options for True/False or Multiple Choice */}
                          {q.options && q.options.length > 0 && (
                            <div className="quiz-options">
                              <p><strong>Options:</strong></p>
                              <ul>
                                {q.options.map((option, optionIndex) => (
                                  <li key={optionIndex} className="quiz-option-item">{option}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Delete Button */}
                          <button
                            className="delete-button"
                            onClick={() => handleDeleteQuestion(q._id, section._id)}
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <p className="quiz-no-questions">No questions in this section.</p>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p className="quiz-no-sections">No sections available.</p>
            )}
          </div>
        ))
      ) : (
        <p className="quiz-loading">Loading quiz data...</p>
      )}
    </div>
  );
}

export default SeeQuiz;
