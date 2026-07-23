import { createBrowserRouter } from "react-router";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Companies from "../pages/Companies/Companies";
import Employees from "../pages/Employees/Employees";
import KPIs from "../pages/KPIs/KPIs";
import Bonuses from "../pages/Bonuses/Bonuses";
import Financials from "../pages/Financials/Financials";
import Ecommerce from "../pages/Ecommerce/Ecommerce";
import Placeholder from "../pages/Placeholder/Placeholder";
import { navGroups } from "../lib/nav";

// Nav destinations that have a real page built. Everything else falls back to
// the Placeholder until it is built out.
const built: Record<string, React.ReactElement> = {
  "/companies": <Companies />,
  "/employees": <Employees />,
  "/kpis": <KPIs />,
  "/bonuses": <Bonuses />,
  "/financials": <Financials />,
  "/ecommerce": <Ecommerce />,
};

// Every nav destination except Home renders its built page or the Placeholder.
const childRoutes = navGroups
  .flatMap((g) => g.items)
  .filter((i) => i.to !== "/")
  .map((i) => ({ path: i.to.slice(1), element: built[i.to] ?? <Placeholder /> }));

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
      ...childRoutes,
      { path: "*", element: <Placeholder /> },
    ],
  },
]);

export default router;
