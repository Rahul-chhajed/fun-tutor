import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../config"; // adjust path as needed
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Deployment() {
  const location = useLocation();
  const quizTime = location.state?.quizTime || "Not Set";
  const quizTitle = localStorage.getItem("quizTitle") || "Not Set";
  const email = localStorage.getItem("userEmail");
  const [roomCode, setRoomCode] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const navigate = useNavigate();

  const routeChange = (path) => {
    navigate(path);
  };

  useEffect(() => {
    axios
      .post(
        `${BASE_URL}/generate-code`,
        {
          quizTitle,
          quizTime,
          email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setRoomCode(response.data.code);
      })
      .catch((error) => {
        console.error("Error generating room code:", error);
      });
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isQuizStarted) {
        endQuiz(false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      if (isQuizStarted) {
        endQuiz(false);
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isQuizStarted]);

  const StartQuiz = () => {
    axios
      .post(
        `${BASE_URL}/start-quiz`,
        {
          quizTitle,
          roomCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        toast.success("🎉 Quiz has been started!");
        setIsQuizStarted(true);
      })
      .catch((error) => {
        console.error("Error starting quiz:", error);
        toast.error("⚠️ Failed to start quiz. Try again.");
      });
  };

  const endQuiz = (showToast = true) => {
    axios
      .post(
        `${BASE_URL}/end-quiz`,
        {
          quizTitle,
          roomCode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then(() => {
        if (showToast) toast.success("🎉 Quiz has been ended!");
        setIsQuizStarted(false);
        setTimeout(() => routeChange("/dashboard"), 2000);
      })
      .catch((error) => {
        console.error("Error ending quiz:", error);
        if (showToast) toast.error("⚠️ Failed to end quiz. Try again.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-white px-4 py-10">
      <Card className="w-full max-w-md shadow-xl border-purple-200">
        <CardContent className="p-6 space-y-5">
          <h2 className="text-3xl font-bold text-center text-purple-700">
            Welcome to the Quiz Room
          </h2>

          <div className="text-gray-700 space-y-2 text-center">
            <p>
              <span className="font-medium">Quiz Title:</span>{" "}
              <span className="text-purple-700 font-semibold">{quizTitle}</span>
            </p>
            <p>
              <span className="font-medium">Quiz Time:</span>{" "}
              <span className="text-purple-700 font-semibold">{quizTime}</span>
            </p>
            <h3 className="text-lg font-semibold text-purple-600 mt-4">
              Room Code
            </h3>
            <p className="text-xl font-bold text-purple-800">{roomCode}</p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <Button
              onClick={StartQuiz}
              className={`bg-purple-600 hover:bg-purple-700 text-white ${
                isQuizStarted ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isQuizStarted}
            >
              {isQuizStarted ? "Quiz Started" : "Start Quiz"}
            </Button>

            <Button
              onClick={() => endQuiz()}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              End Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default Deployment;
