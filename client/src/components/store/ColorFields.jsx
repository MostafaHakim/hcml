import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const ColorFields = ({
  fields,
  append,
  remove,
  register,
  colorPrice,
  watchColors,
  setValue,
}) => {
  useEffect(() => {
    watchColors.forEach((item, index) => {
      if (item?.colorName && colorPrice[item.colorName]) {
        setValue(`colors.${index}.price`, colorPrice[item.colorName]);
      } else {
        setValue(`colors.${index}.price`, "");
      }
    });
  }, [watchColors, colorPrice]);

  return (
    <div className="mt-4 border p-4 rounded flex flex-col space-y-1">
      <h3 className="font-semibold">Colors</h3>
      {fields.map((field, index) => (
        <div key={field.id} className="grid md:grid-cols-4 gap-2">
          <select
            {...register(`colors.${index}.colorName`)}
            className="input border-[1px] border-gray-300"
          >
            <option value="">Select Color</option>
            {Object.keys(colorPrice).map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
          <input
            {...register(`colors.${index}.gram`)}
            placeholder="Gram"
            type="number"
            className="input border-[1px] border-gray-300"
          />
          <input
            {...register(`colors.${index}.price`)}
            readOnly
            className="input border-[1px] border-gray-300"
          />
          <button
            type="button"
            onClick={() => remove(index)}
            className="btn bg-red-500 py-1 rounded-md text-white"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          append({ id: uuidv4(), colorName: "", gram: "", price: "" })
        }
        className="btn bg-blue-500 mt-2 py-1 rounded-md px-4 text-white"
      >
        + Add Color
      </button>
    </div>
  );
};
export default ColorFields;
