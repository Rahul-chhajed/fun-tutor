import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Tfquestion({ title, positiveScore, negativeScore }) {
    let navigate = useNavigate();
    const [question, setQuestion] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [questionIndex, setQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleQuestionChange = (event) => {
        setQuestion(event.target.value);
    };

    const saveQuestion = () => {
        if (!question || !selectedOption) {
            alert("Please enter a question and select an answer.");
            return;
        }

        const newQuestions = [...questions];
        newQuestions[questionIndex] = { 
            question, 
            answer: selectedOption,
            options: ["True", "False"], // Include options
            positiveScore,
            negativeScore
        };
        setQuestions(newQuestions);
        alert("Question saved locally.");
    };

    const submitQuestions = async () => {
        const email = localStorage.getItem("userEmail");
        const token = localStorage.getItem("token");
        const quizTitle = localStorage.getItem("quizTitle");
        const type='TF';
        if (!token) {
            alert("Unauthorized: No token found. Please log in again.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:3000/submit-questions",
                {
                    email,
                    quizTitle,
                    title,
                    questions,
                    type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        
            alert(response.data.message);
            navigate("/format");
          
        } catch (error) {
            console.error("Error submitting questions:", error);
            alert("Failed to submit questions.");
        }
    };

    const nextQuestion = () => {
        saveQuestion();
        setQuestionIndex(questionIndex + 1);
        setQuestion(questions[questionIndex + 1]?.question || "");
        setSelectedOption(questions[questionIndex + 1]?.answer || "");
    };

    const prevQuestion = () => {
        if (questionIndex > 0) {
            setQuestionIndex(questionIndex - 1);
            setQuestion(questions[questionIndex - 1]?.question || "");
            setSelectedOption(questions[questionIndex - 1]?.answer || "");
        }
    };

    return (
        <div style={styles.tfBox}>
            <h3 style={styles.tfTitle}>Title: {title}</h3>

            <input
                type="text"
                placeholder="Enter question"
                value={question}
                onChange={handleQuestionChange}
                style={styles.tfInput}
            />

            <label style={styles.tfLabel}>Select answer:</label>
            <select 
                value={selectedOption} 
                onChange={handleChange} 
                style={styles.tfSelect}
            >
                <option value="">--Choose--</option>
                <option value="True">True</option>
                <option value="False">False</option>
            </select>

            <p style={styles.tfLabel}>Selected: <span>{selectedOption}</span></p>

            <div style={styles.scoreBox}>
                <p style={styles.tfLabel}>+{positiveScore} for correct</p>
                <p style={styles.tfLabel}>{negativeScore} for incorrect</p>
            </div>

            <div style={styles.addButtons}>
                <button 
                    onClick={prevQuestion} 
                    disabled={questionIndex === 0}
                    style={styles.smallBtn}
                >
                    Previous
                </button>

                <button 
                    onClick={saveQuestion} 
                    style={styles.smallBtn}
                >
                    Save
                </button>

                <button 
                    onClick={nextQuestion} 
                    style={styles.smallBtn}
                >
                    Next
                </button>

                <button 
                    onClick={submitQuestions} 
                    style={{ ...styles.smallBtn, ...styles.deployBtn }}
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

const styles = {
    tfBox: {
        backgroundColor: "#fff",
        borderRadius: "8px",
        padding: "30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        maxWidth: "600px",
        margin: "20px auto",
        fontFamily: "'Roboto', sans-serif",
    },
    tfTitle: {
        fontSize: "24px",
        color: "#333",
        marginBottom: "20px",
        fontWeight: "bold",
    },
    tfInput: {
        width: "100%",
        padding: "12px",
        margin: "10px 0",
        fontSize: "16px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        boxSizing: "border-box",
    },
    tfSelect: {
        width: "100%",
        padding: "12px",
        fontSize: "16px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        marginBottom: "10px",
        boxSizing: "border-box",
    },
    tfLabel: {
        fontSize: "16px",
        color: "#555",
        margin: "10px 0",
    },
    scoreBox: {
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        padding: "10px",
        marginBottom: "20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    addButtons: {
        display: "flex",
        justifyContent: "space-between",
        gap: "10px",
        marginTop: "20px",
    },
    smallBtn: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        padding: "10px 20px",
        fontSize: "16px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    deployBtn: {
        backgroundColor: "#007BFF",
    },
    smallBtnDisabled: {
        backgroundColor: "#bbb",
        cursor: "not-allowed",
    },
};

export default Tfquestion;
