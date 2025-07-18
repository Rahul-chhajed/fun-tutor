import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from "../config"; // adjust path as needed
import { toast, ToastContainer } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import 'react-toastify/dist/ReactToastify.css';

function JoinAndGiveQuiz() {
  const [roomCode, setRoomCode] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [finalScore, setFinalScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  const email = localStorage.getItem('userEmail');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!timeLeft || finalScore !== null) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          toast.info("⏰ Time’s up! Submitting quiz...");
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finalScore]);

  const handleJoin = async () => {
    if (!roomCode.trim()) return toast.warning('Please enter a room code.');
    setLoading(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/api/quiz/validate-code`,
        { quizCode: roomCode, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.isValid && res.data.isActive) {
        toast.success('Quiz joined successfully!');
        const quizDataFromServer = res.data.quizData;
        let totalSeconds = 0;
        if (typeof quizDataFromServer.quizTime === 'string') {
          const [hoursStr, minutesStr] = quizDataFromServer.quizTime.split(':');
          totalSeconds = parseInt(hoursStr) * 3600 + parseInt(minutesStr) * 60;
        } else {
          totalSeconds = (quizDataFromServer.quizTime.hours || 0) * 3600 +
                         (quizDataFromServer.quizTime.minutes || 0) * 60;
        }
        quizDataFromServer.totalQuizSeconds = totalSeconds;
        setQuizData(quizDataFromServer);
        setTimeLeft(totalSeconds);
      } else {
        toast.error(res.data.message || 'Unable to join quiz.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (questionId, selectedOption, sectionId, questionText, correctAnswer, posScore, negScore) => {
    const score = selectedOption === correctAnswer ? posScore : negScore;
    setAnswers((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [questionId]: { question_id: questionId, question: questionText, selectedOption, correctAnswer, score },
      },
    }));
  };

  const handleNext = () => {
    const totalSections = quizData.sections.length;
    const totalQuestions = quizData.sections[currentSectionIndex].questions.length;
    if (currentQuestionIndex + 1 < totalQuestions) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSectionIndex + 1 < totalSections) {
      setCurrentSectionIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentSectionIndex > 0) {
      const prevSectionIndex = currentSectionIndex - 1;
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentQuestionIndex(quizData.sections[prevSectionIndex].questions.length - 1);
    }
  };

  const handleSubmit = async () => {
    if (finalScore !== null) return;
    const formattedAnswers = quizData.sections.map((section) => ({
      sectionid: section._id,
      answers: Object.values(answers[section._id] || {}),
    }));
    const totalScore = formattedAnswers.reduce((sum, sec) =>
      sum + sec.answers.reduce((s, q) => s + q.score, 0), 0);

    const payload = {
      quizCode: roomCode,
      participantEmail: email,
      section: formattedAnswers,
      totalScore,
    };

    try {
      setSubmitting(true);
      await axios.post(`${BASE_URL}/api/quiz/submit-response`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Quiz submitted successfully!');
      setFinalScore(totalScore);
    } catch (error) {
      toast.error('Submission failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!quizData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <ToastContainer position="bottom-right" />
        <Card className="w-full max-w-md shadow-lg border border-purple-500">
          <CardContent className="space-y-4">
            <h2 className="text-xl font-bold text-purple-700">Join a Quiz</h2>
            <Input
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="border-purple-500 focus:ring-purple-700"
            />
            <Button onClick={handleJoin} disabled={loading} className="w-full bg-purple-700 hover:bg-purple-800 text-white">
              {loading ? 'Checking...' : 'Join Quiz'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (finalScore !== null) {
    return (
      <div className="p-6 bg-background text-foreground">
        <ToastContainer position="bottom-right" />
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-4">Quiz Submitted!</h2>
        <p className="text-center text-lg mb-6">Your Score: <span className="font-semibold">{finalScore}</span></p>
        {quizData.sections.map((section) => (
          <div key={section._id} className="mb-6">
            <h3 className="text-lg font-semibold text-purple-600 mb-2">{section.title}</h3>
            {section.questions.map((q, idx) => {
              const ans = answers[section._id]?.[q._id];
              const isCorrect = ans?.selectedOption === q.answer;
              return (
                <div key={q._id} className={`p-4 rounded-md ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                  <p className="font-medium">Q{idx + 1}: {q.question}</p>
                  <p>Your Answer: <strong>{ans?.selectedOption || 'Not answered'}</strong></p>
                  <p>Correct Answer: <strong>{q.answer}</strong></p>
                </div>
              );
            })}
          </div>
        ))}
        <div className="flex justify-center">
          <Button onClick={() => window.location.href = '/dashboard'} className="bg-purple-700 hover:bg-purple-800 text-white">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const currentSection = quizData.sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const currentAnswer = answers[currentSection._id]?.[currentQuestion._id];

  return (
    <div className="p-6 bg-background text-foreground max-w-4xl mx-auto">
      <ToastContainer position="bottom-right" />
      <h2 className="text-2xl font-bold text-purple-700">{quizData.quizTitle}</h2>
      <div className="text-md bg-purple-100 px-4 py-2 rounded-md my-4 w-fit">
        ⏳ Time Left: {Math.floor(timeLeft / 3600)}:
        {Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')}:
        {(timeLeft % 60).toString().padStart(2, '0')}
      </div>

      <div className="flex space-x-2 mb-4">
        {quizData.sections.map((section, idx) => (
          <Button key={idx} variant={currentSectionIndex === idx ? 'default' : 'outline'}
            onClick={() => { setCurrentSectionIndex(idx); setCurrentQuestionIndex(0); }}
            className="text-sm">{section.title}</Button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-10 gap-2">
        {currentSection.questions.map((q, idx) => {
          const answered = answers[currentSection._id]?.[q._id];
          return (
            <Button key={q._id} variant={answered ? "default" : "outline"} size="sm"
              onClick={() => setCurrentQuestionIndex(idx)}>
              {idx + 1}
            </Button>
          );
        })}
      </div>

      <Card className="mb-4 border border-purple-300">
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">{currentQuestion.question}</p>
          {currentQuestion.options.map((option, idx) => (
            <label key={idx} className="block">
              <input
                type="radio"
                name={currentQuestion._id}
                value={option}
                checked={currentAnswer?.selectedOption === option}
                onChange={() =>
                  handleOptionChange(
                    currentQuestion._id,
                    option,
                    currentSection._id,
                    currentQuestion.question,
                    currentQuestion.answer,
                    currentQuestion.positiveScore,
                    currentQuestion.negativeScore
                  )
                }
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious}
          disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}>
          Previous
        </Button>

        {currentSectionIndex === quizData.sections.length - 1 &&
        currentQuestionIndex === currentSection.questions.length - 1 ? (
          <Button onClick={handleSubmit} disabled={submitting || finalScore !== null}
            className="bg-purple-700 hover:bg-purple-800 text-white">
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button onClick={handleNext} className="bg-purple-700 hover:bg-purple-800 text-white">
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

export default JoinAndGiveQuiz;
