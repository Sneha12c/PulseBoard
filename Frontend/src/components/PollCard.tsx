import { Link } from "react-router-dom";

interface PollCardProps {
  poll: any;
}

function PollCard({
  poll,
}: PollCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h2 className="text-xl font-bold">
        Poll
      </h2>

      <p className="mt-2">
        Questions:
        {
          poll.questionList.length
        }
      </p>

      <p className="mt-2">
        Expires:
        {new Date(
          poll.expiryTime
        ).toLocaleString()}
      </p>

      <div className="flex gap-2 mt-4">
        <Link
          to={`/analytics/${poll._id}`}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Analytics
        </Link>

        <a
          href={`/poll/${poll.pollLink}`}
          target="_blank"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Open Poll
        </a>
      </div>
    </div>
  );
}

export default PollCard;