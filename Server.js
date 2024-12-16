// Server code using Express and MongoDB with Mongoose
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const port = 8090;

// const mongoURI = process.env.MONGODB_URI;
// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.error('Error connecting to MongoDB', err);
// });

mongoose.connect(
  "mongodb+srv://divvukancherla630:1234@cluster0.epdcw.mongodb.net/",
  {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String,
});

const Question = mongoose.model("Question", questionSchema);

app.use(express.static(path.join(__dirname, "client")));
app.use(express.json());

// Endpoint to fetch questions from MongoDB
app.get("/api/questions", async (req, res) => {
  try {
    const questions = await Question.find({});
    res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/Final_Home.html"));
});

app.post("/api/add-question", async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  try {
    const newQuestion = new Question({
      question,
      options,
      correctAnswer,
    });

    await newQuestion.save();
    res.status(201).json({ message: "Question added successfully" });
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).json({ error: "Failed to add question" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const bodyParser = require("body-parser");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");

const JWT_SECRET =
  "sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk";
app.use("/", express.static(path.join(__dirname, "static")));
app.use(bodyParser.json());

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean();

  if (!user) {
    return res.json({ status: "error", error: "Invalid username/password" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      JWT_SECRET
    );
    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.json({ status: "ok", data: token });
  }

  res.json({ status: "error", error: "Invalid username/password" });
});

app.post("/api/register", async (req, res) => {
  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 8 && plainTextPassword.length > 20) {
    return res.json({
      status: "error",
      error: "Password too small. Should be between (8-20) characters",
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password,
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }

  res.json({ status: "ok" });
});
