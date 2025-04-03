import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  let navigate = useNavigate(); 

  const routeChange = (path) => { 
    navigate(path);
  }

  return (
    <div>
      <button onClick={() => routeChange('/')}>pay games</button>
      <button onClick={() => routeChange('/quiz')}>make quizes</button>
      <button onClick={() => routeChange('/joinQuize')}>join quize</button>
    </div>
  );
}

export default Dashboard;