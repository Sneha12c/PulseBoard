import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../api/axios.ts";

function Dashboard() {
  const navigate = useNavigate();
  const [polls, setPolls] = useState<any[]>([]);

  const fetchPolls =
    async () => {
      try {
        const res = await api.get("/poll/allpolls");
        setPolls(res.data.polls);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchPolls();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mt-6">
        <Link
          to="/create-poll"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Poll
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {polls && polls.map(
          (poll) => (
            <div
              key={poll._id}
              className="bg-white p-4 rounded shadow"
            >
              <h2 className="text-xl font-semibold">
                Poll
              </h2>

              <p className="mt-2">
                Questions:
                {
                  poll.questionList
                    .length
                }
              </p>

              <p>
                Expires:
                {new Date(
                  poll.expiryTime
                ).toLocaleString()}
              </p>

              <div className="flex gap-2 mt-4">
                <Link
                  to={`/analytics/${poll._id}`}
                  className="bg-green-500 text-white px-3 py-2 rounded"
                >
                  Analytics
                </Link>

                <a
                  href={`/poll/${poll.pollLink}`}
                  target="_blank"
                  className="bg-blue-500 text-white px-3 py-2 rounded"
                >
                  Open Poll
                </a>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default Dashboard;
