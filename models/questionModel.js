const mongoose = require("mongoose");

const questionAnswerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const QuestionAnswer = mongoose.model("QuestionAnswer", questionAnswerSchema);

module.exports = QuestionAnswer;
