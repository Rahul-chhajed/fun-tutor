import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import quizAnimation from '../assets/quiz.json'; // download from lottiefiles.com

function Home() {
  const navigate = useNavigate(); 

  const routeChange = (path) => { 
    navigate(path);
  };

  const styles = {
    container: {
      background: "linear-gradient(135deg, #e0f7fa, #ffffff)",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "'Poppins', sans-serif",
      padding: "40px",
    },
    left: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "0 40px",
      animation: "fadeIn 1s ease-in-out",
    },
    heading: {
      fontSize: "3rem",
      color: "#003366",
      marginBottom: "10px",
    },
    subheading: {
      fontSize: "1.2rem",
      color: "#555",
      marginBottom: "30px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      padding: "12px 26px",
      fontSize: "1rem",
      borderRadius: "10px",
      cursor: "pointer",
      marginRight: "15px",
      marginBottom: "15px",
      transition: "all 0.3s ease-in-out",
    },
    buttonHover: {
      transform: "scale(1.05)",
      backgroundColor: "#0056b3",
    },
    right: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    animation: {
      height: "300px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h1 style={styles.heading}>Welcome to Quiz Portal</h1>
        <p style={styles.subheading}>Join, create, and experience live quizzes like never before!</p>
        <div>
          <button style={styles.button} onClick={() => routeChange('/Login')}>Login</button>
          <button style={styles.button} onClick={() => routeChange('/Signup')}>Signup</button>
         
        </div>
      </div>
      <div style={styles.right}>
        <Lottie animationData={quizAnimation} loop={true} style={styles.animation} />
      </div>
    </div>
  );
}

export default Home;

