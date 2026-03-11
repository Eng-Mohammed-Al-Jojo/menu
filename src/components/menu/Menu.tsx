import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import CategorySection from "./CategorySection";
import LoadingScreen from "../common/LoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FiSearch, FiX, FiGrid } from "react-icons/fi";
import { FaCommentDots } from "react-icons/fa";
import FeedbackModal from "./FeedbackModal";

/* ================= Types ================= */
export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  available?: boolean;
  order?: number;
  createdAt?: number;
}

export interface Item {
  featured: any;
  image: string | undefined;
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  price: number;
  ingredients?: string;
  ingredientsAr?: string;
  ingredientsEn?: string;
  priceTw?: number;
  categoryId: string;
  visible?: boolean;
  star?: boolean;
  createdAt?: number;
}

/* ================= LocalStorage ================= */
const saveToLocal = (cats: Category[], its: Item[], orderSystem: boolean) => {
  localStorage.setItem(
    "menu_cache",
    JSON.stringify({
      categories: cats,
      items: its,
      orderSystem,
      savedAt: Date.now(),
    })
  );
};

const loadFromLocal = () => {
  const cached = localStorage.getItem("menu_cache");
  if (!cached) return null;
  return JSON.parse(cached);
};

/* ================= Main Component ================= */
interface Props {
  onLoadingChange?: (loading: boolean) => void;
  onFeaturedCheck?: (hasFeatured: boolean) => void;
  orderSystem?: boolean; // لو بدك تمرره من بره MenuPage
}

