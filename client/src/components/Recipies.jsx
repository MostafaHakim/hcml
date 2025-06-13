import React, { useEffect, useState, useMemo } from "react";

function groupByBatch(rows) {
  if (!rows || rows.length === 0) return [];

  const batches = [];
  let currentBatch = null;

  rows.forEach((row) => {
    const isNewBatchRow = row[0] !== "" && row[0] != null;

    if (isNewBatchRow) {
      if (currentBatch) {
        batches.push(currentBatch);
      }

      currentBatch = [row];
    } else {
      if (currentBatch) {
        currentBatch.push(row);
      }
    }
  });

  if (currentBatch) {
    batches.push(currentBatch);
  }

  return batches;
}

function Recipes({ searchColor, weight }) {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://hcml-ry8s.vercel.app/demand/recipies")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Network response was not ok. Please try again later."
          );
        }
        return res.json();
      })
      .then((data) => {
        setRawData(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch recipes:", err);
        setError("Failed to load recipe data.");
        setRawData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const headers = useMemo(
    () => (rawData.length > 0 ? rawData[0] : []),
    [rawData]
  );
  const dataRows = useMemo(
    () => (rawData.length > 1 ? rawData.slice(1) : []),
    [rawData]
  );

  const batches = useMemo(() => groupByBatch(dataRows), [dataRows]);

  const filteredBatches = useMemo(() => {
    if (!searchColor) {
      return batches;
    }
    return batches.filter((batch) => {
      if (batch.length > 0 && batch[0][1]) {
        const mainColor = batch[0][1].toLowerCase();
        return mainColor.includes(searchColor.toLowerCase());
      }
      return false;
    });
  }, [batches, searchColor]);

  if (loading) {
    return (
      <div className="text-center p-8 text-gray-500">Loading recipes...</div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  if (rawData.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No recipe data available.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filteredBatches.length === 0 ? (
        <p className="text-center p-8 text-gray-500 bg-white rounded-lg shadow">
          {searchColor
            ? `No batch found for "${searchColor}"`
            : "No batches available."}
        </p>
      ) : (
        filteredBatches.map((batch, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
          >
            <h3 className="bg-gray-100 px-4 py-3 font-bold text-gray-800 border-b border-gray-200">
              Batch #{index + 1} &mdash; Main Color:{" "}
              <span className="text-blue-600">{batch[0][1]}</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50">
                  <tr>
                    {headers.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-2 text-gray-600 font-semibold uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {batch.map((row, i) => {
                    const isMainRow = i === 0;

                    const greigeWeightForCalculation =
                      parseFloat(weight) || parseFloat(batch[0][0]) || 0;

                    return (
                      <tr
                        key={i}
                        className={
                          isMainRow ? "bg-blue-50" : "hover:bg-gray-50"
                        }
                      >
                        {headers.map((header, j) => {
                          let displayValue = row[j];

                          if (j === 0) {
                            displayValue = isMainRow
                              ? weight || batch[0][0]
                              : "—";
                          } else if (j === 4) {
                            const percent = parseFloat(row[3]);
                            if (!isNaN(percent)) {
                              displayValue = (
                                greigeWeightForCalculation * percent
                              ).toFixed(3);
                            } else {
                              displayValue = row[4] !== "" ? row[4] : "—";
                            }
                          }

                          if (displayValue === "" || displayValue === null) {
                            displayValue = "—";
                          }

                          return (
                            <td
                              key={j}
                              className={`px-4 py-2 ${
                                isMainRow && "font-semibold"
                              }`}
                            >
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Recipes;
