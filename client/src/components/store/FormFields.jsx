import { useEffect } from "react";

const FormFields = ({
  register,
  errors,
  setValue,
  watchValues,
  workOptions,
  setWorkOptions,
  demandData,
  machine,
  master,
}) => {
  useEffect(() => {
    const found = demandData.find(
      (item) => String(item["Lot Number"]) === String(watchValues.lot)
    );
    if (found) {
      setValue("party", found["Party's Name"] || "");
      setValue("fabricType", found["Type"] || "");
      const works = found["Work"];
      const options =
        typeof works === "string"
          ? works.split(/[,/]/).map((x) => x.trim())
          : works || [];
      setWorkOptions(options);
      setValue("workType", options?.[0] || "");
    }
  }, [watchValues.lot, demandData, setValue]);

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400";

  const field = (label, inputElement) => (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-medium text-gray-700">{label}</label>
      {inputElement}
    </div>
  );

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {field(
        "Date",
        <input
          {...register("date")}
          type="date"
          className={inputClass}
          required
        />
      )}
      {field(
        "Memo No",
        <input
          {...register("memo")}
          placeholder="Memo No"
          className={inputClass}
          required
        />
      )}
      {field(
        "Lot Number",
        <input
          {...register("lot")}
          placeholder="Lot Number"
          className={inputClass}
          required
        />
      )}
      {field(
        "Party",
        <input
          {...register("party")}
          readOnly
          className={inputClass}
          required
        />
      )}
      {field(
        "Shift",
        <select {...register("shift")} className={inputClass} required>
          <option value="">Select Shift</option>
          <option value="A">A</option>
          <option value="B">B</option>
        </select>
      )}

      {field(
        "Fabric Type",
        <input
          {...register("fabricType")}
          readOnly
          className={inputClass}
          required
        />
      )}

      {field(
        "Machine",
        <select {...register("machine")} className={inputClass} required>
          <option value="">Select Machine</option>
          {machine?.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}

      {field(
        "Work Type",
        <select {...register("workType")} className={inputClass} required>
          <option value="">Select Work Type</option>
          {workOptions.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}

      {field(
        "Qty",
        <input
          {...register("qty")}
          placeholder="Quantity"
          type="number"
          className={inputClass}
          required
        />
      )}
      {field(
        "Unit",
        <select {...register("unit")} className={inputClass} required>
          <option value="">Select Unit</option>
          <option value="YDS">YDS</option>
          <option value="Meter">Meter</option>
        </select>
      )}

      {field(
        "Main Color",
        <input
          {...register("mainColor")}
          placeholder="Main Color"
          className={inputClass}
          required
        />
      )}
      {field(
        "Weight",
        <input
          {...register("weight")}
          placeholder="Weight"
          className={inputClass}
          required
        />
      )}

      {field(
        "Master Name",
        <select {...register("master")} className={inputClass} required>
          <option value="">Select Master</option>
          {master?.map((m, i) => (
            <option key={i} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default FormFields;
