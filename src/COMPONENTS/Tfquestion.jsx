import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config"; // adjust path as needed
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Tfquestion({ title, positiveScore, negativeScore }) {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);

  const handleChange = (value) => {
    setSelectedOption(value);
  };

  const saveQuestion = () => {
    if (!question || !selectedOption) {
      alert("Please enter a question and select an answer.");
      return;
    }

    const newQuestions = [...questions];
    newQuestions[questionIndex] = {
      question,
      answer: selectedOption,
      options: ["True", "False"],
      positiveScore,
      negativeScore,
    };
    setQuestions(newQuestions);
    alert("Question saved locally.");
  };

  const submitQuestions = async () => {
    const email = localStorage.getItem("userEmail");
    const token = localStorage.getItem("token");
    const quizTitle = localStorage.getItem("quizTitle");
    const type = "TF";

    if (!token) {
      alert("Unauthorized: No token found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/submit-questions`,
        {
          email,
          quizTitle,
          title,
          questions,
          type,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
      navigate("/format");
    } catch (error) {
      console.error("Error submitting questions:", error);
      alert("Failed to submit questions.");
    }
  };

  const nextQuestion = () => {
    saveQuestion();
    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
    setQuestion(questions[nextIndex]?.question || "");
    setSelectedOption(questions[nextIndex]?.answer || "");
  };

  const prevQuestion = () => {
    if (questionIndex > 0) {
      const prevIndex = questionIndex - 1;
      setQuestionIndex(prevIndex);
      setQuestion(questions[prevIndex]?.question || "");
      setSelectedOption(questions[prevIndex]?.answer || "");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-4 py-10">
      <Card className="w-full max-w-2xl border border-purple-200 shadow-lg rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-semibold text-purple-800 text-center">
            True / False Questions for: {title}
          </h2>

          <div>
            <Label htmlFor="question" className="text-purple-700">
              Question #{questionIndex + 1}
            </Label>
            <Input
              id="question"
              placeholder="Enter your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-purple-700">Select Correct Answer</Label>
            <Select value={selectedOption} onValueChange={handleChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="True">True</SelectItem>
                <SelectItem value="False">False</SelectItem>
              </SelectContent>
            </Select>
            {selectedOption && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: <span className="font-medium">{selectedOption}</span>
              </p>
            )}
          </div>

          <div className="flex justify-between bg-purple-50 p-3 rounded-lg">
            <p className="text-green-700 text-sm font-medium">+{positiveScore} for correct</p>
            <p className="text-red-600 text-sm font-medium">{negativeScore} for incorrect</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <Button variant="outline" onClick={prevQuestion} disabled={questionIndex === 0}>
              Previous
            </Button>
            <Button variant="secondary" onClick={saveQuestion}>
              Save
            </Button>
            <Button onClick={nextQuestion}>Next</Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={submitQuestions}>
              Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
