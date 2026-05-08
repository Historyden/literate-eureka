import { motion, AnimatePresence } from 'motion/react';
import { Trophy, ChevronRight, Zap, Target, Star } from 'lucide-react';
import { cn } from '../lib/utils';

interface LevelWindowProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  xp: number;
  nextLevelXp: number;
}

export function LevelWindow({ isOpen, onClose, level, xp, nextLevelXp }: LevelWindowProps) {
  const progress = (xp / nextLevelXp) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Level Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[101] p-1 shadow-2xl"
          >
            <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-br from-[#FF6321]/20 to-transparent border-b border-white/5 relative bg-black">
                <div className="absolute top-4 right-4 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                  Neural_ID: 0x823A
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF6321] flex items-center justify-center text-white shadow-[0_0_30px_rgba(255,99,33,0.4)]">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Synthesizer Level</h2>
                    <div className="flex items-center gap-2 text-[#FF6321] font-mono text-xl font-black">
                      LEVEL {level}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="data-header text-white/40 block">Current Experience</span>
                      <span className="text-2xl font-black italic text-white tracking-tighter">
                        {xp} <span className="text-white/20 text-xs">XP / {nextLevelXp} XP</span>
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="data-header text-[#FF6321] block">Next Reward</span>
                      <span className="text-xs font-bold uppercase tracking-tighter text-white">Advanced DAG-Access</span>
                    </div>
                  </div>

                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-[#FF6321] to-[#FF8E59] shadow-[0_0_10px_rgba(255,99,33,0.5)]"
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <Zap className="w-4 h-4 text-[#FF6321] mb-2" />
                    <span className="data-header text-white/30 block">Socratic Intensity</span>
                    <span className="text-lg font-black italic text-white uppercase tracking-tighter">Overload</span>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <Target className="w-4 h-4 text-[#FF6321] mb-2" />
                    <span className="data-header text-white/30 block">Nodes Mastered</span>
                    <span className="text-lg font-black italic text-white uppercase tracking-tighter">12 / 48</span>
                  </div>
                </div>

                {/* Perks Section */}
                <div className="space-y-4">
                   <h3 className="data-header text-white/40">Unlocked Neural Paths</h3>
                   <div className="space-y-2">
                      {[
                        { title: 'Propositional Matrix', level: 1, unlocked: true },
                        { title: 'Higher Order Logic', level: 5, unlocked: false },
                        { title: 'Turing Completeness', level: 10, unlocked: false }
                      ].map((perk, i) => (
                        <div key={i} className={cn(
                          "flex items-center justify-between p-3 rounded-lg border transition-all",
                          perk.unlocked ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/5 border-white/5 opacity-40grayscale"
                        )}>
                           <div className="flex items-center gap-3">
                              <Star className={cn("w-4 h-4", perk.unlocked ? "text-emerald-500" : "text-white/20")} />
                              <span className="text-xs font-bold uppercase tracking-tight text-white">{perk.title}</span>
                           </div>
                           <span className="text-[8px] font-mono uppercase text-white/40">Lvl {perk.level}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white text-black rounded-xl font-black italic uppercase tracking-tighter hover:bg-white/90 transition-all flex items-center justify-center gap-2 group"
                >
                  Return to Interface <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
