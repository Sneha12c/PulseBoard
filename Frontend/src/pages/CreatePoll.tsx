import { useState } from "react";
import api from "../api/axios";

type QuestionType = {
  description: string;
  optionList: string[];
  questionType: "single-choice" | "multiple-choice";
  correctOption: string;
  required: boolean;
};

function CreatePoll() {
  const [questions, setQuestions] = useState<QuestionType[]>([
    {
      description: "",
      optionList: ["", "", "", ""],
      questionType: "single-choice",
      correctOption: "",
      required: true,
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        description: "",
        optionList: ["", "", "", ""],
        questionType: "single-choice",
        correctOption: "",
        required: true,
      },
    ]);
  };

  const createPoll = async () => {
    try {
      const res = await api.post("/poll/create", {
        authenticated: true,
        expiryTime: new Date(Date.now() + 86400000),
        questionList: questions,
      });

      alert(res.data.publicUrl);
    } catch (error) {
      console.log(error);
      alert("Failed to create poll");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Create Poll
      </h1>

      {questions.map((q, index) => (
        <div
          key={index}
          className="border rounded-lg p-5 mb-6 shadow-sm"
        >
          <h2 className="font-semibold text-lg mb-4">
            Question {index + 1}
          </h2>

          {/* Question */}
          <input
            type="text"
            placeholder="Enter question"
            className="border p-3 rounded w-full mb-4"
            value={q.description}
            onChange={(e) => {
              const copy = [...questions];
              copy[index].description = e.target.value;
              setQuestions(copy);
            }}
          />

          {/* Question Type */}
          <select
            className="border p-3 rounded w-full mb-4"
            value={q.questionType}
            onChange={(e) => {
              const copy = [...questions];
              copy[index].questionType = e.target.value as | "single-choice" | "multiple-choice";
              setQuestions(copy);
            }}
          >
            <option value="single-choice">
              Single Choice
            </option>

            <option value="multiple-choice">
              Multiple Choice
            </option>
          </select>

          {/* Required */}
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={q.required}
              onChange={(e) => {
                const copy = [...questions];
                copy[index].required =
                  e.target.checked;
                setQuestions(copy);
              }}
            />

            Required Question
          </label>

          {/* Options */}
          <div className="space-y-3">
            {q.optionList.map(
              (option, optionIndex) => (
                <input
                  key={optionIndex}
                  type="text"
                  placeholder={`Option ${
                    optionIndex + 1
                  }`}
                  className="border p-3 rounded w-full"
                  value={option}
                  onChange={(e) => {
                    const copy = [...questions];
                    copy[index].optionList[
                      optionIndex
                    ] = e.target.value;

                    setQuestions(copy);
                  }}
                />
              )
            )}
          </div>

          {/* Correct Option */}
          <input
            type="text"
            placeholder="Correct Option"
            className="border p-3 rounded w-full mt-4"
            value={q.correctOption}
            onChange={(e) => {
              const copy = [...questions];
              copy[index].correctOption =
                e.target.value;

              setQuestions(copy);
            }}
          />
        </div>
      ))}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          onClick={addQuestion}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded"
        >
          Add Question
        </button>

        <button
          onClick={createPoll}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded"
        >
          Create Poll
        </button>
      </div>
    </div>
  );
}

export default CreatePoll;