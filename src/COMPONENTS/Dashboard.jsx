import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';

function Dashboard() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);

  const routeChange = (path) => {
    navigate(path);
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.post(
        'http://localhost:3000/api/quiz/my-quizzes',
        { email: localStorage.getItem('userEmail') },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setQuizzes(res.data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizTitle) => {
    try {
      await axios.delete(`https://fun-tutor-backend-production.up.railway.app/api/quiz/delete/${encodeURIComponent(quizTitle)}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchQuizzes(); // Refresh after delete
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const parseQuizTitle = (quizTitle) => {
    const name = quizTitle.slice(0, -13).replace(/[-_]/g, ' ');
    const timestamp = quizTitle.slice(-13);
    const date = new Date(Number(timestamp));
    const formattedTime = date.toLocaleString();
    return { name, formattedTime };
  };

  // 🔵 STYLE OBJECTS
  const styles = {
    bodyReset: {
      margin: 0,
      fontFamily: "'Roboto', sans-serif",
      display: 'flex',
    },
    sidebar: {
      width: '240px',
      backgroundColor: '#333',
      paddingTop: '20px',
      height: '100vh',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '4px 0 6px rgba(0, 0, 0, 0.1)',
    },
    logo: {
      fontSize: '36px',
      marginBottom: '20px',
    },
    sidebarBtn: {
      backgroundColor: '#444',
      color: '#fff',
      padding: '14px 20px',
      fontSize: '16px',
      margin: '10px 0',
      width: '80%',
      textAlign: 'left',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    sidebarBtnHover: {
      backgroundColor: '#555',
    },
    main: {
      flex: 1,
      padding: '40px 20px',
      backgroundColor: '#f4f6f9',
      minHeight: '100vh',
    },
    header: {
      fontSize: '28px',
      color: '#333',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    contentTitle: {
      fontSize: '24px',
      marginBottom: '10px',
      color: '#333',
    },
    quizList: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
    quizCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'transform 0.2s ease',
    },
    quizName: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    },
    quizTime: {
      fontSize: '14px',
      color: '#777',
    },
    deleteIcon: {
      fontSize: '18px',
      color: '#d9534f',
      cursor: 'pointer',
      transition: 'color 0.3s ease',
    },
    deleteIconHover: {
      color: '#c9302c',
    },
  };

  return (
    <div style={styles.bodyReset}>
      <aside style={styles.sidebar}>
        <div style={styles.logo}>🎲</div>
        <button
          style={styles.sidebarBtn}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.sidebarBtnHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.sidebarBtn.backgroundColor)}
          onClick={() => routeChange('/dashboard/game')}
        >
          Play Games
        </button>
        <button
          style={styles.sidebarBtn}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.sidebarBtnHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.sidebarBtn.backgroundColor)}
          onClick={() => routeChange('/quiz')}
        >
          Make Quizzes
        </button>
        <button
          style={styles.sidebarBtn}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.sidebarBtnHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.sidebarBtn.backgroundColor)}
          onClick={() => routeChange('/JoinAndGiveQuiz')}
        >
          Join Quiz
        </button>
      </aside>
      <main style={styles.main}>
        <div style={styles.header}>Welcome to the Dashboard</div>
        <div style={styles.contentTitle}>Your Created Quizzes</div>
        <div style={styles.quizList}>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => {
              const { name, formattedTime } = parseQuizTitle(quiz.quizTitle);
              return (
                <div
                  key={quiz._id}
                  style={styles.quizCard}
                  onClick={() => routeChange(`/quiz/${encodeURIComponent(quiz.quizTitle)}`)}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
                >
                  <div>
                    <div style={styles.quizName}>{name.trim()}</div>
                    <div style={styles.quizTime}>{formattedTime}</div>
                  </div>
                  <FaTrashAlt
                    style={styles.deleteIcon}
                    onClick={(e) => {
                      e.stopPropagation(); // prevent card click
                      handleDelete(quiz.quizTitle);
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = styles.deleteIconHover.color)}
                    onMouseOut={(e) => (e.currentTarget.style.color = styles.deleteIcon.color)}
                  />
                </div>
              );
            })
          ) : (
            <p>No quizzes found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
