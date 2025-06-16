import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    backgroundColor: '#f0f2f5',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    background: 'white',
    padding: '40px 70px  40px 40px',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
    gap: '25px',
    alignItems: 'center',
  },
  heading: {
    color: '#333',
    fontSize: '28px',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  label: {
    fontWeight: 600,
    marginBottom: '5px',
    fontSize: '15px',
    display: 'block',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '16px',
  },
  errorText: {
    color: 'red',
    fontSize: '13px',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    marginLeft:'25px',
    color: 'white',
    padding: '14px 0px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  linkText: {
    fontSize: '14px',
    color: '#555',
  },
  loginLink: {
    color: '#4CAF50',
    textDecoration: 'none',
    fontWeight: 600,
  },
};

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
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
    axios
      .post('http://localhost:3000/signup-form', formData)
      .then((response) => {
        localStorage.setItem('userEmail', formData.email);
        navigate('/Dashboard');
      })
      .catch((error) => {
        console.log(error);
        setError(error.response.data.message);
      });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create a New Account</h2>
        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          {/* First Name */}
          <div>
            <label htmlFor="firstName" style={styles.label}>First Name</label>
            <input
              id="firstName"
              type="text"
              {...register('firstName', { required: 'First name is required' })}
              value={formData.firstName}
              placeholder="First Name"
              onChange={handleChange}
              style={styles.input}
            />
            {errors.firstName && <span style={styles.errorText}>{errors.firstName.message}</span>}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" style={styles.label}>Last Name</label>
            <input
              id="lastName"
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
              value={formData.lastName}
              placeholder="Last Name"
              onChange={handleChange}
              style={styles.input}
            />
            {errors.lastName && <span style={styles.errorText}>{errors.lastName.message}</span>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required', pattern: /^\S+@\S+\.\S+$/ })}
              value={formData.email}
              placeholder="Email"
              onChange={handleChange}
              style={styles.input}
            />
            {errors.email && <span style={styles.errorText}>{errors.email.message}</span>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must have at least 6 characters' },
              })}
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              style={styles.input}
            />
            {errors.password && <p style={styles.errorText}>{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
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
              style={styles.input}
            />
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword.message}</span>}
          </div>

          {error && <span style={styles.errorText}>{error}</span>}

          <button
            type="submit"
            style={styles.submitButton}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
          >
            Sign Up
          </button>
        </form>

        <div>
          <p style={styles.linkText}>
            Already have an account?{' '}
            <a
              href="/login"
              style={styles.loginLink}
              onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
