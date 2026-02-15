import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface SplashScreenProps {
    onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const [stage, setStage] = useState<'splatter' | 'reveal' | 'drips' | 'exit'>('splatter');

    useEffect(() => {
        const timers = [
            setTimeout(() => setStage('reveal'), 800),
            setTimeout(() => setStage('drips'), 2000),
            setTimeout(() => setStage('exit'), 3500),
            setTimeout(() => onFinish && onFinish(), 4500),
        ];
        return () => timers.forEach(clearTimeout);
    }, [onFinish]);

    const splatters = [
        { color: 'bg-graffiti-red', x: '10%', y: '20%', delay: 0 },
        { color: 'bg-spray-orange', x: '80%', y: '15%', delay: 0.2 },
        { color: 'bg-vivid-purple', x: '15%', y: '75%', delay: 0.4 },
        { color: 'bg-cyber-cyan', x: '75%', y: '80%', delay: 0.1 },
    ];

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-void overflow-hidden"
            exit={{ scale: 1.5, filter: 'blur(20px)', opacity: 0 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
        >
            {/* 1. Paint Splatters (Explosion) */}
            {splatters.map((s, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 4, 3.5], opacity: [0, 0.6, 0.4] }}
                    transition={{ duration: 0.8, delay: s.delay, ease: "easeOut" }}
                    className={`absolute rounded-full blur-[60px] mix-blend-screen pointer-events-none ${s.color}`}
                    style={{
                        left: s.x,
                        top: s.y,
                        width: '300px',
                        height: '300px',
                    }}
                />
            ))}

            {/* 2. Logo Reveal (Shaky Reveal) */}
            <AnimatePresence>
                {(stage === 'reveal' || stage === 'drips') && (
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            rotate: -2,
                            x: [0, -4, 4, -4, 4, 0],
                            y: [0, 4, -4, 4, -4, 0]
                        }}
                        transition={{
                            duration: 0.6,
                            type: "spring",
                            times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                        }}
                        className="relative z-10"
                    >
                        <Logo variant="hero" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Drips (Animated Lines) */}
            {stage === 'drips' && (
                <div className="absolute inset-0 pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: ['0%', '100%'], opacity: [1, 0] }}
                            transition={{
                                duration: 2,
                                delay: i * 0.2,
                                repeat: Infinity,
                                repeatDelay: 0.5
                            }}
                            className="absolute w-[2px]"
                            style={{
                                left: `${15 + i * 15}%`,
                                background: `linear-gradient(to bottom, transparent, ${['#FF003C', '#00F0FF', '#9D00FF', '#FAFF00'][i % 4]})`,
                                boxShadow: `0 0 10px ${['#FF003C', '#00F0FF', '#9D00FF', '#FAFF00'][i % 4]}66`
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise" />
        </motion.div>
    );
};

export default SplashScreen;
