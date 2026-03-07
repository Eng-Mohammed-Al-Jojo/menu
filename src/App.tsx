import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminPage from "./pages/Admin";
import MenuPage from "./pages/MenuPage";

export default function App() {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/admin" element={<AdminPage />} />

      {/* fallback */}
      <Route
        path="*"
        element={
          <div className="text-white p-10 text-center font-bold">
            {t('common.not_found')}
          </div>
        }
      />
    </Routes>
  );
}
