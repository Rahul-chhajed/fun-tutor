import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const onSubmit = (data) => {
    axios.post("http://localhost:3000/login-form", formData)
        .then(response => {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userEmail", response.data.email);
            navigate("/Dashboard");
        })
        .catch(error => {
            console.log(error);
        });
};


  return (
    <div>
      <h2>Log In to Your Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required', pattern: /^\S+@\S+\.\S+$/ })}
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'Password is required' })}
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit">Log In</button>
      </form>

      <div>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Login;

