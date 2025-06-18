import React from "react";

function Signature() {
  return (
    <div className="w-full mx-auto mt-12 p-2 bg-white rounded-lg shadow-xl font-inter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Created By Section */}
        <div className="flex flex-col items-center p-4 border-t border-gray-300 rounded-lg  ">
          <h2 className="text-lg font-semibold text-gray-700">Created by</h2>
          {/* Example placeholder for name */}
        </div>

        {/* Checked By Section */}
        <div className="flex flex-col items-center p-4 border-t border-gray-300 rounded-lg  ">
          <h2 className="text-lg font-semibold text-gray-700">Checked By</h2>
        </div>

        {/* Delivered By Section */}
        <div className="flex flex-col items-center p-4 border-t border-gray-300 rounded-lg  ">
          <h2 className="text-lg font-semibold text-gray-700">Delivered By</h2>
        </div>

        {/* Received By Section */}
        <div className="flex flex-col items-center p-4 border-t border-gray-300 rounded-lg  ">
          <h2 className="text-lg font-semibold text-gray-700">Received By</h2>
        </div>
      </div>
    </div>
  );
}

export default Signature;
