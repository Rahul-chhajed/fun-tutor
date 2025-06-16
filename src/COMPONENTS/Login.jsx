import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmit = (data) => {
    axios.post('http://localhost:3000/login-form', formData)
      .then(response => {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userEmail", response.data.email);
        navigate("/Dashboard");
      })
      .catch(error => {
        console.log(error.response.data.message);
        setError(error.response.data.message);
      });
  };

  const styles = {
    body: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    container: {
      background: 'white',
      padding: '40px 70px 40px 40px',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
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
      fontWeight: '600',
      marginBottom: '5px',
      fontSize: '15px',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
      transition: '0.3s',
    },
    inputFocus: {
      borderColor: '#4CAF50',
      outline: 'none',
      boxShadow: '0 0 8px rgba(76, 175, 80, 0.3)',
    },
    error: {
      color: 'red',
      fontSize: '13px',
    },
    button: {
      backgroundColor: '#4CAF50',
      marginLeft:'20px',
      color: 'white',
      padding: '14px 0px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease, transform 0.2s ease',
    },
    linkText: {
      fontSize: '14px',
      color: '#555',
    },
    link: {
      color: '#4CAF50',
      textDecoration: 'none',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Log In to Your Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
          <div>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: /^\S+@\S+\.\S+$/
              })}
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.email && <span style={styles.error}>{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.password && <span style={styles.error}>{errors.password.message}</span>}
          </div>

          {error && <span style={styles.error}>{error}</span>}

          <button type="submit" style={styles.button}>Log In</button>
        </form>

        <div>
          <p style={styles.linkText}>
            Don't have an account? <a href="/signup" style={styles.link}>Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
