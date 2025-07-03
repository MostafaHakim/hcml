import { useEffect, useState } from "react";

export default function LotEntryForm() {
  const [partyListOptions, setPartyListOptions] = useState([]);
  const [allData, setAllData] = useState([]);
  const [masterList, setMasterList] = useState([]);
  const [thans, setThans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false); // ✅ added
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [form, setForm] = useState({
    lotNo: "",
    date: "",
    party: "",
    fabric: "",
    quality: "",
    unit: "",
    action: [],
    tempThanGaj: "",
    master: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [lotRes, partyAllRes, partyRes, masterRes] = await Promise.all([
          fetch(`${BASE_URL}/griegein`),
          fetch(`${BASE_URL}/party/alldata`),
          fetch(`${BASE_URL}/party`),
          fetch(`${BASE_URL}/user/master`),
        ]);

        const lotData = await lotRes.json();
        const partyAllData = await partyAllRes.json();
        const partyList = await partyRes.json();
        const masterRaw = await masterRes.json();

        const nextLot = parseInt(lotData) + 1;
        setForm((prev) => ({ ...prev, lotNo: nextLot.toString() }));
        setAllData(partyAllData);
        setPartyListOptions(partyList);

        const masterRows = masterRaw.slice(1);
        const names = masterRows.map((row) => row[0]);
        setMasterList(names);
      } catch (err) {
        console.error("Loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm((prev) => ({ ...prev, action: [...prev.action, value] }));
    } else {
      setForm((prev) => ({
        ...prev,
        action: prev.action.filter((item) => item !== value),
      }));
    }
  };

  const handleAddThan = () => {
    if (!form.tempThanGaj) return;
    setThans([...thans, form.tempThanGaj]);
    setForm({ ...form, tempThanGaj: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true); // ✅ Start loading

    const totalGaj = thans.reduce((sum, val) => sum + parseFloat(val || 0), 0);

    const lotPayload = {
      lotNo: form.lotNo,
      date: form.date,
      party: form.party,
      fabric: form.fabric,
      quality: form.quality,
      unit: form.unit,
      master: form.master,
      than: thans.length.toString(),
      totalGaj: totalGaj.toString(),
      action: form.action.join(", "),
    };

    const thanDetails = thans.map((gaj) => ({
      lotNo: form.lotNo,
      gaj,
    }));

    const fullPayload = {
      ...lotPayload,
      thanDetails,
    };

    try {
      const response = await fetch(`${BASE_URL}/griegein`, {
        method: "POST",
        body: JSON.stringify(fullPayload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (result.result === "success") {
        alert("Data saved successfully!");

        const res = await fetch(`${BASE_URL}/griegein`);
        const data = await res.json();
        const nextLot = parseInt(data) + 1;

        setForm({
          lotNo: nextLot.toString(),
          date: "",
          party: "",
          fabric: "",
          quality: "",
          unit: "",
          action: [],
          tempThanGaj: "",
          master: "",
        });
        setThans([]);
      } else {
        alert("Failed to save data!");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setSubmitLoading(false); // ✅ End loading
    }
  };

  const rows = allData.slice(1);
  const processOptions = Array.from(
    new Set(
      rows.map((row) => row[2]).filter((item) => item && item.trim() !== "")
    )
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600 animate-pulse">
        Loading form data...
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded space-y-4 text-black"
    >
      <h2 className="text-xl font-bold mb-4">Lot Entry Form</h2>

      <input
        name="lotNo"
        value={form.lotNo}
        onChange={handleChange}
        placeholder="Lot Number"
        className="border p-2 w-full"
        readOnly
        required
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="party"
        list="partyNameListOptions"
        value={form.party}
        onChange={handleChange}
        placeholder="Party Name"
        className="border p-2 w-full"
        required
      />
      <datalist id="partyNameListOptions">
        {[...new Set(partyListOptions)].sort().map((item) => (
          <option key={item} value={item} />
        ))}
      </datalist>

      <input
        name="fabric"
        value={form.fabric}
        onChange={handleChange}
        placeholder="Fabric Type"
        className="border p-2 w-full"
        required
      />
      <input
        name="quality"
        value={form.quality}
        onChange={handleChange}
        placeholder="Fabric Quality"
        className="border p-2 w-full"
        required
      />
      <input
        type="text"
        name="master"
        list="masterNameListOptions"
        value={form.master}
        onChange={handleChange}
        placeholder="Master Name"
        className="border p-2 w-full"
        required
      />
      <datalist id="masterNameListOptions">
        {masterList.map((name, index) => (
          <option key={index} value={name} />
        ))}
      </datalist>

      <div>
        <label className="block font-semibold mb-1">Thans (Per Gaj)</label>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            name="tempThanGaj"
            value={form.tempThanGaj}
            onChange={handleChange}
            placeholder="Enter gaj"
            className="border p-2 flex-1"
          />
          <button
            type="button"
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleAddThan}
          >
            Add
          </button>
        </div>
        {thans.length > 0 && (
          <ul className="list-inside bg-gray-50 p-2 rounded list-none grid grid-cols-10">
            {thans.map((gaj, idx) => (
              <li
                key={idx}
                className="p-1 border-[1px] text-center border-gray-400"
              >{`${gaj} +`}</li>
            ))}
            <h2 className="p-1 col-span-2 font-bold text-right">{`= ${thans.reduce(
              (sum, val) => sum + parseFloat(val || 0),
              0
            )}`}</h2>
          </ul>
        )}
      </div>

      <input
        name="unit"
        value={form.unit}
        onChange={handleChange}
        placeholder="Unit (e.g., Yards)"
        className="border p-2 w-full"
        required
      />

      <div>
        <label className="block font-semibold mb-1">কার্যাবলী (Actions)</label>
        <div className="grid grid-cols-4 gap-4">
          {processOptions.map((option) => (
            <label key={option} className="flex flex-row space-x-1">
              <input
                className="w-4"
                type="checkbox"
                value={option}
                checked={form.action.includes(option)}
                onChange={handleCheckboxChange}
              />
              <span className="text-sm font-normal">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        disabled={submitLoading}
      >
        {submitLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Submitting...
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
