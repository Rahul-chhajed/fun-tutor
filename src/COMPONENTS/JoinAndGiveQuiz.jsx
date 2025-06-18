import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import classNames from 'classnames';
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
    if (!roomCode.trim()) {
      toast.warning('Please enter a room code.');
      return;
    }
  
    setLoading(true);
  
    try {
      const res = await axios.post(
        'http://localhost:3000/api/quiz/validate-code',
        { quizCode: roomCode, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (res.data.isValid && res.data.isActive) {
        toast.success('Quiz joined successfully!');
  
        const quizDataFromServer = res.data.quizData;
        let totalSeconds = 0;
  
        if (typeof quizDataFromServer.quizTime === 'string') {
          const [hoursStr, minutesStr] = quizDataFromServer.quizTime.split(':');
          const hours = parseInt(hoursStr, 10);
          const minutes = parseInt(minutesStr, 10);
          totalSeconds = (hours * 3600) + (minutes * 60);
        } else if (typeof quizDataFromServer.quizTime === 'object') {
          totalSeconds =
            (quizDataFromServer.quizTime.hours || 0) * 3600 +
            (quizDataFromServer.quizTime.minutes || 0) * 60;
        }
  
        quizDataFromServer.totalQuizSeconds = totalSeconds;
  
        setQuizData(quizDataFromServer);
        setTimeLeft(totalSeconds); // ✅ Start the countdown here
      } else {
        toast.error(res.data.message || 'Unable to join quiz.');
      }
    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong. Try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleOptionChange = (
    questionId,
    selectedOption,
    sectionId,
    questionText,
    correctAnswer,
    posScore,
    negScore
  ) => {
    const score = selectedOption === correctAnswer ? posScore : negScore;

    setAnswers((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [questionId]: {
          question_id: questionId,
          question: questionText,
          selectedOption,
          correctAnswer,
          score,
          questionText,
        },
      },
    }));
  };

  const handleNext = () => {
    const totalSections = quizData.sections.length;
    const currentSection = quizData.sections[currentSectionIndex];
    const totalQuestions = currentSection.questions.length;

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
      const prevSection = quizData.sections[prevSectionIndex];
      setCurrentSectionIndex(prevSectionIndex);
      setCurrentQuestionIndex(prevSection.questions.length - 1);
    }
  };

  const handleSubmit = async () => {
    if (finalScore !== null) return; // Prevent duplicate submissions
    const formattedAnswers = quizData.sections.map((section) => ({
      sectionid: section._id,
      answers: Object.values(answers[section._id] || {}),
    }));

    const totalScore = formattedAnswers.reduce((sum, sec) => {
      return sum + sec.answers.reduce((s, q) => s + q.score, 0);
    }, 0);

    const payload = {
      quizCode: roomCode,
      participantEmail: email,
      section: formattedAnswers,
      totalScore,
    };

    try {
      setSubmitting(true);
      await axios.post('http://localhost:3000/api/quiz/submit-response', payload, {
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
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <ToastContainer position="bottom-right" />
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2 style={{ color: '#2e3a59', fontSize: '24px' }}>Join a Quiz</h2>
          <input
            style={{
              padding: '10px',
              margin: '10px 0',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '16px',
              width: '250px',
            }}
            type="text"
            placeholder="Enter Room Code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '10px',
            }}
            onClick={handleJoin}
            disabled={loading}
          >
            {loading ? 'Checking...' : 'Join Quiz'}
          </button>
        </div>
      </div>
    );
  }

  if (finalScore !== null) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <ToastContainer position="bottom-right" />
        <h2 style={{ color: '#2e3a59', fontSize: '24px' }}>Quiz Submitted!</h2>
        <p style={{ fontSize: '20px' }}>
          Your Score: <strong>{finalScore}</strong>
        </p>
        {quizData.sections.map((section, sIdx) => (
          <div key={section._id} style={{ margin: '20px 0' }}>
            <h3 style={{ color: '#333', fontSize: '20px' }}>{section.title}</h3>
            {section.questions.map((q, qIdx) => {
              const ans = answers[section._id]?.[q._id];
              const isCorrect = ans?.selectedOption === q.answer;

              return (
                <div key={q._id} style={{ margin: '10px 0', background: isCorrect ? '#e7f8d2' : '#f8d2d2', padding: '10px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '16px' }}><strong>Q{qIdx + 1}:</strong> {q.question}</p>
                  <p style={{ fontSize: '14px' }}>Your Answer: {ans?.selectedOption || 'Not answered'}</p>
                  <p style={{ fontSize: '14px' }}>Correct Answer: {q.answer}</p>
                </div>
              );
            })}
          </div>
        ))}
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#2e3a59',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
          onClick={() => window.location.href = '/dashboard'}
        >
          Go to Home
        </button>
      </div>
    );
  }

  const currentSection = quizData.sections[currentSectionIndex];
  const currentQuestion = currentSection.questions[currentQuestionIndex];
  const currentAnswer = answers[currentSection._id]?.[currentQuestion._id];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <ToastContainer position="bottom-right" />
      <h2 style={{ color: '#2e3a59', fontSize: '24px' }}>{quizData.quizTitle}</h2>
      <div style={{ fontSize: '18px', background: '#f2f2f2', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
        ⏳ Time Left: {Math.floor(timeLeft / 3600)}:
        {Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0')}:
        {(timeLeft % 60).toString().padStart(2, '0')}
      </div>
      <h3 style={{ color: '#333', fontSize: '20px' }}>{currentSection.title}</h3>

      <p style={{ fontSize: '16px' }}>
        Question {currentQuestionIndex + 1} of {currentSection.questions.length}
      </p>

      <div style={{ display: 'flex', marginBottom: '20px' }}>
        {quizData.sections.map((section, idx) => (
          <button
            key={idx}
            style={{
              padding: '10px',
              background: currentSectionIndex === idx ? '#4CAF50' : '#ddd',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              margin: '0 5px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setCurrentSectionIndex(idx);
              setCurrentQuestionIndex(0);
            }}
          >
            {section.title}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 40px)', gap: '10px' }}>
        {currentSection.questions.map((q, idx) => {
          const answered = answers[currentSection._id]?.[q._id];
          return (
            <button
              key={q._id}
              style={{
                padding: '10px',
                background: answered ? '#4CAF50' : '#ddd',
                border: 'none',
                borderRadius: '4px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentQuestionIndex(idx)}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: '20px', background: '#f2f2f2', padding: '20px', borderRadius: '8px' }}>
        <p style={{ fontSize: '18px' }}>{currentQuestion.question}</p>
        <div>
          {currentQuestion.options.map((option, idx) => (
            <label key={idx} style={{ display: 'block', margin: '10px 0', fontSize: '16px' }}>
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
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          style={{
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
          onClick={handlePrevious}
          disabled={currentSectionIndex === 0 && currentQuestionIndex === 0}
        >
          Previous
        </button>

        {currentSectionIndex === quizData.sections.length - 1 &&
          currentQuestionIndex === currentSection.questions.length - 1 ? (
          <button
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={handleSubmit}
            disabled={submitting || finalScore !== null}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            style={{
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={handleNext}
            disabled={submitting || finalScore !== null}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default JoinAndGiveQuiz;
