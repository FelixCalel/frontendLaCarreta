import { Route, Routes } from "react-router-dom";
import { RootLayout } from "../pages/layouts/RootLayout";
import { Dashboard } from "../pages";
import QAPageDetails from "../pages/QA/QADetailsIntake";

export const QApaginaDetails = () => {
  return (
    <Routes>
      <Route path="/*" element={<RootLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="agrupados/:pedidoId" element={<QAPageDetails />} />{" "}
      </Route>
    </Routes>
  );
};
