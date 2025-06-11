import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageWrapper from "../components/ui/PageWrapper";

function StoreMaintain() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [memoSearch, setMemoSearch] = useState("");
  const [dateSearch, setDateSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://hcml-ry8s.vercel.app/demand/verifydyes`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setData(data);
        filterByDateAndMemo(data); // Filter immediately after data loads
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        alert("Failed to load data. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    // Re-filter when search terms change
    filterByDateAndMemo(data);
  }, [memoSearch, dateSearch, data]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const filterByDateAndMemo = (fullData) => {
    if (!fullData?.length) {
      setFilteredData([]);
      return;
    }

    const headers = fullData[0];
    const rows = fullData.slice(1);

    const batches = [];
    let currentBatch = [];

    rows.forEach((row) => {
      const isNewBatch = row[0] !== "";
      if (isNewBatch && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [];
      }
      currentBatch.push(row);
    });
    if (currentBatch.length > 0) batches.push(currentBatch);

    const filteredBatches = batches.filter((batch) => {
      const first = batch[0];
      const date = formatDate(first[0]);
      const memo = String(first[1] || "").trim();
      const memoSearchClean = memoSearch.trim();
      const status = String(first[18] || "")
        .trim()
        .toLowerCase();

      const matchMemo = !memoSearchClean || memo.includes(memoSearchClean);
      const matchDate = !dateSearch || date === dateSearch;
      const matchStatus = status === "pending";

      return matchMemo && matchDate && matchStatus;
    });

    setFilteredData([headers, ...filteredBatches.flat()]);
  };

  const holdUpdate = async (batch) => {
    const payload = batch.map((row) => ({
      color: String(row[6] || "").trim(),
      gram: parseFloat(row[13]) || 0,
    }));

    try {
      const response = await fetch("https://hcml-ry8s.vercel.app/stock/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchData: payload }),
      });
      const result = await response.json();
      if (!result.success)
        throw new Error(result.message || "Failed to update stock hold");
    } catch (error) {
      console.error("Hold update error:", error);
      alert("Failed to update stock hold.");
      throw error;
    }
  };

  const markDelivered = async (batch) => {
    try {
      const memoNo = batch[0][1];
      const date = formatDate(batch[0][0]);
      const payload = { memoNo, date, status: "Delivered" };

      const response = await fetch(
        "https://hcml-ry8s.vercel.app/demand/status",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok)
        throw new Error("Failed to update status in Google Sheet");

      await holdUpdate(batch);

      // Update the status in the local state
      const updatedData = data.map((row) => {
        if (batch.includes(row)) {
          const newRow = [...row];
          newRow[18] = "Delivered";
          return newRow;
        }
        return row;
      });

      setData(updatedData);
      filterByDateAndMemo(updatedData);

      alert("Batch marked as delivered successfully!");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to mark batch as delivered. Please try again.");
    }
  };

  // Prepare batches for rendering
  const prepareBatches = (data) => {
    if (!data.length) return [];

    const headers = data[0];
    const rows = data.slice(1);

    const batches = [];
    let currentBatch = [];

    rows.forEach((row) => {
      const isNewBatch = row[0] !== "";
      if (isNewBatch && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [];
      }
      currentBatch.push(row);
    });
    if (currentBatch.length > 0) batches.push(currentBatch);

    return batches;
  };

  const batchesToRender = prepareBatches(filteredData);

  return (
    <div className="w-screen h-screen">
      <Navbar />
      <PageWrapper>
        <div className="w-screen h-screen p-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold">Memo No</label>
              <input
                type="text"
                value={memoSearch}
                onChange={(e) => setMemoSearch(e.target.value)}
                placeholder="Memo No"
                className="border px-2 py-1 w-full rounded"
              />
            </div>
            <div>
              <label className="text-xs font-semibold">Date</label>
              <input
                type="date"
                value={dateSearch}
                onChange={(e) => setDateSearch(e.target.value)}
                className="border px-2 py-1 w-full rounded"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => filterByDateAndMemo(data)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow"
              >
                Filter
              </button>
            </div>
          </div>
          {loading ? (
            <div className="text-center text-white mt-8 text-2xl">
              Loading batches...
            </div>
          ) : batchesToRender.length === 0 ? (
            <div className="text-center text-white mt-8 text-2xl">
              No matching batches found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {batchesToRender.map((batch, batchIndex) => (
                <div
                  key={batchIndex}
                  className="border rounded-lg mb-8 shadow p-3 bg-white col-span-1"
                >
                  <div className="mb-3 text-sm font-medium">
                    <div>Memo No: {batch[0][1]}</div>
                    <div>Date: {formatDate(batch[0][0])}</div>
                    <div>Lot No: {batch[0][12]}</div>
                    <div>Party: {batch[0][10]}</div>
                    <div>Status: {batch[0][18]}</div>
                  </div>
                  <table className="min-w-full text-left mb-3 border">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="border px-2 py-1">Color</th>
                        <th className="border px-2 py-1">Gram</th>
                      </tr>
                    </thead>
                    <tbody>
                      {batch.map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="border px-2 py-1">{row[6]}</td>
                          <td className="border px-2 py-1">{row[13]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    onClick={() => markDelivered(batch)}
                    disabled={batch[0][18] === "Delivered"}
                    className={`text-white px-4 py-1 rounded ${
                      batch[0][18] === "Delivered"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    Mark as Delivered
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </div>
  );
}

export default StoreMaintain;
