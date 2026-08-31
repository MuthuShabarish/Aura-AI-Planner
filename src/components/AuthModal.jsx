import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, KeyRound, Mail, X, Check, Sparkles, LogOut } from 'lucide-react';

export const AuthModal = () => {
  const { showAuth, setShowAuth, userProfile, setUserProfile, showToast, logout } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);

  if (!showAuth) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: name || prev.name,
      title: title || prev.title
    }));
    setShowAuth(false);
    showToast(isSignUp ? "Account Created & Sync Enabled!" : "Executive Profile Updated!", "indigo");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-slide-up">
      <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-indigo-500/10 relative">
        
        <button 
          onClick={() => setShowAuth(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-100">{isSignUp ? 'Executive Registration' : 'Account & Profile Settings'}</h3>
            <p className="text-xs text-slate-400">Sync preferences across devices</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Professional Title / Focus</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              placeholder=""
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Work Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                defaultValue=""
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-2.5 pl-9 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>{isSignUp ? 'Create Executive Account' : 'Save Profile Changes'}</span>
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2 text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-indigo-400 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : 'Need a new account? Register here'}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAuth(false);
              logout();
            }}
            className="w-full mt-1 py-2.5 px-4 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer font-heading"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of Account</span>
          </button>
        </div>

      </div>
    </div>
  );
};
