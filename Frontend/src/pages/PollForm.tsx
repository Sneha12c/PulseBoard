import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api from "../api/axios";

function PollForm() {
  const { pollLink } = useParams();

  const [poll, setPoll] = useState<any>(null);

  const [answers, setAnswers] = useState<any[]>([]);

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll =
    async () => {
      const res =
        await api.get(
          `/poll/${pollLink}`
        );

      setPoll(res.data.pollResult);
    };

  const submitResponse =
    async () => {
      await api.post(
        `/response/${pollLink}`,
        {
          answers,
        }
      );

      alert(
        "Submitted"
      );
    };

  if (!poll)
    return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Poll
      </h1>

      {poll.questionList.map(
        (
          question: any,
          index: number
        ) => (
          <div
            key={index}
            className="mt-4"
          >
            <h2>
              {
                question.description
              }
            </h2>

            {question.optionlist.map(
              (
                option: string
              ) => (
                <label
                  key={option}
                  className="block"
                >
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={() => {
                      const copy =
                        [
                          ...answers,
                        ];

                      copy[
                        index
                      ] = {
                        questionId:
                          question._id,

                        selectedOption:
                          option,
                      };

                      setAnswers(
                        copy
                      );
                    }}
                  />

                  {option}
                </label>
              )
            )}
          </div>
        )
      )}

      <button
        className="bg-green-500 text-white px-4 py-2 mt-6"
        onClick={
          submitResponse
        }
      >
        Submit
      </button>
    </div>
  );
}

export default PollForm;