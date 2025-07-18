import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config"; // adjust path as needed
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
          axios.post(`${BASE_URL}/seequiz-form`, {
            email: userEmail,
            quizTitle: decodedTitle,
          }, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.post(`${BASE_URL}/get-participants`, {
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
    return <div className="text-center mt-20 text-lg text-gray-500">Loading quiz data...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Quiz Details */}
      <div className="md:col-span-2">
        <Card className="p-6">
          <h2 className="text-3xl font-semibold text-purple-800 mb-6">Quiz: {quizData[0].quizTitle}</h2>
          {quizData[0].sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-10">
              <h3 className="text-xl font-bold text-purple-700 mb-3 border-b pb-2">Section {sectionIndex + 1}: {section.title || "Untitled"}</h3>
              {section.questions.map((question, questionIndex) => (
                <Card key={question._id} className="mb-4 border-l-4 border-purple-500">
                  <CardContent className="py-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      Q{questionIndex + 1}: {question.question}
                    </p>
                    <ul className="list-none pl-0 mb-2">
                      {question.options.map((option, optIndex) => (
                        <li key={optIndex} className="bg-purple-50 border border-purple-200 rounded px-3 py-1 mb-1">
                          {option}
                        </li>
                      ))}
                    </ul>
                    <p className="text-green-600 font-medium mt-1">Correct Answer: {question.answer}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Positive Score: {question.positiveScore} | Negative Score: {question.negativeScore}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </Card>
      </div>

      {/* Participants Panel */}
      <div>
        <Card className="p-6 bg-purple-50">
          <h3 className="text-2xl font-semibold text-purple-700 mb-4 text-center">Participants</h3>

          {participants && participants.length > 0 && (
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white mb-4"
              onClick={() => navigate(`/quiz/${encodeURIComponent(decodedTitle)}/analysis?code=${quizCode}`)}
            >
              📊 Show Overall Analysis
            </Button>
          )}

          {participants && participants.length > 0 ? (
            participants.map((participantEmail, index) => (
              <Button
                key={index}
                className="w-full mb-2 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() =>
                  navigate(`/quiz/${encodeURIComponent(decodedTitle)}/${encodeURIComponent(participantEmail)}?code=${quizCode}`)
                }
              >
                {participantEmail}
              </Button>
            ))
          ) : (
            <p className="text-center text-red-500">No participants have joined yet.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default QuizDetails;
