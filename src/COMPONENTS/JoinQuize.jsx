import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JoinQuize() {
  let navigate = useNavigate(); 

  const routeChange = (path) => { 
    navigate(path);
  }

  return (
    <div>
     hello
    </div>
  );
}

export default JoinQuize;
