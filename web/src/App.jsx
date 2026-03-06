import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TalentTree from './components/TalentTree';
import { useNuiEvent } from './hooks/useNuiEvent';
import { fetchNui } from './utils/fetchNui';
import { categories } from './config/talentTreeData';

function App() {
  // NUI Visibility state
  const [isVisible, setIsVisible] = useState(false);

  // Player State
  const [points, setPoints] = useState(500);
  const [unlockedNodes, setUnlockedNodes] = useState({ "root": 1 });
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
    if (data) {
      if (data.points !== undefined) setPoints(data.points);
      if (data.unlockedNodes) setUnlockedNodes({ "root": 1, ...data.unlockedNodes });
      if (data.playerInfo) setPlayerInfo(data.playerInfo);
    }
  });

  useNuiEvent("hideTalentTree", () => {
    setIsVisible(false);
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
  const handleNodeClick = async (node) => {
    const currentLevel = unlockedNodes[node.id] || 0;
    
    // If max level, return
    if (currentLevel >= node.maxLevel) {
      return; 
    }

    if (points >= node.cost) {
       try {
         const response = await fetchNui("purchaseTalent", { nodeId: node.id, cost: node.cost });
         
         if (response && response.status === "ok") {
            setUnlockedNodes(prev => ({ ...prev, [node.id]: (prev[node.id] || 0) + 1 }));
            setPoints(prev => prev - node.cost);
         }
       } catch(e) {
         console.warn("Backend NUI indisponível. Simulando sucesso de compra para testes visuais.", e);
         // Mocking the success so the UI updates since the Lua backend is not integrated yet
         setUnlockedNodes(prev => ({ ...prev, [node.id]: (prev[node.id] || 0) + 1 }));
         setPoints(prev => prev - node.cost);
       }
    } else {
       // Not enough points - Could show a toast message here later
       console.log("Não há pontos suficientes!");
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-background-light text-slate-900 dark:text-slate-100 font-display min-h-screen antialiased overflow-hidden bg-black selection:bg-primary/30">
      <div className="fixed inset-0 bg-black pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex h-screen w-full flex-col backdrop-blur-sm bg-black/90">
        <Header points={points} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar categories={categories} playerInfo={playerInfo} />
          
          <TalentTree 
            unlockedNodes={unlockedNodes} 
            highlightPathTo={selectedNode}
            onNodeClick={handleNodeClick}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
