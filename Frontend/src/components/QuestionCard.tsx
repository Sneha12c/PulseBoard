interface QuestionCardProps {
  question: any;

  index: number;

  updateQuestion: (
    index: number,
    field: string,
    value: any
  ) => void;

  updateOption: (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => void;
}

function QuestionCard({
  question,
  index,
  updateQuestion,
  updateOption,
}: QuestionCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow mt-4">
      <h2 className="font-bold text-lg mb-4">
        Question {index + 1}
      </h2>

      <input
        type="text"
        placeholder="Question"
        value={
          question.description
        }
        onChange={(e) =>
          updateQuestion(
            index,
            "description",
            e.target.value
          )
        }
        className="border p-2 rounded w-full"
      />

      <div className="mt-4">
        {question.optionlist.map(
          (
            option: string,
            optionIndex: number
          ) => (
            <input
              key={optionIndex}
              type="text"
              placeholder={`Option ${
                optionIndex + 1
              }`}
              value={option}
              onChange={(e) =>
                updateOption(
                  index,
                  optionIndex,
                  e.target.value
                )
              }
              className="border p-2 rounded w-full mb-2"
            />
          )
        )}
      </div>
    </div>
  );
}

export default QuestionCard;