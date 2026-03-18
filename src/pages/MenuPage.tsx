import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import CartButton from "../components/cart/CartButton";
import Footer from "../components/menu/footer";
import Menu from "../components/menu/Menu";
import { FaFire, FaMoon, FaSun, FaLanguage } from "react-icons/fa";
import FeaturedModal from "../components/menu/FeaturedModal";
import { motion } from "framer-motion";
import { getDatabase, ref, onValue } from "firebase/database";
import OrderStatusButton from "../components/cart/OrderStatusButton";

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasFeatured, setHasFeatured] = useState(false);
  const [orderSystem, setOrderSystem] = useState(true);

  const isRtl = i18n.language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRtl]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const db = getDatabase();
    const settingsRef = ref(db, "settings/orderSystem");
    const unsubscribe = onValue(settingsRef, (snapshot) => {
      const value = snapshot.val();
      setOrderSystem(value ?? true);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-main) text-(--text-main) font-['Cairo'] relative transition-colors duration-300">

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-primary/10 to-transparent pointer-events-none"></div>

      {/* ✅ Top Bar (FINAL FIX) */}
      <div className="absolute top-6 left-0 right-0 z-50 px-6 flex justify-between items-center pointer-events-none">

        {/* 🔹 LEFT SIDE */}
        <div className="flex items-center pointer-events-auto">
          {isRtl ? (
            // RTL → Theme + Language
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-(--bg-card)/40 border border-(--border-color) backdrop-blur-md hover:bg-(--bg-card) transition-all text-(--text-main)"
              >
                {theme === "light"
                  ? <FaMoon size={16} />
                  : <FaSun size={16} className="text-yellow-400" />}
              </button>

              <button
                onClick={toggleLanguage}
                className="px-4 h-10 flex items-center gap-2 rounded-2xl bg-(--bg-card)/40 border border-(--border-color) backdrop-blur-md hover:bg-(--bg-card) transition-all text-[10px] font-black uppercase tracking-widest text-(--text-main)"
              >
                <FaLanguage size={18} />
                <span>{i18n.language === "ar" ? "EN" : "AR"}</span>
              </button>
            </div>
          ) : (
            // LTR → Featured
            !loading && hasFeatured && (
              <button
                onClick={() => setShowFeaturedModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 backdrop-blur-md hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-orange-500/10"
                title={t("common.most_ordered")}
              >
                <FaFire className="w-4 h-4" />
              </button>
            )
          )}
        </div>

        {/* 🔹 RIGHT SIDE */}
        <div className="flex items-center pointer-events-auto">
          {isRtl ? (
            // RTL → Featured
            !loading && hasFeatured && (
              <button
                onClick={() => setShowFeaturedModal(true)}
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 border border-orange-500/20 backdrop-blur-md hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-orange-500/10"
                title={t("common.most_ordered")}
              >
                <FaFire className="w-4 h-4" />
              </button>
            )
          ) : (
            // LTR → Theme + Language
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-(--bg-card)/40 border border-(--border-color) backdrop-blur-md hover:bg-(--bg-card) transition-all text-(--text-main)"
              >
                {theme === "light"
                  ? <FaMoon size={16} />
                  : <FaSun size={16} className="text-yellow-400" />}
              </button>

              <button
                onClick={toggleLanguage}
                className="px-4 h-10 flex items-center gap-2 rounded-2xl bg-(--bg-card)/40 border border-(--border-color) backdrop-blur-md hover:bg-(--bg-card) transition-all text-[10px] font-black uppercase tracking-widest text-(--text-main)"
              >
                <FaLanguage size={18} />
                <span>{i18n.language === "ar" ? "EN" : "AR"}</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Content */}
      <main className="relative z-10 flex flex-col min-h-screen pb-20">

        {/* Hero */}
        <div className="relative w-full h-[35vh] sm:h-[45vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden mb-8">

          {/* Logo BG */}
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.07 }}
              transition={{ duration: 1.5 }}
              src="/logo.png"
              className="w-[80%] max-w-md object-contain blur-[2px]"
            />
          </div>

          <div className="space-y-4">
            <div className="w-24 h-24 p-3 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 shadow-2xl mx-auto">
              <img src="/logo.png" className="w-full h-full object-contain" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black">
              {t("menu.title")}
            </h1>

            <p className="text-(--text-muted)">
              {t("menu.subtitle")}
            </p>
          </div>

        </div>

        {/* Menu */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
          <Menu
            onLoadingChange={setLoading}
            onFeaturedCheck={setHasFeatured}
          />
        </div>

      </main>

      {/* Floating Cart */}
      <div className={`fixed bottom-10 ${isRtl ? 'left-6' : 'right-6'} z-50`}>
        {!loading && <CartButton />}
      </div>

      <FeaturedModal
        show={showFeaturedModal}
        onClose={() => setShowFeaturedModal(false)}
        orderSystem={orderSystem}
      />

      <OrderStatusButton />
      <Footer />
    </div>
  );
}