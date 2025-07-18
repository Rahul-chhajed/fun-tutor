import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config"; // adjust path as needed
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function SeeQuiz() {
  const userEmail = localStorage.getItem("userEmail");
  const quizTitle = localStorage.getItem("quizTitle");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      if (!token) {
        alert("Unauthorized: No token found. Please log in again.");
        return;
      }

      try {
        const response = await axios.post(
          `${BASE_URL}/seequiz-form`,
          { email: userEmail, quizTitle },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setQuizData(response.data);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, userEmail, quizTitle, token]);

  const handleDeleteQuestion = async (questionId, sectionId) => {
    if (!token) {
      alert("Unauthorized: No token found. Please log in again.");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/delete-question`,
        { quizTitle, sectionId, questionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

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

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/2 bg-purple-200" />
        <Skeleton className="h-6 w-1/3 bg-purple-100" />
        <Skeleton className="h-96 w-full bg-purple-100" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-8">
      {quizData && quizData.length > 0 ? (
        quizData.map((quiz, quizIndex) => (
          <Card key={quizIndex} className="shadow-md border border-purple-300 bg-white">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-purple-700">
                Quiz Title: {quiz.quizTitle}
              </h2>
              <p className="text-sm text-gray-600">
                Created At: {new Date(quiz.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Email: {quiz.email}</p>

              {quiz.sections && quiz.sections.length > 0 ? (
                quiz.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mt-6 border-t pt-4 space-y-4">
                    <h3 className="text-xl font-semibold text-purple-600">
                      Section: {section.title}
                    </h3>
                    <p className="text-md text-gray-700">Type: {section.type}</p>

                    {section.questions && section.questions.length > 0 ? (
                      section.questions.map((q, questionIndex) => (
                        <div
                          key={questionIndex}
                          className="border border-purple-100 bg-purple-50 p-4 rounded-lg space-y-2"
                        >
                          <p className="font-medium text-gray-800">
                            {questionIndex + 1}. {q.question}
                          </p>
                          <p className="text-sm">
                            <strong>Answer:</strong> {q.answer}
                          </p>
                          <p className="text-sm">
                            <strong>Positive Score:</strong> {q.positiveScore}
                          </p>
                          <p className="text-sm">
                            <strong>Negative Score:</strong> {q.negativeScore}
                          </p>

                          {q.options && q.options.length > 0 && (
                            <div>
                              <p className="text-sm font-semibold">Options:</p>
                              <ul className="list-disc pl-5 text-sm">
                                {q.options.map((opt, i) => (
                                  <li key={i}>{opt}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <Button
                            variant="destructive"
                            className="mt-2"
                            onClick={() =>
                              handleDeleteQuestion(q._id, section._id)
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No questions in this section.</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No sections available.</p>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-center text-lg text-gray-600">No quiz data found.</p>
      )}
    </div>
  );
}

export default SeeQuiz;
