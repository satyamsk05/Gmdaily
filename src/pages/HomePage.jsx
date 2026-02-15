import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useBalance, useSendTransaction, useSwitchChain, usePublicClient } from 'wagmi';
import { useUser } from '../context/UserContext';
import { parseEther, encodeFunctionData, formatEther } from 'viem';
import { base } from 'wagmi/chains';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ConnectWallet,
    Wallet,
    WalletDropdown,
    WalletDropdownDisconnect,
    WalletDropdownLink
} from '@coinbase/onchainkit/wallet';
import {
    Transaction,
    TransactionButton,
    TransactionStatus,
    TransactionStatusAction,
    TransactionStatusLabel
} from '@coinbase/onchainkit/transaction';
import { Avatar, Name, Address, Identity, EthBalance } from '@coinbase/onchainkit/identity';

import { useActivity } from '../context/ActivityContext';
import { useFarcaster } from '../context/FarcasterContext';

const HomePage = () => {
    const navigate = useNavigate();
    const { address, isConnected } = useAccount();
    const { userName } = useUser();
    const { context } = useFarcaster();

    const { activities, addActivity, checkInData } = useActivity();
    const { sendTransaction, isLoading: isSending } = useSendTransaction();

    const [showReceiveModal, setShowReceiveModal] = useState(false);
    const [showSendModal, setShowSendModal] = useState(false);
    const [sendAddress, setSendAddress] = useState('');
    const [sendAmount, setSendAmount] = useState('');
    const [selectedTx, setSelectedTx] = useState(null);
    const [showTxModal, setShowTxModal] = useState(false);
    const [activityFilter, setActivityFilter] = useState('All');
    const [legends, setLegends] = useState([]);
    const [txFee, setTxFee] = useState(null);
    const publicClient = usePublicClient();
    const [txReceipt, setTxReceipt] = useState(null);

    useEffect(() => {
        const storedLegends = JSON.parse(localStorage.getItem('my_legends') || '[]');
        setLegends(storedLegends);
    }, []);
    const [txExplorerUrl, setTxExplorerUrl] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleMaxAmount = () => {
        if (balance) {
            const available = parseFloat(balance.formatted);
            const gasReserve = 0.00005;
            const max = Math.max(0, available - gasReserve);
            setSendAmount(max.toFixed(6));
        }
    };

    const handleSend = async () => {
        if (!sendAddress || !sendAmount) return;
        try {
            sendTransaction({
                to: sendAddress,
                value: parseEther(sendAmount),
            }, {
                onSuccess: (hash) => {
                    addActivity('Transaction', {
                        title: `Sent ETH`,
                        amount: `-${sendAmount} ETH`,
                        status: 'Confirmed',
                        icon: 'north_east',
                        transactionHash: hash
                    });
                    setShowSendModal(false);
                    setSendAddress('');
                    setSendAmount('');
                }
            });
        } catch (error) {
            console.error('Send error:', error);
        }
    };

    const copyToClipboardText = (text) => {
        if (!text || typeof text !== 'string') return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const NFT_CONTRACT = '0xa932a9960C83FcCc382bd8fd7CE6b6AeF4a2e2dE';
    const GM_CONTRACT = '0x9A966BbE0E8f4954a32C16e76789D817C466C603';
    const nftAbi = [{ type: 'function', name: 'mint', stateMutability: 'payable', inputs: [], outputs: [] }];
    const gmAbi = [{ type: 'function', name: 'gm', stateMutability: 'payable', inputs: [], outputs: [] }];

    const handleTxClick = async (activity) => {
        const inferredTo = activity.to || (activity.type === 'GM' || activity.type === 'Check-in' ? GM_CONTRACT : (activity.title && activity.title.includes('Mint')) || activity.type === 'Mint' ? NFT_CONTRACT : undefined);
        const enriched = { ...activity, to: inferredTo };
        setSelectedTx(enriched);
        setShowTxModal(true);
        try {
            if (!publicClient || !address || !inferredTo) return;
            let request = { account: address, to: inferredTo, value: 0n };
            if (activity.type === 'GM' || activity.type === 'Check-in') {
                request = { ...request, data: encodeFunctionData({ abi: gmAbi, functionName: 'gm', args: [] }), value: parseEther('0.00001') };
            } else if ((activity.title && activity.title.includes('Mint')) || activity.type === 'Mint') {
                request = { ...request, data: encodeFunctionData({ abi: nftAbi, functionName: 'mint', args: [] }), value: parseEther('0.0002') };
            } else if (activity.type === 'Transaction' && activity.amount) {
                const amt = activity.amount.replace(/[^\d.]/g, '');
                if (amt) request = { ...request, value: parseEther(amt) };
            }
            const gas = await publicClient.estimateGas(request);
            const gasPrice = await publicClient.getGasPrice();
            const feeWei = gas * gasPrice;
            const feeEth = Number(formatEther(feeWei));
            setTxFee({ feeEth, gas: gas.toString(), gasPriceGwei: Number(gasPrice) / 1e9 });
            if (activity.transactionHash) {
                const receipt = await publicClient.getTransactionReceipt({ hash: activity.transactionHash });
                setTxReceipt(receipt || null);
                setTxExplorerUrl(`https://basescan.org/tx/${activity.transactionHash}`);
            }
        } catch {
            setTxFee(null);
            setTxReceipt(null);
            setTxExplorerUrl(null);
        }
    };

    const uniqueActivities = activities.filter((activity, index, self) =>
        index === self.findIndex((t) => (
            (t.transactionHash && activity.transactionHash && t.transactionHash === activity.transactionHash) ||
            (t.type === activity.type && (t.text === activity.text || t.title === activity.title) && t.type !== 'Transaction')
        ))
    ).slice(0, 10);

    const counts = {
        All: uniqueActivities.length,
        Transaction: uniqueActivities.filter((a) => a.type === 'Transaction').length,
        GM: uniqueActivities.filter((a) => a.type === 'GM').length,
        'Check-in': uniqueActivities.filter((a) => a.type === 'Check-in').length,
        'Legends': legends.length,
    };

    const visibleActivities = uniqueActivities.filter((a) => {
        if (activityFilter === 'All') return true;
        return a.type === activityFilter;
    });

    const { data: balance } = useBalance({ address: address });

    return (
        <div className="flex flex-col h-full w-full bg-transparent overflow-hidden relative">
            {/* Background Orbs & Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-b from-void via-slate-950 to-void opacity-0 dark:opacity-100 transition-opacity duration-1000 z-0"></div>
            <div className="bg-orb w-[500px] h-[500px] bg-cyber-cyan/10 -top-40 -right-40 animate-pulse blur-[120px]"></div>
            <div className="bg-orb w-[400px] h-[400px] bg-vivid-purple/10 bottom-1/4 -left-40 animate-bounce-slow blur-[100px]"></div>

            <main className="flex-1 overflow-y-auto px-6 pb-28 w-full relative z-10">
                {/* Header Section */}
                <header className="flex justify-between items-center mb-10 pt-8 animate-fade-in-up">
                    <div className="flex flex-col">
                        <p className="font-marker text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] mb-1">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </p>
                        <h1 className="text-3xl font-marker italic tracking-tighter text-slate-900 dark:text-white leading-tight">
                            {context?.user?.displayName ? `HI, ${context.user.displayName.toUpperCase()}` : (isConnected ? `HI, ${userName.toUpperCase()}` : 'GM, FRIEND')}
                        </h1>
                    </div>
                    <div className="flex items-center relative group/wallet">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan/30 to-vivid-purple/30 rounded-2xl blur opacity-0 group-hover/wallet:opacity-100 transition-opacity duration-500"></div>
                        <Wallet>
                            <ConnectWallet className="bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-1">
                                {context?.user?.pfpUrl ? (
                                    <div className="relative">
                                        <img src={context.user.pfpUrl} alt="PFP" className="w-9 h-9 rounded-xl border border-white/10 shadow-md object-cover" />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-void border border-white/20 flex items-center justify-center">
                                            <span className="text-[6px] text-white">FC</span>
                                        </div>
                                    </div>
                                ) : (
                                    <Avatar className="h-9 w-9" />
                                )}
                            </ConnectWallet>
                            <WalletDropdown className="z-[100]">
                                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                                    <Avatar />
                                    <Name />
                                    <Address />
                                    <EthBalance />
                                </Identity>
                                <WalletDropdownLink icon="settings" href="#" onClick={(e) => { e.preventDefault(); navigate('/settings'); }}>Settings</WalletDropdownLink>
                                <WalletDropdownDisconnect />
                            </WalletDropdown>
                        </Wallet>
                    </div>
                </header>

                {/* Balance Card Section - Reimagined with Laser Border & Bloom */}
                <section className="p-[1px] rounded-[3.5rem] bg-gradient-to-br from-cyber-cyan via-vivid-purple to-graffiti-red shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] mb-10 group animate-fade-in-up delay-100 relative">
                    {/* Bloom effect behind card */}
                    <div className="absolute inset-0 bg-cyber-cyan/5 blur-3xl rounded-full opacity-0 dark:group-hover:opacity-100 transition-opacity duration-1000"></div>

                    <div className="bg-white/95 dark:bg-slate-900/98 backdrop-blur-3xl rounded-[3.4rem] p-8 relative overflow-hidden h-full border border-white/10 dark:neon-glow-cyan transition-all duration-500">
                        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>

                        {/* Laser border animation on top */}
                        <div className="absolute inset-0 rounded-[3.4rem] laser-border opacity-0 dark:opacity-30 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="font-marker text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.4em] mb-2">SAFE PORTFOLIO</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-5xl font-marker italic text-slate-900 dark:text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                            {balance ? parseFloat(balance.formatted).toFixed(4) : '0.0000'}
                                        </h3>
                                        <span className="font-marker text-sm text-primary italic uppercase tracking-widest animate-pulse">ETH</span>
                                    </div>
                                </div>
                                <div className="bg-void dark:bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 shadow-xl">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]"></span>
                                    <span className="font-marker text-[9px] text-white/70 uppercase tracking-tighter">LIVE_FEED</span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowReceiveModal(true)}
                                    className="flex-1 h-14 rounded-2xl bg-void text-white font-marker text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all border border-white/10 hover:neon-glow-cyan"
                                >
                                    <span className="material-icons text-xl text-cyber-cyan">qr_code_2</span>
                                    Receive
                                </button>
                                <button
                                    onClick={() => setShowSendModal(true)}
                                    className="flex-1 h-14 rounded-2xl bg-white dark:bg-white/5 text-slate-900 dark:text-white font-marker text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all border border-slate-200 dark:border-white/10 hover:neon-glow-red"
                                >
                                    <span className="material-icons text-xl text-graffiti-red">north_east</span>
                                    Transfer
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Primary Action Section */}
                <div className="mb-12 animate-fade-in-up delay-200">
                    <button
                        onClick={() => navigate('/mint')}
                        className="w-full h-20 rounded-[2.5rem] bg-void border border-white/10 flex items-center justify-center gap-4 active:scale-[0.98] transition-all relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                    >
                        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-noise" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyber-cyan to-vivid-purple opacity-20 group-hover:opacity-60 transition-all duration-700 animate-pulse blur-xl"></div>
                        <span className="material-icons text-3xl text-graffiti-red group-hover:rotate-45 transition-transform relative z-10">auto_awesome</span>
                        <span className="font-marker text-lg text-white uppercase tracking-[0.2em] relative z-10 italic">MINT LEGEND NFT</span>
                        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-15deg] pointer-events-none animate-shimmer scale-150"></div>
                    </button>
                </div>

                {/* Rituals Registry */}
                <section className="mb-12 animate-fade-in-up delay-300">
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h3 className="font-marker text-xl tracking-tighter text-slate-900 dark:text-white italic">ACTIVE RITUALS</h3>
                        <p className="font-marker text-[9px] uppercase tracking-[0.3em] text-slate-400">STATUS: SYNCED</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                        <button
                            onClick={() => navigate('/checkin')}
                            className="p-[1px] rounded-[2.5rem] bg-gradient-to-tr from-graffiti-red/30 to-transparent flex-1"
                        >
                            <div className="bg-white/60 dark:bg-slate-900/40 p-6 rounded-[2.45rem] flex flex-col items-start gap-4 hover:bg-white transition-all group relative active:scale-[0.97] backdrop-blur-2xl">
                                <div className="absolute top-3 right-3 bg-void px-2 py-0.5 rounded-lg border border-white/10 shadow-xl">
                                    <span className="font-marker text-[8px] text-graffiti-red">{checkInData?.streak ?? 0}D STREAK</span>
                                </div>
                                <div className="w-14 h-14 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform shadow-2xl">
                                    <span className="material-icons text-3xl text-graffiti-red animate-pulse">local_fire_department</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-marker text-base text-slate-900 dark:text-white tracking-tight">VERIFY GM</p>
                                    <p className="font-marker text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Secure Points</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/deploy')}
                            className="p-[1px] rounded-[2.5rem] bg-gradient-to-tr from-cyber-cyan/30 to-transparent flex-1"
                        >
                            <div className="bg-white/60 dark:bg-slate-900/40 p-6 rounded-[2.45rem] flex flex-col items-start gap-4 hover:bg-white transition-all group active:scale-[0.97] backdrop-blur-2xl">
                                <div className="w-14 h-14 rounded-2xl bg-void flex items-center justify-center border border-white/10 group-hover:-rotate-6 transition-transform shadow-2xl">
                                    <span className="material-icons text-3xl text-cyber-cyan">rocket_launch</span>
                                </div>
                                <div className="text-left">
                                    <p className="font-marker text-base text-slate-900 dark:text-white tracking-tight">DEPLOYER</p>
                                    <p className="font-marker text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">Base Mainnet</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </section>

                {/* Ledger Feed */}
                <section className="animate-fade-in-up delay-400">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-marker text-xl tracking-tighter text-slate-900 dark:text-white italic px-1">
                            {activityFilter === 'Legends' ? 'COLLECTION' : 'LEDGER FEED'}
                        </h3>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
                            <div className="w-2 h-2 rounded-full bg-vivid-purple animate-pulse delay-75" />
                        </div>
                    </div>

                    <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        {['All', 'Transaction', 'GM', 'Check-in', 'Legends'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActivityFilter(tab)}
                                className={`whitespace-nowrap px-5 py-2.5 rounded-2xl font-marker text-[10px] uppercase tracking-widest border transition-all ${activityFilter === tab
                                    ? 'bg-void text-white border-white/20 shadow-xl'
                                    : 'bg-white/40 dark:bg-white/5 border-slate-100 dark:border-white/5 text-slate-400'
                                    }`}
                            >
                                {tab} <span className="ml-1 opacity-50 tabular-nums">{counts[tab] ?? 0}</span>
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {activityFilter === 'Legends' ? (
                            legends.length === 0 ? (
                                <div className="text-center py-16 bg-white/40 dark:bg-void/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                                    <span className="material-icons text-5xl text-slate-300 dark:text-slate-800 mb-4 animate-bounce-slow">security</span>
                                    <p className="font-marker text-slate-500 uppercase tracking-widest text-xs">VAULT IS EMPTY</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-5">
                                    {legends.map((nft) => (
                                        <div key={nft.id} className="relative group/legend hover:scale-[1.05] transition-all duration-700">
                                            <div className="p-1 rounded-[2.2rem] bg-gradient-to-br from-white/20 to-transparent">
                                                <div className="aspect-square rounded-[2rem] overflow-hidden relative shadow-2xl">
                                                    <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay bg-noise z-10" />
                                                    <img src={nft.image} alt="NFT" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent opacity-60" />
                                                    <div className="absolute bottom-4 left-4">
                                                        <p className="font-marker text-[9px] text-white uppercase tracking-widest">SECURED</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            !isConnected ? (
                                <div className="text-center py-16 bg-white/40 dark:bg-void/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                                    <span className="material-icons text-5xl text-slate-300 dark:text-slate-800 mb-4">private_connectivity</span>
                                    <p className="font-marker text-slate-500 uppercase tracking-widest text-xs">SYNC FOR ACCESS</p>
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="text-center py-16 bg-white/40 dark:bg-void/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                                    <span className="material-icons text-5xl text-slate-300 dark:text-slate-800 mb-4">radar</span>
                                    <p className="font-marker text-slate-500 uppercase tracking-widest text-xs">NO SIGNALS DETECTED</p>
                                </div>
                            ) : (
                                visibleActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        onClick={() => handleTxClick(activity)}
                                        className="flex items-center justify-between p-5 rounded-[2.2rem] bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:bg-white dark:hover:bg-slate-900 transition-all cursor-pointer group active:scale-[0.98] relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-void flex items-center justify-center shadow-2xl border border-white/5 group-hover:bg-primary/20 transition-colors">
                                                <span className="material-icons text-2xl text-white group-hover:text-primary transition-colors">{activity.icon || (activity.type === 'GM' ? 'send' : 'star')}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-marker text-base text-slate-900 dark:text-white uppercase tracking-tighter">{activity.title || activity.type}</h4>
                                                <p className="font-marker text-[9px] text-slate-400 mt-1 uppercase tracking-widest">{activity.timestamp || activity.time}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-marker text-sm text-slate-900 dark:text-white italic tracking-tighter">{activity.amount}</p>
                                            <div className="flex items-center justify-end gap-2 mt-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-lg">
                                                <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                                                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">SECURED</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </section>

                {/* Receiver Modal Refined */}
                {showReceiveModal && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12 sm:items-center sm:pb-0">
                        <div className="fixed inset-0 bg-void/80 backdrop-blur-xl transition-opacity" onClick={() => setShowReceiveModal(false)}></div>
                        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3.5rem] p-1 shadow-3xl animate-in fade-in slide-in-from-bottom-20 duration-500 overflow-hidden">
                            <div className="p-8 pb-10 flex flex-col items-center">
                                <div className="absolute top-8 right-8">
                                    <button onClick={() => setShowReceiveModal(false)} className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:scale-110 transition-transform">
                                        <span className="material-icons">close</span>
                                    </button>
                                </div>
                                <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full mb-10" />
                                <h3 className="font-marker text-3xl text-slate-900 dark:text-white mb-2 italic tracking-tighter">SECURE RECEIVE</h3>
                                <p className="font-bold text-slate-500 uppercase text-[10px] tracking-widest mb-10 opacity-60">Scan to initiate incoming transfer</p>

                                <div className="relative p-6 bg-white rounded-[3rem] shadow-2xl ring-8 ring-primary/5 mb-12 group">
                                    <div className="absolute -inset-2 bg-gradient-to-tr from-cyber-cyan via-vivid-purple to-graffiti-red blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                                    {address ? <QRCodeSVG value={address} size={200} level="H" /> : <div className="w-[200px] h-[200px]" />}
                                </div>

                                <div className="w-full bg-slate-50 dark:bg-void/50 p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 mb-8 relative overflow-hidden group">
                                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                                    <p className="font-marker text-[9px] text-primary uppercase tracking-[0.3em] mb-4">PUBLIC RECOGNITION KEY</p>
                                    <div className="flex items-center justify-between gap-5">
                                        <span className="text-[12px] font-marker italic text-slate-900 dark:text-white break-all leading-tight opacity-70">{address || 'SCANNING...'}</span>
                                        <button onClick={() => copyToClipboardText(address)} className={`h-12 w-12 flex-shrink-0 rounded-2xl transition-all shadow-xl ${copied ? 'bg-emerald-500' : 'bg-void text-white'}`}>
                                            <span className="material-icons text-xl">{copied ? 'task_alt' : 'content_copy'}</span>
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => setShowReceiveModal(false)} className="w-full h-16 rounded-[1.8rem] bg-void dark:bg-white text-white dark:text-slate-900 font-marker text-sm uppercase tracking-widest active:scale-95 transition-all">TERMINATE</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transfer Modal Refined */}
                {showSendModal && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12 sm:items-center sm:pb-0">
                        <div className="fixed inset-0 bg-void/80 backdrop-blur-xl transition-opacity" onClick={() => setShowSendModal(false)}></div>
                        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3.5rem] p-8 shadow-3xl animate-in fade-in slide-in-from-bottom-20 duration-500 border border-white/10">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="font-marker text-3xl text-slate-900 dark:text-white italic tracking-tighter">OUTBOUND</h3>
                                <button onClick={() => setShowSendModal(false)} className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                    <span className="material-icons">close</span>
                                </button>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <p className="font-marker text-[10px] text-slate-400 uppercase tracking-widest">RECIPIENT_ID</p>
                                        <span className="material-icons text-[14px] text-primary">security</span>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="0x..."
                                        value={sendAddress}
                                        onChange={(e) => setSendAddress(e.target.value)}
                                        className="w-full h-16 bg-slate-50 dark:bg-void/80 rounded-[1.8rem] px-6 text-sm font-marker italic text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 outline-none focus:border-primary/50 transition-all shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <p className="font-marker text-[10px] text-slate-400 uppercase tracking-widest">PAYLOAD_VALUE</p>
                                        <button onClick={handleMaxAmount} className="font-marker text-[9px] text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-xl">
                                            MAX: {balance ? parseFloat(balance.formatted).toFixed(4) : '0'}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={sendAmount}
                                            onChange={(e) => setSendAmount(e.target.value)}
                                            className="w-full h-20 bg-slate-50 dark:bg-void/80 rounded-[2.2rem] px-8 text-4xl font-marker italic text-slate-900 dark:text-white border border-slate-100 dark:border-white/5 outline-none focus:border-primary/50 transition-all shadow-inner"
                                        />
                                        <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-void px-3 py-1.5 rounded-xl border border-white/10">
                                            <span className="font-marker text-primary tracking-tighter text-[11px]">ETH</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleSend} disabled={!sendAddress || !sendAmount || isSending} className="w-full h-20 bg-void text-white rounded-[2.2rem] font-marker text-xl uppercase tracking-widest shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 border border-white/5 active:scale-95 transition-all overflow-hidden relative">
                                    {isSending ? (
                                        <div className="w-6 h-6 border-3 border-cyber-cyan/30 border-t-cyber-cyan rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <span className="material-icons text-xl text-graffiti-red">bolt</span>
                                            <span>EXECUTE TRANSFER</span>
                                        </>
                                    )}
                                    <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay bg-noise" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tx Modal Refined */}
                {showTxModal && selectedTx && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-void/90 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="fixed inset-0" onClick={() => setShowTxModal(false)}></div>
                        <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3.8rem] p-8 shadow-3xl animate-in slide-in-from-bottom-10 duration-500 border border-white/10">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="font-marker text-2xl text-slate-900 dark:text-white italic tracking-tighter uppercase">Signal Report</h3>
                                <button onClick={() => setShowTxModal(false)} className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                                    <span className="material-icons">close</span>
                                </button>
                            </div>
                            <div className="space-y-8">
                                <div className="p-6 bg-slate-50 dark:bg-void/60 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-inner relative overflow-hidden">
                                    <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50" />
                                    <p className="font-marker text-[9px] text-slate-500 uppercase tracking-widest mb-4">TRANSACTION_HASH</p>
                                    <code className="font-marker text-[11px] italic text-slate-900 dark:text-white break-all leading-tight opacity-70 block">{selectedTx.transactionHash || selectedTx.id}</code>
                                </div>
                                <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                                    <div className="space-y-2">
                                        <p className="font-marker text-[9px] text-slate-400 uppercase tracking-widest">Protocol Check</p>
                                        <div className="flex items-center gap-2 font-black text-emerald-500 text-[10px] uppercase tracking-tighter">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></div> SECURED
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-marker text-[9px] text-slate-400 uppercase tracking-widest">Network Edge</p>
                                        <p className="font-marker text-[10px] text-slate-900 dark:text-white uppercase tracking-tighter italic">BASE MAINNET</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-marker text-[9px] text-slate-400 uppercase tracking-widest">Payload Method</p>
                                        <p className="font-marker text-[10px] text-slate-900 dark:text-white uppercase tracking-tighter italic">{selectedTx.type.toUpperCase()}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="font-marker text-[9px] text-slate-400 uppercase tracking-widest">Signal Value</p>
                                        <p className="font-marker text-lg text-primary italic tracking-tight">{selectedTx.amount || '0 ETH'}</p>
                                    </div>
                                </div>
                                {txExplorerUrl && (
                                    <a href={txExplorerUrl} target="_blank" rel="noopener noreferrer" className="w-full h-18 bg-void dark:bg-white text-white dark:text-void rounded-[2rem] flex items-center justify-center gap-4 font-marker text-xs uppercase tracking-widest active:scale-[0.98] transition-all shadow-2xl relative overflow-hidden">
                                        <span className="material-icons text-xl text-cyber-cyan">public</span> Onchain Ledger
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HomePage;
