import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { useAccount, usePublicClient, useReadContract } from 'wagmi';
import { base } from 'viem/chains';
import { encodeFunctionData, parseEther, formatEther } from 'viem';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ConnectWallet,
  Wallet
} from '@coinbase/onchainkit/wallet';
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusLabel
} from '@coinbase/onchainkit/transaction';
import { useActivity } from '../context/ActivityContext';

const MintPage = () => {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { addActivity } = useActivity();
  const publicClient = usePublicClient();

  const NFT_CONTRACT = '0xa932a9960C83FcCc382bd8fd7CE6b6AeF4a2e2dE';
  const MINT_PRICE_ETH = '0.0002';

  const nftAbi = [
    { type: 'function', name: 'mint', stateMutability: 'payable', inputs: [], outputs: [] },
    { type: 'function', name: 'totalMinted', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
    { type: 'function', name: 'MAX_SUPPLY', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
    { type: 'function', name: 'hasUserMinted', stateMutability: 'view', inputs: [{ type: 'address' }], outputs: [{ type: 'bool' }] },
  ];

  const [txHash, setTxHash] = useState(null);
  const [gasFee, setGasFee] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [randomImage, setRandomImage] = useState('https://images.unsplash.com/photo-1635322966219-b75ed3a90122?w=800&h=800&fit=crop');
  const [hasMinted, setHasMinted] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  // Contract Reads
  const { data: totalMintedData } = useReadContract({
    address: NFT_CONTRACT,
    abi: nftAbi,
    functionName: 'totalMinted',
    watch: true,
  });

  const { data: maxSupplyData } = useReadContract({
    address: NFT_CONTRACT,
    abi: nftAbi,
    functionName: 'MAX_SUPPLY',
  });

  const { data: hasUserMintedData } = useReadContract({
    address: NFT_CONTRACT,
    abi: nftAbi,
    functionName: 'hasUserMinted',
    args: [address],
    query: {
      enabled: !!address,
    }
  });

  const totalMinted = totalMintedData ? Number(totalMintedData) : 0;
  const maxSupply = maxSupplyData ? Number(maxSupplyData) : 5555;
  const progressPercent = Math.min((totalMinted / maxSupply) * 100, 100);

  const nftImages = [
    'https://images.unsplash.com/photo-1635322966219-b75ed3a90122?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1541560052-5e137f229371?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1618331835717-801e976710b2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1565528994778-9e32231648a7?w=800&h=800&fit=crop',
  ];

  useEffect(() => {
    if (hasUserMintedData) {
      setHasMinted(true);
    } else {
      const storedLegends = JSON.parse(localStorage.getItem('my_legends') || '[]');
      if (storedLegends.length > 0) {
        setHasMinted(true);
      }
    }
    setRandomImage(nftImages[Math.floor(Math.random() * nftImages.length)]);
  }, [hasUserMintedData]);

  const handleSuccess = (response) => {
    const hash = response?.transactionHash || response;
    setTxHash(hash);
    setIsRevealed(true);
    setHasMinted(true);
    setIsMinting(false);

    try {
      const currentCollection = JSON.parse(localStorage.getItem('my_legends') || '[]');
      const newNft = {
        id: Date.now(),
        image: randomImage,
        mintedAt: new Date().toISOString(),
        txHash: hash
      };
      localStorage.setItem('my_legends', JSON.stringify([newNft, ...currentCollection]));
    } catch (e) {
      console.error('Failed to save to collection:', e);
    }

    addActivity('Mint', {
      title: 'Minted Legend NFT',
      amount: `-${MINT_PRICE_ETH} ETH`,
      status: 'Confirmed',
      transactionHash: hash,
    });
  };

  const calls = useMemo(() => [
    {
      to: NFT_CONTRACT,
      data: encodeFunctionData({
        abi: nftAbi,
        functionName: 'mint',
        args: [],
      }),
      value: parseEther(MINT_PRICE_ETH),
    },
  ], [NFT_CONTRACT]);

  return (
    <div className="flex flex-col h-full w-full bg-transparent overflow-hidden relative">
      {/* Background Orbs & Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-slate-950 to-void opacity-0 dark:opacity-100 transition-opacity duration-1000 z-0"></div>
      <div className="bg-orb w-[500px] h-[500px] bg-primary/20 -top-40 -right-40 animate-pulse blur-[120px]"></div>
      <div className="bg-orb w-[400px] h-[400px] bg-vivid-purple/10 bottom-1/4 -left-40 animate-bounce-slow blur-[100px]"></div>

      <StatusBar dark={false} notch={true} />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-transparent z-20 shrink-0">
        <button onClick={() => navigate(-1)} className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/10 dark:bg-white/5 backdrop-blur-xl text-slate-900 dark:text-white border border-white/20 hover:bg-white/20 transition-all active:scale-90">
          <span className="material-icons text-2xl">chevron_left</span>
        </button>
        <div className="font-marker text-lg text-graffiti-red tracking-tight">MINT STATION</div>
        <div className="w-11"></div>
      </header>

      <main className="flex-1 overflow-y-auto w-full px-6 pb-28 relative z-10 flex flex-col justify-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative"
        >
          {/* Main Container with Iridescent Border & Laser Effect */}
          <div className="p-[1px] rounded-[3.5rem] bg-gradient-to-br from-cyber-cyan via-vivid-purple to-graffiti-red shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] relative group">
            <div className="absolute inset-0 rounded-[3.5rem] laser-border opacity-0 dark:opacity-30 pointer-events-none" />
            <div className="bg-white/95 dark:bg-slate-900/98 backdrop-blur-3xl rounded-[3.4rem] overflow-hidden p-3 pt-0 border border-white/10 dark:neon-glow-cyan transition-all duration-500">

              {/* NFT Hero Area */}
              <div className="relative w-full aspect-square rounded-[2.8rem] overflow-hidden bg-slate-800 border border-white/10 group mt-3">
                {/* Live Badge - Graffiti Style */}
                <div className="absolute top-6 left-6 z-30">
                  <div className="bg-slate-900/60 backdrop-blur-md rounded-full px-4 py-2 border border-white/10 flex items-center gap-2 shadow-2xl">
                    <span className="w-2.5 h-2.5 rounded-full bg-graffiti-red animate-pulse shadow-[0_0_15px_#FF003C]"></span>
                    <span className="font-marker text-[11px] uppercase tracking-[0.2em] text-white">LIVE MINT</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!isRevealed && !hasMinted ? (
                    <motion.div
                      key="hidden"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      {/* Gritty Tech Overlays */}
                      <div className="absolute inset-0 opacity-40 pointer-events-none mix-blend-overlay bg-noise" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/80 pointer-events-none" />

                      {/* Digital Distortion Effect */}
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,240,255,0.05)_2px,rgba(0,240,255,0.05)_4px)]" />

                      <div className="relative z-10 text-center px-8">
                        <div className="w-28 h-28 mx-auto mb-8 relative">
                          <motion.div
                            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 bg-cyber-cyan blur-3xl rounded-full"
                          />
                          <div className="relative w-full h-full bg-void/90 backdrop-blur-2xl rounded-[2rem] border-2 border-cyber-cyan/40 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,240,255,0.2)]">
                            <span className="material-icons text-cyber-cyan text-5xl drop-shadow-[0_0_20px_#00F0FF]">security</span>
                          </div>
                        </div>
                        <h1 className="font-marker text-5xl text-white mb-3 tracking-tighter drop-shadow-2xl italic">GENESIS</h1>
                        <div className="inline-block px-4 py-1.5 bg-cyber-cyan/20 rounded-xl border border-cyber-cyan/30">
                          <p className="font-black text-cyber-cyan text-[10px] uppercase tracking-[0.3em]">Restricted Access</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="revealed"
                      initial={{ scale: 1.3, rotate: 5, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", damping: 12, stiffness: 100 }}
                      className="absolute inset-0"
                    >
                      <img
                        src={randomImage}
                        alt="Restored Art"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent" />

                      {/* Scanlines for the revealed image */}
                      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,white_2px,white_4px)] mix-blend-overlay" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls UI */}
              <div className="px-6 pb-10 pt-10 text-center relative z-20">
                <div className="flex justify-between items-end mb-5">
                  <div className="text-left">
                    <p className="font-marker text-[11px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-1">STREAK TARGET</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-widest flex items-baseline gap-2">
                      {totalMinted.toLocaleString()} <span className="text-slate-200 dark:text-slate-800 text-xl">/</span> {maxSupply.toLocaleString()}
                    </p>
                  </div>
                  <div className="px-4 py-1.5 bg-gradient-to-r from-cyber-cyan/10 to-vivid-purple/10 rounded-2xl border border-white/10 backdrop-blur-md">
                    <span className="text-xs font-black text-cyber-cyan tracking-wider">{progressPercent.toFixed(1)}%</span>
                  </div>
                </div>

                {/* Performance Progress Bar */}
                <div className="relative w-full h-4 bg-slate-100 dark:bg-void/50 rounded-full overflow-hidden mb-10 border border-white/5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-cyber-cyan via-vivid-purple to-graffiti-red relative"
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[4px]" />
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-void/40 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-inner group">
                    <div className="text-left">
                      <p className="font-marker text-[11px] text-slate-400 group-hover:text-cyber-cyan transition-colors uppercase tracking-[0.3em] mb-1">MINT PROTOCOL</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{MINT_PRICE_ETH} <span className="text-xs text-primary">ETH</span></p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                        <img src="https://avatars.githubusercontent.com/u/108554348?v=4" className="w-4 h-4 rounded-full" alt="Base" />
                        <span className="text-[10px] font-black text-white uppercase tracking-tighter">BASE</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-2">GAS: LOW</p>
                    </div>
                  </div>

                  {!hasMinted ? (
                    <Transaction
                      chainId={base.id}
                      calls={calls}
                      onStatus={(status) => {
                        if (status.statusName === 'building' || status.statusName === 'signing') setIsMinting(true);
                        if (status.statusName === 'success') handleSuccess(status);
                        if (status.statusName === 'error') setIsMinting(false);
                      }}
                    >
                      <TransactionButton
                        className={`w-full h-20 rounded-[2.2rem] font-marker text-2xl uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group ${isMinting
                          ? 'bg-slate-800 text-slate-500 cursor-wait'
                          : 'bg-void text-white hover:bg-black hover:shadow-cyber-cyan/20'}`}
                        text={
                          <div className="flex items-center justify-center gap-5 relative z-10">
                            {isMinting ? (
                              <div className="flex items-center gap-3">
                                <span className="animate-spin material-icons text-cyber-cyan">hourglass_top</span>
                                <span className="text-cyber-cyan text-lg">HACKING...</span>
                              </div>
                            ) : (
                              <>
                                <span>INITIALIZE MINT</span>
                                <span className="material-icons text-graffiti-red group-hover:rotate-45 transition-transform text-3xl">bolt</span>
                              </>
                            )}
                          </div>
                        }
                      />
                      <motion.div
                        animate={{ x: [-100, 400] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 w-32 h-[3px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent blur-md opacity-40"
                      />

                      <div className="mt-4">
                        <TransactionStatus>
                          <TransactionStatusLabel className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] opacity-50" />
                        </TransactionStatus>
                      </div>
                    </Transaction>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full h-20 rounded-[2.2rem] bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center gap-4 shadow-xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <span className="material-icons text-green-500 text-2xl">check_circle</span>
                      </div>
                      <span className="font-marker text-xl text-green-500 uppercase tracking-widest italic">ASSET SECURED</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 mb-6 flex items-center justify-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
            <span className="h-[1px] w-12 bg-slate-300 dark:bg-slate-800" />
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">
              AUTHENTICATED BY <span className="text-graffiti-red">GM DAILY</span>
            </p>
            <span className="h-[1px] w-12 bg-slate-300 dark:bg-slate-800" />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MintPage;
