import { useEffect, useState } from "react";

const useDemandData = () => {
  const [demandData, setDemandData] = useState([]);
  const [verifyDyes, setVerifyDyes] = useState([]);
  const [machine, setMachine] = useState([]);
  const [master, setMaster] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    fetch(`${BASE_URL}/demand`)
      .then((res) => res.json())
      .then(setDemandData);

    fetch(`${BASE_URL}/demand/verifydyes`)
      .then((res) => res.json())
      .then(setVerifyDyes);

    fetch(`${BASE_URL}/party/alldata`)
      .then((res) => res.json())
      .then((data) => {
        // Remove header and map only machine names (first column)
        const onlyMachineNames = data.slice(1).map((row) => row[0]);
        setMachine(onlyMachineNames);
      });
    fetch(`${BASE_URL}/user/master`)
      .then((res) => res.json())
      .then((data) => {
        // Remove header and map only machine names (first column)
        const masterNames = data.slice(1).map((row) => row[0]);
        setMaster(masterNames);
      });
  }, []);

  return { demandData, verifyDyes, machine, master };
};

export default useDemandData;
