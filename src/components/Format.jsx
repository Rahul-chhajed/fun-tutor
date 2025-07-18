import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function Format() {
  const navigate = useNavigate();
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");
  const quizTitle = localStorage.getItem("quizTitle");

  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  if (!email || !token || !quizTitle) {
    navigate("/login");
    return null; // Redirect to login if not authenticated
  }
  const handleChange = (e) => {
    setTime(e.target.value);
  };

  const handleDeploy = () => {
    if (!time) {
      setError("Please select a time before deploying the quiz.");
    } else {
      navigate("/deploy", { state: { quizTime: time } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-xl p-6 rounded-xl shadow-md bg-white border border-purple-200">
        <CardContent>
          <h2 className="text-3xl font-bold mb-4 text-center text-purple-700">
            Quiz Format
          </h2>

          <p className="mb-6 text-center text-gray-600">
            Quiz Title: <span className="font-medium">{quizTitle}</span>
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">
            <Button
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Add MCQ Section
            </Button>
            <Button
              onClick={() => navigate("/Tf")}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Add True/False Section
            </Button>
          </div>

          <div className="mb-6 text-center">
            <Button
              variant="outline"
              className="border-purple-500 text-purple-600 hover:bg-purple-100"
              onClick={() => navigate("/see-quiz")}
            >
              See Quiz
            </Button>
          </div>

          <div className="mb-4">
            <Label htmlFor="quiz-time" className="text-gray-700 mb-1 block">
              Select Time (HH:MM)
            </Label>
            <Input
              id="quiz-time"
              type="time"
              value={time}
              onChange={handleChange}
              className="bg-white border border-purple-300 focus:ring-purple-500"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-1 text-center">{error}</p>
          )}

          <div className="mt-6">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white"
              onClick={handleDeploy}
            >
              Deploy Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
