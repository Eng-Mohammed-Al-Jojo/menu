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
  const hasImage = !!item.image;

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
        relative w-full
        animate-item-enter
        ${unavailable ? "opacity-60" : ""}
      `}
    >
      {/* ===== Card ===== */}
      <div
        className={`
          relative flex gap-4 p-4 sm:p-5 rounded-3xl
          bg-linear-to-br from-white/90 to-white/95
          border ${unavailable ? "border-gray-400/40" : "border-[#a70a05]/40"}
          transition-all duration-300
          active:scale-[0.98] md:hover:scale-[1.01]
          shadow-md md:hover:shadow-xl
          font-[Almarai] font-bold hover:scale-105
        `}
      >
        {/* Glow */}
        {!unavailable && (
          <div className="absolute -inset-1 rounded-3xl bg-linear-to-r from-[#FDB143]/10 via-[#FFD369]/20 to-[#FDB143]/10 blur-xl opacity-40 pointer-events-none" />
        )}



        {/* ===== Content ===== */}
        <div className="flex flex-col justify-between flex-1 min-w-0 z-10">
          {/* Name + ingredients */}
          <div>
            <h3
              className={`
                text-lg sm:text-xl md:text-2xl font-extrabold
                leading-snug
                ${unavailable
                  ? "line-through text-gray-300"
                  : "text-[#a70a05]"}
              `}
            >
              {item.name}
            </h3>

            {hasIngredients && (
              <p
                className={`
                  mt-1 text-xs sm:text-sm text-black/80
                  ${unavailable ? "line-through" : ""}
                `}
              >
                {item.ingredients}
              </p>
            )}
          </div>

          {/* ===== Price + Order ===== */}
          <div className="mt-3 flex flex-wrap gap-2">
            {prices.map((p) => {
              const price = Number(p.trim());
              const isAdded = addedPrice === price;

              return (
                <div
                  key={price}
                  className={`
                    flex items-center gap-2 px-3 py-2
                    rounded-xl
                    bg-white/60 backdrop-blur-sm
                    border border-[#FDB143]/30
                    transition-all duration-300
                    active:scale-95
                    ${unavailable ? "opacity-50 line-through" : ""}
                  `}
                >
                  {/* Price */}
                  <span
                    className={`
                      text-sm sm:text-base font-extrabold
                      ${unavailable ? "text-gray-300" : "text-[#a70a05]"}
                    `}
                  >
                    {price}₪
                  </span>

                  {/* Button */}
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
                          : "bg-[#a70a05]/90 hover:scale-110"}
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
        {/* ===== Image ===== */}
        {hasImage && (
          <div
            className="
              w-24 h-24 sm:w-28 sm:h-28
              rounded-2xl overflow-hidden shrink-0
              border border-[#FDB143]/40
              bg-black/30
              animate-image-pop
              z-10
            "
          >
            <img
              src={`/images/${item.image}`}
              alt={item.name}
              loading="lazy"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>

      {/* ===== Toast ===== */}
      {showToast && (
        <div
          className="
            absolute top-1/2 left-1/2
            -translate-x-1/2 -translate-y-full
            bg-[#a70a05]
            text-white font-bold
            px-4 py-2 rounded-2xl
            shadow-lg
            flex items-center gap-2
            animate-toast-show
            pointer-events-none
            z-50
          "
        >
          <FaCheck className="w-4 h-4" />
          <span className="text-sm">تمت إضافة الصنف</span>
        </div>
      )}
    </div>
  );
}
