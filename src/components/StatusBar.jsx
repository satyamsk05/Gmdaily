import React from 'react';

const StatusBar = ({ dark = false, notch = false }) => (
    <div className={`px-10 pt-5 pb-2 flex justify-between items-center z-50 shrink-0 ${dark ? 'text-white/40' : 'text-slate-500/60 dark:text-white/20'}`}>
        <div className="flex items-center gap-2.5">
            <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 blur-[3px] animate-ping opacity-50"></div>
            </div>
            <span className="font-marker text-[9px] uppercase tracking-[0.3em] italic">BASE_NETWORK</span>
        </div>

        <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 py-1 px-2.5 bg-void border border-white/5 rounded-lg shadow-xl">
                <span className="material-icons text-[11px] text-cyber-cyan animate-pulse">sensors</span>
                <span className="font-marker text-[8px] uppercase tracking-widest text-white/50">LIVE_FEED</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/5"></div>
            <span className="font-marker text-[8px] uppercase tracking-[0.2em] opacity-40">V1.4.7_RC</span>
        </div>
    </div>
);

export default StatusBar;
