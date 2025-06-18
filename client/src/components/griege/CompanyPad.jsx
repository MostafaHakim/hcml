import React from "react";

function CompanyPad({ needUseFor }) {
  return (
    <div>
      <div className="flex flex-col items-center justify-center border-b pb-4 mb-6 space-y-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Harun Composite Mills Limited.
          </h1>
          <p className="text-sm text-gray-600">
            Golakandail, Narayanganj, Dhaka, Bangladesh <br />
            Phone: +8801700001
          </p>
        </div>
        <h2 className="px-6 py-2 rounded-lg ring-2 ring-gray-200 ring-inset">
          {needUseFor}
        </h2>
      </div>
    </div>
  );
}

export default CompanyPad;
