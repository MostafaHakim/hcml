import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

function Allparty() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/party/partydetails`)
      .then((res) => res.json())
      .then((data) => {
        const withoutHeader = data.slice(1); // First row is header
        setData(withoutHeader);
      });
  }, []);

  // Filter data based on filterText - check party name or mobile no
  const filteredData = data.filter((party) => {
    const name = String(party[0] || "").toLowerCase();
    const mobile = String(party[2] || "").toLowerCase();
    return (
      name.includes(filterText.toLowerCase()) ||
      mobile.includes(filterText.toLowerCase())
    );
  });

  return (
    <div className="p-6 w-full mx-auto ">
      <h2 className="text-2xl font-bold mb-6 text-center">All Parties</h2>

      {/* Filter input */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by Party Name or Mobile No"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border rounded px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col">
        <div className="border px-4 py-2 shadow-sm bg-blue-800 text-white transition grid grid-cols-6 text-left">
          <h3 className="text-lg font-semibold col-span-2">Party's Name</h3>
          <p className="text-lg font-semibold col-span-3 flex items-center gap-1">
            <FaMapMarkerAlt /> Address
          </p>
          <p className="text-lg font-semibold col-span-1 flex items-center gap-1">
            <FaPhoneAlt /> Mobile No
          </p>
        </div>
        {filteredData.length === 0 ? (
          <p className="text-center py-6 text-gray-500 col-span-6">
            No parties found.
          </p>
        ) : (
          filteredData.map((party, index) => (
            <div
              key={index}
              onClick={() => navigate(`/admin/dashboard/party/${party[2]}`)} // party[2] is ID
              className="border px-4 py-2 shadow-sm bg-white cursor-pointer hover:bg-blue-100 transition grid grid-cols-6 text-left"
            >
              <h3 className="text-lg font-semibold text-gray-800 col-span-2">
                {party[0]}
              </h3>
              <p className="text-gray-600 text-sm col-span-3 flex items-center gap-1">
                <FaMapMarkerAlt className="text-blue-500" /> {party[1]}
              </p>
              <p className="text-gray-600 text-sm col-span-1 flex items-center gap-1">
                <FaPhoneAlt className="text-green-600" /> {party[2]}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Allparty;
