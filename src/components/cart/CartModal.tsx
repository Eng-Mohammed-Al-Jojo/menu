import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import OrderTabs from "./OrderTabs";

export default function CartModal({ onClose }: { onClose: () => void }) {
    const { items, totalPrice, clearCart } = useCart();
    const [toast, setToast] = useState<string | null>(null);
    const [orderSent, setOrderSent] = useState(false);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [orderType, setOrderType] = useState<"in" | "out">("in"); // لتحديد نوع الطلب

    const handleSend = (message: string, type: "in" | "out") => {
        if (!navigator.onLine) {
            setToast("لا يوجد اتصال بالإنترنت ❌");
            setTimeout(() => setToast(null), 3000);
            return;
        }

        const phone = "972592133357"; // رقم المطعم
        const url = "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);
        window.open(url, "_blank");

        setLastMessage(message);
        setOrderSent(true);
        setOrderType(type);
        clearCart();

        setToast("تم إرسال الطلب بنجاح ✅");
        setTimeout(() => setToast(null), 3000);
    };

    if (items.length === 0 && !orderSent) return null;

    const renderMessage = (msg: string) => {
        return msg
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "")
            .map(line => `🔹 ${line}`)
            .join("\n");
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center overflow-auto">
                <div className="bg-[#231F20] w-full max-w-md rounded-3xl p-6 text-[#F7F3E8] relative overflow-y-auto max-h-[90vh] mx-4 my-8">

                    {/* زر الإغلاق */}
                    <button onClick={onClose} className="absolute top-4 left-4 text-xl">
                        <FaTimes />
                    </button>

                    {!orderSent ? (
                        <>
                            <h2 className="text-2xl font-extrabold text-center mb-4">
                                سلة الطلب 🛒
                            </h2>

                            {/* العناصر */}
                            <div className="space-y-3 max-h-56 overflow-auto">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between bg-black/20 rounded-xl p-2">
                                        <span>{item.qty} × {item.name}</span>
                                        <span>{Number(item.price) * item.qty}₪</span>
                                    </div>
                                ))}
                            </div>

                            {/* الإجمالي */}
                            <div className="mt-4 text-lg font-bold flex justify-between">
                                <span>الإجمالي</span>
                                <span>{totalPrice}₪</span>
                            </div>

                            {/* الفورم */}
                            <OrderTabs onConfirm={(msg) => handleSend(msg, "in")} />
                        </>
                    ) : (
                        <div className="space-y-4 text-center">
                            <h2 className="text-2xl font-bold text-[#FFD700] mb-2">
                                {orderType === "in" ? "🍽️ طلب داخل المطعم" : "🛍️ طلب تيك أواي"}
                            </h2>
                            <p className="text-sm text-[#F7F3E8]/70 mb-4">
                                سيتم تحضير طلبك في أسرع وقت ممكن. 💨
                            </p>

                            {/* كارت الطلبية */}
                            <div className="bg-black/20 p-4 rounded-2xl max-h-72 overflow-auto text-left whitespace-pre-wrap wrap-break-word font-medium text-sm">
                                {renderMessage(lastMessage)}
                                <div className="mt-2 font-bold text-lg flex justify-between">
                                    <span>💰 الإجمالي</span>
                                    <span>{totalPrice}₪</span>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-4 w-full py-3 rounded-full bg-[#940D11] font-bold hover:scale-105 transition"
                            >
                                أغلق
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {toast && (
                <div className="fixed top-6 right-6 z-50 bg-[#940D11] text-white px-6 py-3 rounded-2xl font-bold shadow-2xl">
                    {toast}
                </div>
            )}
        </>
    );
}
