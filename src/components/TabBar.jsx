import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TabBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;
    const routes = ['/', '/checkin', '/gm', '/settings'];
    const containerRef = useRef(null);
    const btnRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const [pillLeft, setPillLeft] = useState(0);
    const [pillWidth, setPillWidth] = useState(100);
    const [touchX, setTouchX] = useState(null);
    const currentIndex = routes.indexOf(location.pathname);

    const handleTouchStart = (e) => {
        const t = e.changedTouches?.[0] || e.touches?.[0];
        if (t) setTouchX(t.clientX);
    };

    const handleTouchEnd = (e) => {
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
        const updateRing = () => {
            const c = containerRef.current;
            const b = btnRefs[currentIndex]?.current;
            if (!c || !b) return;
            const cr = c.getBoundingClientRect();
            const br = b.getBoundingClientRect();
            setPillLeft(br.left - cr.left + 4);
            setPillWidth(br.width - 8);
        };
        updateRing();
        window.addEventListener('resize', updateRing);
        return () => window.removeEventListener('resize', updateRing);
    }, [currentIndex]);

    const tabs = [
        { path: '/', icon: 'home', label: 'HUB' },
        { path: '/checkin', icon: 'local_fire_department', label: 'RITUAL' },
        { path: '/gm', icon: 'bolt', label: 'SIGNAL' },
        { path: '/settings', icon: 'terminal', label: 'CONFIG' }
    ];

    return (
        <nav
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] h-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-around px-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 z-50 transition-all duration-300 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            ref={containerRef}
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />

            <div
                className="absolute top-1/2 -translate-y-1/2 pointer-events-none z-0"
                style={{ left: pillLeft, width: pillWidth, height: 56, transition: 'all 400ms cubic-bezier(0.22, 1, 0.36, 1)' }}
            >
                <div className="w-full h-full rounded-[1.8rem] bg-void border border-white/10 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.4)]" />
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent" />
            </div>

            {tabs.map((tab, idx) => (
                <button
                    key={tab.path}
                    ref={btnRefs[idx]}
                    onClick={() => navigate(tab.path)}
                    className={`relative z-10 flex flex-col items-center flex-1 transition-all duration-500 py-2 ${isActive(tab.path) ? 'scale-110' : 'opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                >
                    <span className={`material-icons text-2xl transition-all duration-500 mb-0.5 ${isActive(tab.path) ? 'text-cyber-cyan drop-shadow-[0_0_10px_#00F0FF]' : 'text-slate-400 dark:text-slate-500'}`}>
                        {tab.icon}
                    </span>
                    <span className={`font-marker text-[8px] uppercase tracking-[0.2em] italic ${isActive(tab.path) ? 'text-white' : 'text-slate-500'}`}>
                        {tab.label}
                    </span>
                    {isActive(tab.path) && (
                        <div className="absolute -top-1 w-1 h-1 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00F0FF]" />
                    )}
                </button>
            ))}
        </nav>
    );
};

export default TabBar;
