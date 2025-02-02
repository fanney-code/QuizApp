const express = require("express");
const router = express.Router();
const QuizConfig = require("../models/Quiz"); // Make sure the path to the Quiz model is correct

// Route to handle quiz config POST request
router.post('/quiz-config', async (req, res) => {
  console.log("📥 Received Quiz Config Data:", req.body);

  const { numQuestions, category, difficulty, time } = req.body;

  // Validate required fields
  if (!numQuestions || !category || !difficulty || !time) {
      console.log("❌ Missing fields in quiz config");
      return res.status(400).json({ message: "All fields are required." });
  }

  try {
      // Create a new quiz config document
      const quizConfig = new QuizConfig({ numQuestions, category, difficulty, time });

      // Save to database
      await quizConfig.save();

      // Respond with success message
      res.status(201).json({ message: "Quiz configuration saved successfully!" });
  } catch (err) {
      // Log the error and return a detailed message
      console.error("🚨 Error saving quiz config:", err);
      res.status(500).json({ message: "Error saving quiz configuration", error: err.message });
  }
});

module.exports = router;
