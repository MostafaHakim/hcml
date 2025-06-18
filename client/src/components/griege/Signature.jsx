import React from "react";

function Signature() {
  return (
    <div className="w-full mx-auto mt-12 p-2 bg-white rounded-lg shadow-xl font-inter">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Created By Section */}
        <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-full border-b border-dashed border-gray-400 pb-4 mb-4">
            {/* এখানে সিগনেচারের জন্য স্থান */}
            <p className="text-center text-gray-500 text-sm italic pt-8">
              (Signature)
            </p>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Created by</h2>
          <p className="text-sm text-gray-500">___________</p>{" "}
          {/* Example placeholder for name */}
        </div>

        {/* Checked By Section */}
        <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-full border-b border-dashed border-gray-400 pb-4 mb-4">
            <p className="text-center text-gray-500 text-sm italic pt-8">
              (Signature)
            </p>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Checked By</h2>
          <p className="text-sm text-gray-500">___________</p>
        </div>

        {/* Delivered By Section */}
        <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-full border-b border-dashed border-gray-400 pb-4 mb-4">
            <p className="text-center text-gray-500 text-sm italic pt-8">
              (Signature)
            </p>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Delivered By</h2>
          <p className="text-sm text-gray-500">___________</p>
        </div>

        {/* Received By Section */}
        <div className="flex flex-col items-center p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="w-full border-b border-dashed border-gray-400 pb-4 mb-4">
            <p className="text-center text-gray-500 text-sm italic pt-8">
              (Signature)
            </p>
          </div>
          <h2 className="text-lg font-semibold text-gray-700">Received By</h2>
          <p className="text-sm text-gray-500">___________</p>
        </div>
      </div>
    </div>
  );
}

export default Signature;
