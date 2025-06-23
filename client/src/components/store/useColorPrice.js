import { useEffect, useState } from "react";

const useColorPrice = () => {
  const [colorPrice, setColorPrice] = useState({});

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/colorprice`)
      .then((res) => res.json())
      .then(setColorPrice);
  }, [colorPrice]);

  return { colorPrice };
};
export default useColorPrice;
