import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from "../config"; // adjust path as needed
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const QuizDashboard = () => {
  const email = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token");
  const [quizTitle, setQuizTitle] = useState('');
  const navigate = useNavigate();

  const handleCreateQuiz = () => {
    if (quizTitle.trim()) {
      axios.post(
        `${BASE_URL}/api/quiz`,
        { userEmail: email, title: quizTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        if (response.data.uniqueTitle) {
          localStorage.setItem("quizTitle", response.data.uniqueTitle);
        }
        navigate("/format");
      })
      .catch(() => {
        alert("Error sending quiz title. Please try again.");
      });
    } else {
      alert('Please enter a quiz title');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#eef1f6] p-4">
      <div className="relative w-full max-w-md">
        {/* Purple Glow */}
        <div className="absolute -inset-1 bg-purple-500 blur-2xl opacity-50 rounded-2xl z-0" />

        {/* Main Card */}
        <Card className="relative z-10 p-8 bg-white rounded-2xl shadow-lg">
          <CardContent className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-purple-700">Create a New Quiz</h2>
              <p className="text-muted-foreground mt-1">
                Give your quiz a memorable name and start building questions!
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quizTitle">Quiz Title</Label>
              <Input
                id="quizTitle"
                placeholder="Enter quiz title"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleCreateQuiz}
            >
              Create Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizDashboard;
