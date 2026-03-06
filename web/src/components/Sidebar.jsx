import React from "react";

export default function Sidebar({ playerInfo, categories }) {
  return (
    <aside className="w-64 border-r border-primary/20 flex flex-col pt-6 z-20 shadow-[5px_0_15px_-5px_rgba(0,0,0,0.5)] bg-black">
      <div className="px-6 pb-6 mb-4 border-b border-primary/10 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-primary/50 bg-slate-800 flex items-center justify-center shadow-[0_0_10px_rgba(56,224,123,0.2)] overflow-hidden">
          <img 
            alt="Avatar Profile Picture" 
            className="w-full h-full object-cover" 
            src={playerInfo?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuATo7lHd_h7EG1xTnkY4jeV-Qb49vJyrbXP_ZDoQjprVsQdmPotuCaCQLIUPKWCCHMz4rxQvZk5t9KrxolzzqYdAeL0vu0_KdgjIPV5k7ETZYNFEQAhSkJswxaSKAy7mJvm3wrW1SlrgfolK_BOnlusSI8OekN1dLNDbLs9-8crBO_EOejs7h36e3yv7loNZK55tmv4ynHcuRjJEPy6fN4uOGQywNjYlUSMBpR4aKyQD5GhC1NUmJHTcMpkDzf2iJriIrSBxw2rzjTZ"}
          />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-50">{playerInfo?.name || "PlayerName"}</h2>
          <div className="flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_rgba(56,224,123,0.8)]"></span>
            <span className="text-xs text-slate-400">Level {playerInfo?.level || 1}</span>
          </div>
        </div>
      </div>
      
      <h3 className="px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Categorias</h3>
      
      <nav className="flex-1 px-4 space-y-2">
        {categories.map((cat, idx) => (
          <a key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative group ${cat.active ? 'bg-primary/20 border border-primary/40 text-primary shadow-[0_0_15px_rgba(56,224,123,0.1)]' : 'hover:bg-slate-800/50 text-slate-300 hover:text-slate-100 border border-transparent hover:border-slate-700'}`} href="#">
            {cat.active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md"></div>}
            <span className="material-symbols-outlined text-xl">{cat.icon}</span>
            <span className="font-medium tracking-wide">{cat.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
