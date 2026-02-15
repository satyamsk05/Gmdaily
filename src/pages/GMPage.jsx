import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
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
        <div className="flex flex-col h-full w-full max-w-full bg-background-light dark:bg-background-dark overflow-hidden fixed inset-0">
            {/* Background Atmosphere */}
            <div className="bg-orb w-96 h-96 bg-orange-500/10 top-[-10%] left-[-20%] animate-pulse blur-[120px]"></div>
            <div className="bg-orb w-80 h-80 bg-primary/10 bottom-[-10%] right-[-10%] animate-bounce-slow blur-[100px]"></div>

            {/* Floating Particles */}
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400/40 rounded-full blur-sm floating-particle delay-100"></div>
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-primary/30 rounded-full blur-sm floating-particle delay-300"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-yellow-400/40 rounded-full blur-sm floating-particle delay-500"></div>

            <StatusBar dark={false} notch={true} />
            <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/40 backdrop-blur-2xl z-20 shrink-0 border-b border-slate-200/50 dark:border-white/5">
                <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 shadow-sm active:scale-90 transition-all hover:bg-slate-50 dark:hover:bg-white/5">
                    <span className="material-icons text-xl">chevron_left</span>
                </button>
                <h1 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Blockchain Greeting</h1>
                <div className="flex items-center">
                    <Wallet>
                        <ConnectWallet className="bg-transparent text-slate-900 dark:text-white p-0 h-auto min-w-0 border-none">
                            <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800" />
                        </ConnectWallet>
                        <WalletDropdown className="z-[100]">
                            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                                <Avatar />
                                <Name />
                                <Address />
                                <EthBalance />
                            </Identity>
                            <WalletDropdownLink icon="settings" href="#" onClick={(e) => { e.preventDefault(); navigate('/settings'); }}>
                                Settings
                            </WalletDropdownLink>
                            <WalletDropdownDisconnect />
                        </WalletDropdown>
                    </Wallet>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto w-full px-6 pt-10 pb-28 relative z-10 flex flex-col items-center">
                {/* Personalized Greeting */}
                <div className="flex flex-col items-center mb-10 text-center animate-fade-in-up">
                    <span className="text-orange-500 font-bold text-[10px] tracking-[0.3em] uppercase mb-2">Rise And Shine</span>
                    <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight uppercase font-outfit">
                        Good Morning,<br />
                        <Identity>
                            <Name className="text-primary" />
                        </Identity>
                    </h2>
                </div>

                {/* Hero GM Card */}
                <div className="w-full max-w-sm glass-effect rounded-[3rem] p-8 relative overflow-hidden group border border-slate-200 dark:border-white/10 shadow-2xl transition-all duration-700 animate-fade-in-up delay-100 dark:bg-slate-900/40">
                    {/* Interior Decorative Glows */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-500/5 blur-3xl -z-10 animate-pulse"></div>

                    <div className="relative z-10 flex flex-col items-center text-center">
                        {/* Central Sun Icon with Glow */}
                        <div className="relative mb-8">
                            <div className="absolute inset-0 blur-2xl rounded-full scale-150 transition-all duration-1000 bg-primary/20"></div>
                            <div className="w-28 h-28 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center relative border border-slate-100 dark:border-white/10 shadow-2xl overflow-hidden">
                                <span className="text-6xl transition-all duration-[1500ms] cubic-bezier(0.34, 1.56, 0.64, 1) animate-bounce-slow">
                                    ☀️
                                </span>
                                <div className="absolute -inset-2 border-2 border-dashed border-primary/20 rounded-full animate-rotate-slow"></div>
                                {/* Decorative Sun Rays */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/0 via-orange-500/10 to-transparent animate-rotate-slow pointer-events-none"></div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                            GM Protocol Loading...
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                            We are upgrading the smart contracts to bring you a better onchain experience. <br />The ritual will return shortly.
                        </p>

                        <div className="w-full px-2 relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-2xl blur opacity-20"></div>
                            <button disabled className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 font-black text-sm uppercase tracking-[0.2em] border border-slate-200 dark:border-white/5 cursor-not-allowed flex items-center justify-center gap-3">
                                <span className="material-icons text-lg">hourglass_empty</span>
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secondary Info Card */}
                <div className="w-full max-w-sm mt-8 glass-effect dark:bg-slate-900/20 p-5 rounded-3xl border border-slate-200/50 dark:border-white/5 flex items-center justify-between animate-fade-in-up delay-200">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <span className="material-icons text-primary text-xl">history</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Stats</p>
                            <p className="text-sm font-black text-slate-900 dark:text-white">12.4K Greetings</p>
                        </div>
                    </div>
                    <span className="material-icons text-slate-300 dark:text-slate-700">chevron_right</span>
                </div>
            </main>
        </div>
    );
};

export default GMPage;
