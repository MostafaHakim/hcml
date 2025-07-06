import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const role = localStorage.getItem("role");
  console.log("ProtectedRoute - Role from localStorage:", role);
  console.log("ProtectedRoute - Allowed Roles:", allowedRoles);

  if (!isLoggedIn) return <Navigate to="/login" />;
  if (!allowedRoles.map(r => r.toLowerCase()).includes(role.toLowerCase())) return <Navigate to="/login" />;

  return <Outlet />;
}

export default ProtectedRoute;
