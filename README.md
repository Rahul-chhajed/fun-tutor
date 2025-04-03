# Fun-Tutor 🎓  

An interactive quiz platform where **teachers** can create and manage quizzes, and **students** can join using a room code to participate in real-time. The platform provides **live score updates** and **statistical analysis** for teachers.

---

## Features ✨  
✅ **Real-time quizzes** with unique room codes  
✅ **Live score updates** using Socket.io  
✅ **Secure authentication** with JWT  
✅ **Statistical analysis** for performance evaluation  
✅ **Seamless user experience** with an intuitive UI  

---

## Tech Stack 🛠  
**Frontend:** React.js, CSS, JavaScript  
**Backend:** Node.js, Express.js, MongoDB  
**Real-time:** Socket.io  
**Authentication:** JWT  
**Version Control:** Git & GitHub  

---

## Installation & Setup ⚙️  

### Backend Setup 🚀  
Navigate to the backend folder:  
```sh
cd backend
```

Install dependencies:
```sh
npm install
```

Create a `.env` file and add the following environment variables:
```sh
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:
```sh
node app.js
```

### Frontend Setup 🎨  
Navigate to the frontend folder:
```sh
cd frontend
```

Install dependencies:
```sh
npm install
```

Start the frontend server:
```sh
npm run dev
```

## Usage 🏃  
- **Teachers:** Create quizzes and share the room code with students.  
- **Students:** Enter the room code and attempt quizzes in real-time.  
- **Scores:** Automatically updated and displayed in real-time.
