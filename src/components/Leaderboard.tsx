import React, { useEffect, useState } from 'react';
import { subscribeToTopScores, ScoreEntry } from '../services/leaderboardService';
import { motion } from 'motion/react';
import { Trophy, ShieldCheck } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToTopScores((data) => {
      setScores(data);
      setLoading(false);
    }, 10);

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 w-full bg-white/5 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scores.length > 0 ? scores.map((s, r) => (
        <motion.div 
          key={r}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: r * 0.05 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className="group relative flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-yellow-500/30 transition-all cursor-default overflow-hidden backdrop-blur-sm"
        >
          {/* Background Accent */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/5 to-yellow-500/0 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <div className="flex items-center gap-6 relative z-10">
            <div className="relative">
              <span className={`w-10 h-10 flex items-center justify-center font-black font-mono rounded-lg transform skew-x-[-12deg] transition-all group-hover:scale-110 ${
                r === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' : 
                r === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : 
                r === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-900 text-white' : 'bg-white/5 text-gray-400'
              }`}>
                <span className="skew-x-[12deg]">{(r + 1).toString().padStart(2, '0')}</span>
              </span>
              {r === 0 && (
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Trophy className="w-3 h-3 text-yellow-500 fill-current" />
                </motion.div>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-200">{s.walletAddress.slice(0, 6)}...{s.walletAddress.slice(-4)}</span>
                {r < 3 && <ShieldCheck className="w-3 h-3 text-yellow-400" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border tracking-widest ${
                  s.difficulty === 'extreme' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  s.difficulty === 'hard' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                  s.difficulty === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                  'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                  {s.difficulty.toUpperCase()}
                </span>
                <span className="text-[9px] font-mono text-gray-600 italic">SECURE_TRANS</span>
              </div>
            </div>
          </div>

          <div className="text-right relative z-10">
            <div className="text-2xl font-black font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-yellow-100 to-amber-600">
              {s.score.toLocaleString()}
            </div>
            <div className="text-[10px] font-mono text-yellow-500/70 group-hover:text-yellow-400 transition-colors uppercase tracking-widest">
              PROTOCOL_PTS
            </div>
          </div>
        </motion.div>
      )) : (
        <div className="text-center py-12 text-gray-500">No records found. Stabilize the first vault!</div>
      )}
    </div>
  );
};

export default Leaderboard;
