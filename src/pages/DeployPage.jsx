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

const DeployPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col h-full w-full bg-transparent overflow-hidden relative">
            {/* Atmosphere & Background Orbs */}
            <div className="absolute inset-0 bg-gradient-to-b from-void via-slate-950 to-void opacity-0 dark:opacity-100 transition-opacity duration-1000 z-0"></div>
            <div className="bg-orb w-[500px] h-[500px] bg-primary/10 -top-40 -right-40 animate-pulse blur-[120px]"></div>
            <div className="bg-orb w-[400px] h-[400px] bg-vivid-purple/10 bottom-1/4 -left-40 animate-bounce-slow blur-[100px]"></div>

            <StatusBar dark={false} notch={true} />

            <header className="flex items-center justify-between px-6 py-4 bg-transparent z-20 shrink-0">
                <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90">
                    <span className="material-icons text-2xl">chevron_left</span>
                </button>
                <div className="font-marker text-lg text-cyber-cyan tracking-tight uppercase">Base Deployer</div>
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

            <main className="flex-1 overflow-y-auto w-full px-6 pt-6 pb-28 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <span className="font-marker text-[10px] text-primary tracking-[0.4em] uppercase">Protocol: Build On Base</span>
                    <h2 className="text-5xl font-marker mt-1 text-slate-900 dark:text-white leading-none italic tracking-tighter">SMART CONTRACT</h2>
                    <p className="font-bold text-slate-500 dark:text-slate-400 mt-2 text-[10px] uppercase tracking-widest opacity-60">Initialize your protocol on the Superchain.</p>
                </motion.div>

                <div className="space-y-8 animate-fade-in-up">
                    {/* Input Area - Reimagined */}
                    <div className="space-y-3">
                        <label className="font-marker text-[10px] uppercase tracking-[0.3em] text-slate-400 ml-1">VIRTUAL IDENTITY</label>
                        <div className="p-[1px] rounded-[2rem] bg-gradient-to-r from-cyber-cyan/30 via-white/10 to-transparent">
                            <div className="bg-white/90 dark:bg-void/80 backdrop-blur-2xl rounded-[1.95rem] p-6 shadow-2xl border border-white/5 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                                <input
                                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-2xl font-marker italic placeholder:text-slate-200 dark:placeholder:text-slate-800 text-slate-900 dark:text-white tracking-tighter"
                                    placeholder="e.g. CYBER_TOKEN"
                                    type="text"
                                />
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                                    <span className="material-icons text-cyber-cyan">edit</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selector Grid */}
                    <div className="space-y-3">
                        <label className="font-marker text-[10px] uppercase tracking-[0.3em] text-slate-400 ml-1">NETWORK PROTOCOL</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-[1px] rounded-[2.2rem] bg-gradient-to-tr from-primary/40 to-white/5">
                                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-5 rounded-[2.15rem] border border-white/10 flex flex-col items-start gap-4 relative overflow-hidden group">
                                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary/20 rounded-full blur-xl group-hover:scale-150 transition-transform" />
                                    <div className="w-12 h-12 rounded-2xl bg-void flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                        <span className="material-icons text-primary text-2xl">hub</span>
                                    </div>
                                    <div className="text-left w-full">
                                        <p className="font-marker text-xs text-slate-900 dark:text-white mb-1">BASE MAIN</p>
                                        <div className="flex items-center justify-between w-full">
                                            <p className="text-[9px] font-black text-primary uppercase tracking-widest">ACTIVE</p>
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-[1px] rounded-[2.2rem] bg-white/5">
                                <div className="bg-white/40 dark:bg-white/5 backdrop-blur-2xl p-5 rounded-[2.15rem] border border-white/5 flex flex-col items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100/50 dark:bg-void flex items-center justify-center border border-white/10">
                                        <span className="material-icons text-slate-400 text-2xl">token</span>
                                    </div>
                                    <div className="text-left">
                                        <p className="font-marker text-xs text-slate-900 dark:text-white mb-1">ERC-20</p>
                                        <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">Standard</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gas Analytics Card */}
                    <div className="p-[2px] rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent">
                        <div className="bg-white/80 dark:bg-void/40 backdrop-blur-3xl p-6 rounded-[2.4rem] border border-white/10 flex items-center justify-between shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-14 h-14 rounded-[1.5rem] bg-void flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform">
                                    <span className="material-icons text-cyber-cyan text-2xl">local_gas_station</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-marker text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Fuel Estimation</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">~$0.15 <span className="text-[10px] text-slate-400">USD</span></p>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="px-3 py-1 bg-cyber-cyan/10 rounded-full border border-cyber-cyan/20">
                                    <p className="text-[10px] font-black text-cyber-cyan uppercase tracking-widest">ECO MODE</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Action Button */}
                    <div className="relative group pt-4">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyber-cyan to-indigo-600 rounded-[2.2rem] blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
                        <button className="relative w-full h-20 rounded-[2.2rem] bg-void text-white font-marker text-xl uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(0,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 border border-white/10 overflow-hidden">
                            <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-noise" />
                            <span className="material-icons text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">rocket_launch</span>
                            <span>DEPLOY MODULE</span>
                            {/* Scanning effect on button */}
                            <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                        </button>
                    </div>
                </div>

                <div className="mt-12 mb-6 flex items-center justify-center gap-3 opacity-30">
                    <span className="h-[1px] w-8 bg-slate-300 dark:bg-slate-800" />
                    <p className="font-marker text-[9px] text-slate-500 dark:text-slate-600 uppercase tracking-[0.3em] italic">SECURE PIPELINE V2.0</p>
                    <span className="h-[1px] w-8 bg-slate-300 dark:bg-slate-800" />
                </div>
            </main>
        </div>
    );
};

export default DeployPage;