export default function Menu({ onLoadingChange, onFeaturedCheck, orderSystem: initialOrderSystem }: Props) {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSystem, setOrderSystem] = useState<boolean>(initialOrderSystem ?? true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const MIN_LOADING_TIME = 3000;
  const [startTime] = useState(Date.now());
  /* ================= Backup Logic ================= */
  const loadMenuJson = async () => {
    try {
      const res = await fetch("/menu.json");
      const data = await res.json();
      const cats: Category[] = Object.entries(data.categories || {}).map(([id, v]: any) => ({
        id,
        name: v.name,
        available: v.available !== false,
        order: v.order ?? 0,
        createdAt: v.createdAt || 0,
      })).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      const its: Item[] = Object.entries(data.items || {}).map(([id, v]: any) => ({ id, ...v, createdAt: v.createdAt || 0 }));
      setCategories(cats);
      setItems(its);
      setOrderSystem(data.orderSystem ?? true);
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

      setTimeout(() => {
        setLoading(false);
        onLoadingChange?.(false);
      }, remaining);
    } catch {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  /* ================= Firebase Sync ================= */
  useEffect(() => {
    onLoadingChange?.(true);
    let timeoutId: number | null = null;
    let firebaseLoaded = false;
    const finishFirebase = (cats: Category[], its: Item[], os: boolean) => {
      firebaseLoaded = true;
      saveToLocal(cats, its, os);

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

      setTimeout(() => {
        setLoading(false);
        onLoadingChange?.(false);
      }, remaining);

      if (timeoutId) clearTimeout(timeoutId);
    };
    const loadOnline = () => {
      let cats: Category[] = [];
      let its: Item[] = [];
      let catsLoaded = false;
      let itemsLoaded = false;
      let orderSystemLoaded = false;
      timeoutId = window.setTimeout(() => {
        if (firebaseLoaded) return;
        const cached = loadFromLocal();
        if (cached) {
          setCategories(cached.categories || []);
          setItems(cached.items || []);
          setOrderSystem(cached.orderSystem ?? true);
          setLoading(false);
          onLoadingChange?.(false);
        } else loadMenuJson();
      }, 8000);
      onValue(ref(db, "categories"), (snap) => {
        const data = snap.val();
        cats = data ? Object.entries(data).map(([id, v]: any) => ({
          id,
          name: v.name,
          nameAr: v.nameAr,
          nameEn: v.nameEn,
          available: v.available !== false,
          order: v.order ?? 0,
          createdAt: v.createdAt || 0
        })) : [];
        cats.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setCategories(cats);
        catsLoaded = true;
        if (itemsLoaded && orderSystemLoaded) finishFirebase(cats, its, orderSystem);
      });
      onValue(ref(db, "items"), (snap) => {
        const data = snap.val();
        its = data ? Object.entries(data).map(([id, v]: any) => ({ id, ...v, createdAt: v.createdAt || 0 })) : [];
        setItems(its);
        itemsLoaded = true;
        if (catsLoaded && orderSystemLoaded) finishFirebase(cats, its, orderSystem);
      });
      onValue(ref(db, "settings/orderSystem"), (snap) => {
        const val = snap.val();
        setOrderSystem(val ?? true);
        orderSystemLoaded = true;
        if (catsLoaded && itemsLoaded) finishFirebase(cats, its, val ?? true);
      });
    };
    if (navigator.onLine) loadOnline();
    else loadMenuJson();
  }, [onLoadingChange, t]);

  /* ================= Filtered Data ================= */
  const featuredItems = useMemo(() => items.filter(i => i.star === true && i.visible !== false), [items]);
  const availableCategories = useMemo(() => categories.filter(cat => cat.available), [categories]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (!item) return false;
      const nameAr = item.nameAr?.toLowerCase() ?? "";
      const nameEn = item.nameEn?.toLowerCase() ?? "";
      const nameLegacy = item.name?.toLowerCase() ?? "";
      const ingAr = item.ingredientsAr?.toLowerCase() ?? "";
      const ingEn = item.ingredientsEn?.toLowerCase() ?? "";
      const ingLegacy = item.ingredients?.toLowerCase() ?? "";

      const search = searchTerm?.toLowerCase() ?? "";

      const matchesSearch =
        nameAr.includes(search) ||
        nameEn.includes(search) ||
        nameLegacy.includes(search) ||
        ingAr.includes(search) ||
        ingEn.includes(search) ||
        ingLegacy.includes(search);

      const matchesCategory = activeCategory === "all" || item.categoryId === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, activeCategory]);

  useEffect(() => {
    onFeaturedCheck?.(featuredItems.length > 0);
  }, [featuredItems, onFeaturedCheck]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen pb-20">
      {/* Navigation & Sidebar */}
      <aside className="lg:w-72 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] z-30">
        <div className="flex flex-col gap-8 h-full">
          {/* Search Bar */}
          <div className="relative group">
            <FiSearch className={`${i18n.language === 'ar' ? 'right-4' : 'left-4'} absolute top-1/2 -translate-y-1/2 text-(--text-muted) group-focus-within:text-primary transition-colors text-lg`} />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full bg-(--bg-card)/50 backdrop-blur-md border border-(--border-color) rounded-2xl py-3.5 ${i18n.language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all shadow-sm`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={`absolute ${i18n.language === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-(--bg-main) flex items-center justify-center text-(--text-muted) hover:text-red-500 transition-all border border-(--border-color)`}
              >
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Categories Nav */}
          <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto pb-4 lg:pb-0 custom-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 sticky top-0 bg-(--bg-main)/80 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none py-2 lg:py-0">
            <button
              onClick={() => setActiveCategory("all")}
              className={`flex items-center gap-3 whitespace-nowrap px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === "all"
                ? "bg-primary text-white shadow-xl shadow-primary/30 scale-105"
                : "bg-(--bg-card)/50 border border-(--border-color) text-(--text-muted) hover:border-primary/50 hover:bg-(--bg-card)"
                }`}
            >
              <FiGrid className={activeCategory === 'all' ? 'text-white' : 'text-primary'} />
              {t('common.all')}
            </button>

            {availableCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 whitespace-nowrap px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat.id
                  ? "bg-primary text-white shadow-xl shadow-primary/30 scale-105"
                  : "bg-(--bg-card)/50 border border-(--border-color) text-(--text-muted) hover:border-primary/50 hover:bg-(--bg-card)"
                  }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${activeCategory === cat.id ? 'bg-white' : 'bg-primary'}`} />
                {i18n.language === 'ar' ? (cat.nameAr || cat.name) : (cat.nameEn || cat.name)}
              </button>
            ))}
          </div>

          <div className="hidden lg:block mt-auto p-6 rounded-3xl bg-primary/5 border border-primary/10">
            <h4 className="text-xs font-black text-primary uppercase tracking-tighter mb-2">{t('menu.special_offers')}</h4>
            <p className="text-[10px] text-(--text-muted) font-bold leading-relaxed">{t('menu.special_offers_desc')}</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory + searchTerm}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >

            {/* Content Body */}
            {activeCategory === "all" && !searchTerm ? (
              availableCategories.map((cat) => {
                const catItems = items.filter((i) => i.categoryId === cat.id && i.visible !== false);
                if (!catItems.length) return null;
                return (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    items={catItems}
                    orderSystem={orderSystem} // ✅ إضافة
                  />
                );
              })
            ) : (
              <div className="py-2">
                {filteredItems.length > 0 ? (
                  <CategorySection
                    category={{
                      id: "search",
                      name: searchTerm ? t('common.items') :
                        (i18n.language === 'ar' ?
                          (categories.find(c => c.id === activeCategory)?.nameAr || categories.find(c => c.id === activeCategory)?.name || "") :
                          (categories.find(c => c.id === activeCategory)?.nameEn || categories.find(c => c.id === activeCategory)?.name || ""))
                    }}
                    items={filteredItems.filter(i => i.visible !== false)}
                    orderSystem={orderSystem} // ✅ إضافة
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-32 text-(--text-muted) bg-(--bg-card)/30 rounded-[3rem] border border-dashed border-(--border-color)">
                    <div className="w-20 h-20 rounded-3xl bg-(--bg-main) flex items-center justify-center mb-6 text-4xl shadow-inner opacity-40">
                      🔍
                    </div>
                    <p className="text-xl font-black text-(--text-main)">{t('common.error')}</p>
                    <p className="text-sm font-bold mt-2 uppercase tracking-widest opacity-60">{t('menu.no_results')}</p>
                    <button
                      onClick={() => setShowFeedbackModal(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 mt-8"
                    >
                      <FaCommentDots />
                      <span>{t('admin.feedback')}</span>
                    </button>
                    <button
                      onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                      className="mt-4 px-8 py-3 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      {t('common.all')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Feedback Modal */}
      <FeedbackModal
        show={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        orderSystem={orderSystem} // ✅ إضافة
      />
    </div>
  );
}