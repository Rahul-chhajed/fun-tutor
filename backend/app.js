const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key"; // Use an environment variable for production

const app = express();


mongoose
    .connect("mongodb://localhost:27017/tutorDB")
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String
});
const QuestionSchema = new mongoose.Schema({
    email: { type: String, required: true },  // User's email
    quizTitle: { type: String, required: true, unique: true },  // Unique quiz title
    sections: [
        {
            title: { type: String, required: true },  // Section title
            questions: [
                {
                    question: { type: String, required: true },  // The actual question
                    options: [String], // Multiple options
                    answer: { type: String, required: true },   // Selected answer
                    positiveScore: { type: Number, default: 0 }, // Positive score
                    negativeScore: { type: Number, default: 0 }, // Negative score
                }
            ]
        }
    ],
    createdAt: { type: Date, default: Date.now } // Timestamp
});

  

const QuestionModel = mongoose.model("Question", QuestionSchema);
const user = mongoose.model("user", userSchema);



const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access Denied" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });

        req.user = user;
        next();
    });
};

app.post("/login-form", function (req, res) {
    const { email, password } = req.body;

    user.findOne({ email: email })
        .then((foundUser) => {
            if (!foundUser) {
                return res.status(404).send({ message: 'User not found!' });
            }

            bcrypt.compare(password, foundUser.password, (err, result) => {
                if (err) {
                    return res.status(500).send({ message: 'Error comparing passwords.' });
                }

                if (result) {
                    const token = jwt.sign({ email: foundUser.email }, SECRET_KEY, { expiresIn: "1h" });

                    res.json({ token, email: foundUser.email });
                } else {
                    res.status(401).send({ message: 'Invalid credentials' });
                }
            });
        })
        .catch((err) => res.status(500).send({ message: 'Database error', error: err }));
});


app.post("/signup-form", function (req, res) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send({ message: "Passwords do not match." });
    }

    user.findOne({ email: email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).send({ message: "Email already in use." });
            }

            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).send({ message: "Error hashing password." });
                }

                const tempUser = new user({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
                });

                tempUser.save()
                    .then(() => {
                        const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
                        res.json({ message: 'Sign up successful!', token, email });
                    })
                    .catch((err) => res.status(500).send({ message: 'Error saving user', error: err }));
            });
        })
        .catch((err) => res.status(500).send({ message: 'Database error', error: err }));
});



app.post("/submit-questions",  authenticateToken,async (req, res) => {
    try {
        const { email,quizTitle, title, questions } = req.body;

        // Basic Validation
        if (!email ||!quizTitle|| !title || !questions || questions.length === 0) {
            return res.status(400).json({ message: "All fields are required" });
        }
       
        
        let section = await QuestionModel.findOne({ quizTitle:quizTitle, email: email });
        if (!section) {
            section = new QuestionModel({ email, quizTitle, sections: [] });
        }
        const newSection = {
            title,
            questions: questions.map((q) => ({
                question: q.question,
                answer: q.answer,
                options: q.options,
                positiveScore: q.positiveScore,
                negativeScore: q.negativeScore
            }))
        };
        section.sections.push(newSection);
        await section.save();
        console.log("Questions saved successfully:", section); 
        res.status(201).json({ message: "Questions submitted successfully!" });
    } catch (error) {
        console.error("Error saving questions:", error);
        res.status(500).json({ message: "Server error, try again later" });
    }
});

app.post("/check-title", authenticateToken, async (req, res) => {
    try {
        const { title,quizTitle } = req.body;
        
        const userEmail = req.user.email; // Assuming email is stored in req.user
console.log("email",userEmail);
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const section = await QuestionModel.findOne({ quizTitle:quizTitle, email: userEmail });
        if (!section) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        let existingTitle = false;
        section.sections.forEach((sec) => {
            if (sec.title === title) {
               existingTitle = true;
            }
        });

        res.json({ exists: existingTitle }); // true if exists, false otherwise
    } catch (error) {
        console.error("Error checking title:", error);
        res.status(500).json({ message: "Server error, try again later" });
    }
});



app.post("/seequiz-form", authenticateToken, async (req, res) => {
    try {
        const { email,quizTitle } = req.body;

        // Basic validation
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!quizTitle) {
            return res.status(400).json({ message: "Quiz title is required" });
        }
        // Check if the user exists

        // Fetch data from database
        const quizData = await QuestionModel.find({ email: email, quizTitle: quizTitle }).exec();
        if (!quizData) {
            return res.status(404).json({ message: "No quiz data found" });
        }
        
        console.log(quizData);
        // Send the quiz data as response
        res.json(quizData);
    } catch (error) {
        console.error("Error fetching quiz data:", error);
        res.status(500).json({ message: "Server error, try again later" });
    }
});

app.post("/delete-question", authenticateToken, async (req, res) => {
    try {
        const { quizTitle, sectionId, questionId } = req.body;
        const userEmail = req.user.email; // Assuming email is stored in req.user

        // Find the quiz
        const quiz = await QuestionModel.findOne({ quizTitle: quizTitle, email: userEmail });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Find the section
        const section = quiz.sections.id(sectionId);
        if (!section) {
            return res.status(404).json({ message: "Section not found" });
        }

        // Remove the question using pull()
        section.questions.pull(questionId);
        await quiz.save();

        res.json({ message: "Question deleted successfully!" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ message: "Server error, try again later" });
    }
});

  
  app.post("/api/quiz", authenticateToken, async (req, res) => {
    try {
        const { userEmail, title } = req.body;
        console.log("Title received:", title);
        if (!userEmail) {
            return res.status(400).json({ message: "Email is required" });
        }
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        // Create a unique title using timestamp
        const uniqueTitle = `${title}-${Date.now()}`;

        // Save the quiz with the unique title
        const newQuiz = new QuestionModel({ 
            email: userEmail,
            quizTitle: uniqueTitle,
            sections: []
        });
        await newQuiz.save();

        res.json({ message: "Quiz created successfully!", uniqueTitle });
    } 
    catch (error) {
        console.error("Error saving quiz title:", error);
        res.status(500).json({ message: "Server error, try again later" });
    }
});


  
app.listen(3000, function () {
    console.log("Server started on port 3000");
});
