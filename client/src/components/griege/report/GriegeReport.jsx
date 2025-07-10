import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable"; // সরাসরি ইম্পোর্ট, autoTable ফাংশন আলাদাভাবে দরকার নেই

function GriegeReport() {
  const [demand, setDemand] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const reportRef = useRef();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/demand`)
      .then((res) => res.json())
      .then((data) => {
        setDemand(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ফিল্টারড ডাটা (search করে)
  const filteredDemand = demand.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      String(item["Party's Name"]).toLowerCase().includes(searchLower) ||
      String(item["Lot Number"]).toLowerCase().includes(searchLower) ||
      String(item["Design"]).toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredDemand.length / itemsPerPage);
  const displayedDemand = filteredDemand.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // প্রিন্ট ফাংশন (window.print + css দিয়ে কাস্টম)
  const handlePrint = () => {
    window.print();
  };

  // PDF এক্সপোর্ট ফাংশন (jspdf + autotable)
  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Report Griege", 14, 22);

    const tableColumn = [
      "Date",
      "Lot Number",
      "Party's Name",
      "No of Than",
      "Total Griege",
      "Type",
      "Design",
    ];

    const tableRows = [];

    filteredDemand.forEach((item) => {
      const rowData = [
        new Date(item["Date"]).toLocaleDateString("en-GB"),
        String(item["Lot Number"]),
        String(item["Party's Name"]),
        String(item["Than"]),
        String(item["Received Grey"]),
        String(item["Type"]),
        String(item["Design"]),
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [40, 120, 40] },
      theme: "striped",
    });

    doc.save("Report_Griege.pdf");
  };

  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      <h2 className="uppercase py-3 px-4 bg-green-600 text-white rounded-t-lg text-lg font-semibold shadow-md">
        Report Status
      </h2>

      <div className="my-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          type="text"
          placeholder="Search by Party Name, Lot Number or Design..."
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
      <div id="printable-area" ref={reportRef}>
        {/* হেডার */}
        <div className="hidden md:grid grid-cols-8 bg-green-800 text-white text-sm font-medium py-2 px-4 rounded-t-md shadow-inner">
          <div className="col-span-1">Date</div>
          <div className="col-span-1">Lot Number</div>
          <div className="col-span-2">Party's Name</div>
          <div className="col-span-1 text-center">No of Than</div>
          <div className="col-span-1 text-center">Total Griege</div>
          <div className="col-span-1 text-center">Type</div>
          <div className="col-span-1 text-center">Design</div>
        </div>

        {/* লোডিং */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading data...</p>
        ) : displayedDemand.length === 0 ? (
          <p className="text-center py-10 text-gray-500">No data found.</p>
        ) : (
          displayedDemand.map((item, i) => {
            const bgColor = i % 2 === 0 ? "bg-white" : "bg-gray-100";
            return (
              <Link
                key={item["Lot Number"] + i}
                to={`${item["Lot Number"]}`}
                className={`${bgColor} grid grid-cols-1 md:grid-cols-8 text-gray-800 text-sm hover:bg-green-200 hover:text-green-900 transition-colors duration-300 cursor-pointer px-4 py-4 md:py-3 border-b border-gray-200 rounded md:rounded-none md:border-b-0`}
              >
                {/* মোবাইল ভিউ */}
                <div className="md:hidden mb-3 border-b border-gray-300 pb-2">
                  <div>
                    <strong>Date:</strong>{" "}
                    {new Date(item["Date"]).toLocaleDateString("en-GB")}
                  </div>
                  <div>
                    <strong>Lot Number:</strong> {item["Lot Number"]}
                  </div>
                  <div>
                    <strong>Party's Name:</strong> {item["Party's Name"]}
                  </div>
                  <div>
                    <strong>No of Than:</strong> {item["Than"]}
                  </div>
                  <div>
                    <strong>Total Griege:</strong> {item["Received Grey"]}
                  </div>
                  <div>
                    <strong>Type:</strong> {item["Type"]}
                  </div>
                  <div>
                    <strong>Design:</strong> {item["Design"]}
                  </div>
                </div>

                {/* ডেস্কটপ ভিউ */}
                <div className="hidden md:flex items-center col-span-1">
                  {new Date(item["Date"]).toLocaleDateString("en-GB")}
                </div>
                <div className="hidden md:flex items-center col-span-1">
                  {item["Lot Number"]}
                </div>
                <div className="hidden md:flex items-center col-span-2">
                  {item["Party's Name"]}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item["Than"]}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item["Received Grey"]}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item["Type"]}
                </div>
                <div className="hidden md:flex justify-center items-center col-span-1">
                  {item["Design"]}
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

export default GriegeReport;
