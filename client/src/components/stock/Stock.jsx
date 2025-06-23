import { useState, useEffect, useMemo } from "react";

function Stock() {
  const [colorStock, setColorStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://hcml-ry8s.vercel.app/stock`)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setColorStock(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load color stock.");
        setLoading(false);
      });
  }, []);

  // Category অনুযায়ী ডেটা গ্রুপিং
  const groupedByCategory = useMemo(() => {
    const group = {};
    colorStock.forEach((item) => {
      const category = item.CATAGORY || "Uncategorized";
      if (!group[category]) {
        group[category] = [];
      }
      group[category].push(item);
    });
    return group;
  }, [colorStock]);

  if (loading) {
    return (
      <p className="text-gray-500 text-center py-6 text-lg font-medium">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-red-500 text-center py-6 font-semibold">{error}</p>
    );
  }

  if (colorStock.length === 0) {
    return (
      <p className="text-center w-full py-6 text-gray-600">
        No stock data available.
      </p>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 pb-8">
      <main className="w-full">
        <div>
          <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
            Required to Purchase (Color Stock is Below 4 KG)
          </h2>
        </div>
        {Object.entries(groupedByCategory).map(([category, items]) => {
          return (
            <section
              key={category}
              className="mb-10 w-full text-left uppercase"
            >
              <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
                {category} ({items.length})
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 text-sm text-left capitalize">
                {items.map((color) =>
                  color["PRESENT STOCK"] < 4000 ? (
                    <div
                      key={color["PRODUCT NAME"]}
                      className="p-3 bg-white border border-gray-200 text-black flex flex-col items-start rounded-md shadow hover:bg-gray-50 transition"
                    >
                      <label className="font-semibold">
                        {color["PRODUCT NAME"]}
                      </label>
                      <p className="text-green-600">
                        Current Stock: <span>{color["PRESENT STOCK"]}</span>
                      </p>
                      <p className="text-yellow-600">
                        Stock On Hold: <span>{color["ON HOLD"]}</span>
                      </p>
                      <p className="text-gray-600">
                        Total Stock: <span>{color["TOTAL STOCK"]}</span>
                      </p>
                    </div>
                  ) : (
                    ""
                  )
                )}
              </div>
            </section>
          );
        })}
        {/* ক্যাটাগরি অনুযায়ী গ্রুপে দেখানো */}
        <div>
          <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
            Present Stock
          </h2>
        </div>
        {Object.entries(groupedByCategory).map(([category, items]) => (
          <section key={category} className="mb-10 w-full text-left uppercase">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">
              {category} ({items.length})
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 text-sm text-left capitalize">
              {items.map((color) => (
                <div
                  key={color["PRODUCT NAME"]}
                  className="p-3 bg-white border border-gray-200 text-black flex flex-col items-start rounded-md shadow hover:bg-gray-50 transition"
                >
                  <label className="font-semibold">
                    {color["PRODUCT NAME"]}
                  </label>
                  <p className="text-green-600">
                    Current Stock: <span>{color["PRESENT STOCK"]}</span>
                  </p>
                  <p className="text-yellow-600">
                    Stock On Hold: <span>{color["ON HOLD"]}</span>
                  </p>
                  <p className="text-gray-600">
                    Total Stock: <span>{color["TOTAL STOCK"]}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default Stock;
