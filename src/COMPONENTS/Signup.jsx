import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    let navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:e.target.value,
    });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
axios.post("http://localhost:3000/signup-form",formData)
.then(response=>{

  localStorage.setItem("userEmail", formData.email);
 navigate('/Dashboard');
})
.catch(error=>{
  console.log(error);
});

};

  return (
    <div>
      <h2>Create a New Account</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* First Name */}
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            {...register('firstName', { required: 'First name is required' })}
            value={formData.firstName}
            placeholder="First Name"
            onChange={handleChange}
          />
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            {...register('lastName', { required: 'Last name is required' })}
            value={formData.lastName}
            placeholder="Last Name"
            onChange={handleChange}
          />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required', pattern: /^\S+@\S+\.\S+$/ })}
            value={formData.email}
            placeholder="Email"
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
            {...register('password', { required: 'Password is required', minLength:{
              value:6,
              message:"Password must have at least 6 characters"
            } })}
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value) => value === watch('password') || 'Passwords do not match',
            })}
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit">Sign Up</button>
      </form>

      <div>
        <p>Already have an account? <a href="/login">Log In</a></p>
      </div>
    </div>
  );
};

export default Signup;
