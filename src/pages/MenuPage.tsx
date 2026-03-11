import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";
import CartButton from "../components/cart/CartButton";
import Footer from "../components/menu/footer";
import Menu from "../components/menu/Menu";
import { FaFire, FaMoon, FaSun, FaLanguage } from "react-icons/fa";
import FeaturedModal from "../components/menu/FeaturedModal";
import { motion, AnimatePresence } from "framer-motion";
import { getDatabase, ref, onValue } from "firebase/database";

export default function MenuPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasFeatured, setHasFeatured] = useState(false);
  const [orderSystem, setOrderSystem] = useState(true);

  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRtl]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
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



    <div
      className={`min-h-screen flex flex-col bg-(--bg-main) text-(--text-main) font-['Cairo'] relative transition-colors duration-300`}
    >
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-64 bg-linear-to-b from-primary/10 to-transparent pointer-events-none"></div>

      {/* Header / Top Bar */}
      <header className="sticky top-0 z-40 bg-(--bg-main)/80 backdrop-blur-md border-b border-(--border-color) px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-(--border-color) transition-colors"
            title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          >
            {theme === 'light' ? <FaMoon className="text-gray-600" /> : <FaSun className="text-yellow-400" />}
          </button>

          {/* Featured Button - Header */}
          {!loading && hasFeatured && (
            <button
              onClick={() => setShowFeaturedModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white transition-all border border-orange-100 font-black text-[10px] uppercase tracking-widest shadow-sm"
              title={t('common.most_ordered')}
            >
              <FaFire className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline-block">{t('common.most_ordered')}</span>
            </button>
          )}

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-(--border-color) hover:bg-(--border-color) transition-colors text-[10px] font-black uppercase tracking-widest"
          >
            <FaLanguage className="text-base" />
            <span className="hidden xs:inline-block">{i18n.language === 'ar' ? 'EN' : 'AR'}</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col min-h-screen pb-20">
        {/* Banner / Hero */}
        <div className="flex flex-col items-center py-8 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-2 tracking-tight"
          >
            {t('menu.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-(--text-muted) max-w-md"
          >
            {t('menu.subtitle')}
          </motion.p>
        </div>

        {/* Menu Grid/List */}
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8">
          <Menu
            onLoadingChange={setLoading}
            onFeaturedCheck={setHasFeatured}
          />
        </div>


      </main>

      {/* Floating Actions - Grouped & Premium */}
      <div className={`fixed bottom-10 ${isRtl ? 'left-6 sm:left-10' : 'right-6 sm:right-10'} z-50 pointer-events-none`}>
        <div className="flex flex-col-reverse gap-5 pointer-events-auto">
          {/* Cart Button with enhanced shadow */}
          <AnimatePresence>
            {!loading && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 30 }}
                transition={{ duration: 0.5, ease: "backOut" }}
              >
                <CartButton className="relative! bottom-0! right-0! shadow-2xl shadow-primary/40" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <FeaturedModal
        show={showFeaturedModal}
        onClose={() => setShowFeaturedModal(false)}
        orderSystem={orderSystem}
      />
      <Footer />
    </div>
  );
}
