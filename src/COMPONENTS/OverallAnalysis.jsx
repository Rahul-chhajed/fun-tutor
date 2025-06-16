import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const OverallAnalysis = () => {
    const { title } = useParams();
    const decodedTitle = decodeURIComponent(title);
    const location = useLocation();
    const quizCode = new URLSearchParams(location.search).get("code");
    const [participants, setParticipants] = useState([]);
    const [summary, setSummary] = useState({ average: 0, highest: 0, lowest: 0 });
    const [sectionBreakdown, setSectionBreakdown] = useState({});
    const [questionOptionMap, setQuestionOptionMap] = useState({});
    const [questionTextMap, setQuestionTextMap] = useState({});
    const pdfRef = useRef();

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.post("https://fun-tutor-backend-production.up.railway.app/get-participant-scores", {
                    quizTitle: decodedTitle,
                    quizCode,
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = res.data;
                setParticipants(data);

                if (data.length > 0) {
                    const scores = data.map(p => p.totalScore);
                    const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
                    const highest = Math.max(...scores);
                    const lowest = Math.min(...scores);
                    setSummary({ average, highest, lowest });

                    // Section breakdown
                    const breakdown = {};
                    const questionMap = {};
                    const questionTextMapTemp = {};

                    data.forEach(participant => {
                        participant.section.forEach(sec => {
                            const sectionId = sec.sectionid;
                            if (!breakdown[sectionId]) breakdown[sectionId] = { total: 0, count: 0 };

                            const sectionScore = sec.answers.reduce((s, q) => s + q.score, 0);
                            breakdown[sectionId].total += sectionScore;
                            breakdown[sectionId].count += 1;

                            // Process question options
                            sec.answers.forEach(answer => {
                                const qid = answer.question_id;
                                const selected = answer.selectedOption;
                                questionTextMapTemp[qid] = answer.questionText;

                                if (!questionMap[qid]) questionMap[qid] = {};
                                questionMap[qid][selected] = (questionMap[qid][selected] || 0) + 1;
                            });
                        });
                    });

                    const formattedBreakdown = {};
                    Object.entries(breakdown).forEach(([id, val]) => {
                        formattedBreakdown[id] = (val.total / val.count).toFixed(2);
                    });

                    setSectionBreakdown(formattedBreakdown);
                    setQuestionOptionMap(questionMap);
                    setQuestionTextMap(questionTextMapTemp);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchParticipants();
    }, [quizCode]);

    const downloadPDF = async () => {
        const canvas = await html2canvas(pdfRef.current);
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Quiz_Analysis_${decodedTitle}.pdf`);
    };

    const pieDataSummary = {
        labels: ["Average", "Highest", "Lowest"],
        datasets: [{
            label: "Scores",
            data: [summary.average, summary.highest, summary.lowest],
            backgroundColor: ["#74b9ff", "#00cec9", "#ff7675"],
        }],
    };

    const barDataSection = {
        labels: Object.keys(sectionBreakdown),
        datasets: [{
            label: "Avg Score per Section",
            data: Object.values(sectionBreakdown),
            backgroundColor: "#55efc4",
        }],
    };

    return (
        <div style={{ padding: "40px" }} ref={pdfRef}>
            <h2 style={{ textAlign: "center", color: "#2d3436", fontSize: "2rem", marginBottom: "30px" }}>
                Overall Quiz Analysis: {decodedTitle}
            </h2>

            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "40px" }}>
                <div style={{ width: "300px" }}>
                    <Pie data={pieDataSummary} />
                </div>

                <div style={{ width: "400px" }}>
                    <Bar data={barDataSection} />
                </div>
            </div>

            <div style={{ textAlign: "center", fontSize: "1.2rem", color: "#0984e3", marginTop: "20px" }}>
                <p><strong>Average Score:</strong> {summary.average}</p>
                <p><strong>Highest Score:</strong> {summary.highest}</p>
                <p><strong>Lowest Score:</strong> {summary.lowest}</p>
            </div>

            <h3 style={{ textAlign: "center", marginTop: "40px", fontSize: "1.5rem", color: "#6c5ce7" }}>
                Per Question Option Distribution
            </h3>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px", marginTop: "20px" }}>
                {Object.entries(questionOptionMap).map(([qid, options], idx) => (
                    <div key={qid} style={{ width: "300px" }}>
                        <h4 style={{ textAlign: "center", fontSize: "1rem", marginBottom: "10px" }}>
                            Q{idx + 1}: {questionTextMap[qid]}
                        </h4>
                        <Pie
                            data={{
                                labels: Object.keys(options),
                                datasets: [{
                                    data: Object.values(options),
                                    backgroundColor: ["#fd79a8", "#a29bfe", "#00b894", "#ffeaa7"],
                                }],
                            }}
                        />
                    </div>
                ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "40px" }}>
                <button
                    onClick={downloadPDF}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "#6c5ce7",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "1rem",
                    }}
                >
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default OverallAnalysis;
