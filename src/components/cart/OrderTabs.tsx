import { useState } from "react";
import { FaUtensils, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

export default function OrderTabs({
    onConfirm,
}: {
    onConfirm: (msg: string) => void;
}) {
    const { items, totalPrice } = useCart();
    const [tab, setTab] = useState<"in" | "out">("in");
    const [form, setForm] = useState({
        name: "",
        table: "",
        phone: "",
        address: "",
        notes: "",
    });
    const [error, setError] = useState<string | null>(null);

    const buildMessage = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString("ar-EG");
        const timeStr = now.toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' });

        // قائمة الأصناف بشكل مرتب
        const list = items
            .map(i => `🔹 ${i.qty} × ${i.name} → ${Number(i.price) * i.qty}₪`)
            .join("\n");

        if (tab === "in") {
            if (!form.name || !form.table) {
                setError("الرجاء إدخال اسم الزبون ورقم الطاولة");
                return;
            }

            return `✨ *طلب داخل المطعم* ✨
========================
${list}
========================

💰 *الإجمالي:* ${totalPrice}₪
========================

👤 *الاسم:* ${form.name}
🍽️ *رقم الطاولة:* ${form.table}
📝 *ملاحظات:* ${form.notes || "—"}

⏰ *وقت الطلب:* ${timeStr}
📅 *تاريخ الطلب:* ${dateStr}

💵 الدفع عند الكاشير
========================`;
        }

        if (!form.name || !form.phone || !form.address) {
            setError("الرجاء تعبئة جميع بيانات التيك أواي");
            return;
        }

        return `✨ *طلب تيك أواي* ✨
========================
${list}
========================

💰 *الإجمالي:* ${totalPrice}₪
👤 *الاسم:* ${form.name}
📱 *الجوال:* ${form.phone}
🏠 *العنوان:* ${form.address}
📝 *ملاحظات:* ${form.notes || "—"}

⏰ *وقت الطلب:* ${timeStr}
📅 *تاريخ الطلب:* ${dateStr}

💵 الدفع عند الاستلام
========================`;
    };

    const submit = () => {
        setError(null);
        const msg = buildMessage();
        if (msg) onConfirm(msg);
    };

    return (
        <div className="mt-6 space-y-4">
            {/* Tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setTab("in")}
                    className={`flex-1 py-2 rounded-full font-bold flex items-center justify-center gap-2
            ${tab === "in" ? "bg-[#940D11]" : "bg-[#940D11]/30"}`}
                >
                    <FaUtensils /> داخل المطعم
                </button>

                <button
                    onClick={() => setTab("out")}
                    className={`flex-1 py-2 rounded-full font-bold flex items-center justify-center gap-2
            ${tab === "out" ? "bg-[#940D11]" : "bg-[#940D11]/30"}`}
                >
                    <FaShoppingBag /> تيك أواي
                </button>
            </div>

            {/* Error Toast */}
            {error && (
                <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded-xl text-center">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="space-y-2">
                <input
                    placeholder="اسم الزبون"
                    className="w-full p-2 rounded-xl bg-black/30"
                    onChange={e => setForm({ ...form, name: e.target.value })}
                />

                {tab === "in" && (
                    <input
                        placeholder="رقم الطاولة"
                        className="w-full p-2 rounded-xl bg-black/30"
                        onChange={e => setForm({ ...form, table: e.target.value })}
                    />
                )}

                {tab === "out" && (
                    <>
                        <input
                            placeholder="رقم الجوال"
                            className="w-full p-2 rounded-xl bg-black/30"
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                        <input
                            placeholder="العنوان"
                            className="w-full p-2 rounded-xl bg-black/30"
                            onChange={e => setForm({ ...form, address: e.target.value })}
                        />
                    </>
                )}

                <textarea
                    placeholder="ملاحظات (اختياري)"
                    className="w-full p-2 rounded-xl bg-black/30"
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                />
            </div>

            {/* Confirm */}
            <button
                onClick={submit}
                className="w-full py-3 rounded-full bg-[#940D11] font-bold hover:scale-105 transition"
            >
                تأكيد الطلب
            </button>
        </div>
    );
}
