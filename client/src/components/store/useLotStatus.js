const useLotStatus = (lot, demandData, verifyDyes) => {
  const status = { initialQty: 0 };

  if (!lot) return status;

  // Step 1: Get initial grey qty from demandData
  demandData.forEach((item) => {
    if (String(item["Lot Number"]) === String(lot)) {
      status.initialQty += parseFloat(item["Received Grey"]) || 0;
    }
  });

  // Step 2: Count processed qty by Work Type
  if (verifyDyes?.length > 1) {
    const [headers, ...rows] = verifyDyes;

    const workIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("work")
    );
    const lotIndex = headers.findIndex((h) => h.toLowerCase().includes("lot"));
    const qtyIndex = headers.findIndex((h) => h.toLowerCase().includes("qty"));

    if (workIndex === -1 || lotIndex === -1 || qtyIndex === -1) {
      console.warn("❌ Header mismatch in verifyDyes", headers);
      return status;
    }

    rows.forEach((row) => {
      const lotNo = row[lotIndex];
      const workType = row[workIndex];
      const qty = parseFloat(row[qtyIndex]);

      if (String(lotNo) === String(lot) && workType && !isNaN(qty)) {
        if (!status[workType]) {
          status[workType] = 0;
        }
        status[workType] += qty;
      }
    });
  }

  return status;
};

export default useLotStatus;
