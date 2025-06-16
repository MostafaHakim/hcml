import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Lot() {
  const [demand, setDemand] = useState([]);
  const { lotnumber } = useParams();

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand`)
      .then((res) => res.json())
      .then((data) => {
        setDemand(data);
      });
  }, []);

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-2">
        <div>
          {demand.map((item) => {
            if (item["Lot Number"] == lotnumber) {
              return (
                <div className="flex flex-col items-start justify-start space-y-1  p-4 bg-white bg-opacity-50 ring-2 ring-gray-600 uppercase">
                  <div className="text-2xl">
                    Lot Number: {item["Lot Number"]}
                  </div>
                  <div>Party's Name{item["Party's Name"]}</div>
                  <div className="col-span-1">Type: {item["Type"]}</div>
                  <div className="col-span-1">Design: {item["Design"]}</div>
                  <div className="col-span-1">Total Than: {item["Than"]}</div>
                  <div className="col-span-1">
                    Total Griege: {item["Received Grey"]}
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Lot;
