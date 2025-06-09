// import { Routes, Route, Navigate } from "react-router-dom";

// import Dashboard from "./pages/Dashboard";
// import Griege from "./pages/Griege";
// import Store from "./pages/Store";
// import StoreMaintain from "./pages/StoreMaintain";
// import Home from "./pages/Home";
// import Login from "./components/Login";

// // Griege
// import GriegeinForm from "./components/griege/GriegeinForm";
// import GriegeReport from "./components/griege/report/GriegeReport";
// import Costing from "./components/griege/report/Costing";

// // Store
// import Dyes from "./components/store/Dyes";
// import ColorPurchaseForm from "./components/store/ColorPurchaseForm";
// import DemandForm from "./components/store/DemandForm";
// import DemoForm from "./components/store/DemoForm";

// // Auth wrapper
// import ProtectedRoute from "./components/ProtectedRoute";
// import NotFound from "./components/NotFound";

// function App() {
//   return (
//     <Routes>
//       {/* Login route */}
//       <Route path="/login" element={<Login />} />

//       {/* Admin routes */}
//       <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
//         <Route path="/" element={<Home />}>
//           <Route path="dashboard" element={<Dashboard />}>
//             <Route path="griege/received" element={<GriegeReport />} />
//             <Route path="dyes/demand" element={<Costing />} />
//           </Route>

//           <Route path="griege" element={<Griege />}>
//             <Route path="griegein" element={<GriegeinForm />} />
//           </Route>

//           <Route path="store" element={<Store />}>
//             <Route path="mechanical" element={<DemoForm />} />
//             <Route path="dyes" element={<Dyes />}>
//               <Route path="demand" element={<DemandForm />} />
//               <Route path="purchase" element={<ColorPurchaseForm />} />
//             </Route>
//           </Route>
//         </Route>
//       </Route>

//       {/* Storeman routes */}
//       <Route element={<ProtectedRoute allowedRoles={["Storeman"]} />}>
//         <Route path="/" element={<StoreMaintain />} />
//       </Route>

//       {/* Fallback: unmatched routes go to login */}
//       <Route path="/login" element={<Navigate to="/login" />} />
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Griege from "./pages/Griege";
import Store from "./pages/Store";
import StoreMaintain from "./pages/StoreMaintain";
import Home from "./pages/Home";
import Login from "./components/Login";

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

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <Routes>
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
            <Route path="dyes/demand" element={<Costing />} />
          </Route>

          <Route path="griege" element={<Griege />}>
            <Route path="griegein" element={<GriegeinForm />} />
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
      </Route>

      {/* Not found fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
