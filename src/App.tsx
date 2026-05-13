import React, { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Gamepad2, 
  User, 
  ShieldCheck, 
  Zap, 
  Target, 
  LayoutDashboard,
  Timer,
  ChevronRight,
  Flame,
  Award,
  RefreshCcw,
  Coins,
  Cpu,
  Orbit
} from 'lucide-react';
import GameContainer from './game/GameContainer';
import { useUser } from './hooks/useUser';
import { useAccount } from 'wagmi';
import Leaderboard from './components/Leaderboard';
import { submitScore } from './services/leaderboardService';
import FuturisticBackground from './components/FuturisticBackground';
import ConcreteText from './components/ConcreteText';

type View = 'landing' | 'arena' | 'leaderboard' | 'missions' | 'profile';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [difficulty, setDifficulty] = useState(3); // 3x3 default
  const { isConnected } = useAccount();
  const { user, loading, updateStats } = useUser();

  const handleGameComplete = async (moves: number, time: number) => {
    if (!isConnected || !user) return;
    
    const minTime = (difficulty * difficulty) / 5;
    if (time < minTime && moves < 5) return;
    
    const baseReward = difficulty === 3 ? 100 : difficulty === 4 ? 250 : 500;
    const timeBonus = Math.max(0, Math.floor((120 - time) * 2));
    const xpReward = baseReward + timeBonus;
    const pointsReward = Math.floor(xpReward / 10);
    
    const difficultyName = difficulty === 3 ? 'easy' : difficulty === 4 ? 'medium' : 'hard';
    
    try {
      await updateStats(xpReward, pointsReward);
      await submitScore(user.walletAddress, xpReward, difficultyName);
    } catch (error) {
      console.error("Sync error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center text-yellow-500 font-mono text-sm tracking-[0.5em] uppercase">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="w-8 h-8 animate-spin" />
          <span>Synchronizing Node...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-gray-100 font-sans selection:bg-yellow-500/30 selection:text-yellow-200">
      {/* Dynamic Background System */}
      <FuturisticBackground />

      {/* Floating Crypto Symbols (Ambient) */}
      <AnimatePresence>
        {view === 'landing' && (
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 0.2, 0], 
                  scale: [0.5, 1, 0.5],
                  x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                }}
                transition={{ 
                  duration: 10 + Math.random() * 20, 
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute"
              >
                {i % 2 === 0 ? (
                  <Coins className="w-8 h-8 text-yellow-500/20 blur-[1px]" />
                ) : (
                  <Orbit className="w-10 h-10 text-purple-500/30 blur-[1px]" />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-yellow-500/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('landing')}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)] group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-black fill-black" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              YIELD<span className="text-yellow-500 group-hover:text-amber-500 transition-colors uppercase italic">Vault</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              {['landing', 'arena', 'leaderboard'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as any)}
                  className={`text-xs font-mono uppercase tracking-[0.2em] transition-all relative py-1 ${
                    view === v ? 'text-yellow-400' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {v}
                  {view === v && (
                    <motion.div 
                      layoutId="navTab" 
                      className="absolute bottom-0 left-0 w-full h-[1px] bg-yellow-400"
                    />
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              {isConnected && user && (
                <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-yellow-500/5 rounded-full border border-yellow-500/10 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-500/90">{user.points} cP</span>
                  </div>
                  <div className="h-4 w-[1px] bg-yellow-500/10" />
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-orange-500/90">{user.streak}🔥</span>
                  </div>
                </div>
              )}
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.section
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="space-y-16"
            >
              {/* Hero */}
              <div className="text-center space-y-2 pt-12 pb-24 border-b border-white/5 relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] uppercase tracking-[0.3em] font-mono mb-8"
                >
                  <RefreshCcw className="w-3 h-3 animate-spin" /> Protocol Synchronization Active
                </motion.div>

                <div className="relative flex flex-col items-center justify-center py-8">
                  <ConcreteText />
                  
                  <motion.div
                    className="absolute inset-0 bg-yellow-500/5 blur-[120px] rounded-full -z-10"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 7, repeat: Infinity }}
                  />

                  <motion.h1 
                    className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[0.7] mt-[-4vw] relative z-20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    Puzzle <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600 drop-shadow-[0_0_30px_rgba(234,179,8,0.4)]">Arena</span>
                  </motion.h1>
                </div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-400 text-lg max-w-2xl mx-auto font-medium mt-8 leading-relaxed"
                >
                  The network requires stabilization. Resolve high-yield computational puzzles to secure the vaults. 
                  Ascend the leaderboard and manifest your protocol worth on <span className="text-yellow-500 font-mono">CONCRETE</span>.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-4 pt-12"
                >
                  <button 
                    onClick={() => setView('arena')}
                    className="relative px-10 py-5 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-black uppercase tracking-widest rounded-xl hover:scale-105 shadow-[0_0_40px_rgba(234,179,8,0.5)] flex items-center gap-3 group overflow-hidden transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    ENTER ARENA <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => setView('leaderboard')}
                    className="px-10 py-5 bg-white/5 border border-yellow-500/20 text-yellow-500 font-black uppercase tracking-widest rounded-xl hover:bg-yellow-500/10 hover:border-yellow-500/40 transition-all backdrop-blur-md"
                  >
                    RANKINGS
                  </button>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Zap, label: "Real-time Yield", val: "High Efficiency", color: "text-yellow-400" },
                  { icon: ShieldCheck, label: "Secure Protocols", val: "Vault Protected", color: "text-amber-500" },
                  { icon: Target, label: "Precision Logic", val: "Cognitive Proof", color: "text-yellow-500" },
                ].map((s, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    whileHover={{ y: -10, borderColor: 'rgba(234, 179, 8, 0.5)', backgroundColor: 'rgba(234, 179, 8, 0.05)' }}
                    className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group relative overflow-hidden transition-all"
                  >
                    <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                      <s.icon className="w-24 h-24 rotate-12" />
                    </div>
                    <s.icon className={`w-8 h-8 ${s.color} mb-4`} />
                    <h3 className="text-sm font-mono text-gray-500 uppercase tracking-widest">{s.label}</h3>
                    <p className="text-xl font-bold mt-1">{s.val}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {view === 'arena' && (isConnected ? (
            <motion.section
              key="arena"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Sidebar Controls */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-2xl bg-white/5 border border-yellow-500/10 backdrop-blur-md space-y-4">
                  <h2 className="text-sm font-mono text-yellow-400 uppercase tracking-[0.2em]">Select Vault</h2>
                  <div className="space-y-3">
                    {[
                      { l: 'Stable (3x3)', d: 3, icon: ShieldCheck, color: 'text-green-400' },
                      { l: 'Yield (4x4)', d: 4, icon: Zap, color: 'text-yellow-400' },
                      { l: 'Degen (5x5)', d: 5, icon: Flame, color: 'text-red-400' },
                    ].map((v) => (
                      <button
                        key={v.d}
                        onClick={() => setDifficulty(v.d)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                          difficulty === v.d 
                            ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                            : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <v.icon className={`w-5 h-5 ${v.color}`} />
                          <span className="font-bold">{v.l}</span>
                        </div>
                        {difficulty === v.d && <Zap className="w-4 h-4 fill-current animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-md">
                  <h3 className="text-sm font-mono text-gray-500 uppercase flex items-center gap-2 mb-4">
                    <Award className="w-4 h-4" /> Vault Experience
                  </h3>
                  <div className="text-4xl font-mono font-bold tracking-tighter text-yellow-400">
                    {user?.level || 1}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 italic">Current protocol level. Solve to advance.</p>
                </div>
              </div>

              {/* Game View */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-xl font-bold flex items-center gap-2 uppercase tracking-tighter">
                    <Cpu className="w-5 h-5 text-yellow-500" /> VAULT_INTERFACE_L2
                  </h2>
                  <button className="text-xs font-mono text-gray-500 hover:text-yellow-400 uppercase tracking-widest flex items-center gap-2 transition-colors">
                    <RefreshCcw className="w-3 h-3" /> Re-Sync Node
                  </button>
                </div>
                <div className="aspect-square w-full max-w-2xl mx-auto">
                  <GameContainer 
                    difficulty={difficulty} 
                    onComplete={handleGameComplete} 
                  />
                </div>
              </div>
            </motion.section>
          ) : (
            <div className="text-center py-24 space-y-6">
              <Gamepad2 className="w-16 h-16 text-gray-700 mx-auto animate-bounce" />
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-gray-500">Connect your wallet to access the High-Yield Puzzle Arena.</p>
              <ConnectButton />
            </div>
          ))}

          {view === 'leaderboard' && (
            <motion.section
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-yellow-500/10">
                <div>
                  <h2 className="text-4xl font-black uppercase italic tracking-tighter">PROTOCOL_MASTERS</h2>
                  <p className="text-[10px] font-mono text-yellow-500/50 uppercase tracking-[0.3em] mt-1">Live Validation Sequence</p>
                </div>
                <div className="flex gap-3">
                  {['DAILY', 'ALL-TIME'].map(t => (
                    <button key={t} className="px-4 py-2 text-[10px] font-mono border border-yellow-500/20 rounded-lg uppercase hover:bg-yellow-500/10 hover:border-yellow-500/40 transition-all text-gray-400 hover:text-yellow-400">{t}</button>
                  ))}
                </div>
              </div>

              <Leaderboard />
            </motion.section>
          )}

          {view === 'missions' && (
            <motion.section
              key="missions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {[
                { t: "Stabilizers Init", d: "Complete 3 vaults", p: Math.min(1, (user?.puzzlesSolved || 0) / 3), r: "50 XP" },
                { t: "Efficiency Hunter", d: "Finish 10 vaults", p: Math.min(1, (user?.puzzlesSolved || 0) / 10), r: "120 XP" },
                { t: "High Yield Cycle", d: "Level up to Level 5", p: Math.min(1, (user?.level || 1) / 5), r: "200 XP" },
                { t: "Degen Legend", d: "Level up to Level 10", p: Math.min(1, (user?.level || 1) / 10), r: "500 XP" },
              ].map((m, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl space-y-4 hover:border-yellow-500/30 transition-all group overflow-hidden relative">
                  <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/[0.02] transition-colors" />
                  <div className="relative z-10 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-200">{m.t}</h3>
                      <p className="text-sm text-gray-500">{m.d}</p>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 bg-yellow-500/10 rounded border border-yellow-500/20 text-yellow-500">{m.r}</span>
                  </div>
                  <div className="relative z-10 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-gray-500">
                      <span>PROGRESS</span>
                      <span>{Math.round(m.p * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${m.p * 100}%` }}
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-600 transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]" 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Navigation Dock */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-1 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          {[
            { id: 'landing' as View, icon: LayoutDashboard },
            { id: 'arena' as View, icon: Gamepad2 },
            { id: 'leaderboard' as View, icon: Trophy },
            { id: 'missions' as View, icon: Target },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`p-3 rounded-xl transition-all duration-300 relative group ${
                view === item.id ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className="w-6 h-6" />
              {view === item.id && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute -inset-1 bg-cyan-500/20 blur-lg rounded-xl -z-10"
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Footer Branding */}
      <footer className="pt-24 pb-32 text-center relative z-10">
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.5em] mb-4">Secured by Concrete.Protocol</div>
        <div className="flex justify-center gap-8 text-gray-500">
          {['Twitter', 'Discord', 'Docs'].map(s => (
            <a key={s} href="#" className="text-xs hover:text-yellow-400 transition-colors uppercase tracking-widest">{s}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
