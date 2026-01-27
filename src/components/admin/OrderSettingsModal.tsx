import { useState, useEffect } from "react";
import { update, ref, get } from "firebase/database";
import { db } from "../../firebase";

/* ================== Toast ================== */
function Toast({
    type,
    message,
}: {
    type: "success" | "error";
    message: string;
}) {
    return (
        <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-999
            px-5 py-2.5 rounded-lg shadow-xl text-white text-xs font-semibold
            animate-slideUp
            ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
            {message}
        </div>
    );
}

/* ================== Service Checkbox ================== */
function ServiceCheckbox({
    title,
    enabled,
    onToggle,
    value,
    setValue,
    disabled,
}: {
    title: string;
    enabled: boolean;
    onToggle: () => void;
    value: string;
    setValue: (v: string) => void;
    disabled: boolean;
}) {
    return (
        <div className="bg-black/30 rounded-xl p-3 space-y-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={onToggle}
                    disabled={disabled}
                    className="accent-green-500 w-4 h-4"
                />
                <span className="font-semibold">{title}</span>
            </label>

            {enabled && (
                <input
                    type="tel"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) =>
                        setValue(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="رقم واتساب بدون +"
                    className="w-full bg-black/40 rounded-lg px-3 py-1.5 text-xs outline-none
                    placeholder:text-gray-300 focus:ring-1 focus:ring-yellow-500"
                />
            )}

            {!enabled && !disabled && (
                <p className="text-[11px] text-gray-400">
                    الخدمة غير مفعّلة
                </p>
            )}
        </div>
    );
}

/* ================== Modal ================== */
interface Props {
    setShowOrderSettings: (show: boolean) => void;
}

export default function OrderSettingsModal({ setShowOrderSettings }: Props) {
    const [orderSystem, setOrderSystem] = useState(true);

    const [inRestaurant, setInRestaurant] = useState(false);
    const [takeaway, setTakeaway] = useState(false);

    const [inPhone, setInPhone] = useState("");
    const [outPhone, setOutPhone] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [toast, setToast] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    /* ===== Fetch Settings ===== */
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const systemSnap = await get(ref(db, "settings/orderSystem"));
                setOrderSystem(systemSnap.exists() ? systemSnap.val() : true);

                const snap = await get(ref(db, "settings/orderSettings"));
                if (snap.exists()) {
                    const data = snap.val();

                    setInRestaurant(Boolean(data.inRestaurant));
                    setTakeaway(Boolean(data.takeaway));

                    setInPhone(data.inPhone || "");
                    setOutPhone(data.outPhone || "");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    if (loading) return null;

    /* ===== Toggle Order System ===== */
    const toggleOrderSystem = async () => {
        const newVal = !orderSystem;
        await update(ref(db, "settings"), { orderSystem: newVal });
        setOrderSystem(newVal);

        setToast({
            type: newVal ? "success" : "error",
            message: newVal
                ? "✅ تم تفعيل نظام الطلب"
                : "🚫 تم إيقاف نظام الطلب",
        });

        setTimeout(() => setToast(null), 2000);
    };

    /* ===== Save with Validation ===== */
    const handleSave = async () => {
        // Validation
        if (inRestaurant && !inPhone.trim()) {
            setToast({ type: "error", message: "❌ يجب إدخال رقم واتساب للطلب داخل المطعم" });
            return;
        }
        if (takeaway && !outPhone.trim()) {
            setToast({ type: "error", message: "❌ يجب إدخال رقم واتساب للتيك أواي" });
            return;
        }

        try {
            setSaving(true);

            // Consider service stopped if number empty
            await update(ref(db, "settings/orderSettings"), {
                inRestaurant: inRestaurant && !!inPhone.trim(),
                takeaway: takeaway && !!outPhone.trim(),
                inPhone: inRestaurant ? inPhone : "",
                outPhone: takeaway ? outPhone : "",
            });

            setToast({
                type: "success",
                message: "💾 تم حفظ الإعدادات بنجاح",
            });
        } catch {
            setToast({
                type: "error",
                message: "❌ فشل الحفظ",
            });
        } finally {
            setSaving(false);
            setTimeout(() => setToast(null), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex justify-center items-center">
            <div className="bg-[#231F20] w-full max-w-sm rounded-2xl p-3 text-[#F7F3E8] relative shadow-2xl text-sm">
                <button
                    onClick={() => setShowOrderSettings(false)}
                    className="absolute top-3 left-3 text-sm hover:text-red-400"
                >
                    ✖
                </button>

                <h2 className="text-lg font-bold text-center mb-4">
                    إعدادات الطلب 🛠️
                </h2>

                {/* Order System Toggle */}
                <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg mb-4">
                    <span className="font-semibold text-sm">
                        تفعيل نظام الطلب
                    </span>

                    <button
                        onClick={toggleOrderSystem}
                        className={`w-12 h-6 rounded-full relative transition ${orderSystem ? "bg-green-500" : "bg-gray-600"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition ${orderSystem ? "right-1" : "right-6"
                                }`}
                        />
                    </button>
                </div>

                {/* Services */}
                <div className="space-y-3">
                    <ServiceCheckbox
                        title="🍽️ الطلب داخل المطعم"
                        enabled={inRestaurant}
                        onToggle={() =>
                            setInRestaurant((prev) => !prev)
                        }
                        value={inPhone}
                        setValue={setInPhone}
                        disabled={!orderSystem}
                    />

                    <ServiceCheckbox
                        title="🛍️ تيك أواي / دليفري"
                        enabled={takeaway}
                        onToggle={() => setTakeaway((prev) => !prev)}
                        value={outPhone}
                        setValue={setOutPhone}
                        disabled={!orderSystem}
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`mt-4 w-full py-2 rounded-lg bg-green-600 text-sm font-semibold ${saving ? "opacity-60" : "hover:bg-green-500"
                        }`}
                >
                    {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
                </button>
            </div>

            {toast && <Toast type={toast.type} message={toast.message} />}
        </div>
    );
}
