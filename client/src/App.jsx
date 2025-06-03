import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Griege from "./pages/Griege";

import Store from "./pages/Store";
import Dyes from "./components/store/Dyes";
import ColorPurchaseForm from "./components/store/ColorPurchaseForm";
import DemandForm from "./components/store/DemandForm";
import GriegeinForm from "./components/griege/GriegeinForm";
import DemoForm from "./components/store/DemoForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/griege" element={<Griege />}>
          <Route path="griegein" element={<GriegeinForm />} />
        </Route>
        <Route path="/store" element={<Store />}>
          <Route path="mechanical" element={<DemoForm />}></Route>
          <Route path="dyes" element={<Dyes />}>
            <Route path="demand" element={<DemandForm />} />
            <Route path="purchase" element={<ColorPurchaseForm />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
