import { useState, useEffect, useRef } from "react";
import { FaTimes, FaPlus, FaMinus, FaTrash, FaCheckCircle, FaShoppingBasket } from "react-icons/fa";
import { TbCurrencyShekel } from "react-icons/tb";
import { useCart } from "../../context/CartContext";
import OrderTabs from "./OrderTabs";
import { db } from "../../firebase";
import { ref, onValue, push, set } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface OrderSettings {
    inRestaurant: boolean;
    takeaway: boolean;
    inPhone: string;
    outPhone: string;
}

const LOCAL_STORAGE_KEY = "orderSettings";

export default function CartModal({ onClose }: { onClose: () => void }) {
    const { t, i18n } = useTranslation();
    const { items, totalPrice, clearCart, increase, decrease, removeItem } = useCart();

    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [orderSent, setOrderSent] = useState(false);
    const [lastMessage, setLastMessage] = useState<string>("");
    const [orderType, setOrderType] = useState<"in" | "out">("in");
    const [orderSettings, setOrderSettings] = useState<OrderSettings | null>(null);

    const firstInputRef = useRef<HTMLInputElement>(null);

    /* ===== Fetch Settings ===== */
    useEffect(() => {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            setOrderSettings(JSON.parse(localData));
        }

        const settingsRef = ref(db, "settings/orderSettings");
        const unsubscribe = onValue(settingsRef, snapshot => {
            if (snapshot.exists()) {
                const settings = snapshot.val();
                setOrderSettings(settings);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSend = async (
        type: "in" | "out",
        customerData: {
            name: string;
            table?: string;
            phone?: string;
            address?: string;
            notes?: string;
        },
        message: string
    ) => {
        if (!navigator.onLine) {
            setToast({ message: t('common.internet_error') + " ❌", type: 'error' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        try {
            await saveOrderToDB(type, customerData);

            const phone =
                type === "in"
                    ? orderSettings?.inPhone
                    : orderSettings?.outPhone;

            const url =
                "https://wa.me/" +
                phone +
                "?text=" +
                encodeURIComponent(message);

            window.open(url, "_blank");

            setLastMessage(message);
            setOrderSent(true);
            setOrderType(type);
            clearCart();

            setToast({ message: t('common.success'), type: 'success' });
            setTimeout(() => setToast(null), 10000);

        } catch (err) {
            console.error(err);
            setToast({ message: t('common.error'), type: 'error' });
            setTimeout(() => setToast(null), 4000);
        }
    };

    const saveOrderToDB = async (
        type: "in" | "out",
        customerData: {
            name: string;
            table?: string;
            phone?: string;
            address?: string;
            notes?: string;
        }
    ) => {
        const orderRef = push(ref(db, "orders"));

        const orderData = {
            id: orderRef.key,
            orderType: type,
            customer: {
                name: customerData.name,
                table: customerData.table || null,
                phone: customerData.phone || null,
                address: customerData.address || null,
                notes: customerData.notes || "",
            },
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                qty: item.qty,
                price: item.selectedPrice,
                total: item.qty * item.selectedPrice,
            })),
            totalItems: items.reduce((sum, i) => sum + i.qty, 0),
            totalPrice,
            status: "pending",
            createdAt: Date.now(),
        };

        await set(orderRef, orderData);
    };

    const renderMessage = (msg: string) =>
        msg
            .split("\n")
            .map(line => line.trim())
            .filter(Boolean)
            .join("\n");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-(--bg-card) w-full max-w-lg rounded-4xl border border-(--border-color) shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden z-10"
            >
                {/* Header */}
                <div className="p-6 border-b border-(--border-color) flex justify-between items-center bg-(--bg-main)/50">
                    <h2 className="text-2xl font-black text-primary flex items-center gap-3">
                        <span className="bg-primary/10 p-2 rounded-2xl">
                            <FaShoppingBasket size={20} />
                        </span>
                        {t('common.cart')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-2xl bg-(--bg-main) border border-(--border-color) flex items-center justify-center text-(--text-muted) hover:text-primary hover:border-primary/30 transition-all"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {!orderSent ? (
                        <>
                            {items.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center gap-6">
                                    <div className="w-24 h-24 bg-(--bg-main) rounded-full flex items-center justify-center text-5xl opacity-40">
                                        🛍️
                                    </div>
                                    <p className="text-xl font-bold text-(--text-muted)">{t('common.empty_cart')}</p>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                                    >
                                        {t('common.back')}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Items List */}
                                    <div className="space-y-4">
                                        <AnimatePresence mode="popLayout">
                                            {items.map(item => (
                                                <motion.div
                                                    layout
                                                    key={item.priceKey}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9, x: 20 }}
                                                    className="flex items-center gap-4 bg-(--bg-main) rounded-3xl p-4 border border-(--border-color) group"
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-bold text-base text-(--text-main)">
                                                            {item.name}
                                                        </p>
                                                        <div className="flex items-center gap-1 mt-0.5">
                                                            <span className="text-sm font-bold text-primary">{item.selectedPrice}</span>
                                                            <TbCurrencyShekel size={14} className="text-primary opacity-60" />
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3 bg-(--bg-card) p-1.5 rounded-2xl border border-(--border-color)">
                                                        <button
                                                            onClick={() => decrease(item.priceKey)}
                                                            className="w-8 h-8 rounded-xl bg-(--bg-main) text-(--text-main) flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-(--border-color)"
                                                        >
                                                            <FaMinus size={10} />
                                                        </button>

                                                        <span className="min-w-[20px] text-center text-sm font-black text-(--text-main)">
                                                            {item.qty}
                                                        </span>

                                                        <button
                                                            onClick={() => increase(item.priceKey)}
                                                            className="w-8 h-8 rounded-xl bg-(--bg-main) text-(--text-main) flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-(--border-color)"
                                                        >
                                                            <FaPlus size={10} />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeItem(item.priceKey)}
                                                        className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded-xl opacity-0 group-hover:opacity-100"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>

                                    {/* Summary */}
                                    <div className="bg-primary/5 rounded-4xl p-6 border border-primary/10">
                                        <div className="flex justify-between items-center mb-6">
                                            <span className="text-lg font-bold text-(--text-muted)">{t('common.total')}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-black text-primary">{totalPrice}</span>
                                                <TbCurrencyShekel size={24} className="text-primary mt-1" />
                                            </div>
                                        </div>

                                        <OrderTabs
                                            onConfirm={handleSend}
                                            firstInputRef={firstInputRef}
                                            orderSettings={orderSettings ?? undefined}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 text-center py-6"
                        >
                            <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-4xl shadow-2xl shadow-green-500/20">
                                <FaCheckCircle />
                            </div>

                            <div>
                                <h2 className="text-3xl font-black text-(--text-main) mb-2">
                                    {t('common.success')}!
                                </h2>
                                <p className="text-(--text-muted) font-bold uppercase tracking-widest text-sm">
                                    {orderType === "in" ? t('common.dine_in') : t('common.takeaway')}
                                </p>
                            </div>

                            <div className="bg-(--bg-main) p-6 rounded-4xl border border-(--border-color) text-left shadow-inner">
                                <div className={`font-mono text-sm whitespace-pre-wrap text-(--text-main) opacity-80 leading-relaxed ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}>
                                    {renderMessage(lastMessage)}
                                </div>
                                <div className="mt-6 pt-4 border-t border-(--border-color) font-black flex justify-between text-lg text-primary">
                                    <span>{t('common.total')}</span>
                                    <div className="flex items-center gap-1">
                                        <span>{totalPrice}</span>
                                        <TbCurrencyShekel size={20} />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-4 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
                            >
                                {t('common.close')}
                            </button>
                        </motion.div>
                    )}
                </div>
            </motion.div>

            {/* Toast Notifications */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-10 left-1/2 -translate-x-1/2 z-100 px-8 py-4 rounded-2xl font-black shadow-2xl text-white ${toast.type === 'success' ? 'bg-secondary' : 'bg-red-500'
                            }`}
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
