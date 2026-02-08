import { type Item } from "./Menu";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { FaCheck } from "react-icons/fa";

interface Props {
  item: Item;
  orderSystem: boolean;
}

export default function ItemRow({ item, orderSystem }: Props) {
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;

  const { addItem } = useCart();
  const [addedPrice, setAddedPrice] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  const hasIngredients = !!item.ingredients;

  const handleAdd = (price: number) => {
    addItem(item, price);
    setAddedPrice(price);
    setShowToast(true);

    setTimeout(() => {
      setAddedPrice(null);
      setShowToast(false);
    }, 1000);
  };

  return (
    <div
      className={`
        relative w-full h-full
        ${unavailable ? "opacity-60" : ""}
      `}
    >
      {/* ===== Card ===== */}
      <div
        className={`
          relative flex flex-col h-full
          rounded-3xl overflow-hidden
          bg-linear-to-br from-white/90 to-white/95
          border ${unavailable ? "border-gray-400/40" : "border-[#a70a05]/40"}
          shadow-md transition-all duration-300
          active:scale-[0.98]
          font-[Almarai] font-bold
        `}
      >
        {/* ===== Image ===== */}
        <div className="w-full h-32 sm:h-36 bg-black/20 overflow-hidden">
          <img
            src={item.image ? `/images/${item.image}` : "/logo.png"}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/logo.png";
            }}
          />
        </div>/ // /

        {/* ===== Content ===== */}
        <div className="p-3 flex flex-col gap-2 flex-1">
          {/* Name */}
          <h3
            className={`
              text-sm sm:text-base font-extrabold leading-snug
              ${unavailable
                ? "line-through text-gray-300"
                : "text-[#a70a05]"}
            `}
          >
            {item.name}
          </h3>

          {/* Ingredients */}
          {hasIngredients && (
            <p
              className={`
                text-[11px] sm:text-xs text-black/70 line-clamp-2
                ${unavailable ? "line-through" : ""}
              `}
            >
              {item.ingredients}
            </p>
          )}

          {/* ===== Prices + Add ===== */}
          <div className="mt-auto flex flex-col gap-2">
            {prices.map((p) => {
              const price = Number(p.trim());
              const isAdded = addedPrice === price;

              return (
                <div
                  key={price}
                  className={`
                    flex items-center justify-between
                    px-2 py-1.5 rounded-xl
                    bg-white/80 border border-[#FDB143]/30
                    transition
                    ${unavailable ? "opacity-50 line-through" : ""}
                  `}
                >
                  <span className="text-sm font-extrabold text-[#a70a05]">
                    {price}₪
                  </span>

                  {orderSystem && !unavailable && (
                    <button
                      onClick={() => handleAdd(price)}
                      className={`
                        w-7 h-7 flex items-center justify-center
                        rounded-md text-white font-bold
                        transition-all duration-300
                        active:scale-90
                        ${isAdded
                          ? "bg-[#a70a05]"
                          : "bg-[#a70a05]/90 hover:scale-110"
                        }
                      `}
                    >
                      {isAdded ? (
                        <FaCheck className="animate-pulse" />
                      ) : (
                        <span className="text-lg">+</span>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== Toast ===== */}
      {showToast && (
        <div
          className="
            absolute top-2 left-1/2
            -translate-x-1/2
            bg-[#a70a05]
            text-white font-bold
            px-3 py-1.5 rounded-xl
            shadow-lg
            flex items-center gap-2
            animate-toast-show
            pointer-events-none
            z-50
          "
        >
          <FaCheck className="w-4 h-4" />
          <span className="text-xs">تمت الإضافة</span>
        </div>
      )}
    </div>
  );
}
