import React, { useEffect, useRef, useState } from "react";
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

function PakingList() {
  const [groupedData, setGroupedData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedChalan, setSearchedChalan] = useState("");
  const chalanRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://hcml-ry8s.vercel.app/griegein/delivaryinfo"
        );
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
        if (heightLeft > 0) {
          pdf.addPage();
        }
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`${searchedChalan}_PackingList.pdf`);
  };

  const matchedData = searchedChalan ? groupedData[searchedChalan] : null;

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
      <div className="w-full max-w-md flex flex-row items-center justify-end gap-2">
        <input
          type="search"
          placeholder="Enter Challan No"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded-md w-full text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200 text-base shadow-md"
        >
          Search
        </button>
      </div>

      {matchedData ? (
        <div
          ref={chalanRef}
          className="w-full bg-white shadow-lg border border-gray-200 rounded-lg p-8 print:shadow-none print:border-none max-w-4xl"
        >
          <div className="text-center border-b border-gray-300 pb-4 mb-6">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              Harun Composite Mills Limited.
            </h1>
            <p className="text-md text-gray-700">
              Golakandail, Narayanganj, Dhaka, Bangladesh <br />
              Phone: +8801700001
            </p>
          </div>

          <div className="flex flex-row justify-between items-start mb-6 text-md text-gray-800">
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
              <div className="text-md text-gray-700">Islam Pur</div>
            </div>
            <div>
              <span className="font-bold text-gray-900">Packing List No: </span>
              {searchedChalan}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b border-gray-300 pb-3">
            Packing List
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white">
            {Object.entries(groupedTables).map(([key, rows], index) => {
              const [lotNo, color] = key.split("__");
              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-5 shadow-sm text-md bg-gray-50 hover:shadow-md transition duration-200"
                >
                  <h3 className="text-xl font-extrabold text-blue-700 mb-2">
                    Lot: {lotNo}
                  </h3>
                  <p className="text-gray-700">Type: {rows[0][4]}</p>
                  <p className="text-gray-700">Design: {rows[0][5]}</p>
                  <p className="text-gray-700 mb-3">Color: {color}</p>

                  <table className="w-full mt-3 border border-gray-300 text-md text-center bg-white rounded-md overflow-hidden">
                    <thead className="bg-blue-100">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700 font-semibold">
                          Griege Than
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-gray-700 font-semibold">
                          Finishing Than
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className="even:bg-gray-50 odd:bg-white">
                          <td className="border border-gray-200 px-3 py-2">
                            {row[6]}
                          </td>
                          <td className="border border-gray-200 px-3 py-2">
                            {row[7]}
                          </td>
                        </tr>
                      ))}
                      <tr className="font-bold bg-blue-50 text-blue-800">
                        <td className="border border-gray-300 px-3 py-2">
                          Total:{" "}
                          {rows.reduce((sum, r) => sum + Number(r[6] || 0), 0)}
                        </td>
                        <td className="border border-gray-300 px-3 py-2">
                          Total:{" "}
                          {rows.reduce((sum, r) => sum + Number(r[7] || 0), 0)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>

          <div className="mt-10 p-5 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-300 pb-3">
              Fabric Type Summary
            </h3>
            <table className="w-full table-auto text-md border border-gray-300 bg-white rounded-md overflow-hidden">
              <thead className="bg-blue-100">
                <tr className="text-left text-gray-700 font-semibold">
                  <th className="border border-gray-300 px-3 py-2">
                    Fabric Type
                  </th>
                  <th className="border border-gray-300 px-3 py-2">
                    Total Than
                  </th>
                  <th className="border border-gray-300 px-3 py-2">
                    Total Griege
                  </th>
                  <th className="border border-gray-300 px-3 py-2">
                    Total Finishing
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  matchedData.reduce((acc, row) => {
                    const type = row[4];
                    if (!acc[type]) {
                      acc[type] = { than: 0, griege: 0, finishing: 0 };
                    }
                    acc[type].than += 1;
                    acc[type].griege += Number(row[6]) || 0;
                    acc[type].finishing += Number(row[7]) || 0;
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

          <div className="flex justify-start items-center mb-6 mt-6 text-md text-gray-800 p-3 bg-blue-50 border border-blue-100 rounded-md">
            <span className="font-bold text-gray-900 mr-2">Comment:</span>
            <span className="text-gray-700">{matchedData[0][11] || "N/A"}</span>
          </div>

          <div className="mt-12 text-right bg-white">
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
        <p className="text-gray-600 text-lg mt-8">
          Please enter a Challan Number to view the packing list.
        </p>
      )}

      {matchedData && (
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-200 text-lg shadow-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-200 text-lg shadow-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9V4h12v5M6 18h12M6 14h12M6 9h12M9 4h6"
              />
            </svg>
            Print
          </button>
        </div>
      )}
    </div>
  );
}

export default PakingList;
