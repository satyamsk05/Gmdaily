import React, { useState, useEffect } from 'react';
import StatusBar from '../components/StatusBar';
import { useAccount } from 'wagmi';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import { Avatar, Name, Address, Identity, EthBalance } from '@coinbase/onchainkit/identity';
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel
} from '@coinbase/onchainkit/transaction';
import { base } from 'viem/chains';
import { encodeFunctionData, parseEther } from 'viem';
import { useActivity } from '../context/ActivityContext';

const CheckInPage = () => {
    const { address, isConnected } = useAccount();
    const { addActivity, checkInData } = useActivity();
    const navigate = useNavigate();

    const today = new Date().toDateString();
    const hasCheckedInToday = checkInData.lastCheckIn === today;
    const [isCheckingIn, setIsCheckingIn] = useState(false);

    const handleSuccess = (response) => {
        addActivity('Check-in', {
            title: 'Daily Streak Maintained',
            status: 'Confirmed',
            transactionHash: response.transactionHash
        });
        setIsCheckingIn(false);
    };

    const GM_CONTRACT = '0x9A966BbE0E8f4954a32C16e76789D817C466C603';
    const gmAbi = [
        { type: 'function', name: 'gm', stateMutability: 'payable', inputs: [], outputs: [] },
    ];
    const calls = [
        {
            to: GM_CONTRACT,
            data: encodeFunctionData({ abi: gmAbi, functionName: 'gm', args: [] }),
            value: parseEther('0.00001'),
        },
    ];

    return (
        <div className="flex flex-col h-full w-full bg-transparent overflow-hidden relative">
            {/* Atmosphere & Gritty Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-void via-slate-950 to-void opacity-0 dark:opacity-100 transition-opacity duration-1000 z-0"></div>
            <div className="bg-orb w-[500px] h-[500px] bg-primary/20 -top-40 -right-40 animate-pulse blur-[120px]"></div>
            <div className="bg-orb w-[400px] h-[400px] bg-vivid-purple/10 bottom-1/4 -left-40 animate-bounce-slow blur-[100px]"></div>

            <StatusBar dark={false} notch={true} />

            <header className="flex items-center justify-between px-6 py-4 bg-transparent z-20 shrink-0">
                <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90">
                    <span className="material-icons text-2xl">chevron_left</span>
                </button>
                <div className="font-marker text-lg text-cyber-cyan tracking-tight uppercase">Streak Protocol</div>
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

            <main className="flex-1 overflow-y-auto w-full pb-28 pt-4 px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <span className="font-marker text-[10px] text-primary tracking-[0.4em] uppercase">Session: Daily Verification</span>
                    <h2 className="text-5xl font-marker mt-1 text-slate-900 dark:text-white leading-none italic tracking-tighter">CHECK-IN</h2>
                </motion.div>

                {/* Progress Grid - Reimagined */}
                <div className="mb-10 p-[1px] rounded-[2.5rem] bg-gradient-to-r from-white/20 via-primary/20 to-white/20 shadow-2xl">
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl p-6 rounded-[2.4rem]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="material-icons text-primary text-sm">calendar_today</span>
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Ritual Status</span>
                            </div>
                            <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                <span className="text-[10px] font-black text-primary uppercase">{checkInData.streak} DAY STREAK</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1.5">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                                const now = new Date();
                                const currentDayIdx = now.getDay();
                                const adjustedCurrentIdx = currentDayIdx === 0 ? 6 : currentDayIdx - 1;

                                const dayDate = new Date(now);
                                const daysDiff = idx - adjustedCurrentIdx;
                                dayDate.setDate(now.getDate() + daysDiff);
                                const dayDateString = dayDate.toDateString();

                                const isToday = idx === adjustedCurrentIdx;
                                const wasCheckedIn = checkInData.history?.includes(dayDateString);
                                const isTodayCompleted = isToday && hasCheckedInToday;
                                const isCompleted = (idx < adjustedCurrentIdx && wasCheckedIn) || isTodayCompleted;

                                return (
                                    <div key={idx} className="flex flex-col items-center gap-2">
                                        <div className={`w-full aspect-square rounded-xl border flex items-center justify-center transition-all duration-500 relative overflow-hidden ${isCompleted
                                            ? 'bg-primary border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                            : isToday
                                                ? 'bg-white dark:bg-void border-primary/50 animate-pulse'
                                                : 'bg-slate-100 dark:bg-white/5 border-transparent'
                                            }`}>
                                            {isCompleted ? (
                                                <span className="material-icons text-white text-xs">bolt</span>
                                            ) : isToday ? (
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            ) : null}

                                            {/* Gritty overlay for completed */}
                                            {isCompleted && <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-noise" />}
                                        </div>
                                        <span className={`text-[8px] font-black ${isToday ? 'text-primary' : 'text-slate-400 dark:text-slate-600'}`}>{day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Action Area */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative group p-1 rounded-full bg-gradient-to-tr from-cyber-cyan via-vivid-purple to-graffiti-red animate-rotate-slow">
                        <div className="bg-white dark:bg-slate-900 rounded-full p-2">
                            {!isConnected ? (
                                <div className="w-52 h-52 rounded-full glass-effect dark:bg-slate-900/80 flex items-center justify-center shadow-2xl p-4">
                                    <Wallet>
                                        <ConnectWallet className="!rounded-full !bg-void !text-white !font-marker !uppercase !tracking-widest !px-8 !py-5 !shadow-2xl !transition-all active:!scale-95 !border-none !text-sm">
                                            SYNC WALLET
                                        </ConnectWallet>
                                    </Wallet>
                                </div>
                            ) : (
                                <Transaction
                                    chainId={base.id}
                                    calls={calls}
                                    onStatus={(status) => {
                                        if (status.statusName === 'building' || status.statusName === 'signing') setIsCheckingIn(true);
                                        if (status.statusName === 'success') handleSuccess(status);
                                        if (status.statusName === 'error') setIsCheckingIn(false);
                                    }}
                                >
                                    <TransactionButton
                                        disabled={hasCheckedInToday}
                                        className={`w-52 h-52 rounded-full flex flex-col items-center justify-center shadow-2xl border-4 transition-all duration-700 relative overflow-hidden ${hasCheckedInToday
                                            ? 'bg-emerald-500/10 border-emerald-500/30 dark:neon-glow-cyan'
                                            : 'bg-void border-white/5 hover:shadow-primary/30 active:scale-95 dark:neon-glow-purple'
                                            }`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {hasCheckedInToday ? (
                                                <motion.div
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="flex flex-col items-center"
                                                >
                                                    <span className="material-icons text-emerald-500 text-6xl mb-2">task_alt</span>
                                                    <span className="font-marker text-emerald-500 text-xs tracking-widest uppercase">Verified</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex flex-col items-center pt-2"
                                                >
                                                    {isCheckingIn ? (
                                                        <>
                                                            <div className="w-16 h-16 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-4" />
                                                            <span className="font-marker text-cyber-cyan text-xs tracking-[0.2em] italic">SYNCING...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className="material-icons text-white text-7xl mb-1 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">fingerprint</span>
                                                            <span className="font-marker text-white text-xs tracking-widest uppercase">INITIATE RITUAL</span>
                                                        </>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Scanning Effect Overlay */}
                                        {!hasCheckedInToday && (
                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-1/2 w-full animate-scan pointer-events-none" />
                                        )}
                                    </TransactionButton>
                                    <div className="mt-6 flex justify-center">
                                        <TransactionStatus>
                                            <TransactionStatusLabel className="font-marker text-slate-500 text-[10px] uppercase tracking-[0.3em] opacity-50" />
                                        </TransactionStatus>
                                    </div>
                                </Transaction>
                            )}
                        </div>
                    </div>
                </div>

                {/* Analytics Card - Refined */}
                <div className="p-[2px] rounded-[3rem] bg-gradient-to-br from-white/10 to-white/5 shadow-xl mb-8">
                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-6 rounded-[2.9rem] relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-150" />

                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-void flex items-center justify-center border border-white/10 shadow-lg">
                                    <span className="material-icons text-graffiti-red text-3xl animate-pulse">local_fire_department</span>
                                </div>
                                <div>
                                    <p className="font-marker text-[10px] text-slate-400 uppercase tracking-widest mb-1">Ritual Streak</p>
                                    <p className="text-3xl font-marker italic text-slate-900 dark:text-white leading-none tracking-tighter">{checkInData.streak} Days</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="px-3 py-1 bg-void/10 dark:bg-white/10 rounded-xl border border-white/10">
                                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">LVL 4 ADEPT</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="font-marker text-[10px] text-slate-400 uppercase tracking-widest">Next Phase Unlock</span>
                                <span className="text-xs font-black text-primary uppercase">
                                    {7 - (checkInData.streak % 7)} Rituals
                                </span>
                            </div>

                            <div className="w-full h-3 bg-slate-100 dark:bg-void rounded-full overflow-hidden shadow-inner border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(checkInData.streak % 7) * (100 / 7)}%` }}
                                    className="h-full bg-gradient-to-r from-primary to-cyber-cyan relative"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reward Preview - Gritty Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-void dark:bg-void p-5 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                        <p className="font-marker text-[9px] text-slate-500 uppercase tracking-widest mb-2">Collective Pool</p>
                        <p className="text-xl font-black text-white leading-none">10.5K <span className="text-[10px] text-primary italic font-marker">STREAK</span></p>
                    </div>
                    <div className="bg-void dark:bg-white/5 p-5 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay bg-noise" />
                        <p className="font-marker text-[9px] text-slate-500 uppercase tracking-widest mb-2">Allocated Share</p>
                        <p className="text-xl font-black text-white leading-none">420 <span className="text-[10px] text-emerald-500 italic font-marker">STREAK</span></p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckInPage;
