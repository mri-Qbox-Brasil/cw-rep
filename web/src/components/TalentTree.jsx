import React, { useMemo, useState } from "react";
import TalentNode from "./TalentNode";
import TalentPath from "./TalentPath";
import { baseTreeNodes, buildDynamicTree } from "../config/talentTreeData";

export default function TalentTree({ unlockedNodes, draftNodes, highlightPathTo, onNodeClick }) {
  // Combine unlocked and drafted for visual pathway connecting
  const getCombinedLevel = (id) => (unlockedNodes[id] || 0) + (draftNodes[id] || 0);

  // Use state to handle panning (Drag) and zooming (Scroll)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Generate the dynamic tree based on CURRENT combined levels
  // So adding a draft point visually expands the tree if it hits max
  const combinedNodesState = useMemo(() => {
    const combined = { ...unlockedNodes };
    for (const [k, v] of Object.entries(draftNodes)) {
      combined[k] = (combined[k] || 0) + v;
    }
    return combined;
  }, [unlockedNodes, draftNodes]);

  const { nodes: treeNodes, paths: treePaths } = useMemo(() => {
    return buildDynamicTree(baseTreeNodes, combinedNodesState);
  }, [combinedNodesState]);

  // Handle Drag / Pan logic
  const handleMouseDown = (e) => {
    // Only drag if clicking on the background (primary button usually 0 for left click)
    // Avoid dragging on right click (button 2) because right click allocates
    if (e.target.closest('.group') || e.button !== 0) return; 
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

  const handleWheel = (e) => {
    // Zoom in/out via Mouse Wheel
    setScale(prev => Math.min(Math.max(prev - e.deltaY * 0.0015, 0.3), 2.5));
  };
  
  return (
    <main 
      className="flex-1 relative overflow-hidden bg-[#050608] shadow-inner cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      
      {/* Background Radial Dots/Grid */}
      <div 
         className="absolute inset-0 pointer-events-none opacity-20"
         style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: `${30 * scale}px ${30 * scale}px`, backgroundPosition: `${pan.x}px ${pan.y}px` }}
      />

      {/* Pannable Canvas Container */}
      <div 
        className="absolute inset-0 origin-center transition-transform duration-75 ease-out"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
        <div className="absolute left-1/2 top-1/2 w-[1px] h-[1px]"> {/* Relative Center Anchor */}
          
          {/* SVG Paths Background */}
          {/* We make SVG overflow naturally by using big fixed width centered around the anchor */}
          <svg className="absolute left-[-2000px] top-[-1500px] w-[4000px] h-[3000px] pointer-events-none z-0">
            <g transform="translate(2000, 1500)"> {/* Offset SVG 0,0 to match our React center */}
              {treePaths.map((path) => {
                // Path is lit if both ends have >0 points
                const isUnlocked = getCombinedLevel(path.sourceId) > 0 && getCombinedLevel(path.targetId) > 0;
                // Redefined path startX/endX are already from center.
                // We pass a dummy '0' for centerX inside TalentPath since we centered the SVG <g>
                return <TalentPath key={path.id} path={path} isUnlocked={isUnlocked} svgCenterX={0} />;
              })}
            </g>
          </svg>

          {/* Render Nodes */}
          {treeNodes.map((node) => {
            let status = "locked";
            const combinedLvl = getCombinedLevel(node.id);
            const baseLvl = unlockedNodes[node.id] || 0;
            const draftLvl = draftNodes[node.id] || 0;
            
            if (node.isRoot || combinedLvl > 0) {
              status = "active";
            } else if (highlightPathTo === node.id || node.requires?.every(reqId => getCombinedLevel(reqId) > 0)) {
              status = "unlocked"; 
            }
            
            return (
              <TalentNode 
                key={node.id} 
                node={node} 
                status={status}
                baseLevel={baseLvl}
                draftLevel={draftLvl}
                currentLevel={combinedLvl}
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
