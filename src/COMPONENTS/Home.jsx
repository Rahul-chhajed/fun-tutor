import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  let navigate = useNavigate(); 

  const routeChange = (path) => { 
    navigate(path);
  }

  return (
    <div>
      <button onClick={() => routeChange('/Login')}>Login</button>
      <button onClick={() => routeChange('/Signup')}>Signup</button>
    </div>
  );
}

export default Home;
