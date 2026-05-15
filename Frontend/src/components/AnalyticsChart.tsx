interface AnalyticsProps {
  analytics: any[];
}

function AnalyticsChart({
  analytics,
}: AnalyticsProps) {
  return (
    <div className="space-y-4">
      {analytics.map(
        (
          item,
          index
        ) => (
          <div
            key={index}
            className="bg-white p-4 rounded shadow"
          >
            <h2 className="font-bold">
              Question ID:
              {
                item._id
                  .questionId
              }
            </h2>

            <p className="mt-2">
              Option:
              {
                item._id
                  .option
              }
            </p>

            <p>
              Votes:
              {
                item.count
              }
            </p>

            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{
                  width: `${Math.min(
                    item.count * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default AnalyticsChart;