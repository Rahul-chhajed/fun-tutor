import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config"; // adjust path as needed
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
        const res = await axios.post(
         `${BASE_URL}/get-participant-scores`,
          {
            quizTitle: decodedTitle,
            quizCode,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data;
        setParticipants(data);

        if (data.length > 0) {
          const scores = data.map((p) => p.totalScore);
          const average = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2);
          const highest = Math.max(...scores);
          const lowest = Math.min(...scores);
          setSummary({ average, highest, lowest });

          const breakdown = {};
          const questionMap = {};
          const questionTextMapTemp = {};

          data.forEach((participant) => {
            participant.section.forEach((sec) => {
              const sectionId = sec.sectionid;
              if (!breakdown[sectionId]) breakdown[sectionId] = { total: 0, count: 0 };

              const sectionScore = sec.answers.reduce((s, q) => s + q.score, 0);
              breakdown[sectionId].total += sectionScore;
              breakdown[sectionId].count += 1;

              sec.answers.forEach((answer) => {
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
    datasets: [
      {
        label: "Scores",
        data: [summary.average, summary.highest, summary.lowest],
        backgroundColor: ["#a29bfe", "#6c5ce7", "#ffeaa7"],
      },
    ],
  };

  const barDataSection = {
    labels: Object.keys(sectionBreakdown),
    datasets: [
      {
        label: "Avg Score per Section",
        data: Object.values(sectionBreakdown),
        backgroundColor: "#81ecec",
      },
    ],
  };

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto text-gray-800" ref={pdfRef}>
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-10">
        Overall Quiz Analysis: {decodedTitle}
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        <Card className="w-[300px] bg-white">
          <CardContent className="p-4">
            <Pie data={pieDataSummary} />
          </CardContent>
        </Card>

        <Card className="w-[400px] bg-white">
          <CardContent className="p-4">
            <Bar data={barDataSection} />
          </CardContent>
        </Card>
      </div>

      <div className="text-center mt-6 text-lg space-y-2 text-purple-600 font-medium">
        <p>
          <strong>Average Score:</strong> {summary.average}
        </p>
        <p>
          <strong>Highest Score:</strong> {summary.highest}
        </p>
        <p>
          <strong>Lowest Score:</strong> {summary.lowest}
        </p>
      </div>

      <h3 className="text-center mt-14 mb-6 text-2xl font-semibold text-purple-600">
        Per Question Option Distribution
      </h3>

      <div className="flex flex-wrap justify-center gap-6">
        {Object.entries(questionOptionMap).map(([qid, options], idx) => (
          <Card key={qid} className="w-[300px] bg-white">
            <CardContent className="p-4">
              <h4 className="text-center text-base font-semibold mb-2 text-gray-700">
                Q{idx + 1}: {questionTextMap[qid]}
              </h4>
              <Pie
                data={{
                  labels: Object.keys(options),
                  datasets: [
                    {
                      data: Object.values(options),
                      backgroundColor: ["#fd79a8", "#a29bfe", "#00cec9", "#ffeaa7"],
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button
          onClick={downloadPDF}
          className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-md text-lg"
        >
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default OverallAnalysis;
