import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import CheckInPage from './pages/CheckInPage';
import GMPage from './pages/GMPage';
import DeployPage from './pages/DeployPage';
import SettingsPage from './pages/SettingsPage';
import TabBar from './components/TabBar';
import MintPage from './pages/MintPage';
import SplashScreen from './features/branding/SplashScreen';
import GraffitiLanding from './features/branding/GraffitiLanding';
import './index.css';

const AppContent = () => {
    const [isDark, setIsDark] = useState(false);
    const [showLanding, setShowLanding] = useState(false);
    const [showSplash, setShowSplash] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const routes = ['/', '/checkin', '/gm', '/settings'];
    const currentIndex = routes.indexOf(location.pathname);
    const [touchX, setTouchX] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        const t = e.changedTouches?.[0] || e.touches?.[0];
        if (t) setTouchX(t.clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const t = e.changedTouches?.[0] || e.touches?.[0];
        if (!t || touchX === null) return;
        const dx = t.clientX - touchX;
        const threshold = 50;
        if (dx < -threshold && currentIndex < routes.length - 1) {
            navigate(routes[currentIndex + 1]);
        } else if (dx > threshold && currentIndex > 0) {
            navigate(routes[currentIndex - 1]);
        }
        setTouchX(null);
    };

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <div
            className="w-full h-full flex flex-col items-center justify-center bg-slate-950"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Global SVG Filters */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <filter id="fractal-noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
            </svg>

            <div className="app-container shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                {/* Background Fractal Noise Texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-noise z-0" />

                <AnimatePresence mode="wait">
                    {showSplash ? (
                        <SplashScreen key="splash" onFinish={() => setShowSplash(false)} />
                    ) : showLanding ? (
                        <GraffitiLanding key="landing" onEnter={() => setShowLanding(false)} />
                    ) : (
                        <div className="relative z-10 h-full flex flex-col">
                            {/* Dark Mode Toggle */}
                            <button
                                onClick={() => setIsDark(!isDark)}
                                className="fixed top-24 right-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl p-2.5 rounded-l-2xl flex items-center gap-2 group transition-all hover:pl-4 active:scale-95"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center transition-colors">
                                    <span className="material-icons text-primary text-lg">
                                        {isDark ? 'light_mode' : 'dark_mode'}
                                    </span>
                                </div>
                            </button>

                            <div className="flex-1 overflow-y-auto scrollbar-hide">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/checkin" element={<CheckInPage />} />
                                    <Route path="/gm" element={<GMPage />} />
                                    <Route path="/mint" element={<MintPage />} />
                                    <Route path="/deploy" element={<DeployPage />} />
                                    <Route path="/settings" element={<SettingsPage isDark={isDark} setIsDark={setIsDark} />} />
                                </Routes>
                            </div>

                            <TabBar />

                            {/* iOS Indicator Bar */}
                            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-200 dark:bg-slate-800 rounded-full z-[70]"></div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;
