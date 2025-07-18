import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { BASE_URL } from "../config"; // adjust path as needed
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const onSubmit = () => {
    axios
      .post(`${BASE_URL}/signup-form`, formData)
      .then(() => {
        localStorage.setItem('userEmail', formData.email);
        navigate('/login');
      })
      .catch((error) => {
        console.log(error);
        setError(error.response?.data?.message || 'Signup failed');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-3xl font-bold text-purple-700 text-center">Create a New Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-purple-700 mb-1">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="First Name"
            />
            {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-purple-700 mb-1">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Last Name"
            />
            {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: /^\S+@\S+\.\S+$/,
              })}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Email"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Password"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-purple-700 mb-1">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Backend Error */}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg">
            Sign Up
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="text-purple-600 font-semibold hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
