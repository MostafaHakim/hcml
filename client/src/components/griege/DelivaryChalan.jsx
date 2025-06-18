import React from "react";

const challanData = [
  {
    date: "2025-06-18",
    chalanNo: "DC-2501",
    lotNumber: "L-1023",
    partyName: "ABC Fabrics",
    type: "Cotton",
    design: "Floral",
    griege: "1200",
    finishing: "1150",
    color: "Sky Blue",
    status: "Delivered",
    deliveredBy: "Hasan",
    comments: "Handled with care",
  },
  // আরও এন্ট্রি এখানে যোগ করতে পারো...
];

const DelivaryChalan = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Harun Composite Mills Limited.
          </h1>
          <p className="text-sm text-gray-600">
            Golakandail, Narayanganj, Dhaka, Bangladesh <br />
            Phone: +8801700001
          </p>
        </div>
        <img src="/logo.png" alt="HCML" className="h-20 w-20 object-contain" />
      </div>
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start space-x-1">
          <label>Delivary Date</label>
          <span>12/15/25</span>
        </div>
        <div className="flex flex-row items-center justify-start space-x-1">
          <label>Chalan No</label>
          <span>DC-250628100228</span>
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
              <th className="border px-2 py-1">Total Griege</th>
              <th className="border px-2 py-1">Finishing Griege</th>
              <th className="border px-2 py-1">Comments</th>
            </tr>
          </thead>
          <tbody>
            {challanData.map((item, idx) => (
              <tr key={idx} className="text-center">
                <td className="border px-2 py-1">{item.date}</td>
                <td className="border px-2 py-1">{item.lotNumber}</td>
                <td className="border px-2 py-1">{item.partyName}</td>
                <td className="border px-2 py-1">{item.type}</td>
                <td className="border px-2 py-1">{item.design}</td>
                <td className="border px-2 py-1">{item.griege}</td>
                <td className="border px-2 py-1">{item.finishing}</td>
                <td className="border px-2 py-1">{item.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-8 text-right">
        <p className="text-sm text-gray-600">Authorized Signature</p>
        <div className="h-10 border-b w-40 float-right mt-1"></div>
      </div>
    </div>
  );
};

export default DelivaryChalan;
