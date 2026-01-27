import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import CartModal from "./CartModal";

export default function CartButton() {
    const { totalItems } = useCart();
    const [open, setOpen] = useState(false);

    if (totalItems === 0) return null;

    return (
        <>
            {/* زر الكارت */}
            <button
                onClick={() => setOpen(true)}
                className="
          fixed bottom-6 right-6 z-40
          flex items-center gap-2
          bg-[#FDB143] text-[#040309]
          px-4 py-3 rounded-full
          shadow-2xl
          hover:scale-105 transition
          font-[Cairo] font-bold
        "
            >
                <FaShoppingCart className="text-xl" />
                <span className="text-sm">{totalItems}</span>
            </button>

            {/* المودال */}
            {open && <CartModal onClose={() => setOpen(false)} />}
        </>
    );
}
