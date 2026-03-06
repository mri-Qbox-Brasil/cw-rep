import React, { useMemo, useState } from "react";
import TalentNode from "./TalentNode";
import TalentPath from "./TalentPath";
import { baseTreeNodes, buildDynamicTree } from "../config/talentTreeData";

export default function TalentTree({ unlockedNodes, highlightPathTo, onNodeClick }) {
  // unlockedNodes is now an object like: { root: 1, mob_1: 2, cond_1: 1 }
  const getLevel = (id) => unlockedNodes[id] || 0;

  // Use state to handle panning (Drag to view the infinite tree)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Generate the dynamic tree based on currently unlocked nodes
  const { nodes: treeNodes, paths: treePaths } = useMemo(() => {
    return buildDynamicTree(baseTreeNodes, unlockedNodes);
  }, [unlockedNodes]);

  // Handle Drag / Pan logic
  const handleMouseDown = (e) => {
    // Only drag if clicking on the background, not on a node
    if (e.target.closest('.group')) return; 
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  return (
    <main 
      className="flex-1 relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black shadow-inner cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      
      {/* Tooltip for Legend */}
      <div className="absolute top-8 left-8 bg-black/80 border border-slate-800 backdrop-blur-md rounded-lg p-4 max-w-xs shadow-xl z-30 pointer-events-none">
        <h4 className="text-sm font-bold text-slate-200 mb-2 border-b border-slate-700 pb-2">Informações do Nó</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#eab308] border-[2px] border-[#fde047] shadow-[0_0_8px_rgba(234,179,8,0.6)]"></span>
            <span className="text-xs text-slate-300">Nó Ativo Maxed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-900 border-[2px] border-[#22c55e]"></span>
            <span className="text-xs text-slate-300">Nó Desbloqueado (Comprável)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-800 border-[2px] border-slate-600"></span>
            <span className="text-xs text-slate-500">Nó Bloqueado (Requisitos)</span>
          </div>
        </div>
      </div>

      {/* Pannable Canvas Container */}
      <div 
        className="absolute inset-0 transition-transform duration-75 ease-out"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px)` }}
      >
        <div className="absolute left-1/2 top-0 w-[1px] h-[1px]"> {/* Relative Center Anchor */}
          
          {/* SVG Paths Background */}
          {/* We make SVG overflow naturally by using big fixed width centered around the anchor */}
          <svg className="absolute left-[-2000px] top-[-1000px] w-[4000px] h-[3000px] pointer-events-none z-0">
            <g transform="translate(2000, 1000)"> {/* Offset SVG 0,0 to match our React center */}
              {treePaths.map((path) => {
                // Path is lit if both ends have >0 points
                const isUnlocked = getLevel(path.sourceId) > 0 && getLevel(path.targetId) > 0;
                // Redefined path startX/endX are already from center.
                // We pass a dummy '0' for centerX inside TalentPath since we centered the SVG <g>
                return <TalentPath key={path.id} path={path} isUnlocked={isUnlocked} svgCenterX={0} />;
              })}
            </g>
          </svg>

          {/* Render Nodes */}
          {treeNodes.map((node) => {
            let status = "locked";
            const currentLvl = getLevel(node.id);
            
            if (node.isRoot || currentLvl > 0) status = "active";
            else if (highlightPathTo === node.id || node.requires?.every(reqId => getLevel(reqId) > 0)) {
              status = "unlocked"; 
            }
            
            return (
              <TalentNode 
                key={node.id} 
                node={node} 
                status={status}
                currentLevel={currentLvl}
                onPurchase={onNodeClick}
                highlightPath={() => {}}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
