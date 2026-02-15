import React from 'react';
import { motion } from 'framer-motion';
import Logo from './Logo';

interface GraffitiLandingProps {
    onEnter: () => void;
}

const GraffitiLanding: React.FC<GraffitiLandingProps> = ({ onEnter }) => {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-void"
        >
            {/* Background Fractal Noise Texture */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-noise" />

            {/* Hero Section */}
            <div className="text-center space-y-8">
                <Logo variant="hero" />

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-2xl text-lg md:text-2xl text-slate-400 font-light tracking-wide leading-relaxed"
                >
                    The underground home of <span className="text-spray-orange font-marker">decentralized art</span>.
                    Built for those who tag the blockchain.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-6 pt-8"
                >
                    <button
                        onClick={onEnter}
                        className="group relative px-8 py-4 bg-graffiti-red text-white font-marker text-xl rounded-sm transform -rotate-1 hover:rotate-0 transition-transform"
                    >
                        <span className="relative z-10">ENTER THE VOID</span>
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    </button>

                    <button className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan font-marker text-xl rounded-sm transform rotate-1 hover:rotate-0 transition-transform bg-transparent hover:bg-cyber-cyan/10">
                        VIEW COLLECTION
                    </button>
                </motion.div>
            </div>

            {/* Floating Decorative Elements */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    rotate: [-2, 2, -2]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-[10%] w-32 h-32 md:w-48 md:h-48 border-4 border-vivid-purple opacity-20 pointer-events-none"
            />

            <div className="absolute bottom-8 right-8">
                <Logo variant="profile" />
            </div>
        </motion.main>
    );
};

export default GraffitiLanding;
