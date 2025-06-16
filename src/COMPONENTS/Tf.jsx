import React, { useState } from "react";
import axios from "axios";
import Tfquestion from "./Tfquestion";

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
        <div style={styles.container}>
            {!submittedTitle && (
                <div style={styles.tfBox}>
                    <h1 style={styles.tfTitle}>True/False Section</h1>

                    <div style={styles.horizontalGroup}>
                        <input
                            type="text"
                            placeholder="Enter section title"
                            value={sectionTitle}
                            onChange={(e) => setSectionTitle(e.target.value)}
                            style={styles.tfInput}
                        />
                    </div>

                    <div style={styles.horizontalGroup}>
                        <input
                            type="number"
                            placeholder="Positive score"
                            value={positiveScore}
                            onChange={(e) => setPositiveScore(e.target.value)}
                            style={{ ...styles.tfInput, ...styles.smallInput }}
                        />
                        <input
                            type="number"
                            placeholder="Negative score"
                            value={negativeScore}
                            onChange={(e) => setNegativeScore(e.target.value)}
                            style={{ ...styles.tfInput, ...styles.smallInput }}
                        />
                    </div>

                    <button onClick={handleSubmit} style={styles.btn}>
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

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "'Roboto', sans-serif",
    },
    tfBox: {
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "30px",
        width: "100%",
        maxWidth: "500px",
        textAlign: "center",
        marginBottom: "20px",
    },
    tfTitle: {
        fontSize: "24px",
        color: "#333333",
        marginBottom: "20px",
        fontWeight: "bold",
    },
    horizontalGroup: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "20px",
    },
    tfInput: {
        width: "100%",
        padding: "10px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        margin: "10px 0",
        boxSizing: "border-box",
    },
    smallInput: {
        width: "48%",
    },
    btn: {
        backgroundColor: "#4CAF50",
        color: "#fff",
        padding: "12px 24px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
};

export default Tf;
