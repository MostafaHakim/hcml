import React, { useEffect, useState } from "react";

function Costing() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [lotSearch, setLotSearch] = useState("");
  const [partySearch, setPartySearch] = useState("");

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand/verifydyes`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toISOString().split("T")[0];
  };

  const handleFilter = () => {
    if (!data || data.length === 0) return;

    const headers = data[0];
    const rows = data.slice(1);

    const dateIndex = headers.indexOf("Date");
    const lotIndex = headers.indexOf("Lot No");
    const partyIndex = headers.indexOf("Party");

    const batches = [];
    let currentBatch = [];

    rows.forEach((row) => {
      const isNewBatch = row[dateIndex] !== "";
      if (isNewBatch && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [];
      }
      currentBatch.push(row);
    });
    if (currentBatch.length > 0) batches.push(currentBatch);

    const filteredBatches = batches.filter((batch) => {
      const firstRow = batch[0];
      const rowDate = formatDate(firstRow[dateIndex]);
      const lotNo = firstRow[lotIndex]?.toString() || "";
      const partyName = firstRow[partyIndex]?.toString() || "";

      const inDateRange =
        (!fromDate || rowDate >= fromDate) && (!toDate || rowDate <= toDate);
      const lotMatch =
        lotSearch === "" ||
        lotNo.toLowerCase().includes(lotSearch.toLowerCase());
      const partyMatch =
        partySearch === "" ||
        partyName.toLowerCase().includes(partySearch.toLowerCase());

      return inDateRange && lotMatch && partyMatch;
    });

    const filtered = filteredBatches.flat();
    setFilteredData([headers, ...filtered]);
  };

  if (!filteredData || filteredData.length === 0)
    return <p className="text-center mt-4">No data available</p>;

  const headers = filteredData[0];
  const rows = filteredData.slice(1);

  const batchRows = [];
  let currentBatch = [];

  const dateIndex = headers.indexOf("Date");

  rows.forEach((row) => {
    const isNewBatch = row[dateIndex] !== "";
    if (isNewBatch && currentBatch.length > 0) {
      batchRows.push(currentBatch);
      currentBatch = [];
    }
    currentBatch.push(row);
  });
  if (currentBatch.length > 0) batchRows.push(currentBatch);

  return (
    <div className="overflow-x-auto p-4 text-sm">
      {/* Filter Inputs */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div>
          <label className="block text-xs font-semibold mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Lot No</label>
          <input
            type="text"
            placeholder="Lot no"
            value={lotSearch}
            onChange={(e) => setLotSearch(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Party Name</label>
          <input
            type="text"
            placeholder="Party name"
            value={partySearch}
            onChange={(e) => setPartySearch(e.target.value)}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={handleFilter}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow"
        >
          Filter
        </button>
      </div>

      <div className="min-w-full border border-gray-300 rounded-lg shadow mx-auto max-w-7xl">
        <table className="min-w-full text-left text-black">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="py-1 px-3 border font-semibold text-center"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {batchRows.map((batch, batchIndex) => (
              <React.Fragment key={batchIndex}>
                {batch.map((row, rowIndex) => {
                  const isFirstRow = rowIndex === 0;
                  return (
                    <tr
                      key={rowIndex}
                      className={`${
                        isFirstRow ? "bg-yellow-100 font-medium" : "bg-white"
                      } hover:bg-yellow-50 transition duration-150`}
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className={`border px-3 py-1 whitespace-nowrap text-center ${
                            headers[cellIndex] === "Date"
                              ? "text-blue-700 font-medium"
                              : ""
                          }`}
                        >
                          {headers[cellIndex] === "Date"
                            ? formatDate(cell)
                            : cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Costing;
