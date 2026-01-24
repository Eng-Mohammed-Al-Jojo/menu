import { type Item } from "./Menu";
import { useCart } from "../../context/CartContext";

interface Props {
  item: Item;
}

export default function ItemRow({ item }: Props) {
  const prices = String(item.price).split(",");
  const unavailable = item.visible === false;

  const { items, addItem, increase, decrease } = useCart();
  const cartItem = items.find(i => i.id === item.id);

  return (
    <div
      className={`rounded-3xl p-0.5 transition-all duration-300 ${unavailable ? "opacity-60" : "hover:scale-105"}`}
    >
      <div
        className={`
          relative rounded-xl px-5 py-4
          bg-[#231F20] border-2 border-[#940D11]/50
          shadow-inner shadow-[#940D11]/40
          transition-all duration-500 font-[Almarai] font-bold
          flex flex-col
        `}
      >
        {/* Glow effect */}
        {!unavailable && (
          <div className="absolute inset-0 rounded-4xl bg-[#940D11]/10 animate-pulse z-0"></div>
        )}

        {/* Name + Ingredients */}
        <div className="relative z-10 text-[#F7F3E8] mb-3">
          <h3
            className={`text-lg md:text-xl font-extrabold wrap-break-word ${unavailable ? "line-through decoration-[#F7F3E8]/50 decoration-2" : ""}`}
          >
            {item.name}
          </h3>

          {item.ingredients && (
            <p className={`mt-1 text-xs md:text-sm wrap-break-word ${unavailable ? "line-through decoration-[#F7F3E8]/30 decoration-1" : ""}`}>
              {item.ingredients}
            </p>
          )}
        </div>

        {/* Prices */}
        <div className="relative z-10 text-sm md:text-md text-[#F7F3E8]/80 flex flex-wrap gap-2 mb-3">
          {prices.map((p, i) => (
            <span key={i} className="flex items-center">
              {p.trim()}₪
              {i !== prices.length - 1 && <span className="mx-1 text-[#F7F3E8]/40">|</span>}
            </span>
          ))}
        </div>

        {/* Cart Controls في الجهة اليمنى */}
        <div className="flex justify-end mt-1 z-10">
          {!unavailable ? (
            !cartItem ? (
              <button
                onClick={() => addItem(item)}
                className="w-9 h-9 rounded-full bg-[#940D11] text-white font-extrabold text-lg hover:scale-110 transition shadow-lg"
              >
                +
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-[#940D11]/20 rounded-full px-2 py-1">
                <button onClick={() => decrease(item.id)} className="w-7 h-7 rounded-full bg-[#940D11] text-white">
                  −
                </button>

                <span className="min-w-[20px] text-center text-sm font-bold">{cartItem.qty}</span>

                <button onClick={() => increase(item.id)} className="w-7 h-7 rounded-full bg-[#940D11] text-white">
                  +
                </button>
              </div>
            )
          ) : (
            <span className="text-red-400 font-bold text-sm">غير متوفر حالياً</span>
          )}
        </div>
      </div>
    </div>
  );
}
