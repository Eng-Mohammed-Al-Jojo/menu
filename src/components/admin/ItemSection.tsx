import React, { useState, useEffect } from "react";
import { ref, push, update } from "firebase/database";
import { db } from "../../firebase";
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiChevronDown, FiStar, FiImage, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import type { PopupState, Category, Item } from "./types";
import FeaturedGallery from "./FeaturedGallery";
import CustomSelect from "./CustomSelect";

/* ================== auto load feature images ================== */
const galleryImages = Object.keys(
  import.meta.glob("/public/images/*")
).map((path) => path.replace("/public/images/", ""));

interface Props {
  categories: Record<string, Category>;
  items: Record<string, Item>;
  popup: PopupState;
  setPopup: (popup: PopupState) => void;
}

const ItemSection: React.FC<Props> = ({ categories, items, setPopup }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemNameAr, setItemNameAr] = useState("");
  const [itemNameEn, setItemNameEn] = useState("");
  const [itemIngredientsAr, setItemIngredientsAr] = useState("");
  const [itemIngredientsEn, setItemIngredientsEn] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [quickSearch, setQuickSearch] = useState("");
  const [formLang, setFormLang] = useState<"ar" | "en">("ar");

  const [selectedCategoryError, setSelectedCategoryError] = useState(false);
  const [itemNameError, setItemNameError] = useState(false);
  const [itemPriceError, setItemPriceError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [showGallery, setShowGallery] = useState(false);
  const [galleryForItemId, setGalleryForItemId] = useState<string | null>(null);
  const [itemImage, setItemImage] = useState("");
  const [localItems, setLocalItems] = useState<Record<string, Item>>(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const addItem = async () => {
    let hasError = false;
    if (!selectedCategory) { setSelectedCategoryError(true); hasError = true; }
    if (!itemNameAr.trim() && !itemNameEn.trim()) { setItemNameError(true); hasError = true; }

    const priceArray = itemPrice.split(",").map(p => p.trim());
    if (!itemPrice.trim() || priceArray.some(p => isNaN(Number(p)) || Number(p) <= 0)) {
      setItemPriceError(true);
      hasError = true;
    }

    if (hasError) return;

    await push(ref(db, "items"), {
      name: itemNameAr || itemNameEn, // Fallback for legacy logic
      nameAr: itemNameAr,
      nameEn: itemNameEn,
      ingredients: itemIngredientsAr || itemIngredientsEn, // Fallback
      ingredientsAr: itemIngredientsAr,
      ingredientsEn: itemIngredientsEn,
      price: itemPrice,
      categoryId: selectedCategory,
      visible: true,
      createdAt: Date.now(),
      image: itemImage || "",
      star: false,
    });

    setItemNameAr("");
    setItemNameEn("");
    setItemIngredientsAr("");
    setItemIngredientsEn("");
    setItemPrice("");
    setSelectedCategory("");
    setItemImage("");

    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  };

  const toggleItem = async (id: string, visible: boolean) => {
    await update(ref(db, `items/${id}`), { visible: !visible });
  };

  const updateImage = async (id: string, image: string) => {
    await update(ref(db, `items/${id}`), { image });
  };

  const removeImage = async (id: string) => {
    await update(ref(db, `items/${id}`), { image: "" });
  };

  const openGallery = (itemId: string, currentImage?: string) => {
    setGalleryForItemId(itemId);
    setItemImage(currentImage || "");
    setShowGallery(true);
  };

  const handleSelectImage = async (img: string) => {
    if (!galleryForItemId) return;
    await updateImage(galleryForItemId, img);
    setShowGallery(false);
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative group">
        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-(--text-muted) group-focus-within:text-primary transition-colors text-xl" />
        <input
          className="w-full bg-(--bg-card) border border-(--border-color) rounded-3xl py-4 pl-14 pr-6 text-base font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-premium"
          placeholder="إبحث عن صنف، قسم، أو سعر..."
          value={quickSearch}
          onChange={(e) => setQuickSearch(e.target.value)}
        />
      </div>

      {/* Adding Form */}
      <div className="bg-(--bg-card) p-8 rounded-[2.5rem] border border-(--border-color) shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-colors" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl shadow-inner">
              <FiPlus />
            </div>
            <div>
              <h2 className="text-2xl font-black text-(--text-main)">إضافة صنف جديد</h2>
              <p className="text-(--text-muted) text-sm font-medium">أدخل تفاصيل الطبق الجديد لإضافته للمنيو</p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex bg-(--bg-main) p-1 rounded-xl border border-(--border-color)">
            <button
              onClick={() => setFormLang("ar")}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${formLang === "ar" ? "bg-primary text-white shadow-md" : "text-(--text-muted) hover:text-primary"}`}
            >
              العربية (AR)
            </button>
            <button
              onClick={() => setFormLang("en")}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${formLang === "en" ? "bg-primary text-white shadow-md" : "text-(--text-muted) hover:text-primary"}`}
            >
              English (EN)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-(--text-muted) mr-2">القسم</label>
            <CustomSelect
              options={Object.keys(categories).map(id => ({ id, name: categories[id].name }))}
              value={selectedCategory}
              onChange={(val) => { setSelectedCategory(val); setSelectedCategoryError(false); }}
              error={selectedCategoryError}
              placeholder="اختر القسم..."
            />
            <AnimatePresence>
              {selectedCategoryError && (
                <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-xs text-red-500 font-bold mr-2">
                  الرجاء اختيار قسم
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-(--text-muted) mr-2">
              {formLang === "ar" ? "اسم الصنف (بالعربية)" : "Item Name (English)"}
            </label>
            <input
              className={`w-full bg-(--bg-main) border px-5 py-3 rounded-2xl text-sm font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all
                ${itemNameError ? "border-red-500" : "border-(--border-color)"}`}
              placeholder={formLang === "ar" ? "مثل: بيتزا مارجريتا" : "e.g., Margherita Pizza"}
              value={formLang === "ar" ? itemNameAr : itemNameEn}
              onChange={(e) => {
                if (formLang === "ar") setItemNameAr(e.target.value);
                else setItemNameEn(e.target.value);
                setItemNameError(false);
              }}
            />
            <AnimatePresence>
              {itemNameError && (
                <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-xs text-red-500 font-bold mr-2">
                  الرجاء إدخال اسم الصنف
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-black uppercase tracking-widest text-(--text-muted) mr-2">
              {formLang === "ar" ? "المكونات أو الوصف (بالعربية)" : "Ingredients or Description (English)"}
            </label>
            <input
              className="w-full bg-(--bg-main) border border-(--border-color) px-5 py-3 rounded-2xl text-sm font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              placeholder={formLang === "ar" ? "وصف مختصر للطبق..." : "Short description..."}
              value={formLang === "ar" ? itemIngredientsAr : itemIngredientsEn}
              onChange={(e) => {
                if (formLang === "ar") setItemIngredientsAr(e.target.value);
                else setItemIngredientsEn(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-black uppercase tracking-widest text-(--text-muted) mr-2">الأسعار</label>
            <input
              className={`w-full bg-(--bg-main) border px-5 py-3 rounded-2xl text-sm font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all
                ${itemPriceError ? "border-red-500" : "border-(--border-color)"}`}
              placeholder="مثال: 50, 40 (افصل بفاصلة لعدة أحجام)"
              value={itemPrice}
              onChange={(e) => { setItemPrice(e.target.value); setItemPriceError(false); }}
            />
            <AnimatePresence>
              {itemPriceError && (
                <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-xs text-red-500 font-bold mr-2">
                  الرجاء إدخال أسعار صحيحة مفصولة بفواصل
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-end">
            <button
              onClick={addItem}
              className="w-full h-[52px] bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <FiPlus className="text-xl" />
              إضافة الصنف للمنيو
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute inset-0 bg-primary/95 flex items-center justify-center z-50 rounded-[2.5rem]"
            >
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
                <h3 className="text-2xl font-black">تمت الإضافة بنجاح</h3>
                <p className="opacity-80 font-bold mt-1 uppercase tracking-widest text-xs">Menu updated successfully</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Items by Category */}
      <div className="space-y-6">
        {Object.entries(categories)
          .sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
          .map(([catId, cat]) => {
            const catItems = Object.keys(localItems)
              .map(id => ({ ...localItems[id], id }))
              .filter(item => item.categoryId === catId)
              .filter(item => {
                const search = quickSearch.toLowerCase();
                return (
                  item.name.toLowerCase().includes(search) ||
                  cat.name.toLowerCase().includes(search) ||
                  String(item.price).includes(search)
                );
              });

            if (quickSearch && catItems.length === 0) return null;

            const isExpanded = expandedSections[catId] ?? false;

            return (
              <div key={catId} className="bg-(--bg-card) border border-(--border-color) rounded-4xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleSection(catId)}
                  className="w-full text-right p-6 flex items-center justify-between group bg-(--bg-main)/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                      <FiChevronDown className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-(--text-main)">{cat.name}</h3>
                      <p className="text-(--text-muted) text-xs font-bold uppercase tracking-widest mt-0.5">{catItems.length} {catItems.length === 1 ? 'Item' : 'Items'}</p>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-2 divide-y divide-(--border-color)">
                        {catItems.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`flex flex-col sm:flex-row items-center gap-6 py-4 transition-all ${!item.visible ? "opacity-40 grayscale" : ""}`}
                          >
                            {/* Image Part */}
                            <div className="relative group/img">
                              {item.image ? (
                                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-(--border-color) shadow-inner">
                                  <img
                                    src={`/images/${item.image}`}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500"
                                    onError={(e) => { e.currentTarget.src = "/logo.png" }}
                                  />
                                  <button
                                    onClick={() => removeImage(item.id)}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover/img:scale-100 transition-transform"
                                  >
                                    <FiMinus size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => openGallery(item.id)}
                                  className="w-20 h-20 bg-(--bg-main) border-2 border-dashed border-(--border-color) rounded-2xl flex flex-col items-center justify-center text-(--text-muted) hover:text-primary hover:border-primary/50 transition-all gap-1"
                                >
                                  <FiImage size={24} />
                                  <span className="text-[10px] font-black uppercase tracking-tighter">Add</span>
                                </button>
                              )}
                              <button
                                onClick={() => openGallery(item.id, item.image)}
                                className="absolute -bottom-2 -left-2 w-8 h-8 bg-white border border-(--border-color) rounded-xl flex items-center justify-center text-primary shadow-sm opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                <FiImage size={14} />
                              </button>
                            </div>

                            {/* Info Part */}
                            <div className="flex-1 min-w-0 flex flex-col gap-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-black text-lg text-(--text-main) truncate">{item.name}</h4>
                                {item.star && <FiStar className="text-yellow-400 fill-yellow-400" size={16} />}
                              </div>
                              {item.ingredients && <p className="text-xs text-(--text-muted) font-medium line-clamp-1">{item.ingredients}</p>}
                              <p className="text-primary font-black text-sm">{item.price} <span className="text-[10px] uppercase opacity-70">₪</span></p>
                            </div>

                            {/* Actions Part */}
                            <div className="flex items-center gap-3 bg-(--bg-main) p-1.5 rounded-2xl border border-(--border-color)">
                              <button
                                onClick={() => toggleItem(item.id, item.visible)}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 border
                                        ${item.visible ? "bg-green-500 border-green-500/20" : "bg-gray-300 border-gray-400"}`}
                              >
                                <motion.span
                                  animate={{ x: item.visible ? 24 : 2 }}
                                  className="absolute top-0.5 left-0 w-4.5 h-4.5 rounded-full bg-white shadow-md"
                                />
                              </button>

                              <div className="w-px h-6 bg-(--border-color)" />

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={async () => {
                                    const newStar = !item.star;
                                    await update(ref(db, `items/${item.id}`), { star: newStar });
                                  }}
                                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${item.star ? "bg-yellow-100 text-yellow-600" : "hover:bg-yellow-50 text-(--text-muted)"}`}
                                >
                                  <FiStar size={18} fill={item.star ? "currentColor" : "none"} />
                                </button>
                                <button
                                  onClick={() => setPopup({ type: "editItem", id: item.id })}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-primary/10 hover:text-primary text-(--text-muted) transition-all"
                                >
                                  <FiEdit size={18} />
                                </button>
                                <button
                                  onClick={() => setPopup({ type: "deleteItem", id: item.id })}
                                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 hover:text-red-500 text-(--text-muted) transition-all"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}

                        {catItems.length === 0 && (
                          <div className="py-12 text-center">
                            <p className="text-(--text-muted) font-bold">لا يوجد أصناف في هذا القسم حالياً</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
      </div>

      <FeaturedGallery
        visible={showGallery}
        onClose={() => setShowGallery(false)}
        onSelect={handleSelectImage}
        galleryImages={galleryImages}
        selectedImage={itemImage}
      />
    </div>
  );
};

export default ItemSection;
