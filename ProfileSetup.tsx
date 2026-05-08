import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Shield, Zap, Target, ArrowRight, Brain, Loader2, ChevronRight } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ProfileSetupProps {
  user: { uid: string; email: string };
  onComplete: () => void;
}

export function ProfileSetup({ user, onComplete }: ProfileSetupProps) {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState('Beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length < 3) {
      setError('Neural Alias must be at least 3 characters');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username,
        bio,
        expertise,
        avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${username}`,
        level: 1,
        createdAt: serverTimestamp()
      });
      onComplete();
    } catch (err: any) {
      console.error(err);
      setError('Connection failure. Synchronisation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900 flex flex-col items-center px-6 pt-[clamp(3rem,15vh,10rem)] pb-12 font-sans relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] relative z-10 flex flex-col items-center"
      >
        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mb-10 shadow-xl">
          <Brain className="w-6 h-6 text-white" />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-gray-900">Setup your profile</h1>
          <p className="text-gray-400 text-sm font-medium">
            Join the collective. Authenticated as <br/> 
            <span className="text-black font-semibold">{user.email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <div className="space-y-3">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
             <input 
               type="text" 
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               placeholder="How should we call you?"
               className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all shadow-sm"
               required
             />
          </div>

          <div className="space-y-3">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Bio</label>
             <textarea 
               value={bio}
               onChange={(e) => setBio(e.target.value)}
               placeholder="What are you learning?"
               className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all h-28 resize-none shadow-sm"
             />
          </div>

          <div className="space-y-3">
             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Experience</label>
             <div className="flex gap-2">
                {['Beginner', 'Intermediate', 'Expert'].map((lvl) => (
                   <button
                     key={lvl}
                     type="button"
                     onClick={() => setExpertise(lvl)}
                     className={`flex-1 py-3 text-xs rounded-xl font-bold transition-all border ${
                       expertise === lvl 
                       ? 'bg-black border-black text-white shadow-md' 
                       : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                     }`}
                   >
                      {lvl}
                   </button>
                ))}
             </div>
          </div>

          {error && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-[11px] font-bold text-red-500 uppercase tracking-wider text-center bg-red-50 py-3 rounded-xl border border-red-100"
            >
               {error}
            </motion.div>
          )}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-black text-white rounded-2xl font-bold tracking-tight text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 group shadow-lg"
          >
            {isSubmitting ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
               <>
                 Continue <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </>
            )}
          </button>
        </form>

        <div className="mt-16 flex items-center gap-4 opacity-10">
           <div className="h-px w-8 bg-black" />
           <div className="text-[10px] font-bold uppercase tracking-[0.3em]">Secure session</div>
           <div className="h-px w-8 bg-black" />
        </div>
      </motion.div>
    </div>
  );
}
