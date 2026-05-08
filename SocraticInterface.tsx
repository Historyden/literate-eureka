import { useState } from 'react';
import { ConceptNode, Message } from '../types';
import { Send, Loader2, Brain, LogOut, Trophy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SocraticInterfaceProps {
  concept: ConceptNode;
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  user?: { email: string; uid: string };
  onLogout?: () => void;
  onOpenLevels?: () => void;
  level?: number;
}

export function SocraticInterface({ 
  concept, 
  messages, 
  onSendMessage, 
  isLoading,
  user,
  onLogout,
  onOpenLevels,
  level
}: SocraticInterfaceProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden rounded-[2rem] relative">
      {/* minimalist Header */}
      <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white shadow-lg">
            <Brain className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-gray-900 tracking-tight">{concept.title}</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Active session</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {level !== undefined && (
            <button 
              onClick={onOpenLevels}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <Trophy className="w-3.5 h-3.5 text-[#FF6321]" />
              <span className="text-xs font-bold text-gray-600">Level {level}</span>
            </button>
          )}
          <button
            onClick={onLogout}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-300 hover:text-gray-900 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 scrollbar-hide bg-[#FAFBFF]/30">
        <AnimatePresence initial={false}>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
              <Brain className="w-10 h-10 mb-4 opacity-20" />
              <p className="text-xs font-medium tracking-wide uppercase">Initializing conversation...</p>
            </div>
          ) : messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex flex-col group",
                m.role === 'user' ? "items-end" : "items-start"
              )}
            >
              <div className={cn(
                "px-5 py-3.5 text-sm md:text-[15px] leading-relaxed max-w-[85%] relative",
                m.role === 'user' 
                  ? "bg-black text-white rounded-2xl rounded-tr-none shadow-md" 
                  : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-none shadow-sm"
              )}>
                <div className="markdown-body">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
              <span className="text-[10px] text-gray-300 mt-2 font-medium px-1">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-gray-400 p-2"
          >
            <div className="flex gap-1">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Modern Input Bar */}
      <div className="px-8 pb-8 pt-4 bg-white shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all text-gray-900 placeholder:text-gray-400 shadow-sm"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square rounded-xl bg-black flex items-center justify-center text-white hover:bg-gray-800 disabled:opacity-20 transition-all shadow-lg active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
