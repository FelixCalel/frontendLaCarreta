import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import QAPageDashboard from "../pages/QA/QAPageDashboard";

export const QApaginaPedido = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="calidad" element={<QAPageDashboard />} />{" "}
      </Route>
    </Routes>
  );
};
