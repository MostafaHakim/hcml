import React, { useEffect, useState } from "react";

function Recipies({ searchColor, weight }) {
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/demand/recipies")
      .then((res) => res.json())
      .then((data) => setRawData(data));
  }, []);

  const headers = rawData[0];
  const dataRows = rawData.slice(1);

  function groupByBatch(rows) {
    const batches = [];
    let currentBatch = [];

    rows.forEach((row) => {
      if (row[0] !== "") {
        if (currentBatch.length) {
          batches.push(currentBatch);
        }
        currentBatch = [row]; // নতুন ব্যাচ শুরু
      } else {
        currentBatch.push(row); // আগের ব্যাচে যুক্ত করো
      }
    });

    if (currentBatch.length) {
      batches.push(currentBatch);
    }

    return batches;
  }

  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const grouped = groupByBatch(dataRows);
    setBatches(grouped);
  }, []);

  const filteredBatches = batches.filter((batch) => {
    const mainColor = batch[0][1]?.toLowerCase();
    return mainColor.includes(searchColor.toLowerCase());
  });

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Dyeing Batches</h2>

      {filteredBatches.length === 0 ? (
        <p className="text-gray-500">No batch found for "{searchColor}"</p>
      ) : (
        filteredBatches.map((batch, index) => (
          <div key={index} className="mb-8 border rounded shadow">
            <h3 className="bg-blue-100 px-4 py-2 font-semibold">
              Batch {index + 1} — Main Color: {batch[0][1]}
            </h3>
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  {headers.map((header, idx) => (
                    <th key={idx} className="border px-2 py-1">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {batch.map((row, i) => {
                  const isMainRow = row[0] !== "";

                  // *** MODIFICATION START ***
                  // Use the 'weight' prop if it's a valid number, otherwise use the original batch[0][0]
                  const greigeWeightForCalculation =
                    parseFloat(weight) || parseFloat(batch[0][0]);
                  // *** MODIFICATION END ***

                  return (
                    <tr
                      key={i}
                      className={isMainRow ? "bg-blue-50 font-semibold" : ""}
                    >
                      {row.map((cell, j) => {
                        let displayValue = cell;

                        if (j === 0) {
                          // Display the user-provided weight if it's the main row, otherwise '-'
                          displayValue = isMainRow ? weight || "-" : "-";
                        } else if (j === 4) {
                          const percent = parseFloat(row[3]);
                          if (!isNaN(percent)) {
                            // Use greigeWeightForCalculation for all rows in the batch
                            displayValue = (
                              greigeWeightForCalculation * percent
                            ).toFixed(2);
                          } else {
                            displayValue = row[4] !== "" ? row[4] : "-";
                          }
                        } else if (cell === "") {
                          displayValue = "-";
                        }

                        return (
                          <td key={j} className="border px-2 py-1">
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
        ))
      )}
    </div>
  );
}

export default Recipies;
