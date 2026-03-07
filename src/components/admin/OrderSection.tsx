import React, { useState } from "react";
import { ref, update, remove } from "firebase/database";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaUtensils, FaShoppingBag, FaClock, FaTrash, FaHistory } from "react-icons/fa";

interface Props {
    orders: Record<string, any>;
}

const OrderSection: React.FC<Props> = ({ orders }) => {
    const [openOrder, setOpenOrder] = useState<string | null>(null);

    const orderArray = Object.entries(orders || {})
        .map(([id, order]) => ({ id, ...order }))
        .sort((a, b) => b.createdAt - a.createdAt);

    const toggleOrder = (id: string) => {
        setOpenOrder(openOrder === id ? null : id);
    };

    const updateStatus = (id: string, status: string) => {
        update(ref(db, `orders/${id}`), { status });
    };

    const deleteOrder = (id: string) => {
        if (confirm("Are you sure you want to delete this order?")) {
            remove(ref(db, `orders/${id}`));
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "preparing": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "done": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-black text-primary flex items-center gap-3">
                        <FaHistory className="text-2xl" />
                        لوحة الطلبات
                    </h2>
                    <p className="text-(--text-muted) text-sm font-medium mt-1">
                        إدارة الطلبات الحالية والسابقة
                    </p>
                </div>
                <div className="bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
                    <span className="text-primary font-black text-lg">{orderArray.length}</span>
                    <span className="text-(--text-muted) text-xs font-bold mr-2">طلب إجمالي</span>
                </div>
            </header>

            <div className="grid gap-4">
                <AnimatePresence mode="popLayout">
                    {orderArray.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-(--bg-card) rounded-4xl p-12 text-center border border-dashed border-(--border-color)"
                        >
                            <div className="w-20 h-20 bg-(--bg-main) rounded-full flex items-center justify-center mx-auto mb-4 text-3xl opacity-30">
                                📋
                            </div>
                            <p className="text-(--text-muted) font-bold">لا يوجد طلبات حالياً</p>
                        </motion.div>
                    ) : (
                        orderArray.map((order, index) => {
                            const isOpen = openOrder === order.id;
                            const statusStyles = getStatusStyles(order.status || "pending");

                            return (
                                <motion.div
                                    layout
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`bg-(--bg-card) rounded-4xl border transition-all duration-300 ${isOpen ? "border-primary shadow-xl ring-4 ring-primary/5" : "border-(--border-color) hover:border-primary/30"
                                        }`}
                                >
                                    <button
                                        onClick={() => toggleOrder(order.id)}
                                        className="w-full text-right flex flex-col md:flex-row md:items-center gap-4 p-6"
                                    >
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-inner ${order.orderType === "in" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                                                }`}>
                                                {order.orderType === "in" ? <FaUtensils /> : <FaShoppingBag />}
                                            </div>
                                            <div>
                                                <h3 className="font-black text-lg text-(--text-main) flex items-center gap-2">
                                                    {order.customer?.name || "زبون"}
                                                    {order.customer?.table && (
                                                        <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">
                                                            طاولة {order.customer.table}
                                                        </span>
                                                    )}
                                                </h3>
                                                <div className="flex items-center gap-3 text-xs text-(--text-muted) font-bold mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <FaClock />
                                                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{order.items?.length} أصناف</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0">
                                            <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusStyles}`}>
                                                {order.status || "pending"}
                                            </div>
                                            <div className="text-xl font-black text-primary">
                                                {order.totalPrice} <span className="text-xs">₪</span>
                                            </div>
                                            <div className={`text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                                                <FaChevronDown />
                                            </div>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 pt-2 border-t border-(--border-color) bg-(--bg-main)/30">
                                                    <div className="grid md:grid-cols-2 gap-8 py-4">
                                                        <div className="space-y-4">
                                                            <h4 className="text-xs font-black uppercase tracking-widest text-(--text-muted) flex items-center gap-2">
                                                                <span className="w-1 h-3 bg-primary rounded-full" />
                                                                تفاصيل الزبون
                                                            </h4>
                                                            <div className="bg-(--bg-card) p-4 rounded-2xl border border-(--border-color) space-y-2">
                                                                {order.customer?.phone && <p className="text-sm font-bold text-(--text-main)">📞 {order.customer.phone}</p>}
                                                                {order.customer?.address && <p className="text-sm font-bold text-(--text-main)">📍 {order.customer.address}</p>}
                                                                {order.customer?.notes && <p className="text-sm text-(--text-muted) bg-yellow-50 p-3 rounded-xl border border-yellow-100 mt-2 italic">📝 {order.customer.notes}</p>}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <h4 className="text-xs font-black uppercase tracking-widest text-(--text-muted) flex items-center gap-2">
                                                                <span className="w-1 h-3 bg-secondary rounded-full" />
                                                                الأصناف المطلوبة
                                                            </h4>
                                                            <div className="bg-(--bg-card) p-4 rounded-2xl border border-(--border-color) divide-y divide-(--border-color)">
                                                                {order.items.map((item: any, i: number) => (
                                                                    <div key={i} className="flex justify-between py-2 text-sm">
                                                                        <span className="font-bold text-(--text-main)">
                                                                            <span className="text-primary mr-1">{item.qty}×</span> {item.name}
                                                                        </span>
                                                                        <span className="font-mono text-(--text-muted)">{item.total} ₪</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-(--border-color)">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => updateStatus(order.id, "pending")}
                                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${order.status === 'pending' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-(--bg-main) text-(--text-muted) hover:bg-yellow-50'}`}
                                                            >
                                                                ⏳ قيد الانتظار
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(order.id, "preparing")}
                                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${order.status === 'preparing' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-(--bg-main) text-(--text-muted) hover:bg-blue-50'}`}
                                                            >
                                                                👨‍🍳 قيد التحضير
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(order.id, "done")}
                                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${order.status === 'done' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-(--bg-main) text-(--text-muted) hover:bg-green-50'}`}
                                                            >
                                                                ✅ تم التسليم
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => deleteOrder(order.id)}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                                        >
                                                            <FaTrash size={12} />
                                                            حذف الطلب
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};


export default OrderSection;
