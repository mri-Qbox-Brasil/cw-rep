import React from "react";

export default function Header({ points }) {
  return (
    <header className="flex items-center justify-between border-b border-primary/20 px-8 py-4 shadow-sm shadow-primary/5 bg-black">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_rgba(56,224,123,0.3)]">
          <span className="material-symbols-outlined text-2xl">account_tree</span>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide text-slate-50 uppercase shadow-primary/50 drop-shadow-md">Árvore de Reputação</h1>
          <p className="text-xs text-primary/80 uppercase tracking-widest font-semibold">Melhore suas habilidades</p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 px-5 py-2 rounded-full shadow-[0_0_20px_rgba(56,224,123,0.15)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/20 w-0 group-hover:w-full transition-all duration-300 ease-out"></div>
        <span className="material-symbols-outlined text-primary relative z-10">generating_tokens</span>
        <span className="text-primary font-bold tracking-wider relative z-10 drop-shadow-[0_0_8px_rgba(56,224,123,0.8)]">
          {points} Pts Disponíveis
        </span>
      </div>
    </header>
  );
}
