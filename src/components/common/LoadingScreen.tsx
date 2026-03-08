import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const MIN_LOADING_TIME = 3000;

export default function LoadingScreen() {
    const { i18n } = useTranslation();

    const [progress, setProgress] = useState(0);
    const startTime = useRef(Date.now());

    /* fake progress until 90% */
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 7;
            });
        }, 300);

        return () => clearInterval(interval);
    }, []);

    /* finish after minimum time */
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

    /* messages */

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

    const messages = i18n.language === "ar" ? messagesAr : messagesEn;

    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-(--bg-main) overflow-hidden">

            {/* glow background */}

            <div className="absolute inset-0 pointer-events-none">

                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full"
                />

                <motion.div
                    animate={{ scale: [1.1, 1, 1.1] }}
                    transition={{ duration: 12, repeat: Infinity }}
                    className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-secondary/10 blur-[120px] rounded-full"
                />

            </div>

            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-10">

                {/* logo */}

                <div className="relative mb-20">

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-30px] rounded-full border border-primary/20"
                    />

                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.1, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-[-50px] rounded-full bg-primary/10 blur-2xl"
                    />

                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-36 h-36 md:w-44 md:h-44 bg-(--bg-card)/70 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl flex items-center justify-center"
                    >
                        <img
                            src="/logo.png"
                            alt="logo"
                            className="w-4/5 h-4/5 object-contain"
                        />
                    </motion.div>

                </div>

                {/* message */}

                <AnimatePresence mode="wait">
                    <motion.h2
                        key={msgIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-2xl font-black text-(--text-main) text-center mb-10"
                    >
                        {messages[msgIndex]}
                    </motion.h2>
                </AnimatePresence>

                {/* progress */}

                <div className="w-full">

                    <div className="relative h-2 rounded-full bg-black/20 overflow-hidden border border-white/5">

                        <motion.div
                            className="absolute inset-y-0 left-0 bg-linear-to-r from-primary via-white to-secondary"
                            animate={{ width: `${progress}%` }}
                            transition={{ type: "spring", stiffness: 40, damping: 20 }}
                        />

                        <motion.div
                            animate={{ left: ["-30%", "120%"] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="absolute inset-y-0 w-32 bg-linear-to-r from-transparent via-white/50 to-transparent"
                        />

                    </div>

                    <div className="text-center mt-4 text-sm text-(--text-muted) font-bold">
                        {Math.round(progress)}%
                    </div>

                </div>

            </div>

        </div>
    );
}