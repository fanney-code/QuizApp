require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

// Models
const User = require("./models/User");
const QuizConfig = require("./models/Quiz"); // Ensure you import the correct model here

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "frontend"), { index: false }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "login.html"));
});

app.get("/quiz-config", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

// Handle Login Form Submission
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    if (!username || !password) {
      return res.status(400).send("Username and password are required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });

    await user.save();
    res.redirect("/quiz-config"); // Redirect to the main quiz page after login
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).send("Error saving user data");
  }
});

// Handle Quiz Config Submission
app.post('/api/quiz-config', (req, res) => {
  const quizData = req.body;

  if (!quizData) {
      return res.status(400).json({ error: 'No quiz data received' });
  }

  // Save to MongoDB
  QuizConfig.create(quizData)
      .then((savedData) => {
          console.log("Quiz data saved:", savedData);
          res.status(201).json(savedData);  // Return the saved data as a response
      })
      .catch((error) => {
          console.error('Error saving quiz data:', error);
          res.status(500).json({ error: 'Failed to save quiz data' });  // Return error response
      });
});

// MongoDB Connection
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/quizapp");
    console.log("✅ Connected to MongoDB");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

connectDB();
