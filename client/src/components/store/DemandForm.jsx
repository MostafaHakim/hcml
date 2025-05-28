import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const DyesDemandForm = () => {
  const [colorPrice, setColorPrice] = useState({});

  useEffect(() => {
    const getColorData = async () => {
      try {
        const res = await fetch("https://hcml-ry8s.vercel.app/colorprice");
        const data = await res.json();
        setColorPrice(data);
      } catch (error) {
        console.error("Failed to fetch colors:", error);
      }
    };
    getColorData();
  }, [colorPrice]);

  const { register, handleSubmit, control, reset, watch, setValue } = useForm({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      colors: [{ id: uuidv4(), colorName: "", gram: "", price: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "colors",
  });

  const watchColors = watch("colors");

  // Color select এর সাথে সাথে price আপডেটের জন্য useEffect
  useEffect(() => {
    watchColors.forEach((item, index) => {
      if (item?.colorName && colorPrice[item.colorName]) {
        setValue(`colors.${index}.price`, colorPrice[item.colorName]);
      } else {
        setValue(`colors.${index}.price`, "");
      }
    });
  }, [watchColors, colorPrice, setValue]);

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const onSubmit = (data) => {
    setLoading(true);

    const totalCost = data.colors.reduce((sum, item) => {
      return sum + parseFloat(item.gram || 0) * parseFloat(item.price || 0);
    }, 0);

    const costPerGaj = totalCost / parseFloat(data.qty || 1);

    const payload = {
      ...data,
      totalBatchCost: totalCost.toFixed(2),
      costPerGaj: costPerGaj.toFixed(2),
    };

    fetch("https://hcml-ry8s.vercel.app/demand", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((result) => {
        setLoading(false);
        setResponse(result.status || "Submitted successfully");
        reset();
        setTimeout(() => {
          setResponse("");
        }, 3000);
      })
      .catch((err) => {
        setLoading(false);
        setResponse("Submission failed");
        console.error(err);
      });
  };

  return (
    <div className="w-full p-4 grid md:grid-cols-11">
      <div className=" col-span-1 md:col-span-3"></div>
      <div className="w-full col-span-1 md:col-span-5 mx-auto p-4 text-black relative bg-white  rounded-lg shadow-md">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-40 flex items-center justify-center z-10">
            <span className="text-blue-800 text-4xl font-sans">
              Loading....
            </span>
          </div>
        )}

        <h1 className="text-xl font-bold mb-4">Dyes Demand Form</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Batch Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" {...register("date")} className="input" />
            <input
              placeholder="Memo No"
              {...register("memo")}
              className="input"
            />
            <input
              placeholder="Shift"
              {...register("shift")}
              className="input"
            />
            <input
              placeholder="Fabric Type"
              {...register("fabricType")}
              className="input"
            />
            <input
              placeholder="Machine No"
              {...register("machine")}
              className="input"
            />
            <input
              placeholder="Work Type"
              {...register("workType")}
              className="input"
            />
            <input
              placeholder="Qty (Gaj)"
              type="number"
              {...register("qty")}
              className="input"
            />
            <input
              placeholder="Unit (Gaj/Pound)"
              {...register("unit")}
              className="input"
            />
            <input
              placeholder="Main Color"
              {...register("mainColor")}
              className="input"
            />
            <input
              placeholder="Party Name"
              {...register("party")}
              className="input"
            />
            <input
              placeholder="Master Name"
              {...register("master")}
              className="input"
            />
            <input
              placeholder="Lot Number"
              {...register("lot")}
              className="input"
            />
          </div>

          {/* Colors Table */}
          <div className="border p-4 rounded-md">
            <h2 className="font-semibold mb-2">Colors</h2>
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2"
              >
                <select
                  {...register(`colors.${index}.colorName`)}
                  className="input"
                >
                  <option value="">Select Color</option>
                  {Object.keys(colorPrice).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                <input
                  placeholder="Gram"
                  type="number"
                  {...register(`colors.${index}.gram`)}
                  className="input"
                />

                <input
                  placeholder="Price per gram"
                  type="number"
                  {...register(`colors.${index}.price`)}
                  className="input"
                  readOnly
                />

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  X
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({ id: uuidv4(), colorName: "", gram: "", price: "" })
              }
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              + Add Color
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-1 rounded"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {response && <p className="mt-4 font-semibold">Status: {response}</p>}
      </div>
      <div className="col-span-1 md:col-span-3"></div>
    </div>
  );
};

export default DyesDemandForm;
