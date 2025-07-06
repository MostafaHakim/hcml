import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Griege = lazy(() => import("./pages/Griege"));
const Store = lazy(() => import("./pages/Store"));
const StoreMaintain = lazy(() => import("./pages/StoreMaintain"));
const GriegeinForm = lazy(() => import("./components/griege/GriegeinForm"));
const GriegeReport = lazy(() =>
  import("./components/griege/report/GriegeReport")
);
const Costing = lazy(() => import("./components/griege/report/Costing"));
const Dyes = lazy(() => import("./components/store/Dyes"));
const ColorPurchaseForm = lazy(() =>
  import("./components/store/ColorPurchaseForm")
);
const DemandForm = lazy(() => import("./components/store/DemandForm"));
const DemoForm = lazy(() => import("./components/store/DemoForm"));
const NotFound = lazy(() => import("./components/NotFound"));
const DeliveredDyes = lazy(() => import("./components/DeliveredDyes"));
const ColorPurchase = lazy(() => import("./components/ColorPurchase"));
const Lot = lazy(() => import("./components/Lot"));
const DeliveryForm = lazy(() => import("./components/griege/DeliveryForm"));
const Delivery = lazy(() => import("./components/griege/Delivery"));
const PakingList = lazy(() => import("./components/griege/PakingList"));
const DelivaryChalan = lazy(() => import("./components/griege/DelivaryChalan"));
const DeliveryReport = lazy(() =>
  import("./components/griege/report/DeliveryReport")
);
const Allparty = lazy(() => import("./components/party/Allparty"));
const Profile = lazy(() => import("./components/party/Profile"));
const Stock = lazy(() => import("./components/stock/Stock"));
const Allmaster = lazy(() => import("./components/master/Allmaster"));
const MasterProfile = lazy(() => import("./components/master/MasterProfile"));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-500 h-16 w-16"></div>
  </div>
);

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/admin" /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute allowedRoles={["Admin", "Director", "MD"]} />
            }
          >
            <Route path="/admin" element={<Home />}>
              <Route path="dashboard" element={<Dashboard />}>
                <Route path="griege/received" element={<GriegeReport />} />
                <Route path="griege/delivery" element={<DeliveryReport />} />
                <Route path="griege/received/:lotnumber" element={<Lot />} />
                <Route path="dyes/stock" element={<Stock />} />
                <Route path="dyes/demand" element={<Costing />} />
                <Route path="dyes/purchase" element={<ColorPurchase />} />
                <Route path="delivery/mark" element={<DeliveryForm />} />
                <Route path="delivery/delivary" element={<Delivery />} />
                <Route path="delivery/pakinglist" element={<PakingList />} />
                <Route path="delivery/calan" element={<DelivaryChalan />} />
                <Route path="party/allparty" element={<Allparty />} />
                <Route path="party/:id" element={<Profile />} />
                <Route path="master/allmaster" element={<Allmaster />} />
                <Route path="master/:id" element={<MasterProfile />} />
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
          <Route element={<ProtectedRoute allowedRoles={["Storeman"]} />}>
            <Route path="/store" element={<StoreMaintain />} />
            <Route path="/delivered" element={<DeliveredDyes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default App;
