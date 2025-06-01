import { useEffect, useState, useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const DyesDemandForm = () => {
  const [colorPrice, setColorPrice] = useState({});
  const [demandData, setDemandData] = useState([]);
  const [verifyDyes, setVerifyDyes] = useState([]);

  useEffect(() => {
    const getDemandData = async () => {
      try {
        const res = await fetch("https://hcml-ry8s.vercel.app/demand");
        const data = await res.json();
        setDemandData(data);
      } catch (error) {
        console.error("Failed to fetch demand data:", error);
      }
    };
    getDemandData();
  }, []);

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
      colors: [{ id: uuidv4(), colorName: "", gram: "", price: "" }],
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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "colors",
  });

  const watchColors = watch("colors");
  const watchLot = watch("lot");
  const watchQty = watch("qty");
  const watchWorkType = watch("workType");

  useEffect(() => {
    fetch("https://hcml-ry8s.vercel.app/demand/verifydyes")
      .then((res) => res.json())
      .then((data) => {
        setVerifyDyes(data);
      });
  }, []);

  useEffect(() => {
    watchColors.forEach((item, index) => {
      if (item?.colorName && colorPrice[item.colorName]) {
        setValue(`colors.${index}.price`, colorPrice[item.colorName]);
      } else {
        setValue(`colors.${index}.price`, "");
      }
    });
  }, [watchColors, colorPrice, setValue]);

  useEffect(() => {
    if (watchLot && demandData.length > 0) {
      const foundLot = demandData.find(
        (item) => String(item["Lot Number"]) === watchLot
      );

      if (foundLot) {
        setValue("party", foundLot["Party's Name"] || "");
        setValue("fabricType", foundLot["Type"] || "");

        if (foundLot["Work "]) {
          const workTypes = foundLot["Work "].split(",").map((w) => w.trim());
          setWorkOptions(workTypes);

          if (workTypes.length > 0) {
            setValue("workType", workTypes[0]);
          }
        }
      } else {
        setValue("party", "");
        setValue("fabricType", "");
        setWorkOptions([]);
        setValue("workType", "");
      }
    }
  }, [watchLot, demandData, setValue]);

  const [workOptions, setWorkOptions] = useState([]);
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

  const lotStatus = useMemo(() => {
    const status = {
      initialQty: 0, // Received Grey quantity
      Dyeing: 0,
      Printing: 0,
      Finishing: 0,
    };

    if (!watchLot || verifyDyes.length === 0 || demandData.length === 0)
      return status;

    // Calculate total Received Grey for the lot
    const foundDemands = demandData.filter(
      (item) => String(item["Lot Number"]) === String(watchLot)
    );

    if (foundDemands.length > 0) {
      status.initialQty = foundDemands.reduce((sum, item) => {
        const receivedGrey =
          typeof item["Received Grey"] === "number"
            ? item["Received Grey"]
            : parseFloat(item["Received Grey"]) || 0;
        return sum + receivedGrey;
      }, 0);
    }

    // Calculate demand from verifyDyes
    const header = verifyDyes[0];
    const workTypeIndex = header.indexOf("Work Type");
    const qtyIndex = header.indexOf("Qty");
    const lotIndex = header.indexOf("Lot No");

    verifyDyes.slice(1).forEach((row) => {
      if (String(row[lotIndex]) === String(watchLot)) {
        const workType = row[workTypeIndex];
        const quantity = parseFloat(row[qtyIndex]) || 0;

        if (workType === "Dyeing") status.Dyeing += quantity;
        else if (workType === "Printing") status.Printing += quantity;
        else if (workType === "Finishing") status.Finishing += quantity;
      }
    });

    return status;
  }, [watchLot, demandData, verifyDyes]);

  // Calculate remaining quantities
  const remainingQuantities = useMemo(() => {
    return {
      Dyeing: lotStatus.initialQty - lotStatus.Dyeing,
      Printing: lotStatus.initialQty - lotStatus.Printing,
      Finishing: lotStatus.initialQty - lotStatus.Finishing,
    };
  }, [lotStatus]);

  // Check if current demand exceeds remaining quantity
  const validateDemandQty = (value) => {
    if (!watchWorkType || !value) return true;

    const qty = parseFloat(value);
    if (isNaN(qty)) return "Invalid quantity";

    const remaining = remainingQuantities[watchWorkType];
    if (remaining !== undefined && qty > remaining) {
      return `Demand exceeds remaining ${watchWorkType} quantity (Max: ${remaining.toFixed(
        2
      )})`;
    }

    return true;
  };

  // const getWarningMessage = useCallback(() => {
  //   const messages = [];

  //   if (
  //     watchWorkType === "Dyeing" &&
  //     lotStatus.Dyeing + parseInt(watchQty) > lotStatus.initialQty
  //   ) {
  //     messages.push(
  //       `এই লটে গ্রে ডাইং বাকি আছে ${
  //         lotStatus.initialQty - lotStatus.Dyeing
  //       } গজ এখন পর্যন্ত ডাইং হয়েছে  ${lotStatus.Dyeing.toFixed(2)} গজ`
  //     );
  //   }

  //   if (
  //     watchWorkType === "Printing" &&
  //     lotStatus.Printing + parseInt(watchQty) > lotStatus.initialQty
  //   ) {
  //     messages.push(
  //       `Printing demand exceeded! (${lotStatus.Printing.toFixed(
  //         2
  //       )} > ${lotStatus.initialQty.toFixed(2)})`
  //     );
  //   }

  //   if (
  //     watchWorkType === "Finishing" &&
  //     lotStatus.Finishing + parseInt(watchQty) > lotStatus.initialQty
  //   ) {
  //     messages.push(
  //       `Finishing demand exceeded! (${lotStatus.Finishing.toFixed(
  //         2
  //       )} > ${lotStatus.initialQty.toFixed(2)})`
  //     );
  //   }

  //   return messages.join("\n");
  // }, [lotStatus, watchQty]);

  const getWarningMessage = useCallback(() => {
    const messages = [];
    const qty = parseInt(watchQty);

    switch (watchWorkType) {
      case "Dyeing":
        if (lotStatus.Dyeing + qty > lotStatus.initialQty) {
          messages.push(
            `এই লটে গ্রে ডাইং বাকি আছে ${
              lotStatus.initialQty - lotStatus.Dyeing
            } গজ। এখন পর্যন্ত ডাইং হয়েছে ${lotStatus.Dyeing.toFixed(2)} গজ`
          );
        } else {
          messages.push(
            `এই লটে গ্রে ডাইং বাকি আছে ${
              lotStatus.initialQty - lotStatus.Dyeing
            }`
          );
        }
        break;

      case "Printing":
        if (lotStatus.Printing + qty > lotStatus.initialQty) {
          messages.push(
            `এই লটে গ্রে প্রিন্টিং বাকি আছে ${
              lotStatus.initialQty - lotStatus.Printing
            } গজ। এখন পর্যন্ত প্রিন্টিং হয়েছে ${lotStatus.Printing.toFixed(
              2
            )} গজ`
          );
        } else {
          messages.push(
            `এই লটে গ্রে প্রিন্টিং বাকি আছে ${
              lotStatus.initialQty - lotStatus.Printing
            }`
          );
        }
        break;

      case "Finishing":
        if (lotStatus.Finishing + qty > lotStatus.initialQty) {
          messages.push(
            `এই লটে গ্রে ফিনিশিং বাকি আছে ${
              lotStatus.initialQty - lotStatus.Finishing
            } গজ। এখন পর্যন্ত ফিনিশিং হয়েছে ${lotStatus.Finishing.toFixed(
              2
            )} গজ`
          );
        } else {
          messages.push(
            `এই লটে গ্রে ফিনিশিং বাকি আছে ${
              lotStatus.initialQty - lotStatus.Finishing
            }`
          );
        }
        break;

      default:
        break;
    }

    return messages.join("\n");
  }, [lotStatus, watchQty, watchWorkType]);

  return (
    <div className="w-full p-4 grid md:grid-cols-11 gap-4">
      <div className="col-span-1 md:col-span-3"></div>
      <div className="w-full col-span-1 md:col-span-5 mx-auto p-4 text-black relative bg-white rounded-lg shadow-md">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-40 flex items-center justify-center z-10">
            <span className="text-blue-800 text-4xl font-sans">
              Loading....
            </span>
          </div>
        )}

        <h1 className="text-xl font-bold mb-4">Dyes Demand Form</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="date" {...register("date")} className="input" />
            <input
              placeholder="Memo No"
              {...register("memo")}
              className="input"
            />
            <input
              placeholder="Lot Number"
              {...register("lot")}
              className="input"
            />
            <input
              placeholder="Party Name"
              {...register("party")}
              className="input"
              readOnly
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
              readOnly
            />
            <input
              placeholder="Machine No"
              {...register("machine")}
              className="input"
            />

            <select {...register("workType")} className="input">
              {workOptions.length > 0 ? (
                workOptions.map((work, index) => (
                  <option key={index} value={work}>
                    {work}
                  </option>
                ))
              ) : (
                <option value="">Select Work Type</option>
              )}
            </select>

            <div>
              <input
                placeholder="Qty (Gaj)"
                type="number"
                {...register("qty", {
                  required: "Quantity is required",
                  validate: validateDemandQty,
                })}
                className="input"
              />
              {errors.qty && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.qty.message}
                </p>
              )}
            </div>

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
              placeholder="Master Name"
              {...register("master")}
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
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {response && <p className="mt-4 font-semibold">Status: {response}</p>}
      </div>

      {/* Lot Status Panel */}
      <div className="col-span-1 md:col-span-3 p-4 bg-white text-black rounded-lg">
        <div className="w-full flex flex-col items-center justify-center space-y-4">
          <h2 className="text-2xl font-serif px-8 py-2 bg-pink-800 rounded-full text-white">
            Lot Status
          </h2>
          <div className="w-full">
            <div className="font-bold mb-2 p-2 bg-gray-200 rounded">
              Lot Number: {watchLot || "N/A"}
            </div>

            <div className="flex justify-between w-full p-2 border-b">
              <span className="font-semibold">Received Grey:</span>
              <span className="font-bold">
                {lotStatus.initialQty.toFixed(2)} Goj
              </span>
            </div>

            <ul className="flex flex-col items-start justify-center p-4 text-xl space-y-3 uppercase">
              <li className="flex justify-between w-full">
                <span>Dyeing:</span>
                <span className="font-bold">
                  {lotStatus.Dyeing.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    (Remaining: {remainingQuantities.Dyeing.toFixed(2)})
                  </span>
                </span>
              </li>
              <li className="flex justify-between w-full">
                <span>Printing:</span>
                <span className="font-bold">
                  {lotStatus.Printing.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    (Remaining: {remainingQuantities.Printing.toFixed(2)})
                  </span>
                </span>
              </li>
              <li className="flex justify-between w-full">
                <span>Finishing:</span>
                <span className="font-bold">
                  {lotStatus.Finishing.toFixed(2)}
                  <span className="text-sm text-gray-500 ml-2">
                    (Remaining: {remainingQuantities.Finishing.toFixed(2)})
                  </span>
                </span>
              </li>
            </ul>

            {lotStatus.initialQty > 0 && (
              <div
                className={`${
                  lotStatus.initialQty - lotStatus.Dyeing < watchQty
                    ? "bg-red-100 border border-red-300"
                    : "bg-green-100 border border-green-300"
                }mt-4 p-2 rounded`}
              >
                {getWarningMessage() && (
                  <pre
                    className={` font-semibold whitespace-pre-wrap ${
                      lotStatus.initialQty - lotStatus.Dyeing < watchQty
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    ⚠️ {getWarningMessage()}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DyesDemandForm;
