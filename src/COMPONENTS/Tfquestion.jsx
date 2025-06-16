import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './styles.css'; // Import your existing CSS file

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

        if (!token) {
            alert("Unauthorized: No token found. Please log in again.");
            return;
        }
        try {
            const response = await axios.post(
                "https://fun-tutor-backend-production.up.railway.app/submit-questions",
                {
                    email,
                    quizTitle,
                    title,
                    questions,
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
        <div className="tf-box">
            <h3 className="tf-title">Title: {title}</h3>

            <input
                type="text"
                placeholder="Enter question"
                value={question}
                onChange={handleQuestionChange}
                className="tf-input"
            />

            <label className="tf-label">Select answer:</label>
            <select 
                value={selectedOption} 
                onChange={handleChange} 
                className="tf-select"
            >
                <option value="">--Choose--</option>
                <option value="True">True</option>
                <option value="False">False</option>
            </select>

            <p className="tf-label">Selected: <span>{selectedOption}</span></p>

            <div className="score-box">
                <p className="tf-label">+{positiveScore} for correct</p>
                <p className="tf-label">{negativeScore} for incorrect</p>
            </div>

            <div className="add-buttons">
                <button 
                    onClick={prevQuestion} 
                    disabled={questionIndex === 0}
                    className="btn small-btn"
                >
                    Previous
                </button>

                <button 
                    onClick={saveQuestion} 
                    className="btn small-btn"
                >
                    Save
                </button>

                <button 
                    onClick={nextQuestion} 
                    className="btn small-btn"
                >
                    Next
                </button>

                <button 
                    onClick={submitQuestions} 
                    className="btn small-btn deploy-btn"
                >
                    Submit
                </button>
            </div>
        </div>
    );
}

export default Tfquestion;
