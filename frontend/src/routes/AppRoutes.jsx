import { Route, Routes } from "react-router";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import CoursesPage from "../pages/CoursesPage";
import ScheduleConfigPage from "../pages/ScheduleConfigPage";
import ResultsPage from "../pages/ResultsPage";
import ScheduleDetailPage from "../pages/ScheduleDetailPage";
import NotFoundPage from "../pages/NotFoundPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />

        <Route
          path="materias"
          element={<CoursesPage />}
        />

        <Route
          path="configuracion"
          element={<ScheduleConfigPage />}
        />

        <Route
          path="resultados"
          element={<ResultsPage />}
        />

        <Route
          path="resultados/:id"
          element={<ScheduleDetailPage />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;