import React, { useState } from "react";
import axios from "axios";
import Tfquestion from "./Tfquestion";
import "./styles.css"; // Import your existing CSS file

function Tf() {
    const [sectionTitle, setSectionTitle] = useState("");
    const [submittedTitle, setSubmittedTitle] = useState("");
    const [positiveScore, setPositiveScore] = useState("");
    const [negativeScore, setNegativeScore] = useState("");

    const checkTitle = async () => {
        try {
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            const quizTitle = localStorage.getItem("quizTitle"); // Retrieve quiz title from localStorage
            if (!token) {
                alert("Unauthorized: No token found. Please log in again.");
                return false;
            }

            const response = await axios.post(
                "https://fun-tutor-backend-production.up.railway.app/check-title",
                {
                    title: sectionTitle,
                    quizTitle: quizTitle
                }, // Use sectionTitle as title
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token in headers
                    },
                }
            );

            if (response.data.exists) {
                alert("Error: Title already exists. Choose a different title.");
                return false; // Title exists, return false
            }
            return true; // Title is available
        } catch (error) {
            console.error("Error checking title:", error);
            alert("Failed to check title.");
            return false; // In case of error, prevent submission
        }
    };

    const handleSubmit = async () => {
        if (!sectionTitle.trim() || !positiveScore || !negativeScore) {
            alert("Please enter section title, positive score, and negative score.");
            return;
        }

        const isTitleValid = await checkTitle();
        if (!isTitleValid) {
            setSectionTitle(""); // Clear fields if title already exists
            setPositiveScore("");
            setNegativeScore("");
            return;
        }

        setSubmittedTitle(sectionTitle); // Only set title if valid
    };

    return (
        <div className="container">
            {!submittedTitle && (
                <div className="tf-box">
                    <h1 className="tf-title">True/False Section</h1>

                    <div className="horizontal-group">
                        <input
                            type="text"
                            placeholder="Enter section title"
                            value={sectionTitle}
                            onChange={(e) => setSectionTitle(e.target.value)}
                            className="tf-input"
                        />
                    </div>

                    <div className="horizontal-group">
                        <input
                            type="number"
                            placeholder="Positive score"
                            value={positiveScore}
                            onChange={(e) => setPositiveScore(e.target.value)}
                            className="tf-input small-input"
                        />
                        <input
                            type="number"
                            placeholder="Negative score"
                            value={negativeScore}
                            onChange={(e) => setNegativeScore(e.target.value)}
                            className="tf-input small-input"
                        />
                    </div>

                    <button onClick={handleSubmit} className="btn">
                        Submit
                    </button>
                </div>
            )}
            {submittedTitle && (
                <Tfquestion
                    title={submittedTitle}
                    positiveScore={positiveScore}
                    negativeScore={negativeScore}
                />
            )}
        </div>
    );
}

export default Tf;
