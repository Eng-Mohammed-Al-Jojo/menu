import { type Item } from "./Menu";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { FiPlus, FiCheck, FiStar, FiShoppingBag } from "react-icons/fi";
import { TbCurrencyShekel } from "react-icons/tb";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Props {
  item: Item;
  orderSystem: boolean;
  featuredMode?: boolean;
}

export default function ItemRow({ item, orderSystem, featuredMode }: Props) {
  const { t, i18n } = useTranslation();
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;
  const isRtl = i18n.language === 'ar';

  const itemName = isRtl ? (item as any).nameAr || item.name : (item as any).nameEn || item.name;
  const itemIngredients = isRtl ? (item as any).ingredientsAr || item.ingredients : (item as any).ingredientsEn || item.ingredients;

  const { addItem } = useCart();
  const [addedPrice, setAddedPrice] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleAdd = (price: number) => {
    addItem(item, price);
    setAddedPrice(price);
    setShowToast(true);

    setTimeout(() => {
      setAddedPrice(null);
      setShowToast(false);
    }, 1500);
  };

  return (
    <motion.div
      layout
      className={`relative group h-full flex flex-col bg-(--bg-card)/60 backdrop-blur-md rounded-4xl border border-(--border-color) overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/30 transition-all duration-500 ${unavailable ? "opacity-60 grayscale-[0.8]" : ""
        } ${featuredMode ? "ring-2 ring-primary/20 bg-linear-to-b from-primary/10 to-transparent shadow-lg shadow-primary/5" : ""}`}
    >
      {/* Image Container - Reduced size for compact layout */}
      <div className={`relative overflow-hidden ${featuredMode ? "h-40 sm:h-44" : "h-32 sm:h-36"}`}>
        <motion.img
          whileHover={{ scale: 1.15, rotate: 2 }}
          transition={{ duration: 0.8 }}
          src={item.image ? `/images/${item.image}` : "/logo.png"}
          alt={item.name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/logo.png";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {item.star && (
            <div className="bg-amber-400 text-white p-2 rounded-xl shadow-lg shadow-amber-400/20 backdrop-blur-md">
              <FiStar fill="currentColor" size={12} />
            </div>
          )}

        </div>

        {unavailable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/90 text-black px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white">
              {t('common.unavailable')}
            </span>
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col flex-1 gap-1.5">
        <div className="flex justify-between items-start gap-2">
          <h3 className={`text-sm sm:text-base font-black leading-tight flex-1 ${unavailable ? "text-(--text-muted)" : "text-(--text-main)"}`}>
            {itemName}
          </h3>
          {featuredMode && <span className="text-primary opacity-50"><FiShoppingBag size={14} /></span>}
        </div>

        {itemIngredients && (
          <p className="text-[10px] sm:text-xs text-(--text-muted) font-medium line-clamp-2 leading-relaxed opacity-80">
            {itemIngredients}
          </p>
        )}

        {/* Pricing Area - Redesigned for Compactness */}
        {/* Pricing Area */}
        <div className="mt-auto pt-3">

          {/* ===== When order system OFF ===== */}
          {!orderSystem && (
            <div className="flex items-center gap-2 pl-1">
              <span className="text-base font-black text-primary">
                {prices.map((p) => Number(p.trim())).join(" - ")}
              </span>

              <TbCurrencyShekel
                size={18}
                className="text-(--text-muted) opacity-70"
              />
            </div>
          )}

          {/* ===== When order system ON ===== */}
          {orderSystem && (
            <div className="flex flex-col gap-2">
              {prices.map((p, idx) => {
                const price = Number(p.trim());
                const isAdded = addedPrice === price;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between gap-2 p-1 rounded-xl border transition-all duration-300 group/price ${isAdded
                      ? "bg-green-50/50 border-green-200"
                      : "bg-(--bg-main)/50 border-(--border-color) hover:border-primary/40 hover:bg-(--bg-main)"
                      }`}
                  >
                    <div className="pl-3 flex items-center gap-1">
                      <span
                        className={`text-base font-black ${isAdded ? "text-green-600" : "text-primary"
                          }`}
                      >
                        {price}
                      </span>

                      <TbCurrencyShekel
                        size={16}
                        className="text-(--text-muted)"
                      />
                    </div>

                    {!unavailable && (
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAdd(price)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-500 shadow-sm ${isAdded
                          ? "bg-green-500 text-white shadow-green-500/20"
                          : "bg-(--bg-card) text-(--text-muted) hover:bg-primary hover:text-white hover:shadow-primary/20 border border-(--border-color)"
                          }`}
                      >
                        {isAdded ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <FiCheck strokeWidth={4} size={14} />
                          </motion.div>
                        ) : (
                          <FiPlus size={14} />
                        )}
                      </motion.button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-green-500/10 backdrop-blur-[2px] pointer-events-none z-10 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 20 }} animate={{ y: 0 }}
              className="bg-white text-green-500 p-2 rounded-full shadow-2xl"
            >
              <FiCheck strokeWidth={4} size={24} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
