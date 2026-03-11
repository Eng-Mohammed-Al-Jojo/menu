import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

const MIN_LOADING_TIME = 3000;

export default function LoadingScreen() {
    const { i18n } = useTranslation();
    const isRtl = i18n.language === "ar";

    const [progress, setProgress] = useState(0);
    const startTime = useRef(Date.now());
    const [msgIndex, setMsgIndex] = useState(0);

    // Fake progress until 90%
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 7;
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);

    // Finish after minimum time
    useEffect(() => {
        const timer = setInterval(() => {
            const elapsed = Date.now() - startTime.current;

            if (elapsed >= MIN_LOADING_TIME) {
                setProgress(100);
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, []);

    const messagesAr = [
        "نجهّز لك تجربة مميزة...",
        "نضيف لمسة من السحر...",
        "لحظات ويكتمل كل شيء...",
        "مرحباً بك..."
    ];

    const messagesEn = [
        "Preparing your experience...",
        "Adding a touch of magic...",
        "Almost there...",
        "Welcome..."
    ];

    const messages = isRtl ? messagesAr : messagesEn;

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 2200);

        return () => clearInterval(interval);
    }, [messages.length]);

    // Memoize particles to prevent re-generation on re-renders
    const particles = useMemo(() => {
        return Array.from({ length: 25 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 1,
            x: Math.random() * 100,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5
        }));
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-(--bg-main) overflow-hidden"
            dir={isRtl ? "rtl" : "ltr"}
        >
            {/* Soft background glows */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[130px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full"
                />
            </div>

            {/* Particle micro-animations */}
            <div className="absolute inset-0 pointer-events-none">
                {particles.map((p) => (
                    <motion.div
                        key={p.id}
                        initial={{
                            x: `${p.x}vw`,
                            y: "110vh",
                            opacity: 0,
                            scale: 0
                        }}
                        animate={{
                            y: "-10vh",
                            opacity: [0, 0.6, 0],
                            scale: [0, 1, 0.5]
                        }}
                        transition={{
                            duration: p.duration,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "linear"
                        }}
                        className="absolute rounded-full bg-primary/50 blur-[1px]"
                        style={{
                            width: p.size,
                            height: p.size
                        }}
                    />
                ))}
            </div>

            {/* Luxury Animated Frame */}
            <div className="absolute inset-4 sm:inset-6 md:inset-8 pointer-events-none z-10 rounded-4xl sm:rounded-[2.5rem] border border-white/5 dark:border-white/10 overflow-hidden shadow-[inset_0_0_30px_rgba(255,255,255,0.015)]">
                {/* Diagonal shining gradient on the frame */}
                <motion.div
                    animate={{
                        x: ["-100%", "200%"],
                        y: ["-100%", "200%"]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 left-0 w-full h-[150%] bg-linear-to-br from-transparent via-primary/10 to-transparent opacity-60"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-20 flex flex-col items-center w-full max-w-sm px-6">

                {/* Logo Section */}
                <div className="relative mb-14 flex justify-center items-center">

                    {/* Expanding outer ring */}
                    <motion.div
                        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                        transition={{
                            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute inset-[-55px] md:inset-[-70px] rounded-full border border-primary/10"
                    />

                    {/* Inner counter-rotating dashed ring */}
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-30px] md:inset-[-45px] rounded-full border border-primary/20 border-dashed"
                    />

                    {/* Breathing Logo Glow */}
                    <motion.div
                        animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-primary/30 blur-[30px]"
                    />

                    {/* Logo Glass Card */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 rounded-[1.8rem] md:rounded-[2.2rem] p-px bg-linear-to-b from-white/20 via-white/5 to-transparent shadow-2xl"
                    >
                        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-(--bg-card)/60 backdrop-blur-2xl rounded-[1.8rem] md:rounded-[2.2rem] flex items-center justify-center overflow-hidden">
                            {/* Glass inner border */}
                            <div className="absolute inset-0 rounded-[1.8rem] md:rounded-[2.2rem] border border-white/5 mix-blend-overlay" />

                            {/* Inner Shimmer */}
                            <motion.div
                                animate={{ x: ["-150%", "250%"] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-[-25deg]"
                            />

                            {/* Logo Image */}
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="relative z-10 w-3/4 h-3/4 object-contain drop-shadow-xl"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Loading Messages */}
                <div className="h-10 relative w-full mb-6 flex justify-center items-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={msgIndex}
                            initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="absolute text-base md:text-lg font-medium text-(--text-main) tracking-wide text-center"
                        >
                            {messages[msgIndex]}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Premium Loading Bar */}
                <div className="w-full max-w-[200px] flex flex-col items-center">
                    <div className="relative h-[2px] w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 40, damping: 20 }}
                            className="absolute inset-y-0 left-0 bg-linear-to-r from-primary/50 via-primary to-primary/50 rounded-full"
                        />
                        <motion.div
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-y-0 w-1/2 bg-linear-to-r from-transparent via-white/40 to-transparent"
                        />
                    </div>
                    <div className="mt-4 text-xs font-semibold text-(--text-muted) tracking-widest uppercase">
                        {Math.round(progress)}%
                    </div>
                </div>

            </div>
        </motion.div>
    );
}