import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Signature = () => {
  return (
    <div className="flex flex-col items-end mt-12 text-gray-700">
      <div className="border-t border-gray-400 pt-2 text-center">
        <p className="font-semibold text-lg">Authorized Signature</p>
        <p className="text-sm">Harun Composite Mills Limited</p>
      </div>
    </div>
  );
};

function PackingList() {
  const [groupedData, setGroupedData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedChalan, setSearchedChalan] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25; // Adjust this value as needed
  const chalanRef = useRef();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/griegein/delivaryinfo`);
        const raw = await res.json();
        const rows = raw.slice(1).filter((r) => r[1]);

        const grouped = {};
        for (const row of rows) {
          const chalanNo = row[1];
          if (!grouped[chalanNo]) grouped[chalanNo] = [];
          grouped[chalanNo].push(row);
        }

        setGroupedData(grouped);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    setSearchedChalan(searchText.trim());
  };

  const handleDownloadPDF = async () => {
    const element = chalanRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let position = 0;
    if (pdfHeight > pageHeight) {
      let heightLeft = pdfHeight;
      while (heightLeft > 0) {
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft > 0) pdf.addPage();
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`${searchedChalan}_PackingList.pdf`);
  };

  const matchedData = searchedChalan ? groupedData[searchedChalan] : null;

  useEffect(() => {
    if (!matchedData) {
      setAddress("");
      return;
    }

    setAddressLoading(true); // ✅ Start loading
    fetch(
      `${BASE_URL}/griegein/getaddress?party=${encodeURIComponent(
        matchedData[0][3]
      )}`
    )
      .then((res) => res.json())
      .then((data) => setAddress(data?.address || ""))
      .catch(() => setAddress(""))
      .finally(() => setAddressLoading(false)); // ✅ Stop loading
  }, [matchedData]);

  const groupByLotAndColor = (data) => {
    const result = {};
    data.forEach((row) => {
      const key = `${row[2]}__${row[8]}`;
      if (!result[key]) result[key] = [];
      result[key].push(row);
    });
    return result;
  };

  const groupedTables = matchedData ? groupByLotAndColor(matchedData) : {};

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8 p-6 font-inter">
      {/* Search Box */}
      <div className="w-full max-w-md flex flex-row items-center justify-end gap-2">
        <input
          type="search"
          placeholder="Enter Challan No"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border border-gray-300 px-3 py-2 rounded-md w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-base shadow-md"
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && <p className="text-blue-600 text-lg">Loading data...</p>}

      {/* Display matchedData (Packing List View) */}
      {matchedData ? (
        <div
          ref={chalanRef}
          className="w-full bg-white shadow-lg border border-gray-200 rounded-lg p-8 print:shadow-none print:border-none max-w-4xl"
        >
          <div className="text-center border-b border-gray-300 pb-1 mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1">
              Harun Composite Mills Limited.
            </h1>
            <p className="text-md text-gray-700">
              Golakandail, Narayanganj, Dhaka, Bangladesh <br />
              Phone: +8801700001
            </p>
          </div>

          <div className="flex flex-row justify-between items-start mb-2 text-md text-gray-800">
            <div>
              <span className="font-bold text-gray-900">Delivery Date: </span>
              {new Date(matchedData[0][0]).toLocaleDateString("en-BD", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {matchedData[0][3]}
              </div>
              <div className="text-md text-gray-700">
                {addressLoading ? "Loading address..." : address}
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-900">Packing List No: </span>
              {searchedChalan}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2 text-center border-b border-gray-300 pb-2">
            Packing List
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1 bg-white text-sm">
            {Object.entries(groupedTables).map(([key, rows], index) => {
              const [lotNo, color] = key.split("__");
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-2 shadow-sm text-md bg-gray-50 hover:shadow-md transition duration-200"
                >
                  <div className="grid grid-cols-3 gap-1">
                    <div className="col-span-1 text-left">Lot:</div>
                    <div className="col-span-2 text-left">{lotNo}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="col-span-1 text-left">Type:</div>
                    <div className="col-span-2 text-left">{rows[0][4]}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="col-span-1 text-left">Design:</div>
                    <div className="col-span-2 text-left">{rows[0][5]}</div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="col-span-1 text-left">Color:</div>
                    <div className="col-span-2 text-left">{color}</div>
                  </div>

                  <table className="w-full mt-3 border border-gray-300 text-sm text-center bg-white rounded-md overflow-hidden">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="border border-gray-300 p-2 text-gray-700 font-semibold">
                          Griege
                        </th>
                        <th className="border border-gray-300 text-gray-700 font-semibold">
                          Finishing
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr
                          key={`${lotNo}_${color}_${i}`}
                          className="even:bg-gray-50 odd:bg-white"
                        >
                          <td className="border border-gray-200 p-1">
                            {row[6]}
                          </td>
                          <td className="border border-gray-200 p-1">
                            {row[7]}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-blue-50 text-blue-800 text-xs">
                        <td className="border border-gray-300 p-1">
                          Total:{" "}
                          {rows.reduce(
                            (sum, r) => sum + (parseFloat(r[6]) || 0),
                            0
                          )}
                        </td>
                        <td className="border border-gray-300 p-1">
                          Total:{" "}
                          {rows.reduce(
                            (sum, r) => sum + (parseFloat(r[7]) || 0),
                            0
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          <div className="mt-2 p-2 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-3">
              Fabric Type Summary
            </h3>
            <table className="w-full table-auto text-sm border border-gray-300 bg-white rounded-md overflow-hidden">
              <thead className="bg-blue-100">
                <tr className="text-left text-gray-700 font-semibold">
                  <th className="border border-gray-300 px-3 py-2 text-center">
                    Fabric Type
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center">
                    Total Than
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center">
                    Total Griege
                  </th>
                  <th className="border border-gray-300 px-3 py-2 text-center">
                    Total Finishing
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  matchedData.reduce((acc, row) => {
                    const type = row[4];
                    const griegeVal = parseFloat(row[6]);
                    const finishingVal = parseFloat(row[7]);

                    if (!acc[type]) {
                      acc[type] = { than: 0, griege: 0, finishing: 0 };
                    }

                    acc[type].than += 1;
                    acc[type].griege += isNaN(griegeVal) ? 0 : griegeVal;
                    acc[type].finishing += isNaN(finishingVal)
                      ? 0
                      : finishingVal;

                    return acc;
                  }, {})
                ).map(([type, totals], idx) => (
                  <tr
                    key={idx}
                    className="even:bg-gray-50 odd:bg-white text-gray-800"
                  >
                    <td className="border border-gray-200 px-3 py-2">{type}</td>
                    <td className="border border-gray-200 px-3 py-2">
                      {totals.than}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {totals.griege}
                    </td>
                    <td className="border border-gray-200 px-3 py-2">
                      {totals.finishing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-start items-center mb-2 mt-2 text-sm text-gray-800 p-2 bg-blue-50 border border-blue-100 rounded-md">
            <span className="font-bold text-gray-900 mr-2">Comment:</span>
            <span className="text-gray-700">{matchedData[0][11] || "N/A"}</span>
          </div>

          <div className="mt-10 text-right bg-white">
            <Signature />
          </div>
        </div>
      ) : searchedChalan ? (
        <p className="text-red-600 font-semibold text-xl mt-8 p-4 bg-red-100 border border-red-300 rounded-md">
          No challan found with:{" "}
          <span className="text-red-800">{searchedChalan}</span>. Please check
          the challan number and try again.
        </p>
      ) : (
        // Show All Challans When Nothing is Searched
        <div className="w-full max-w-3xl mt-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            All Available Pakinglist
          </h3>
          <div className="space-y-2">
            {Object.entries(groupedData).map(([chalanNo, rows]) => (
              <div
                key={chalanNo}
                onClick={() => setSearchedChalan(chalanNo)}
                className="cursor-pointer bg-white hover:bg-blue-50 border border-gray-300 rounded-md p-3 shadow-sm transition grid grid-cols-5 text-left"
              >
                <div className="text-md text-gray-900 font-bold col-span-2">
                  Pakinglist No: {chalanNo}
                </div>
                <div className="text-sm text-gray-700 col-span-1">
                  Date: {new Date(rows[0][0]).toLocaleDateString("en-BD")}
                </div>
                <div className="text-sm text-gray-700 col-span-2">
                  Party: {rows[0][3]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      {searchedChalan && matchedData && (
        <button
          onClick={() => {
            setSearchedChalan("");
            setSearchText("");
          }}
          className="mt-6 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          🔙 Back to All Pakinglist
        </button>
      )}

      {/* PDF / Print Buttons */}
      {matchedData && (
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-200 text-lg shadow-lg flex items-center gap-2"
          >
            📥 Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-200 text-lg shadow-lg flex items-center gap-2"
          >
            🖨️ Print
          </button>
        </div>
      )}
    </div>
  );
}

export default PackingList;
