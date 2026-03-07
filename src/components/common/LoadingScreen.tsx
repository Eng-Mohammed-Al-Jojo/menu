import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LoadingScreen() {
    const { i18n } = useTranslation();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev < 90 ? prev + Math.random() * 10 : prev));
        }, 400);
        return () => clearInterval(interval);
    }, []);

    const messagesAr = [
        "جاري شحن التجربة الرهيبة...",
        "نصنع لك عالماً من المذاق...",
        "ثوانٍ من الإبهار الكهربائي...",
        "أهلاً بك في المستقبل..."
    ];

    const messagesEn = [
        "Charging the ultimate experience...",
        "Crafting a world of taste...",
        "Seconds of electric magic...",
        "Welcome to the future..."
    ];

    const messages = i18n.language === 'ar' ? messagesAr : messagesEn;
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % messages.length);
        }, 1800);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-(--bg-main) overflow-hidden perspective-1000">
            {/* Reality Depth: Dynamic Particles */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 100 + "%",
                            y: Math.random() * 100 + "%",
                            opacity: 0,
                            scale: Math.random() * 0.5 + 0.2
                        }}
                        animate={{
                            y: [null, Math.random() * -100 + "%"],
                            opacity: [0, 0.4, 0],
                            filter: ["blur(1px)", "blur(3px)", "blur(1px)"]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute w-1 h-1 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                    />
                ))}
            </div>

            {/* Electric Background Arcs */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <motion.path
                    d="M 0 50 Q 25 20 50 50 T 100 50"
                    fill="none"
                    stroke="url(#electric-grad)"
                    strokeWidth="1"
                    strokeDasharray="10 5"
                    animate={{ strokeDashoffset: [0, -100] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <defs>
                    <linearGradient id="electric-grad" x1="0%" y1="0%" x2="100%0%">
                        <stop offset="0%" stopColor="var(--primary)" />
                        <stop offset="50%" stopColor="var(--secondary)" />
                        <stop offset="100%" stopColor="var(--primary)" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Main Immersive Vessel */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-10">

                {/* Electric Energy Core */}
                <div className="relative mb-20 group">
                    {/* Glass Orb Shell */}
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-[-40px] rounded-full border border-white/10 bg-white/5 backdrop-blur-[2px] shadow-[inset_0_0_50px_rgba(255,255,255,0.1)]"
                    />

                    {/* 3D Glass Rings */}
                    <motion.div
                        animate={{ rotateX: [70, 75, 70], rotateY: [0, 360], scale: [1, 1.1, 1] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-60px] rounded-[4rem] border-2 border-primary/20 shadow-[inner_0_0_30px_rgba(var(--primary-rgb),0.2)] backdrop-blur-[1px]"
                    />
                    <motion.div
                        animate={{ rotateX: [-70, -65, -70], rotateY: [360, 0], scale: [1.1, 1, 1.1] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-80px] rounded-[5rem] border border-secondary/10 shadow-[0_0_40px_rgba(var(--secondary-rgb),0.1)]"
                    />

                    {/* Core Electric Pulse */}
                    <motion.div
                        animate={{
                            boxShadow: [
                                "0 0 0px rgba(var(--primary-rgb),0)",
                                "0 0 100px rgba(var(--primary-rgb),0.6)",
                                "0 0 0px rgba(var(--primary-rgb),0)"
                            ]
                        }}
                        transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 1.5 }}
                        className="absolute inset-0 rounded-4xl z-[-1]"
                    />

                    {/* The Reality Vessel (Logo Box) */}
                    <motion.div
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{
                            rotateY: [-15, 15],
                            rotateX: [-10, 10],
                            y: [0, -20, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative w-40 h-40 md:w-48 md:h-48 bg-(--bg-card)/50 backdrop-blur-3xl p-6 rounded-4xl shadow-[0_50px_100px_rgba(0,0,0,0.4),inset_0_0_0_2px_rgba(255,255,255,0.1)] border border-white/20 flex items-center justify-center overflow-hidden"
                    >
                        {/* Glossy Surface Shutter */}
                        <motion.div
                            animate={{
                                x: ["-150%", "150%"],
                                opacity: [0, 0.5, 0]
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-[-35deg] pointer-events-none"
                        />

                        {/* Electric Flicker Effect on Logo */}
                        <motion.div
                            animate={{
                                opacity: [1, 0.7, 1, 0.8, 1],
                                scale: [1, 1.02, 1, 0.98, 1]
                            }}
                            transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5 }}
                            className="w-full h-full p-2 z-10"
                        >
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)] contrast-125 saturate-110"
                                onError={(e) => e.currentTarget.src = '/hamada.png'}
                            />
                        </motion.div>

                        {/* Internal Electric Sparks */}
                        <SparkEffect />
                    </motion.div>

                    {/* Realistic HUD Overlays */}
                    <div className="absolute -left-16 top-0 flex flex-col gap-1 opacity-20 select-none">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{ width: [10, 30, 10] }}
                                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                className="h-[2px] bg-primary rounded-full"
                            />
                        ))}
                    </div>

                    <motion.div
                        animate={{ opacity: [0.2, 0.6, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute -right-14 top-0 text-[9px] font-black text-primary writing-mode-vertical uppercase tracking-[0.4em] opacity-40"
                    >
                        Reality Matrix: Active
                    </motion.div>
                </div>

                {/* Cinematic Progress */}
                <div className="w-full text-center space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={msgIndex}
                            initial={{ opacity: 0, scale: 0.8, y: 10, filter: "blur(20px)" }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.2, y: -10, filter: "blur(20px)" }}
                            className="text-2xl md:text-3xl font-black text-(--text-main) tracking-tighter drop-shadow-sm"
                        >
                            {messages[msgIndex]}
                        </motion.h2>
                    </AnimatePresence>

                    <div className="relative px-2">
                        {/* Global Energy Glow */}
                        <div className="absolute inset-x-[-20%] top-[-200%] h-[500%] bg-primary/5 blur-[80px] rounded-full animate-pulse" />

                        <div className="relative h-2.5 w-full bg-black/20 backdrop-blur-xl rounded-full border border-white/5 overflow-hidden shadow-inner">
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-linear-to-r from-primary via-white to-secondary shadow-[0_0_25px_rgba(var(--primary-rgb),1)]"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 40, damping: 20 }}
                            />

                            {/* Electric Zap Traveling Row */}
                            <motion.div
                                animate={{ left: ["-50%", "150%"] }}
                                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-y-0 w-32 bg-linear-to-r from-transparent via-white/60 to-transparent"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-end px-4">
                        <div className="flex flex-col items-start gap-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary opacity-60">System Protocol</span>
                            <div className="flex gap-1">
                                {[...Array(3)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                        className="w-1.5 h-1.5 rounded-sm bg-primary/40"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase text-(--text-muted) tracking-widest leading-none">Power Buffer</span>
                            <div className="text-3xl font-black text-transparent bg-clip-text bg-linear-to-b from-primary to-secondary italic leading-none mt-1">
                                {Math.round(progress)}<span className="text-sm ml-1">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SparkEffect() {
    return (
        <div className="absolute inset-0 pointer-events-none z-0">
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0, 1, 0.8, 1, 0],
                        scale: [0, 1.2, 0.8, 1.5, 0],
                        x: [0, (Math.random() - 0.5) * 160],
                        y: [0, (Math.random() - 0.5) * 160],
                        rotate: [0, 45, 90, 135, 180]
                    }}
                    transition={{
                        duration: 0.25,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 1.5,
                        delay: i * 0.3
                    }}
                    className="absolute top-1/2 left-1/2 w-px h-24 bg-linear-to-b from-transparent via-white to-transparent blur-[0.3px]"
                />
            ))}
        </div>
    );
}
