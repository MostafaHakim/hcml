import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Signature from "./Signature";

function DelivaryChalan() {
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
        console.error(error);
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

    // Increase scale for better resolution
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

    // If content is longer than one page, split into multiple pages
    while (heightLeft > 0) {
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
      position -= pdfHeight;
      if (heightLeft > 0) {
        pdf.addPage();
      }
    }

    pdf.save(`${searchedChalan}_DeliveryChalan.pdf`);
  };

  const matchedData = searchedChalan ? groupedData[searchedChalan] : null;

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-8 p-6">
      {/* Search Section */}
      <div className="w-full max-w-md flex flex-row items-center justify-end gap-2">
        <input
          type="search"
          placeholder="Enter Delivery Challan No"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Challan Display */}
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
              <span>{new Date(matchedData[0][0]).toLocaleDateString()}</span>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-gray-900">
                {matchedData[0][3]}
              </div>
              <div className="text-md text-gray-700">Islam Pur</div>
            </div>
            <div className="flex space-x-2">
              <span className="font-semibold">Challan No:</span>
              <span>{searchedChalan}</span>
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
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Lot No</th>
                  <th className="border px-2 py-1">Party</th>
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
                    {new Date(matchedData[0][0]).toLocaleDateString()}
                  </td>
                  <td className="border px-2 py-1">{matchedData[0][2]}</td>
                  <td className="border px-2 py-1">{matchedData[0][3]}</td>
                  <td className="border px-2 py-1">{matchedData[0][4]}</td>
                  <td className="border px-2 py-1">{matchedData[0][5]}</td>
                  <td className="border px-2 py-1">{matchedData.length}</td>
                  <td className="border px-2 py-1">
                    {matchedData.reduce((sum, r) => sum + Number(r[6] || 0), 0)}
                  </td>
                  <td className="border px-2 py-1">
                    {matchedData.reduce((sum, r) => sum + Number(r[7] || 0), 0)}
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
      ) : searchedChalan ? (
        <p className="text-red-600 font-semibold">
          No challan found with: {searchedChalan}
        </p>
      ) : null}

      {/* Download & Print Buttons */}
      {matchedData && (
        <div className="flex gap-4 justify-end">
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

export default DelivaryChalan;
