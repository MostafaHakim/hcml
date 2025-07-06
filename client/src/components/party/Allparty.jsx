import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

function Allparty() {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(true); // ✅ Added loading state
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    setLoading(true); // ✅ Start loading
    fetch(`${BASE_URL}/party/partydetails`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const withoutHeader = data.slice(1); // Remove header row
          setData(withoutHeader);
        } else {
          console.error("Fetched data is not an array:", data);
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching party details:", error);
        setData([]);
      })
      .finally(() => {
        setLoading(false); // ✅ Done loading
      });
  }, []);

  const filteredData = data.filter((party) => {
    const name = String(party[0] || "").toLowerCase();
    const mobile = String(party[2] || "").toLowerCase();
    return (
      name.includes(filterText.toLowerCase()) ||
      mobile.includes(filterText.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        🧾 All Parties
      </h2>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by Party Name or Mobile No"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border border-gray-300 rounded-lg px-5 py-3 w-full max-w-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Header */}
      <div className="hidden md:grid grid-cols-6 bg-blue-700 text-white px-5 py-3 rounded-t-lg shadow-md">
        <div className="font-semibold col-span-2">Party's Name</div>
        <div className="font-semibold col-span-3 flex items-center gap-2">
          <FaMapMarkerAlt className="text-white" /> Address
        </div>
        <div className="font-semibold col-span-1 flex items-center gap-2">
          <FaPhoneAlt className="text-white" /> Mobile No
        </div>
      </div>

      {/* Party List */}
      <div className="flex flex-col gap-2 mt-2">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Loading parties...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No parties found.</p>
        ) : (
          filteredData.map((party, index) => (
            <div
              key={index}
              onClick={() => navigate(`/admin/dashboard/party/${party[2]}`)}
              className="grid grid-cols-1 md:grid-cols-6 gap-y-2 md:gap-0 items-center bg-white hover:bg-blue-50 cursor-pointer border px-5 py-4 rounded-lg shadow-sm transition"
            >
              <div className="font-semibold text-gray-800 md:col-span-2">
                {party[0]}
              </div>
              <div className="text-gray-600 text-sm md:col-span-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" /> {party[1]}
              </div>
              <div className="text-gray-600 text-sm md:col-span-1 flex items-center gap-2">
                <FaPhoneAlt className="text-green-600" /> {party[2]}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Allparty;
