import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Allparty() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/party/partydetails`)
      .then((res) => res.json())
      .then((data) => {
        const withoutHeader = data.slice(1); // First row is header
        setData(withoutHeader);
      });
  }, []);

  return (
    <div className="p-6 w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">All Parties</h2>

      <div className="flex flex-col">
        <div className="border px-4 py-2 shadow-sm bg-blue-800 text-white transition grid grid-cols-6 text-left">
          <h3 className="text-lg font-semibold col-span-2">Party's Name</h3>
          <p className="text-lg font-semibold  col-span-3">📍 Address</p>
          <p className="text-lg font-semibold  col-span-1">📞 Mobile No</p>
        </div>
        {data.map((party, index) => (
          <div
            key={index}
            onClick={() => navigate(`/admin/dashboard/party/${party[2]}`)} // party[2] is ID
            className="border  px-4 py-2 shadow-sm bg-white cursor-pointer hover:bg-blue-100 transition grid grid-cols-6 text-left"
          >
            <h3 className="text-lg font-semibold text-gray-800 col-span-2">
              {party[0]}
            </h3>
            <p className="text-gray-600 text-sm col-span-3">📍 {party[1]}</p>
            <p className="text-gray-600 text-sm col-span-1">📞 {party[2]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Allparty;
