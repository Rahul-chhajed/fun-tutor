import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../config"; // adjust path as needed
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
        const res = await axios.post(
          `${BASE_URL}/get-participant-score`,
          {
            quizCode,
            participantEmail: email,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPerformance(res.data);
      } catch (err) {
        console.error("Error fetching performance:", err);
      }
    };

    if (quizCode && email) fetchPerformance();
  }, [quizCode, email]);

  if (!performance) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-8 w-1/2 rounded-md" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
        Performance Summary
      </h2>

      <Card className="mb-6 bg-purple-50 border border-purple-200">
        <CardContent className="p-6 text-gray-800">
          <p>
            <strong>Quiz Title:</strong> {decodedTitle}
          </p>
          <p>
            <strong>Participant:</strong> {performance.participantEmail}
          </p>
          <p>
            <strong>Quiz Code:</strong> {performance.quizCode}
          </p>
          <p>
            <strong>Total Score:</strong> {performance.totalScore}
          </p>
          <p>
            <strong>Submitted At:</strong>{" "}
            {new Date(performance.createdAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {performance.section.map((sec, idx) => (
        <Card
          key={sec.sectionid}
          className="mb-6 border-l-4 border-purple-600 shadow-md bg-white"
        >
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-purple-700 mb-4">
              Section {idx + 1}
            </h3>
            {sec.answers.map((ans, i) => (
              <div key={i} className="mb-4 border-b pb-2">
                <p className="font-medium text-gray-700">
                  Q{i + 1}: {ans.questionText}
                </p>
                <p>
                  <strong>Selected:</strong>{" "}
                  <span
                    className={
                      ans.selectedOption === ans.correctAnswer
                        ? "text-green-600 font-semibold"
                        : "text-red-500 font-semibold"
                    }
                  >
                    {ans.selectedOption}
                  </span>
                </p>
                <p>
                  <strong>Correct Answer:</strong> {ans.correctAnswer}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Score:</strong> {ans.score}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ParticipantPerform;
