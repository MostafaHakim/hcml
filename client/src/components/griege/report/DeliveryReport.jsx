import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

function DeliveryReport() {
  const [groupedData, setGroupedData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const reportRef = useRef();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/griegein/delivaryinfo`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 1) {
          const headers = data[0];
          const rows = data.slice(1);
          const formatted = rows
            .filter((row) => row.length === headers.length)
            .map((row) =>
              headers.reduce((obj, key, idx) => {
                obj[key] = row[idx];
                return obj;
              }, {})
            );

          const grouped = Object.values(
            formatted.reduce((acc, curr) => {
              const key = `${curr["Chalan No"]}-${curr["Lot Number"]}`;
              if (!acc[key]) {
                acc[key] = {
                  ...curr,
                  totalGriege: isNaN(Number(curr["Griege"]))
                    ? 0
                    : Number(curr["Griege"]),
                  totalFinishing: isNaN(Number(curr["Finishing"]))
                    ? 0
                    : Number(curr["Finishing"]),
                };
              } else {
                acc[key].totalGriege += isNaN(Number(curr["Griege"]))
                  ? 0
                  : Number(curr["Griege"]);
                acc[key].totalFinishing += isNaN(Number(curr["Finishing"]))
                  ? 0
                  : Number(curr["Finishing"]);
              }
              return acc;
            }, {})
          );

          setGroupedData(grouped);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredData = groupedData.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      String(item["Party's Name"]).toLowerCase().includes(searchLower) ||
      String(item["Lot Number"]).toLowerCase().includes(searchLower) ||
      String(item["Chalan No"]).toLowerCase().includes(searchLower) ||
      String(item["Design"]).toLowerCase().includes(searchLower) ||
      String(item["Status"]).toLowerCase().includes(searchLower) ||
      String(item["Delivered By"]).toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Delivery Report", 14, 22);

    const tableColumn = [
      "Date",
      "Chalan No",
      "Lot Number",
      "Party",
      "Type",
      "Design",
      "Total Than",
      "Total Griege",
      "Status",
      "Delivered By",
      "Comments",
    ];

    const tableRows = [];

    filteredData.forEach((item) => {
      const row = [
        new Date(item["Date"]).toLocaleDateString("en-GB"),
        String(item["Chalan No"]),
        String(item["Lot Number"]),
        String(item["Party's Name"]),
        String(item["Type"]),
        String(item["Design"]),
        String(item.totalGriege),
        String(item.totalFinishing),
        String(item["Status"]),
        String(item["Delivered By"]),
        String(item["Comments"] || ""),
      ];
      tableRows.push(row);
    });

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [40, 120, 40] },
      theme: "striped",
    });

    doc.save("Delivery_Report.pdf");
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <h2 className="uppercase py-3 px-4 bg-green-600 text-white rounded-t-lg text-lg font-semibold shadow-md">
        Delivery Report
      </h2>

      <div className="my-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          type="text"
          placeholder="Search by Party, Lot, Chalan No, Design, Status, Delivered By..."
          className="w-full max-w-md p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Print
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* রিপোর্ট অংশ */}
      <div ref={reportRef}>
        {/* হেডার */}{" "}
        <div className="hidden md:grid grid-cols-12 bg-green-800 text-white text-xs font-semibold py-2 px-4 rounded-t-md shadow-inner">
          <div className="col-span-1">Date</div>
          <div className="col-span-1">Chalan No</div>{" "}
          <div className="col-span-1">Lot Number</div>
          <div className="col-span-2">Party's Name</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Design</div>
          <div className="col-span-1">Total Than</div>
          <div className="col-span-1">Total Griege</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1">Delivered By</div>
          <div className="col-span-1">Comments</div>
        </div>
        {/* লোডিং */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading data...</p>
        ) : displayedData.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No data found.</p>
        ) : (
          displayedData.map((item, i) => {
            const bgColor = i % 2 === 0 ? "bg-white" : "bg-gray-100";
            return (
              <Link
                key={item["Chalan No"] + "-" + item["Lot Number"] + i}
                to={`${item["Lot Number"]}`}
                className={`${bgColor} grid grid-cols-1 md:grid-cols-12 text-gray-800 text-sm hover:bg-green-200 hover:text-green-900 transition-colors duration-300 cursor-pointer px-4 py-3 border-b border-gray-200 rounded md:rounded-none md:border-b-0`}
              >
                {/* মোবাইল ভিউ */}
                <div className="md:hidden mb-3 border-b border-gray-300 pb-2 space-y-1 text-xs">
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(item["Date"]).toLocaleDateString("en-GB")}
                  </div>
                  <div>
                    <strong>Chalan No:</strong> {item["Chalan No"]}
                  </div>
                  <div>
                    <strong>Lot Number:</strong> {item["Lot Number"]}
                  </div>
                  <div>
                    <strong>Party's Name:</strong> {item["Party's Name"]}
                  </div>
                  <div>
                    <strong>Type:</strong> {item["Type"]}
                  </div>
                  <div>
                    <strong>Design:</strong> {item["Design"]}
                  </div>
                  <div>
                    <strong>Total Than:</strong> {item.totalGriege}
                  </div>
                  <div>
                    <strong>Total Griege:</strong> {item.totalFinishing}
                  </div>
                  <div>
                    <strong>Status:</strong> {item["Status"]}
                  </div>
                  <div>
                    <strong>Delivered By:</strong> {item["Delivered By"]}
                  </div>
                  <div>
                    <strong>Comments:</strong> {item["Comments"]}
                  </div>
                </div>

                {/* ডেস্কটপ ভিউ */}
                <div className="hidden md:flex items-center col-span-1">
                  {new Date(item["Date"]).toLocaleDateString("en-GB")}
                </div>
                <div className="hidden md:flex items-center col-span-1">
                  {item["Chalan No"]}
                </div>
                <div className="hidden md:flex items-center col-span-1">
                  {item["Lot Number"]}
                </div>
                <div className="hidden md:flex items-center col-span-2">
                  {item["Party's Name"]}
                </div>
                <div className="hidden md:flex items-center col-span-1">
                  {item["Type"]}
                </div>
                <div className="hidden md:flex items-center col-span-1">
                  {item["Design"]}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item.totalGriege}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item.totalFinishing}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item["Status"]}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item["Delivered By"]}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item["Comments"]}
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:bg-green-300"
          >
            Previous
          </button>
          <span>
            Page{" "}
            <strong>
              {currentPage} of {totalPages}
            </strong>
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:bg-green-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default DeliveryReport;
