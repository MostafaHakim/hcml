import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import Recipies from "../Recipies";
import FormFields from "./FormFields";
import ColorFields from "./ColorFields";
import LotStatusPanel from "./LotStatusPanel";
import useLotStatus from "./useLotStatus";
import useDemandData from "./useDemandData";
import useColorPrice from "./useColorPrice";

const DyesDemandForm = () => {
  const { demandData, verifyDyes, machine, master } = useDemandData();
  const { colorPrice } = useColorPrice();

  const [workOptions, setWorkOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      colors: [{ colorName: "", gram: "", price: "" }],
      memo: "",
      shift: "",
      fabricType: "",
      machine: "",
      workType: "",
      qty: "",
      unit: "",
      mainColor: "",
      party: "",
      master: "",
      lot: "",
      status: "pending",
      weight: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "colors",
  });

  const watchValues = watch();
  const lotStatus = useLotStatus(watchValues.lot, demandData, verifyDyes);

  const stockUpdate = async () => {
    setMessage("Submitting...");
    try {
      const res = await fetch("https://hcml-ry8s.vercel.app/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colors: watchValues.colors }),
      });
      const result = await res.json();
      if (result.status === "success") {
        setMessage("✅ স্টক থেকে কমে গেছে এবং অন হোল্ড এ গেছে!");
      } else {
        setMessage("❌ সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      }
    } catch (err) {
      setMessage("❌ কানেকশনের সমস্যা হয়েছে।");
    } finally {
      {
        setTimeout(() => setMessage(""), 4000);
      }
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");

    const totalCost = data.colors.reduce((sum, item) => {
      return sum + parseFloat(item.gram || 0) * parseFloat(item.price || 0);
    }, 0);
    const countGoj = parseFloat(data.qty) - (parseFloat(data.qty) * 10) / 100;
    const costPerGaj = totalCost / countGoj;

    const payload = {
      ...data,
      totalBatchCost: totalCost.toFixed(2),
      costPerGaj: costPerGaj.toFixed(2),
    };

    await stockUpdate();

    try {
      const res = await fetch("https://hcml-ry8s.vercel.app/demand", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      setResponse(result.status || "✅ Submitted successfully");
      reset();
    } catch (err) {
      setResponse("❌ Submission failed");
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setResponse(""), 4000);
    }
  };

  return (
    <div className="w-full p-4 grid md:grid-cols-11 gap-4">
      {/* Left: Recipies */}
      <div className="col-span-1 md:col-span-3">
        {watchValues.mainColor && watchValues.weight && (
          <Recipies
            searchColor={watchValues.mainColor}
            weight={watchValues.weight}
          />
        )}
      </div>

      {/* Center: Form */}
      <div className="relative w-full col-span-1 md:col-span-5 mx-auto p-4 text-black bg-white rounded-lg shadow-md">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 z-20 flex items-center justify-center rounded-lg">
            <div className="text-lg flex items-center gap-2 text-blue-700">
              <svg
                className="animate-spin h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Submitting...
            </div>
          </div>
        )}

        <h1 className="text-xl font-bold mb-4 text-center">Dyes Demand Form</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormFields
            register={register}
            errors={errors}
            setValue={setValue}
            watchValues={watchValues}
            workOptions={workOptions}
            setWorkOptions={setWorkOptions}
            demandData={demandData}
            machine={machine}
            master={master} // ✅ Add this line
          />

          <ColorFields
            fields={fields}
            append={append}
            remove={remove}
            register={register}
            watchColors={watchValues.colors}
            colorPrice={colorPrice}
            setValue={setValue}
          />

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white text-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

          {response && (
            <div
              className={`mt-4 p-3 rounded-md text-center font-medium ${
                response.startsWith("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {response}
            </div>
          )}

          {message && (
            <div className="text-center text-sm mt-2 text-gray-600">
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Right: Lot Status */}
      <LotStatusPanel lotStatus={lotStatus} watchValues={watchValues} />
    </div>
  );
};

export default DyesDemandForm;
