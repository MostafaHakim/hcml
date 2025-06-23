import { useEffect, useState } from "react";

const useDemandData = () => {
  const [demandData, setDemandData] = useState([]);
  const [verifyDyes, setVerifyDyes] = useState([]);
  const [machine, setMachine] = useState([]);
  const [master, setMaster] = useState([]);

  useEffect(() => {
    fetch(`https://hcml-ry8s.vercel.app/demand`)
      .then((res) => res.json())
      .then(setDemandData);

    fetch(`https://hcml-ry8s.vercel.app/demand/verifydyes`)
      .then((res) => res.json())
      .then(setVerifyDyes);

    fetch(`https://hcml-ry8s.vercel.app/party/alldata`)
      .then((res) => res.json())
      .then((data) => {
        // Remove header and map only machine names (first column)
        const onlyMachineNames = data.slice(1).map((row) => row[0]);
        setMachine(onlyMachineNames);
      });
    fetch(`https://hcml-ry8s.vercel.app/user/master`)
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
