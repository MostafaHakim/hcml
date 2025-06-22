import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Dashboard from "./pages/Dashboard";
import Griege from "./pages/Griege";
import Store from "./pages/Store";
import StoreMaintain from "./pages/StoreMaintain";
import Home from "./pages/Home";
import Login from "./components/Login";
import DelivaryFrom from "./components/griege/DeliveryForm";
import Delivery from "./components/griege/Delivery";

// Griege
import GriegeinForm from "./components/griege/GriegeinForm";
import GriegeReport from "./components/griege/report/GriegeReport";
import Costing from "./components/griege/report/Costing";

// Store
import Dyes from "./components/store/Dyes";
import ColorPurchaseForm from "./components/store/ColorPurchaseForm";
import DemandForm from "./components/store/DemandForm";
import DemoForm from "./components/store/DemoForm";

// Auth wrapper
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import DeliveredDyes from "./components/DeliveredDyes";
import ColorPurchase from "./components/ColorPurchase";
import Lot from "./components/Lot";
import DeliveryForm from "./components/griege/DeliveryForm";
import PakingList from "./components/griege/PakingList";
import DelivaryChalan from "./components/griege/DelivaryChalan";
import DeliveryReport from "./components/griege/report/DeliveryReport";
import Allparty from "./components/party/Allparty";
import Profile from "./components/party/Profile";
import Stock from "./components/stock/Stock";
import Allmaster from "./components/master/Allmaster";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Default route based on login status */}
        <Route
          path="/"
          element={
            isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />
          }
        />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin" element={<Home />}>
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="griege/received" element={<GriegeReport />} />
              <Route path="griege/delivery" element={<DeliveryReport />} />
              <Route path="griege/received/:lotnumber" element={<Lot />} />
              <Route path="dyes/stock" element={<Stock />} />
              <Route path="dyes/demand" element={<Costing />} />
              <Route path="dyes/purchase" element={<ColorPurchase />} />
              <Route path="delivery/mark" element={<DelivaryFrom />} />
              <Route path="delivery/delivary" element={<Delivery />} />
              <Route path="delivery/pakinglist" element={<PakingList />} />
              <Route path="delivery/calan" element={<DelivaryChalan />} />
              <Route path="party/allparty" element={<Allparty />} />
              <Route path="party/:id" element={<Profile />} />
              <Route path="master/allmaster" element={<Allmaster />} />
            </Route>

            <Route path="griege" element={<Griege />}>
              <Route path="griegein" element={<GriegeinForm />} />
              <Route path="griegeout" element={<DeliveryForm />} />
            </Route>

            <Route path="store" element={<Store />}>
              <Route path="mechanical" element={<DemoForm />} />
              <Route path="dyes" element={<Dyes />}>
                <Route path="demand" element={<DemandForm />} />
                <Route path="purchase" element={<ColorPurchaseForm />} />
              </Route>
            </Route>
          </Route>
        </Route>

        {/* Storeman routes */}
        <Route element={<ProtectedRoute allowedRoles={["Storeman"]} />}>
          <Route path="/store" element={<StoreMaintain />} />
          <Route path="/delivered" element={<DeliveredDyes />} />
        </Route>

        {/* Not found fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
