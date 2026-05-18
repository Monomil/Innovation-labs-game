import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, Heart, Wind, Flame, Sun, Sparkles, Smile, Frown, ShieldAlert, Phone, User as UserIcon, LifeBuoy, AlertCircle } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { Button, Card } from './ui/GameUI';

export function AizaChatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { gameState, sendMessage } = useGame();
  const [inputValue, setInputValue] = useState('');
  const [showSupportScreen, setShowSupportScreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const safeChatMessages = gameState?.chatMessages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [safeChatMessages, isOpen]);

  // Check for crisis trigger in last message
  useEffect(() => {
    if (safeChatMessages.length > 0) {
      const lastMsg = safeChatMessages[safeChatMessages.length - 1];
      if (lastMsg.sender === 'aiza' && lastMsg.text.startsWith('危机检测:')) {
        setShowSupportScreen(true);
      }
    }
  }, [safeChatMessages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue('');
  };

  const quickRelief = [
    { text: "I feel happy", icon: <Smile className="text-green-400" /> },
    { text: "I feel sad", icon: <Frown className="text-blue-400" /> },
    { text: "I feel angry", icon: <Flame className="text-red-400" /> },
    { text: "Help me breathe", icon: <Wind className="text-teal-400" /> },
    { text: "I need calm", icon: <Sparkles className="text-purple-400" /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 right-6 w-[350px] md:w-[450px] h-[650px] bg-[#0a0a2a]/95 backdrop-blur-3xl border-2 border-white/20 rounded-[50px] shadow-[0_40px_100px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex justify-between items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_70%)]" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <Sparkles className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter italic text-white uppercase">AIZA CHAT</h3>
                <span className="text-[10px] text-white/50 font-black uppercase tracking-widest leading-none">Your Magical Companion</span>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-white/10 transition-colors text-white relative z-10">
              <X size={24} />
            </button>
          </div>

          {/* Messages Area */}
          <div 
             ref={scrollRef}
             className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar relative"
          >
             {safeChatMessages.map((msg) => (
               <motion.div
                 key={msg.id}
                 initial={{ opacity: 0, y: 10, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div className={`max-w-[85%] p-5 rounded-[30px] text-sm font-bold leading-relaxed shadow-xl relative ${
                   msg.sender === 'user' 
                     ? 'bg-indigo-600 text-white rounded-tr-none' 
                     : 'bg-white/5 text-indigo-100 border border-white/10 rounded-tl-none'
                 }`}>
                   {msg.text.replace('危机检测: ', '')}
                   {msg.sender === 'aiza' && (
                     <div className="absolute -left-2 -top-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-[10px] border-2 border-[#0a0a2a]">
                       🦊
                     </div>
                   )}
                 </div>
               </motion.div>
             ))}
             
             {/* Safety Note Footer */}
             <div className="pt-4">
                <div className="bg-red-500/5 border-2 border-red-500/10 p-6 rounded-[35px] flex flex-col gap-3">
                   <div className="flex items-center gap-3">
                      <ShieldAlert size={20} className="text-red-400" />
                      <span className="text-[10px] font-black text-red-200/40 uppercase tracking-widest">Aiza Safety Guide</span>
                   </div>
                   <p className="text-[11px] font-bold text-red-100/40 leading-relaxed">
                     If you're feeling very sad or unsafe, please tell a trusted adult like a parent or teacher right away. You are very important!
                   </p>
                </div>
             </div>
          </div>

          {/* Input Area */}
          <div className="p-8 bg-white/5 border-t border-white/10">
             <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
                {quickRelief.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(item.text)}
                    className="shrink-0 bg-white/5 hover:bg-indigo-500/20 border border-white/10 px-5 py-3 rounded-full flex items-center gap-2 transition-all group whitespace-nowrap"
                  >
                    <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.text}</span>
                  </button>
                ))}
             </div>
             
             <div className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Tell me your secret feelings..."
                  className="flex-1 h-16 bg-black/40 border-2 border-white/5 rounded-[28px] px-8 text-white text-sm font-bold focus:outline-none focus:border-indigo-500 transition-all placeholder:text-white/10"
                />
                <button
                  onClick={handleSend}
                  className="w-16 h-16 bg-white text-indigo-950 rounded-[28px] flex items-center justify-center hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                  <Send size={28} />
                </button>
             </div>
          </div>

          {/* Crisis Support Screen Overlay */}
          <AnimatePresence>
             {showSupportScreen && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[60] bg-[#0a0a2a]/95 backdrop-blur-xl flex flex-col items-center p-8 overflow-y-auto no-scrollbar"
               >
                  <div className="w-24 h-24 bg-red-500 rounded-[35px] flex items-center justify-center text-white mb-8 shadow-2xl rotate-3">
                     <Heart size={48} className="fill-white" />
                  </div>
                  
                  <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter text-center leading-tight mb-4">
                     You Are Not Alone,<br /><span className="text-red-400">Dear Explorer</span>
                  </h2>
                  
                  <p className="text-indigo-200 text-center font-bold mb-10 leading-relaxed">
                    I'm so glad you told me how you feel. You deserve to feel safe and happy. Sometimes feelings can be very big, and it's okay to ask for help to carry them.
                  </p>

                  <div className="w-full space-y-4">
                     <div className="bg-white/5 p-6 rounded-[35px] border-2 border-indigo-500/20 flex flex-col gap-4">
                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest text-center">First Step</h4>
                        <div className="flex items-center gap-4 text-white">
                           <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center grow-0 shrink-0">
                              <UserIcon size={24} />
                           </div>
                           <p className="font-black italic uppercase tracking-tighter text-lg leading-tight">
                              Tell a trusted adult right now!
                           </p>
                        </div>
                     </div>

                     <div className="bg-red-500/10 p-6 rounded-[35px] border-2 border-red-500/20">
                        <h4 className="text-xs font-black text-red-400 uppercase tracking-widest text-center mb-6">Emergency Help</h4>
                        <div className="space-y-4">
                           <EmergencyLine icon={<AlertCircle />} label="Emergency" number="999" />
                           <EmergencyLine icon={<Phone />} label="Childline" number="0800 1111" />
                           <EmergencyLine icon={<LifeBuoy />} label="Samaritans" number="116 123" />
                           <EmergencyLine icon={<Heart />} label="NHS Support" number="111" />
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={() => setShowSupportScreen(false)}
                    className="mt-12 w-full h-16 rounded-[28px] bg-white text-indigo-950 font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-2xl mb-8"
                  >
                     I Will Talk To Someone
                  </button>
               </motion.div>
             )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmergencyLine({ icon, label, number }: { icon: React.ReactNode, label: string, number: string }) {
   return (
      <div className="flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-white/5">
         <div className="flex items-center gap-3">
            <div className="text-red-400">{icon}</div>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{label}</span>
         </div>
         <span className="text-xl font-black text-white italic tracking-tighter">{number}</span>
      </div>
   );
}
