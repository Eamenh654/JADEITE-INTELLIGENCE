import { createBrowserRouter } from "react-router";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Placeholder from "../pages/Placeholder/Placeholder";
import { navGroups } from "../lib/nav";

// Every nav destination except Home renders the Placeholder for now.
const placeholderRoutes = navGroups
  .flatMap((g) => g.items)
  .filter((i) => i.to !== "/")
  .map((i) => ({ path: i.to.slice(1), element: <Placeholder /> }));

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      ...placeholderRoutes,
      { path: "*", element: <Placeholder /> },
    ],
  },
]);

export default router;
