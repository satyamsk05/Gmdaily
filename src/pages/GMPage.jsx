import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { motion } from 'framer-motion';
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Address, Identity, EthBalance } from '@coinbase/onchainkit/identity';

const GMPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full w-full bg-transparent overflow-hidden relative">
            {/* Atmosphere & Background Orbs */}
            <div className="absolute inset-0 bg-gradient-to-b from-void via-slate-950 to-void opacity-0 dark:opacity-100 transition-opacity duration-1000 z-0"></div>
            <div className="bg-orb w-[500px] h-[500px] bg-graffiti-red/10 top-[-20%] left-[-20%] animate-pulse blur-[120px]"></div>
            <div className="bg-orb w-[400px] h-[400px] bg-cyber-cyan/10 bottom-[-10%] right-[-10%] animate-bounce-slow blur-[100px]"></div>

            <StatusBar dark={false} notch={true} />

            <header className="flex items-center justify-between px-6 py-4 bg-transparent z-20 shrink-0">
                <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90">
                    <span className="material-icons text-2xl">chevron_left</span>
                </button>
                <div className="font-marker text-lg text-graffiti-red tracking-tight uppercase">Greeting Protocol</div>
                <div className="flex items-center">
                    <Wallet>
                        <ConnectWallet className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-1">
                            <Avatar className="h-8 w-8" />
                        </ConnectWallet>
                        <WalletDropdown className="z-[100]">
                            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                                <Avatar />
                                <Name />
                                <Address />
                                <EthBalance />
                            </Identity>
                            <WalletDropdownDisconnect />
                        </WalletDropdown>
                    </Wallet>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto w-full px-6 pt-6 pb-28 relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center mb-10 text-center"
                >
                    <span className="font-marker text-[10px] text-cyber-cyan tracking-[0.4em] uppercase mb-1">Signal: Morning Transmission</span>
                    <h2 className="text-5xl font-marker text-slate-900 dark:text-white leading-none tracking-tighter italic">
                        GOOD<br />MORNING
                    </h2>
                </motion.div>

                {/* Hero GM Card - Reimagined with Laser & Glow */}
                <div className="w-full p-[1px] rounded-[3.5rem] bg-gradient-to-tr from-graffiti-red via-vivid-purple to-cyber-cyan shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] relative group">
                    <div className="absolute inset-0 rounded-[3.5rem] laser-border opacity-0 dark:opacity-30 pointer-events-none" />
                    <div className="bg-white/95 dark:bg-slate-900/98 backdrop-blur-3xl rounded-[3.4rem] overflow-hidden p-8 relative dark:neon-glow-purple transition-all duration-500">

                        {/* Gritty Atmosphere Interior */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 blur-3xl -z-10 animate-pulse" />

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Central Sun Icon with Graffiti Glow */}
                            <div className="relative mb-8">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute inset-0 bg-neon-yellow blur-3xl rounded-full scale-150"
                                />
                                <div className="w-32 h-32 bg-void rounded-[2.5rem] flex items-center justify-center relative border-2 border-neon-yellow/30 shadow-[0_0_40px_rgba(250,255,0,0.2)] overflow-hidden group-hover:rotate-6 transition-transform duration-700">
                                    <span className="text-7xl drop-shadow-[0_0_15px_rgba(250,255,0,0.5)] animate-bounce-slow select-none">
                                        ☀️
                                    </span>
                                    {/* Gritty Textures */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-noise" />
                                    <div className="absolute -inset-2 border-2 border-dashed border-neon-yellow/10 rounded-full animate-rotate-slow" />
                                </div>
                            </div>

                            <h3 className="font-marker text-3xl text-slate-900 dark:text-white mb-3 tracking-tighter italic">
                                G.M. SYSTEM UPGRADE
                            </h3>
                            <p className="font-bold text-slate-500 dark:text-slate-400 text-[11px] mb-10 leading-relaxed uppercase tracking-widest px-4">
                                The greeting protocol is currently being re-indexed on the <span className="text-cyber-cyan">Superchain</span>. <br />The ritual will return shortly.
                            </p>

                            <div className="w-full relative group/btn">
                                <div className="absolute -inset-1 bg-cyber-cyan/20 rounded-2xl blur-md opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <button disabled className="w-full h-16 rounded-[1.8rem] bg-void/5 dark:bg-white/5 text-slate-400 dark:text-slate-500 font-marker text-lg uppercase tracking-[0.2em] border border-slate-200 dark:border-white/10 cursor-not-allowed flex items-center justify-center gap-4 relative overflow-hidden backdrop-blur-md">
                                    <span className="material-icons text-xl animate-spin">hourglass_top</span>
                                    SYSTEM BUSY
                                </button>
                                {/* Glowing underline */}
                                <div className="absolute -bottom-1 inset-x-12 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent blur-sm opacity-30" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Network Statistics - Reimagined */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="w-full mt-10 p-[1px] rounded-[2rem] bg-gradient-to-r from-white/10 to-transparent"
                >
                    <div className="bg-white/40 dark:bg-white/5 backdrop-blur-3xl p-6 rounded-[1.9rem] flex items-center justify-between border border-white/10 group overflow-hidden relative">
                        <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-noise" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-white/10 shadow-lg">
                                <span className="material-icons text-cyber-cyan text-2xl group-hover:rotate-12 transition-transform">analytics</span>
                            </div>
                            <div>
                                <p className="font-marker text-[9px] text-slate-500 uppercase tracking-widest mb-0.5">Global Consensus</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white tracking-widest">12,492 GMs</p>
                            </div>
                        </div>
                        <span className="material-icons text-slate-300 dark:text-slate-700 animate-pulse relative z-10">radar</span>
                    </div>
                </motion.div>

                <div className="mt-12 flex items-center gap-3 opacity-30">
                    <span className="h-[1px] w-8 bg-slate-300 dark:bg-slate-800" />
                    <p className="font-marker text-[9px] text-slate-500 uppercase tracking-[0.4em]">VERIFIED BY SUPERCHAIN</p>
                    <span className="h-[1px] w-8 bg-slate-300 dark:bg-slate-800" />
                </div>
            </main>
        </div>
    );
};

export default GMPage;
