import React, { useState, useEffect } from 'react';
import TalentTree from './components/TalentTree';
import { useNuiEvent } from './hooks/useNuiEvent';
import { fetchNui } from './utils/fetchNui';

function App() {
  // NUI Visibility state
  const [isVisible, setIsVisible] = useState(false);

  // Player State
  const [points, setPoints] = useState(2500); // Pontos disponíveis
  const [pointsSpent, setPointsSpent] = useState(0); // Pontos gastos na sessão atual (Draft)
  
  const [unlockedNodes, setUnlockedNodes] = useState({ "root": 1 });
  const [draftNodes, setDraftNodes] = useState({}); // Nodes clicados mas não confirmados
  
  const [playerInfo, setPlayerInfo] = useState({
    name: "John Doe",
    level: 42,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuATo7lHd_h7EG1xTnkY4jeV-Qb49vJyrbXP_ZDoQjprVsQdmPotuCaCQLIUPKWCCHMz4rxQvZk5t9KrxolzzqYdAeL0vu0_KdgjIPV5k7ETZYNFEQAhSkJswxaSKAy7mJvm3wrW1SlrgfolK_BOnlusSI8OekN1dLNDbLs9-8crBO_EOejs7h36e3yv7loNZK55tmv4ynHcuRjJEPy6fN4uOGQywNjYlUSMBpR4aKyQD5GhC1NUmJHTcMpkDzf2iJriIrSBxw2rzjTZ"
  });

  // UI State
  const [selectedNode, setSelectedNode] = useState(null);

  // --- NUI Events ---
  useNuiEvent("showTalentTree", (data) => {
    setIsVisible(true);
    setDraftNodes({});
    setPointsSpent(0);
    if (data) {
      if (data.points !== undefined) setPoints(data.points);
      if (data.unlockedNodes) setUnlockedNodes({ "root": 1, ...data.unlockedNodes });
      if (data.playerInfo) setPlayerInfo(data.playerInfo);
    }
  });

  useNuiEvent("hideTalentTree", () => {
    setIsVisible(false);
    setDraftNodes({});
    setPointsSpent(0);
  });

  // Handle escape key to close NUI
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isVisible) {
        setIsVisible(false);
        fetchNui("closeTalentTree");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  // For development only, make UI visible
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setIsVisible(true);
    }
  }, []);

  // --- Logic ---
  const handleNodeDraftClick = (node, action = "add") => {
    const currentBaseLevel = unlockedNodes[node.id] || 0;
    const currentDraftLevel = draftNodes[node.id] || 0;
    const totalLevel = currentBaseLevel + currentDraftLevel;
    
    if (action === "add") {
      // If max level, return
      if (totalLevel >= node.maxLevel) return; 

      if (points >= node.cost) {
        // Adiciona ao carrinho (Draft)
        setDraftNodes(prev => ({ ...prev, [node.id]: (prev[node.id] || 0) + 1 }));
        setPoints(prev => prev - node.cost);
        setPointsSpent(prev => prev + node.cost);
      } else {
         console.log("Não há pontos suficientes!");
      }
    } else if (action === "remove") {
      // Só pode remover se tivermos colocado no draft agora
      if (currentDraftLevel > 0) {
        setDraftNodes(prev => {
          const next = { ...prev };
          next[node.id] -= 1;
          if (next[node.id] === 0) delete next[node.id];
          return next;
        });
        setPoints(prev => prev + node.cost);
        setPointsSpent(prev => prev - node.cost);
      }
    }
  };

  const handleConfirmPurchase = async () => {
    if (Object.keys(draftNodes).length === 0) return;

    try {
      // Em um cenário real backend, você mandaria o objeto inteiro de draft ou calcularia o diff
      const response = await fetchNui("purchaseTalentsBatch", { draft: draftNodes, totalCost: pointsSpent });
      
      if (response && response.status === "ok") {
        commitDraft();
      }
    } catch(e) {
      console.warn("Backend NUI indisponível. Simulando sucesso de compra em batch.", e);
      commitDraft();
    }
  };

  const commitDraft = () => {
    // Mescla o Draft com os Unlocked reais
    setUnlockedNodes(prev => {
      const newUnlocked = { ...prev };
      for (const [nodeId, levels] of Object.entries(draftNodes)) {
        newUnlocked[nodeId] = (newUnlocked[nodeId] || 0) + levels;
      }
      return newUnlocked;
    });
    setDraftNodes({});
    setPointsSpent(0);
    // Pontos totais já foram reduzidos durante o draft localmente.
  };

  if (!isVisible) return null;

  return (
    <div className="bg-background-dark text-slate-100 font-display min-h-screen antialiased overflow-hidden selection:bg-primary/30 relative">
      <div className="fixed inset-0 bg-black pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex h-screen w-full flex-col backdrop-blur-sm bg-black/90">
        
        {/* TOP LEFT PANEL - Árvore de Conhecimento & Confirmar */}
        <div className="absolute top-6 left-6 z-40 flex flex-col gap-4 w-72">
           <div className="flex items-center gap-3 cursor-pointer hover:text-white text-zinc-300 transition-colors" onClick={() => { setIsVisible(false); fetchNui("closeTalentTree"); }}>
             <div className="bg-zinc-900 flex items-center justify-center p-1 rounded-md border border-zinc-800 hover:bg-zinc-800">
               <span className="material-symbols-outlined text-sm">chevron_left</span>
             </div>
             <h2 className="text-[13px] font-black tracking-widest uppercase">ÁRVORE DE CONHECIMENTO</h2>
           </div>

           <div className="bg-zinc-950/80 backdrop-blur-md rounded-lg border border-zinc-800/80 p-5 shadow-2xl flex flex-col gap-1">
             <div className="flexjustify-between items-center">
                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{pointsSpent} PONTOS GASTOS</p>
             </div>
             <div className="mt-2">
                 <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mb-1">PONTOS DISPONÍVEIS</p>
                 <p className="text-4xl font-black text-[#a3e635]">+{points}</p>
             </div>
           </div>

           <button 
            onClick={handleConfirmPurchase}
            disabled={Object.keys(draftNodes).length === 0}
            className="w-full py-3.5 bg-white text-black font-black text-[11px] tracking-widest rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
           >
             Confirmar
           </button>
        </div>

        {/* TOP CENTER LOGO (Mock) */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
           <div className="w-10 h-10 bg-[#a3e635] flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(163,230,53,0.3)]" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
             I
           </div>
        </div>

        {/* BOTTOM RIGHT FOOTER - Atalhos */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center">
          <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800/60 rounded-full px-8 py-3 flex items-center gap-6 text-[9px] font-bold tracking-widest text-zinc-500 shadow-xl">
            <div className="flex items-center gap-2 text-white">
              <span className="material-symbols-outlined text-sm">mouse</span>
              <span className="text-zinc-400">ORIENTAÇÃO:</span>
              <span>SCROLL: ZOOM NA TELA</span>
            </div>
            <span className="w-px h-3 bg-zinc-800"></span>
            <span className="text-white"><span className="text-zinc-400">BOTÃO ESQUERDO:</span> MOVER TELA / ALOCAR</span>
            <span className="w-px h-3 bg-zinc-800"></span>
            <span className="text-white"><span className="text-zinc-400">BOTÃO DIREITO:</span> REMOVER PONTO</span>
          </div>
        </div>
        
        {/* Main Tree Canvas */}
        <div className="flex flex-1 overflow-hidden">
          <TalentTree 
            unlockedNodes={unlockedNodes} 
            draftNodes={draftNodes}
            highlightPathTo={selectedNode}
            onNodeClick={handleNodeDraftClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
