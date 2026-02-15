import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { useUser } from '../context/UserContext';
import StatusBar from '../components/StatusBar';
import { motion } from 'framer-motion';

const SettingsPage = ({ isDark, setIsDark }) => {
    const navigate = useNavigate();
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { userName, setUserName } = useUser();
    const [notifications, setNotifications] = useState(true);
    const [copied, setCopied] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(userName);

    const copyAddress = () => {
        if (address) {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const avatarUrl = address
        ? `https://api.dicebear.com/7.x/notionists/svg?seed=${address}&backgroundColor=b6e3f4,c0aede,d1d4f9`
        : `https://api.dicebear.com/7.x/notionists/svg?seed=guest&backgroundColor=b6e3f4`;

    const handleSaveName = () => {
        if (tempName.trim()) {
            setUserName(tempName);
            setIsEditingName(false);
        }
    };

    const handleLogOut = () => {
        disconnect();
        navigate('/');
    };

    const SettingItem = ({ icon, label, sublabel, rightElement, onClick, iconColor = "text-cyber-cyan", bgColor = "bg-void" }) => (
        <div
            onClick={onClick}
            className="flex items-center justify-between p-5 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.2rem] border border-white/10 active:scale-[0.98] transition-all cursor-pointer group hover:bg-white/80 dark:hover:bg-slate-900/60"
        >
            <div className="flex items-center gap-5">
                <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center border border-white/10 shadow-xl group-hover:rotate-3 transition-transform ${iconColor.includes('cyan') ? 'dark:neon-glow-cyan' : iconColor.includes('purple') ? 'dark:neon-glow-purple' : iconColor.includes('red') || iconColor.includes('orange') ? 'dark:neon-glow-red' : ''}`}>
                    <span className={`material-icons ${iconColor} text-2xl`}>{icon}</span>
                </div>
                <div>
                    <p className="font-marker text-base text-slate-900 dark:text-white leading-tight italic tracking-tighter uppercase">{label}</p>
                    {sublabel && <p className="font-marker text-[9px] text-slate-400 uppercase tracking-widest mt-1 opacity-70">{sublabel}</p>}
                </div>
            </div>
            {rightElement ? rightElement : <span className="material-icons text-slate-300 dark:text-slate-700">chevron_right</span>}
        </div>
    );

    const SectionHeader = ({ title }) => (
        <div className="flex items-center gap-3 mb-5 mt-10 px-2">
            <h3 className="font-marker text-sm tracking-widest text-slate-400 dark:text-slate-500 uppercase italic">{title}</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-slate-200 dark:from-slate-800 to-transparent"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-full w-full bg-transparent overflow-hidden relative">
            {/* Background Orbs & Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-void via-slate-950 to-void opacity-0 dark:opacity-100 transition-opacity duration-1000 z-0"></div>
            <div className="bg-orb w-[500px] h-[500px] bg-cyber-cyan/10 -top-40 -right-40 animate-pulse blur-[120px]"></div>
            <div className="bg-orb w-[400px] h-[400px] bg-vivid-purple/10 bottom-1/4 -left-40 animate-bounce-slow blur-[100px]"></div>

            <StatusBar dark={false} notch={true} />

            {/* Header Section - Tightened */}
            <header className="flex items-center justify-between px-6 py-2 bg-transparent z-20 shrink-0">
                <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-900/10 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-white border border-slate-900/10 dark:border-white/20 hover:bg-slate-900/20 dark:hover:bg-white/20 transition-all active:scale-90">
                    <span className="material-icons text-xl">chevron_left</span>
                </button>
                <div className="font-marker text-xs text-vivid-purple/70 tracking-[0.2em] uppercase">SYSTEM_CONFIG</div>
                <div className="w-10"></div>
            </header>

            <main className="flex-1 overflow-y-auto px-6 pb-32 relative z-10">
                <div className="mb-8 pt-2 animate-fade-in-up">
                    <h1 className="text-4xl font-marker italic text-slate-900 dark:text-white tracking-tighter leading-none mb-1">SETTINGS</h1>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-[2px] bg-cyber-cyan opacity-50"></span>
                        <p className="font-marker text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Protocol Version 1.0.4 r7</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Profile Card Reimagined - Refined Aesthetics */}
                    <div className="p-[1px] rounded-[3rem] bg-gradient-to-br from-cyber-cyan via-vivid-purple to-graffiti-red shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] mb-10 group animate-fade-in-up delay-100">
                        <div className="bg-white/95 dark:bg-slate-900/98 backdrop-blur-3xl rounded-[2.95rem] p-7 relative overflow-hidden flex items-center gap-5">
                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan/5 via-transparent to-vivid-purple/5 pointer-events-none" />

                            <div className="relative">
                                <div className="w-20 h-20 rounded-[2rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl relative group-hover:scale-105 transition-transform duration-500 dark:neon-glow-cyan">
                                    <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay bg-noise z-10" />
                                    <div className="absolute inset-0 terminal-scanline opacity-20 z-20 pointer-events-none" />
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                </div>
                                <div className="absolute -right-0.5 -bottom-0.5 w-6 h-6 bg-emerald-500 border-[3px] border-white dark:border-slate-900 rounded-full shadow-[0_0_12px_#10B981]"></div>
                            </div>

                            <div className="flex-1 min-w-0">
                                {isEditingName ? (
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tempName}
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="bg-slate-100 dark:bg-void/80 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-xs font-marker italic text-slate-900 dark:text-white w-full outline-none ring-2 ring-primary/20 shadow-inner"
                                            autoFocus
                                            onBlur={handleSaveName}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 group cursor-pointer mb-1" onClick={() => setIsEditingName(true)}>
                                        <h2 className={`font-marker italic text-slate-900 dark:text-white tracking-tighter breakdown-words ${userName.length > 10 ? 'text-xl' : 'text-2xl'}`}>
                                            {userName.toUpperCase()}
                                        </h2>
                                        <span className="material-icons text-slate-300 dark:text-slate-600 group-hover:text-cyber-cyan transition-colors text-base">edit</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-vivid-purple shadow-[0_0_8px_rgba(157,0,255,0.5)]"></span>
                                    <p className="font-marker text-[8px] text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-80">LEGENDARY OPERATOR</p>
                                </div>

                                <button
                                    onClick={copyAddress}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 dark:bg-void text-white rounded-xl border border-white/5 active:scale-95 transition-all shadow-lg hover:shadow-cyber-cyan/10"
                                >
                                    <span className="text-[9px] font-marker italic text-cyber-cyan tracking-tight">
                                        {address ? `${address.slice(0, 8)}...${address.slice(-4)}` : 'IDENTITY_OFFLINE'}
                                    </span>
                                    <span className="material-icons text-[14px] text-white/30">{copied ? 'task_alt' : 'content_copy'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Preferences & Aesthetics */}
                    <section className="animate-fade-in-up delay-200">
                        <SectionHeader title="AESTHETIC_SYNC" />
                        <div className="space-y-4">
                            <SettingItem
                                icon="dark_mode"
                                label="VISION_MODe"
                                sublabel="Switch between Neural Themes"
                                iconColor="text-vivid-purple"
                                bgColor="bg-void"
                                rightElement={
                                    <div className="relative flex bg-slate-100 dark:bg-void p-1 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner w-40 h-10">
                                        {/* Sliding Active Indicator */}
                                        <div
                                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-0 ${!isDark
                                                ? 'left-1 bg-white shadow-[0_5px_15px_rgba(0,240,255,0.2)] border border-cyber-cyan/20'
                                                : 'left-[calc(50%+1px)] bg-slate-900 border border-vivid-purple/30 shadow-[0_5px_15px_rgba(157,0,255,0.3)]'}`}
                                        />

                                        <button
                                            onClick={() => setIsDark(false)}
                                            className={`flex-1 flex items-center justify-center text-[9px] font-marker uppercase tracking-[0.2em] transition-colors relative z-10 ${!isDark
                                                ? 'text-cyber-cyan'
                                                : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
                                        >
                                            LIGHT
                                        </button>
                                        <button
                                            onClick={() => setIsDark(true)}
                                            className={`flex-1 flex items-center justify-center text-[9px] font-marker uppercase tracking-[0.2em] transition-colors relative z-10 ${isDark
                                                ? 'text-vivid-purple'
                                                : 'text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400'}`}
                                        >
                                            DARK
                                        </button>
                                    </div>
                                }
                            />
                            <SettingItem
                                icon="notifications_active"
                                label="SIGNAL_FEED"
                                sublabel="Real-time Protocol Alerts"
                                iconColor="text-cyber-cyan"
                                bgColor="bg-void"
                                rightElement={
                                    <button
                                        onClick={() => setNotifications(!notifications)}
                                        className={`w-14 h-7 rounded-full transition-all duration-500 relative shadow-2xl border ${notifications ? 'bg-cyber-cyan border-white/20' : 'bg-void border-white/10'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-500 shadow-xl ${notifications ? 'left-8' : 'left-1'}`}></div>
                                    </button>
                                }
                            />
                        </div>
                    </section>

                    {/* Protocol Security */}
                    <section className="animate-fade-in-up delay-300">
                        <SectionHeader title="PROTOCOL_SECURITY" />
                        <div className="space-y-4">
                            <SettingItem
                                icon="account_balance_wallet"
                                label="WALLET_VAULT"
                                sublabel="Protected Onchain Identity"
                                iconColor="text-graffiti-red"
                                bgColor="bg-void"
                            />
                            <SettingItem
                                icon="lan"
                                label="NETWORK_EDGE"
                                sublabel="Active: Base Mainnet"
                                iconColor="text-spray-orange"
                                bgColor="bg-void"
                                rightElement={
                                    <div className="flex items-center gap-3 bg-void px-4 py-2 rounded-2xl border border-white/10 shadow-2xl">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]"></div>
                                        <span className="font-marker text-[10px] text-white uppercase tracking-widest italic">VERIFIED</span>
                                    </div>
                                }
                            />
                        </div>
                    </section>

                    {/* Terminal Actions */}
                    <div className="animate-fade-in-up delay-400 pt-10 px-2">
                        <button
                            onClick={handleLogOut}
                            className="w-full h-18 rounded-[2rem] bg-slate-900 dark:bg-void border border-graffiti-red/20 flex flex-col items-center justify-center active:scale-95 transition-all group overflow-hidden relative shadow-2xl"
                        >
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                            <div className="absolute inset-0 terminal-scanline opacity-[0.05] pointer-events-none" />
                            <div className="absolute -inset-1 bg-graffiti-red/5 blur-xl group-hover:bg-graffiti-red/10 transition-all"></div>

                            <span className="font-marker text-graffiti-red text-xs uppercase tracking-[0.4em] relative z-10 group-hover:scale-105 transition-transform italic mb-0.5">TERMINATE_SESSION</span>
                            <span className="font-marker text-[7px] text-graffiti-red/40 uppercase tracking-[0.2em] relative z-10">disconnect protocols</span>
                        </button>
                    </div>

                    <div className="text-center py-10">
                        <p className="font-marker text-[8px] text-slate-500 uppercase tracking-[0.5em] opacity-40">ENCRYPTED END-TO-END CONNECTION</p>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
