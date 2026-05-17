import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import api from "../api/axios";

import { socket } from "../Socket/socket";

function Analytics() {
  const { pollLink } = useParams();
  console.log(pollLink);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => { 
    fetchAnalytics();
    socket.emit("join-poll", pollLink);

    socket.on( "poll-analytics-updated", (data) => {
        console.log("Analytics updated:", data);
        setAnalytics(data);
      }
    );

    return () => {
      socket.off(
        "analytics_updated"
      );
    };
  }, []);

  const fetchAnalytics = async () => {
    const res = await api.get(`/poll/analytics/${pollLink}`);
    setAnalytics(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Analytics
      </h1>

      <p>
        Total Responses:
        {
          analytics?.totalResponses
        }
      </p>

      {analytics?.analyticsResult.map(
        (
          item: any,
          index: number
        ) => (
          <div key={index}>
            <p>
              Question:
              {item._id.questionId}
            </p>
            <p>
              Option: {item._id.option}
            </p>

            <p>
              Votes: { item.count}
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default Analytics;