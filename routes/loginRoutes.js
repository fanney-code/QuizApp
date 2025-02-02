const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/User");

// Route to handle login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      res.redirect("/quizRoutes"); // Redirect to quiz page after successful login
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (err) {
    res.status(500).send("Error processing login");
  }
});

module.exports = router;
