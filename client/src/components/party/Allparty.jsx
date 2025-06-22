import React, { useEffect, useState } from "react";

function Allparty() {
  const [data, setData] = useState(data);
  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/party/partydetails`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);
  console.log(data);
  return (
    <div>
      <h2>All PArty</h2>
    </div>
  );
}

export default Allparty;
