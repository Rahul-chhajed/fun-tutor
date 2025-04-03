import React, { useState, useEffect } from "react";
import { useLocation} from "react-router-dom";

function Deployment() {
    const location = useLocation();
    const quizTime = location.state?.quizTime || "Not Set";

    const [roomCode, setRoomCode] = useState("");

    // Function to generate a 6-character alphanumeric room code
    const generateRoomCode = () => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let code = "";
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return code;
    };

    // Generate a code when the component loads
    useEffect(() => {
        const storedCode = localStorage.getItem("roomCode");
        if (storedCode) {
            setRoomCode(storedCode);
        } else {
            const newCode = generateRoomCode();
            setRoomCode(newCode);
            localStorage.setItem("roomCode", newCode);
        }
    }, []); 
    return (
        <div>
           <h2>Welcome to the Quiz Room</h2>
           <p>Your Room Code: <strong>{roomCode}</strong></p>
            <p>Selected Quiz Time: {quizTime}</p>
        </div>
    );
}

export default Deployment;
