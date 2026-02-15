import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
    variant?: 'hero' | 'profile';
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'hero', className = '' }) => {
    const isHero = variant === 'hero';

    return (
        <div className={`relative inline-block ${className}`}>
            {/* SVG Filters for Spray Paint Effect */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <filter id="spray-paint">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.65"
                        numOctaves="3"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="6"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>

                <filter id="rough-edge">
                    <feTurbulence
                        type="turbulence"
                        baseFrequency="0.05"
                        numOctaves="2"
                        result="noise"
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="noise"
                        scale="4"
                    />
                </filter>
            </svg>

            {isHero ? (
                <motion.div
                    initial={{ rotate: -2, scale: 0.9, opacity: 0 }}
                    animate={{ rotate: -2, scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                    className="relative px-4 py-2"
                >
                    {/* Main Logo Text */}
                    <h1
                        className="text-7xl md:text-9xl font-marker tracking-tighter text-graffiti-red select-none"
                        style={{ filter: "url(#spray-paint)" }}
                    >
                        GM <span className="text-cyber-cyan">DAILY</span>
                    </h1>

                    {/* Drip Underline */}
                    <svg
                        className="absolute -bottom-4 left-0 w-full h-8 text-graffiti-red"
                        viewBox="0 0 400 30"
                        style={{ filter: "url(#rough-edge)" }}
                    >
                        <path
                            d="M10,10 Q100,25 200,10 T390,15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            strokeLinecap="round"
                        />
                        {/* Drip drops */}
                        <circle cx="50" cy="22" r="3" fill="currentColor" />
                        <circle cx="150" cy="28" r="4" fill="currentColor" />
                        <circle cx="280" cy="24" r="3" fill="currentColor" />
                    </svg>
                </motion.div>
            ) : (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-16 h-16 md:w-20 md:h-20"
                >
                    {/* Circular Splatter Border */}
                    <svg className="absolute inset-0 w-full h-full text-vivid-purple opacity-80" viewBox="0 0 100 100">
                        <circle
                            cx="50" cy="50" r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            strokeDasharray="10 5"
                            style={{ filter: "url(#rough-edge)" }}
                        />
                    </svg>

                    <div
                        className="absolute inset-2 flex items-center justify-center bg-void rounded-full border-2 border-graffiti-red"
                        style={{ filter: "url(#rough-edge)" }}
                    >
                        <span className="font-marker text-xl md:text-2xl text-neon-yellow">GM</span>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default Logo;
