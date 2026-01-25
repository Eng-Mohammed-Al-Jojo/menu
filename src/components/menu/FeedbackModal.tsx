import { useState, useEffect } from "react";
import { FaTimes, FaStar } from "react-icons/fa";

interface Props {
    show: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ show, onClose }: Props) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(0); // نجوم التقييم
    const [hoverRating, setHoverRating] = useState(0); // تأثير hover على النجوم
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!show) {
            // Reset fields when modal closes
            setName("");
            setPhone("");
            setMessage("");
            setRating(0);
            setHoverRating(0);
        }
    }, [show]);

    const handleSend = () => {
        if (!message.trim()) {
            setToast("الرجاء كتابة الملاحظة ⚠️");
            setTimeout(() => setToast(null), 3000);
            return;
        }

        const phoneNumber = "972592133357"; // رقم الواتساب
        const fullMessage = `🔹 الاسم: ${name || "-"}\n🔹 الجوال: ${phone || "-"}\n🔹 التقييم: ${rating}/5\n🔹 الملاحظة: ${message}`;
        const url = "https://wa.me/" + phoneNumber + "?text=" + encodeURIComponent(fullMessage);
        window.open(url, "_blank");

        setToast("تم إرسال الملاحظة بنجاح ✅");
        setTimeout(() => setToast(null), 3000);
        onClose();
    };

    if (!show) return null;

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
                <div className="bg-[#231F20] text-[#F7F3E8] rounded-3xl w-full max-w-md p-6 relative shadow-lg max-h-[90vh] overflow-y-auto">
                    {/* Close Button */}
                    <button onClick={onClose} className="absolute top-4 left-4 text-xl">
                        <FaTimes />
                    </button>

                    <h2 className="text-2xl font-extrabold text-center mb-2 text-[#E7E7E7]">
                        الآراء و الشكاوى
                    </h2>
                    <p className="text-sm text-[#F7F3E8]/60 text-center">
                        نسعد بأرائكم ونعمل على إسعادكم ✨
                    </p>

                    <div className="flex flex-col gap-4 mt-4">
                        <input
                            type="text"
                            placeholder="الاسم (اختياري)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-[#1F1B1C] text-[#F7F3E8] border border-[#940D11]"
                        />
                        <input
                            type="tel"
                            placeholder="رقم الجوال (اختياري)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-[#1F1B1C] text-[#F7F3E8] border border-[#940D11] text-right placeholder:text-[#F7F3E8]/50"
                        />

                        {/* تقييم النجوم */}
                        <div className="flex justify-center mt-2 mb-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <div
                                    key={star}
                                    className="relative cursor-pointer"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    {/* خلفية النجمة (ظل خفيف) */}
                                    <FaStar className="text-[#444] w-8 h-8" />

                                    {/* نجمة التقييم الفعلي */}
                                    <FaStar
                                        className={`absolute top-0 left-0 w-8 h-8 transition-transform duration-200 
          ${star <= (hoverRating || rating) ? "text-yellow-400 scale-125 drop-shadow-lg" : "text-transparent"}
          hover:scale-120 hover:text-yellow-300`}
                                    />
                                </div>
                            ))}
                        </div>


                        <textarea
                            placeholder="الملاحظة *"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-[#1F1B1C] text-[#F7F3E8] border border-[#940D11] resize-none"
                            rows={5}
                        />
                        <button
                            onClick={handleSend}
                            className="w-full py-3 rounded-full bg-[#940D11] font-bold hover:scale-105 transition"
                        >
                            إرسال
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed top-6 right-6 z-50 bg-[#940D11] text-white px-6 py-3 rounded-2xl font-bold shadow-2xl animate-pulse">
                    {toast}
                </div>
            )}
        </>
    );
}
