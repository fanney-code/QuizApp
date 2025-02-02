// models/Quiz.js

const mongoose = require("mongoose");

// Quiz configuration schema definition
const QuizConfigSchema = new mongoose.Schema({
  numQuestions: {
    type: Number,
    required: true, // Number of questions in the quiz
  },
  category: {
    type: String,
    required: true, // Category of the quiz (e.g., General Knowledge)
  },
  difficulty: {
    type: String,
    required: true, // Difficulty level (e.g., easy, medium, hard)
  },
  time: {
    type: Number,
    required: true, // Time limit for the quiz (in minutes)
  },
});

// Creating the QuizConfig model based on the schema
const QuizConfig = mongoose.model('QuizConfig', QuizConfigSchema);
module.exports = QuizConfig;