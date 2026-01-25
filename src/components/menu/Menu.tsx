import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { ref, onValue } from "firebase/database";
import CategorySection from "./CategorySection";

/* ================= Types ================= */
export interface Category {
  id: string;
  name: string;
  available?: boolean;
  createdAt?: number;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  ingredients?: string;
  priceTw?: number;
  categoryId: string;
  visible?: boolean;
  createdAt?: number;
}

/* ================= LocalStorage ================= */
const saveToLocal = (cats: Category[], its: Item[]) => {
  localStorage.setItem(
    "menu_cache",
    JSON.stringify({ categories: cats, items: its, savedAt: Date.now() })
  );
};

const loadFromLocal = () => {
  const cached = localStorage.getItem("menu_cache");
  if (!cached) return null;
  return JSON.parse(cached);
};
/* ======================================== */

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string;
    color: "green" | "red";
  } | null>(null);

  useEffect(() => {
    let timeoutId: number | null = null;
    let firebaseLoaded = false;

    const loadOnline = () => {
      let cats: Category[] = [];
      let its: Item[] = [];
      let catsLoaded = false;
      let itemsLoaded = false;

      timeoutId = setTimeout(() => {
        if (!firebaseLoaded) {
          const cached = loadFromLocal();
          if (cached) {
            setCategories(cached.categories || []);
            setItems(cached.items || []);
            setLoading(false);

            setToast({
              message: "الإنترنت ضعيف، تم تحميل آخر نسخة محفوظة",
              color: "red",
            });
            setTimeout(() => setToast(null), 4000);
          }
        }
      }, 8000);

      const finishFirebase = () => {
        firebaseLoaded = true;
        saveToLocal(cats, its);
        setLoading(false);
        if (timeoutId) clearTimeout(timeoutId);

        setToast({
          message: "تم التحميل من قاعدة البيانات",
          color: "green",
        });
        setTimeout(() => setToast(null), 3000);
      };

      onValue(ref(db, "categories"), (snap) => {
        const data = snap.val();
        cats = data
          ? Object.entries(data).map(([id, v]: any) => ({
            id,
            name: v.name,
            available: v.available !== false, // الافتراضي متوفر
            createdAt: v.createdAt || 0,
          }))
          : [];

        setCategories(cats);
        catsLoaded = true;
        if (itemsLoaded) finishFirebase();
      });

      onValue(ref(db, "items"), (snap) => {
        const data = snap.val();
        its = data
          ? Object.entries(data).map(([id, v]: any) => ({
            id,
            ...v,
            createdAt: v.createdAt || 0,
          }))
          : [];

        setItems(its);
        itemsLoaded = true;
        if (catsLoaded) finishFirebase();
      });
    };

    const loadOffline = async () => {
      try {
        const res = await fetch("/menu-data.json");
        const data = await res.json();

        const cats = Object.entries(data.categories || {}).map(
          ([id, v]: any) => ({
            id,
            name: v.name,
            available: v.available !== false,
            createdAt: v.createdAt || 0,
          })
        );

        const its = Object.entries(data.items || {}).map(([id, v]: any) => ({
          id,
          ...v,
          createdAt: v.createdAt || 0,
        }));

        setCategories(cats);
        setItems(its);
        setLoading(false);

        setToast({
          message: "أنت غير متصل – نسخة محلية ثابتة",
          color: "red",
        });
        setTimeout(() => setToast(null), 4000);
      } catch {
        setLoading(false);
      }
    };

    if (navigator.onLine) loadOnline();
    else loadOffline();
  }, []);

  /* ========= فلترة الأقسام المتوفرة فقط ========= */
  const availableCategories = categories.filter(
    (cat) => cat.available
  );

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#231F20] font-[Almarai] font-bold">
        <div className="relative w-56 h-56 mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-contain rounded-full shadow-2xl animate-pulseScale"
          />
          <div className="absolute inset-0 rounded-full border-4 border-[#940D11]/50 animate-ping"></div>
        </div>

        <h2 className="text-3xl md:text-5xl font-extrabold text-[#F7F3E8]">
          يتم تحضير القائمة
          <span className="text-[#940D11] animate-ping ml-1">...</span>
        </h2>

        <p className="mt-4 text-[#F7F3E8]/70 text-lg md:text-xl font-[Alamiri]">
          انتظر قليلاً، سيتم عرض كل الأصناف قريباً
        </p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 pb-20 space-y-8 font-[Alamiri] text-[#F7F3E8] bg-[#231F20] min-h-screen">
      {toast && (
        <div
          className="fixed top-6 right-6 px-6 py-3 rounded-2xl font-bold shadow-2xl z-50 text-white"
          style={{ background: "#940D11" }}
        >
          {toast.message}
        </div>
      )}

      {/* ===== Filter Tabs ===== */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-2 rounded-full font-bold transition font-[Cairo] ${activeCategory === null
              ? "bg-[#940D11] text-white shadow-lg text-sm md:text-md"
              : "bg-[#E0E0E0] text-[#221E1F] text-xs md:text-md"
            }`}
        >
          جميع الأصناف
        </button>

        {availableCategories
          .filter((cat) =>
            items.some((i) => i.categoryId === cat.id)
          )
          .map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-bold transition font-[Cairo] ${activeCategory === cat.id
                  ? "bg-[#940D11] text-white shadow-lg text-sm md:text-md"
                  : "bg-[#E0E0E0] text-[#221E1F] text-xs md:text-md"
                }`}
            >
              {cat.name}
            </button>
          ))}
      </div>

      {/* ===== عرض الأقسام والأصناف ===== */}
      {(activeCategory
        ? availableCategories.filter((c) => c.id === activeCategory)
        : availableCategories
      ).map((cat) => {
        const catItems = items.filter(
          (i) => i.categoryId === cat.id
        );
        if (!catItems.length) return null;

        return (
          <CategorySection
            key={cat.id}
            category={cat}
            items={catItems}
          />
        );
      })}
    </main>
  );
}
