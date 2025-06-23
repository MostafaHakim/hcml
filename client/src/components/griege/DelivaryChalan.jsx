import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Signature from "./Signature";

function DeliveryChallan() {
  const [groupedData, setGroupedData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedChallan, setSearchedChallan] = useState("");
  const [address, setAddress] = useState("");
  const [demand, setDemand] = useState([]);

  const chalanRef = useRef();

  // Fetch data on load
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
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand`)
      .then((res) => res.json())
      .then((data) => {
        setDemand(data);
      });
  }, []);

  useEffect(() => {
    if (!searchedChallan || !groupedData[searchedChallan]) {
      setAddress("");
      return;
    }

    const partyName = groupedData[searchedChallan][0][3];
    fetch(
      `https://hcml-ry8s.vercel.app/griegein/getaddress?party=${encodeURIComponent(
        partyName
      )}`
    )
      .then((res) => res.json())
      .then((data) => setAddress(data?.address || ""))
      .catch(() => setAddress(""));
  }, [searchedChallan]);

  const handleSearch = () => {
    setSearchedChallan(searchText.trim());
  };

  const handleDownloadPDF = async () => {
    const element = chalanRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("l", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    pdf.save(`${searchedChallan}_DeliveryChallan.pdf`);
  };

  const matchedData = searchedChallan ? groupedData[searchedChallan] : null;

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8 p-6">
      {/* Search Section */}
      <div className="w-full max-w-md flex flex-row items-center justify-end gap-2">
        <input
          type="search"
          placeholder="Enter Delivery Challan No"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Matched Challan Detail View */}
      {matchedData ? (
        <div
          ref={chalanRef}
          className="max-w-6xl w-full bg-white shadow-md border rounded-lg p-6 print:p-0 print:shadow-none print:border-none"
        >
          {/* Header */}
          <div className="text-center border-b pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Harun Composite Mills Limited.
            </h1>
            <p className="text-sm text-gray-600">
              Golakandail, Narayanganj, Dhaka, Bangladesh <br />
              Phone: +8801700001
            </p>
          </div>

          {/* Top Info */}
          <div className="flex flex-row justify-between mb-4">
            <div className="flex space-x-2">
              <span className="font-semibold">Delivery Date:</span>
              <span>
                {new Date(matchedData[0][0]).toLocaleDateString("en-GB")}
              </span>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {matchedData[0][3]}
              </div>
              <div className="text-md text-gray-700">{address}</div>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">Challan No:</span>
              <span>{searchedChallan}</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center border-b pb-2">
            Delivery Challan
          </h2>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">Griege Received Date</th>
                  <th className="border px-2 py-1">Lot No</th>
                  <th className="border px-2 py-1">Type</th>
                  <th className="border px-2 py-1">Design</th>
                  <th className="border px-2 py-1">Total Than</th>
                  <th className="border px-2 py-1">Total Griege</th>
                  <th className="border px-2 py-1">Finishing Griege</th>
                  <th className="border px-2 py-1">Comments</th>
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  <td className="border px-2 py-1">
                    {demand.map((item, i) => {
                      if (
                        item["Party's Name"] === matchedData[0][3] &&
                        item["Lot Number"] === matchedData[0][2]
                      ) {
                        return new Date(item["Date"]).toLocaleDateString(
                          "en-GB"
                        );
                      }
                      return null;
                    })}
                  </td>
                  <td className="border px-2 py-1">{matchedData[0][2]}</td>
                  <td className="border px-2 py-1">{matchedData[0][4]}</td>
                  <td className="border px-2 py-1">{matchedData[0][5]}</td>
                  <td className="border px-2 py-1">{matchedData.length}</td>
                  <td className="border px-2 py-1">
                    {matchedData.reduce((sum, r) => {
                      const val = parseFloat(r[6]);
                      return isNaN(val) ? sum : sum + val;
                    }, 0)}
                  </td>
                  <td className="border px-2 py-1">
                    {matchedData.reduce((sum, r) => {
                      const val = parseFloat(r[7]);
                      return isNaN(val) ? sum : sum + val;
                    }, 0)}
                  </td>
                  <td className="border px-2 py-1">{matchedData[0][11]}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-8 text-right">
            <Signature />
          </div>
        </div>
      ) : searchedChallan ? (
        <p className="text-red-600 font-semibold">
          No challan found with: {searchedChallan}
        </p>
      ) : (
        // ✅ Show All Challan List if no search
        <div className="w-full max-w-3xl mt-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            All Delivery Challans
          </h3>
          <div className="space-y-2">
            {Object.entries(groupedData).map(([chalanNo, rows]) => (
              <div
                key={chalanNo}
                onClick={() => setSearchedChallan(chalanNo)}
                className="cursor-pointer bg-white hover:bg-blue-50 border border-gray-300 rounded-md p-3 shadow-sm transition grid grid-cols-5 text-left"
              >
                <div className="text-md text-gray-900 font-bold col-span-2">
                  Challan No: {chalanNo}
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

      {/* Back & Download Buttons */}
      {matchedData && (
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => {
              setSearchedChallan("");
              setSearchText("");
            }}
            className="bg-sky-500 text-white px-4 py-2 rounded hover:bg-sky-700"
          >
            🔙 Back
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Print
          </button>
        </div>
      )}
    </div>
  );
}

export default DeliveryChallan;
