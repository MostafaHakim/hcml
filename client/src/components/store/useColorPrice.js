import { useEffect, useState } from "react";

const useColorPrice = () => {
  const [colorPrice, setColorPrice] = useState({});
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    fetch(`${BASE_URL}/colorprice`)
      .then((res) => res.json())
      .then(setColorPrice);
  }, [colorPrice]);

  return { colorPrice };
};
export default useColorPrice;
