/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, Card } from './ui/GameUI';
import { 
  Lock, Eye, EyeOff, ArrowLeft, BarChart3, BrainCircuit, Heart, Gem, Trophy, Users, 
  LineChart as LucideLineChart, AlertCircle, CheckCircle2, ShieldAlert, LogOut, Trash2, SwitchCamera, Download, Edit2, Sparkles
} from 'lucide-react';
import { useGame } from '../store/GameContext';
import { getParentalInsights } from '../services/geminiService';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface AdminAccessProps {
  onBack: () => void;
}

export function AdminAccess({ onBack }: AdminAccessProps) {
  const { gameState, logout, deleteProfile, resolveAlert, resetProfileProgress, updateProfile } = useGame();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [activeTab, setActiveTab] = useState<'wellbeing' | 'alerts' | 'profiles'>('wellbeing');
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', age: 5, email: '' });
  const [aiInsights, setAiInsights] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && activeTab === 'wellbeing' && !aiInsights) {
      loadInsights();
    }
  }, [isAuthenticated, activeTab]);

  const loadInsights = async () => {
    setIsLoadingAI(true);
    try {
      const insights = await getParentalInsights(gameState);
      setAiInsights(insights);
    } catch (err) {
      console.error(err);
      setAiInsights("The AI guide is unavailable right now.");
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === gameState.adminPin) { 
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Wrong PIN! Please try again.');
    }
  };

  const handleEditInit = (profile: any) => {
     setEditingProfileId(profile.id);
     setEditFormData({ name: profile.name, age: profile.age, email: profile.email });
  };

  const handleUpdate = (e: React.FormEvent) => {
     e.preventDefault();
     if (editingProfileId) {
        updateProfile(editingProfileId, editFormData);
        setEditingProfileId(null);
     }
  };

  const exportData = () => {
    const data = JSON.stringify(gameState, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aiza_report_${gameState.playerName}_${Date.now()}.json`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#05051a] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#05051a_100%)] opacity-50" />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="max-w-md w-full border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl rounded-[60px] p-12">
            <div className="flex flex-col items-center text-center gap-6">
              <div className="w-24 h-24 bg-white/10 rounded-[40px] flex items-center justify-center text-white border border-white/20 shadow-inner">
                <Lock size={48} />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Admin Access</h1>
                <p className="text-indigo-300/60 font-bold px-4 leading-relaxed">Enter your secure PIN to view player analytics and safety logs.</p>
              </div>
              
              <form onSubmit={handleLogin} className="w-full mt-6 flex flex-col gap-6">
                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN"
                    maxLength={4}
                    className="w-full p-6 rounded-[35px] bg-black/40 border-4 border-white/5 focus:border-indigo-500 outline-none text-4xl font-black text-center text-white placeholder:text-indigo-900 transition-all tracking-[0.5em]"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPin ? <EyeOff size={28} /> : <Eye size={28} />}
                  </button>
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 font-black text-xs uppercase tracking-widest text-center">
                    {error}
                  </motion.p>
                )}
                <Button variant="primary" className="h-20 rounded-[35px] bg-white text-indigo-950 font-black text-2xl uppercase italic shadow-2xl">
                   Unlock Access
                </Button>
              </form>
              
              <button 
                onClick={onBack} 
                className="mt-6 text-white/40 font-black hover:text-white flex items-center gap-2 transition-colors uppercase text-[10px] tracking-widest"
              >
                <ArrowLeft size={16} /> Return to World
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const moodMap = { happy: 5, calm: 4, confused: 3, worried: 2, angry: 1, sleepy: 3 };
  const lastLogs = gameState.moodLogs || [];
  const chartData = lastLogs.slice(-7).map(log => ({
    time: new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'short' }),
    value: moodMap[log.mood] || 3,
    mood: log.mood
  }));

  const barData = Object.entries(
    lastLogs.reduce((acc: any, log) => {
      acc[log.mood] = (acc[log.mood] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    count: count as number
  }));

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#6366f1'];

  return (
    <div className="min-h-screen bg-[#05051a] flex flex-col overflow-y-auto font-sans antialiased text-white selection:bg-indigo-500 no-scrollbar">
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 p-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white text-indigo-950 rounded-[24px] flex items-center justify-center shadow-2xl rotate-3">
            <Users size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Admin Access</h1>
            <p className="text-xs font-black text-indigo-400 uppercase tracking-widest mt-1">Explorer: {gameState.playerName || 'Guest'}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
           <button onClick={exportData} title="Export Progress" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all border border-white/10">
              <Download size={24} />
           </button>
           <button onClick={onBack} className="px-8 h-14 rounded-2xl bg-white text-indigo-950 font-black hover:scale-105 transition-all shadow-2xl uppercase italic text-sm">
            Close Access
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full p-8 space-y-8 pb-32">
        {/* Navigation Tabs */}
        <div className="flex gap-4 p-2 bg-white/5 rounded-[30px] border border-white/10 self-start">
           {[
             { id: 'wellbeing', label: 'Wellbeing Summary', icon: <BarChart3 size={20} /> },
             { id: 'alerts', label: 'Safety Alerts', icon: <AlertCircle size={20} /> },
             { id: 'profiles', label: 'Manage Profiles', icon: <Users size={20} /> }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-3 px-8 py-4 rounded-[22px] font-black uppercase text-xs tracking-widest transition-all ${
                 activeTab === tab.id ? 'bg-white text-indigo-950 shadow-xl' : 'text-white/40 hover:text-white'
               }`}
             >
                {tab.icon} {tab.label}
             </button>
           ))}
        </div>

        {activeTab === 'wellbeing' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard icon={<Gem className="text-emerald-400" />} label="Total Gems" value={gameState.gems} />
              <StatCard icon={<Trophy className="text-yellow-400" />} label="Achievements" value={gameState.achievements.length} />
              <StatCard icon={<BrainCircuit className="text-indigo-400" />} label="Skills Mastered" value={gameState.progress.length} />
              <StatCard icon={<Heart className="text-rose-400" />} label="Mood Logs" value={gameState.moodLogs.length} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card className="border-white/10 bg-white/5 p-10 rounded-[50px] lg:col-span-2">
                  <div className="flex justify-between items-center mb-8">
                     <h3 className="text-2xl font-black flex items-center gap-4 italic uppercase tracking-tighter">
                        <div className="w-14 h-14 rounded-[25px] bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                           <BrainCircuit size={32} />
                        </div>
                        AI Reflection Guide
                     </h3>
                     <button 
                       onClick={loadInsights}
                       disabled={isLoadingAI}
                       className="px-6 py-2 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/30 hover:bg-indigo-500 hover:text-white transition-all disabled:opacity-50"
                     >
                        {isLoadingAI ? "Reflecting..." : "Refresh Insights"}
                     </button>
                  </div>
                  
                  <div className="bg-indigo-950/40 rounded-[35px] p-8 border border-white/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={64} className="text-white" />
                     </div>
                     {isLoadingAI ? (
                        <div className="flex flex-col items-center py-12 gap-4">
                           <motion.div 
                             animate={{ rotate: 360 }}
                             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                             className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
                           />
                           <p className="text-indigo-300/40 font-black uppercase text-[10px] tracking-[0.3em]">AI is analyzing emotional patterns...</p>
                        </div>
                     ) : (
                        <div className="prose prose-invert max-w-none">
                           <p className="text-indigo-100 font-bold text-lg leading-relaxed italic">
                              "{aiInsights || "No data available to generate insights yet."}"
                           </p>
                        </div>
                     )}
                  </div>
                  <div className="mt-6 flex items-center gap-3 text-indigo-300/40">
                     <AlertCircle size={14} />
                     <p className="text-[10px] font-black uppercase tracking-widest">Powered by Gemini AI • Guidance should supplement professional advice</p>
                  </div>
               </Card>

               <Card className="border-white/10 bg-white/5 p-10 rounded-[50px]">
                  <h3 className="text-xl font-black mb-10 flex items-center gap-4 italic uppercase tracking-tighter">
                     <div className="w-12 h-12 rounded-[20px] bg-teal-500/10 flex items-center justify-center text-teal-400">
                        <BarChart3 size={28} />
                      </div>
                    Emotional Range
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: 'rgba(255,255,255,0.4)', fontWeight: 800}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#05051a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px'}} />
                        <Bar dataKey="count" radius={[15, 15, 0, 0]}>
                          {barData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </Card>

               <Card className="border-white/10 bg-white/5 p-10 rounded-[50px]">
                  <h3 className="text-xl font-black mb-10 flex items-center gap-4 italic uppercase tracking-tighter">
                     <div className="w-12 h-12 rounded-[20px] bg-rose-500/10 flex items-center justify-center text-rose-400">
                        <LucideLineChart size={28} />
                      </div>
                    Trend Line
                  </h3>
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                           <XAxis dataKey="time" fontSize={10} tick={{fill: 'rgba(255,255,255,0.4)', fontWeight: 800}} axisLine={false} tickLine={false} />
                           <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} hide />
                           <Tooltip contentStyle={{backgroundColor: '#05051a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px'}} />
                           <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#6366f1" 
                              strokeWidth={10} 
                              dot={{ r: 10, fill: '#6366f1', stroke: '#fff', strokeWidth: 4 }} 
                              activeDot={{ r: 14, shadow: '0 0 30px rgba(99,102,241,0.8)' }}
                           />
                        </LineChart>
                     </ResponsiveContainer>
                  </div>
                  <p className="text-[10px] text-indigo-300/40 font-black mt-8 text-center uppercase tracking-widest">Higher is calmer/happier • Weekly aggregate</p>
               </Card>
            </div>
          </motion.div>
        )}

        {/* ... (alerts section) */}
        {activeTab === 'alerts' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-3xl font-black italic uppercase tracking-tighter">Safety Alerts Log</h2>
               <div className="flex items-center gap-3 bg-red-500/10 px-6 py-3 rounded-2xl border border-red-500/20">
                  <ShieldAlert size={20} className="text-red-400" />
                  <span className="text-xs font-black text-red-100 uppercase tracking-widest">{gameState.safetyAlerts.filter(a => !a.resolved).length} Unresolved</span>
               </div>
            </div>

            {gameState.safetyAlerts.length === 0 ? (
               <div className="p-20 text-center bg-white/5 rounded-[60px] border-4 border-dashed border-white/5">
                  <CheckCircle2 size={64} className="text-indigo-400/20 mx-auto mb-6" />
                  <p className="text-indigo-300/40 font-black uppercase tracking-[0.3em]">No safety concerns detected</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-6">
                  {gameState.safetyAlerts.map(alert => (
                     <Card key={alert.id} className={`p-8 border-white/10 rounded-[40px] flex items-center justify-between ${alert.resolved ? 'bg-white/5 opacity-50' : 'bg-red-500/10 border-red-500/20'}`}>
                        <div className="flex gap-8 items-center">
                           <div className={`w-20 h-20 rounded-3xl flex items-center justify-center ${alert.resolved ? 'bg-indigo-500/20 text-indigo-400' : 'bg-red-500 text-white'}`}>
                              <AlertCircle size={32} />
                           </div>
                           <div>
                              <div className="flex items-center gap-3 mb-1">
                                 <h4 className="text-xl font-black italic uppercase tracking-tighter">{alert.type === 'crisis' ? 'Crisis Detection' : 'System Alert'}</h4>
                                 <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-black/40 rounded-full border border-white/10">
                                    {new Date(alert.timestamp).toLocaleString()}
                                 </span>
                              </div>
                              <p className="text-indigo-100/60 font-bold max-w-2xl">{alert.message}</p>
                           </div>
                        </div>
                        {!alert.resolved && (
                          <button 
                             onClick={() => resolveAlert(alert.id)}
                             className="h-16 px-10 rounded-3xl font-black uppercase text-xs tracking-widest bg-white text-indigo-950 hover:scale-105 transition-all shadow-2xl"
                          >
                             Mark as Resolved
                          </button>
                        )}
                     </Card>
                  ))}
               </div>
            )}
          </motion.div>
        )}

        {/* Profiles Section with Edit Logic */}
        {activeTab === 'profiles' && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="flex items-center justify-between">
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter">Profile Management</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {gameState.profiles.map(profile => (
                     <Card key={profile.id} className="p-10 border-white/10 bg-white/5 rounded-[50px] relative overflow-hidden group">
                        {editingProfileId === profile.id ? (
                           <form onSubmit={handleUpdate} className="flex flex-col gap-4 relative z-10">
                              <h4 className="text-xl font-black italic uppercase tracking-tighter text-indigo-400 mb-4">Edit Profile</h4>
                              <div className="space-y-4">
                                 <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-indigo-500"
                                    placeholder="Name"
                                 />
                                 <input
                                    type="number"
                                    value={editFormData.age}
                                    onChange={(e) => setEditFormData({ ...editFormData, age: parseInt(e.target.value) })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-indigo-500"
                                    placeholder="Age"
                                    min="5"
                                    max="10"
                                 />
                                 <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white font-bold outline-none focus:border-indigo-500"
                                    placeholder="Email"
                                 />
                              </div>
                              <div className="flex gap-2 mt-4">
                                 <button type="submit" className="flex-1 h-14 bg-white text-indigo-950 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Save Changes</button>
                                 <button type="button" onClick={() => setEditingProfileId(null)} className="flex-1 h-14 bg-white/5 text-white/40 font-black uppercase text-xs tracking-widest rounded-2xl border border-white/10">Cancel</button>
                              </div>
                           </form>
                        ) : (
                           <div className="flex items-center gap-8 relative z-10">
                              <div className="w-24 h-24 bg-indigo-500 rounded-[35px] flex items-center justify-center text-4xl shadow-2xl relative">
                                 {profile.petSelection === 'cat' ? '🐱' : profile.petSelection === 'dog' ? '🐶' : '🐰'}
                                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-950 text-xl font-black border-4 border-indigo-900">
                                    {profile.age}
                                 </div>
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-2xl font-black italic mb-1 uppercase tracking-tighter">{profile.name}</h4>
                                 <p className="text-indigo-400 font-bold text-sm mb-4 leading-none">{profile.email}</p>
                                 <div className="flex gap-2">
                                    <button
                                       onClick={() => handleEditInit(profile)}
                                       className="px-6 py-3 rounded-2xl bg-white text-indigo-950 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                                    >
                                       <Edit2 size={12} /> Edit Info
                                    </button>
                                    <button
                                       onClick={() => {
                                          if (confirm(`Are you sure you want to delete ${profile.name}'s profile forever?`)) {
                                             deleteProfile(profile.id);
                                          }
                                       }}
                                       className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                    >
                                       <Trash2 size={20} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        )}
                        {profile.id === gameState.currentProfileId && (
                           <div className="absolute top-8 right-8 px-4 py-1 bg-teal-500 text-teal-950 text-[10px] font-black uppercase tracking-widest rounded-full">
                              Active Now
                           </div>
                        )}
                     </Card>
                  ))}
                  
                  <div className="p-10 border-4 border-dashed border-white/5 bg-white/[0.02] rounded-[50px] flex flex-col items-center justify-center text-center gap-6 min-h-[160px]">
                     <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-indigo-400">
                        <Users size={32} />
                     </div>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Ready for a new spirit?</p>
                     <button 
                       onClick={() => logout()}
                       className="px-10 py-5 bg-indigo-500/20 text-indigo-400 rounded-3xl font-black uppercase text-xs tracking-widest border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all"
                     >
                        Add New Profile
                     </button>
                  </div>
              </div>

              <div className="mt-12 p-12 rounded-[50px] bg-red-500/5 border-4 border-red-500/10 max-w-4xl">
                 <div className="flex items-start gap-8">
                    <div className="w-20 h-20 bg-red-500 rounded-[30px] flex items-center justify-center text-white shrink-0 shadow-2xl">
                       <ShieldAlert size={40} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Critical Actions</h3>
                       <p className="text-indigo-300/40 font-medium mb-8 leading-relaxed">
                          Resetting the current profile will wipe all gems, pets, skills, and progress. 
                          This action is destructive and cannot be undone.
                       </p>
                       <div className="flex gap-4">
                          <button 
                             onClick={() => {
                                if(confirm("ABSOLUTELY SURE? Everything for this user will be erased.")) {
                                  resetProfileProgress();
                                }
                             }}
                             className="px-10 h-16 bg-red-600 text-white rounded-[25px] font-black uppercase italic tracking-tighter text-sm hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-red-900/40"
                          >
                             Reset Progress for {gameState.playerName}
                          </button>
                          <button 
                             onClick={() => logout()}
                             className="px-10 h-16 bg-white/5 text-white rounded-[25px] font-black uppercase italic tracking-tighter text-sm hover:bg-white/10 transition-all border border-white/10 flex items-center gap-3"
                          >
                             <LogOut size={20} /> Logout Admin
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           </motion.div>
        )}
      </div>

      {/* Atmospheric FX */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 blur-[150px] rounded-full" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/20 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <Card className="bg-white/5 border-white/10 rounded-[40px] py-10 px-8 flex flex-col items-center gap-4 shadow-2xl hover:border-white/20 transition-all group overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <motion.div whileHover={{ scale: 1.2, rotate: 10 }} className="text-4xl relative z-10">{icon}</motion.div>
      <div className="text-5xl font-black text-white italic tracking-tighter relative z-10">{value}</div>
      <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest relative z-10 opacity-60">{label}</div>
    </Card>
  );
}
