import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import quizAnimation from '../assets/quiz.json';
import { Button } from '@/components/ui/button';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-10 text-purple-900 font-sans">
      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center items-start space-y-6 text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-purple-800">
          Welcome to <span className="text-purple-600">Quiz Portal</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Join, create, and experience live quizzes like never before!
        </p>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => navigate('/Login')}
            className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 text-base font-semibold rounded-xl shadow"
          >
            Login
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/Signup')}
            className="border-purple-600 text-purple-600 hover:bg-purple-100 px-6 py-3 text-base font-semibold rounded-xl"
          >
            Signup
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex justify-center items-center mt-10 md:mt-0">
        <Lottie animationData={quizAnimation} loop={true} className="w-72 md:w-96" />
      </div>
    </div>
  );
}
