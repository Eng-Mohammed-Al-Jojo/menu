import { useEffect, useState } from "react";
import { FiX, FiStar } from "react-icons/fi";
import { ref, get } from "firebase/database";
import { db } from "../../firebase";
import { motion, AnimatePresence } from "framer-motion";

import ItemRow from "./ItemRow";

interface Props {
    show: boolean;
    onClose: () => void;
}

interface Item {
    featured: any;
    image: string | undefined;
    id: string;
    name: string;
    price: number;
    ingredients?: string;
    priceTw?: number;
    categoryId: string;
    visible?: boolean;
    star?: boolean;
    createdAt?: number;
}

export default function FeaturedModal({ show, onClose }: Props) {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!show) return;

        const fetchStarItems = async () => {
            setLoading(true);
            try {
                const snap = await get(ref(db, "items"));
                if (snap.exists()) {
                    const data = snap.val();
                    const starItems = Object.entries(data)
                        .map(([id, item]: any) => ({ id, ...item }))
                        .filter((item: any) => item.star === true && item.visible !== false);
                    setItems(starItems);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStarItems();
    }, [show]);

    return (
        <AnimatePresence>
            {show && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        className="relative bg-(--bg-card)/80 backdrop-blur-2xl w-full max-w-4xl rounded-[3rem] border border-(--border-color) shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10"
                    >
                        {/* Premium Header */}
                        <div className="p-8 border-b border-(--border-color) flex items-center justify-between bg-linear-to-r from-primary/10 via-transparent to-transparent">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center text-2xl shadow-inner border border-amber-100">
                                    <FiStar fill="currentColor" />
                                </div>
                                <div className="text-right">
                                    <h2 className="text-2xl font-black text-(--text-main)">الأصناف الأكثر طلباً</h2>
                                    <p className="text-(--text-muted) text-[10px] uppercase font-black tracking-widest mt-0.5 opacity-60">Top Rated Recommendations</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-(--bg-main) text-(--text-muted) hover:text-red-500 transition-all border border-(--border-color) hover:scale-105"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="text-4xl text-primary"
                                    >
                                        ⚙️
                                    </motion.div>
                                    <p className="text-sm font-bold text-(--text-muted) animate-pulse uppercase tracking-widest">Loading favorites...</p>
                                </div>
                            ) : items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 rounded-3xl bg-(--bg-main) flex items-center justify-center mb-6 text-4xl shadow-inner opacity-40">
                                        ✨
                                    </div>
                                    <h3 className="text-xl font-black text-(--text-main)">لا يوجد أصناف مميزة حالياً</h3>
                                    <p className="text-sm font-bold text-(--text-muted) mt-2 opacity-60">Check back later for our specialties!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {items.map((item, idx) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <ItemRow item={item} orderSystem={true} featuredMode={true} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 border-t border-(--border-color) bg-(--bg-main)/30 text-center">
                            <p className="text-[10px] font-black text-(--text-muted) uppercase tracking-[0.2em] opacity-40 flex items-center justify-center gap-3">
                                <span className="w-8 h-px bg-(--border-color)" />
                                Choose the best for you
                                <span className="w-8 h-px bg-(--border-color)" />
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
