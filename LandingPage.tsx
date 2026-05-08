import { Brain, ArrowRight, Zap, Target, Search, ShieldCheck, LogIn, Layers, Trophy, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onLogin: () => void;
  onDemoMode: () => void;
  error: string | null;
  isLoggingIn: boolean;
}

export function LandingPage({ onLogin, onDemoMode, error, isLoggingIn }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 selection:bg-black selection:text-white overflow-x-hidden font-sans relative">
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-gray-100 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shadow-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold tracking-tight text-gray-900">Socratic</span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={onLogin}
            disabled={isLoggingIn}
            className="px-6 py-2.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />} 
            {isLoggingIn ? 'Verifying...' : 'Sign In'}
          </button>
        </div>
      </nav>

      <section className="relative pt-44 pb-24 px-8 max-w-7xl mx-auto min-h-[90vh] flex items-center z-10 text-center flex-col">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-100/50 border border-red-200 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest max-w-md mx-auto"
          >
             {error === 'auth/popup-closed-by-user' 
                ? 'Login window was closed. Please try again.' 
                : 'Connection failure. Please retry login.'}
          </motion.div>
        )}
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-8 border border-emerald-100">
            <Zap className="w-3 h-3 fill-emerald-600" />
            Adaptive Learning Now Active
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-black leading-[0.9]">
            Learn through <span className="text-gray-300">dialogue.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 font-medium max-w-xl mx-auto leading-relaxed">
            The Socratic Mentor uses adaptive AI to guide you through complex concepts by asking the right questions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-10 py-5 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-[0.98]"
            >
              Start Learning <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onDemoMode}
              className="w-full sm:w-auto px-10 py-5 bg-white border border-gray-200 text-gray-500 rounded-2xl font-bold text-lg hover:border-gray-400 transition-all flex items-center justify-center"
            >
              Try Local Demo
            </button>
          </div>
        </motion.div>
      </section>

      <section className="py-24 px-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center">
          {[
            { icon: Target, title: 'Adaptive Paths', desc: 'Curriculum that updates based on your current understanding.' },
            { icon: Search, title: 'First Principles', desc: 'Deep dives into subjects rather than surface-level memorization.' },
            { icon: ShieldCheck, title: 'Secure Mastery', desc: 'Track your progress across the knowledge graph with ease.' }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                <feat.icon className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-[0.3em]">&copy; 2026 // Socratic Systems</p>
      </footer>
    </div>
  );
}
