import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BASE_URL } from "../config"; // adjust path as needed

export default function Dashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  const routeChange = (path) => navigate(path);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/quiz/my-quizzes`,
        { email: localStorage.getItem("userEmail") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuizzes(res.data.quizzes || []);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizTitle) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/quiz/delete/${encodeURIComponent(quizTitle)}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchQuizzes(); // Refresh after delete
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const parseQuizTitle = (quizTitle) => {
    const name = quizTitle.slice(0, -13).replace(/[-_]/g, " ");
    const timestamp = quizTitle.slice(-13);
    const date = new Date(Number(timestamp));
    const formattedTime = date.toLocaleString();
    return { name, formattedTime };
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-purple-900 text-white shadow-lg">
        <div className="text-3xl font-bold text-center py-6">🎲 FunTutor</div>
        <nav className="flex flex-col px-4 gap-2">
          <Button variant="ghost" className="justify-start" onClick={() => routeChange("/dashboard/game")}>
            🎮 Play Games
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => routeChange("/quiz")}>
            📝 Make Quizzes
          </Button>
          <Button variant="ghost" className="justify-start" onClick={() => routeChange("/JoinAndGiveQuiz")}>
            🚀 Join Quiz
          </Button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col p-6">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-purple-800">Dashboard</h1>
          <Avatar>
            <AvatarFallback className="bg-purple-600 text-white">FT</AvatarFallback>
          </Avatar>
        </div>

        {/* Quiz Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Created Quizzes</h2>
          {quizzes.length > 0 ? (
            <ScrollArea className="h-[70vh] pr-3">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {quizzes.map((quiz) => {
                  const { name, formattedTime } = parseQuizTitle(quiz.quizTitle);
                  return (
                    <Card
                      key={quiz._id}
                      onClick={() => routeChange(`/quiz/${encodeURIComponent(quiz.quizTitle)}`)}
                      className="cursor-pointer hover:scale-[1.01] transition-transform bg-white shadow-md border border-purple-200"
                    >
                      <CardContent className="p-4 flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-lg text-purple-900">{name.trim()}</div>
                          <div className="text-sm text-gray-500">{formattedTime}</div>
                        </div>
                        <FaTrashAlt
                          className="text-red-500 hover:text-red-700 text-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(quiz.quizTitle);
                          }}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-gray-600">No quizzes found.</p>
          )}
        </div>
      </main>
    </div>
  );
}
