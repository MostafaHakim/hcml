import React, { useEffect, useState } from "react";
import PackingListView from "../griege/PackingListView";
import LotThanSelector from "../griege/LotThanSelector";

const API_BASE = "https://hcml-ry8s.vercel.app"; // সংজ্ঞায়িত করুন

function Delivery() {
  const [party, setParty] = useState("");
  const [parties, setParties] = useState([]);
  const [lots, setLots] = useState([]);
  const [selectedThans, setSelectedThans] = useState([]);

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/demand")
      .then((res) => res.json())
      .then((data) => {
        const partyNames = data.map((item) => item["Party's Name"]);
        setParties(partyNames);
      });
  }, []);
  const handlePartyChange = async (e) => {
    const selectedParty = e.target.value;
    console.log("Selected Party:", selectedParty);
    setParty(selectedParty);
    setLots([]);
    setSelectedThans([]);

    if (!selectedParty) return;

    try {
      const res = await fetch(
        `${API_BASE}/griegein/getLotsByParty?party=${selectedParty}`
      );
      const data = await res.json();
      console.log("Fetched Lots:", data);
      if (data.lots) setLots(data.lots);
    } catch (err) {
      console.error("Failed to fetch lots:", err);
    }
  };

  const handleThanSelection = (lotNo, thanData) => {
    setSelectedThans((prev) => {
      // ডুপ্লিকেট চেক করুন
      const exists = prev.some(
        (item) => item.lotNo === lotNo && item.thanNo === thanData.thanNo
      );
      return exists ? prev : [...prev, { lotNo, ...thanData }];
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Packing List Generator</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-1">Select Party:</label>
        <select
          className="border p-2 rounded w-full"
          value={party}
          onChange={handlePartyChange}
        >
          <option value="">-- Select Party --</option>
          {parties.map((p, i) => (
            <option key={i} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {lots.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lots.map((lot) => (
            <LotThanSelector
              key={lot.lotNo}
              lot={lot}
              onThanSelect={handleThanSelection}
              apiBase={API_BASE}
            />
          ))}
        </div>
      )}

      {selectedThans.length > 0 && (
        <div className="mt-6">
          <PackingListView selectedThans={selectedThans} />
        </div>
      )}
    </div>
  );
}

export default Delivery;
