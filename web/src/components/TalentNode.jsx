import React from "react";
import { cn } from "../lib/utils";

// Mapping colors for branch types
const colorClasses = {
  active: {
    yellow: "bg-[#eab308]/20 border-[#fde047] text-[#fde047] shadow-[0_0_20px_rgba(234,179,8,0.5)]",
    green: "bg-[#22c55e]/20 border-[#4ade80] text-[#4ade80] shadow-[0_0_20px_rgba(34,197,94,0.5)]",
    red: "bg-[#ef4444]/20 border-[#f87171] text-[#f87171] shadow-[0_0_20px_rgba(239,68,68,0.5)]",
    default: "bg-primary/20 border-primary text-primary shadow-[0_0_25px_rgba(56,224,123,0.5)]"
  },
  unlocked: {
    yellow: "bg-black/60 border-zinc-700 text-zinc-500 hover:border-[#eab308] hover:text-[#eab308] hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all",
    green: "bg-black/60 border-zinc-700 text-zinc-500 hover:border-[#22c55e] hover:text-[#22c55e] hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all",
    red: "bg-black/60 border-zinc-700 text-zinc-500 hover:border-[#ef4444] hover:text-[#ef4444] hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all",
    default: "bg-black/60 border-zinc-700 text-zinc-500 hover:border-primary hover:text-primary hover:shadow-[0_0_15px_rgba(56,224,123,0.3)] transition-all"
  },
  draft: "bg-[#0ea5e9]/20 border-[#0ea5e9] text-[#0ea5e9] shadow-[0_0_20px_rgba(14,165,233,0.8)]"
};

export default function TalentNode({ node, status, baseLevel = 0, draftLevel = 0, currentLevel = 0, onPurchase, highlightPath }) {
  const { id, icon, title, description, cost, maxLevel, position, isRoot, color } = node;

  const triggerFeedback = (e) => {
    const el = e.currentTarget.querySelector('.node-circle');
    if (el) {
       el.classList.add('scale-90', 'brightness-150');
       setTimeout(() => el.classList.remove('scale-90', 'brightness-150'), 100);
    }
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (status !== "locked" && currentLevel < maxLevel) {
      onPurchase(node, "add");
      triggerFeedback(e);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (draftLevel > 0) {
      onPurchase(node, "remove");
      triggerFeedback(e);
    }
  };

  const typeColor = color || "default";
  
  // A node is visually "Active" (filled) if it has at least 1 BASE point
  const isBaseFilled = baseLevel > 0;
  
  // Is Draft if it has draft points
  const isDraft = draftLevel > 0;

  let colorStyle = "";
  if (isDraft) {
    colorStyle = colorClasses.draft;
  } else if (isBaseFilled || isRoot) {
    colorStyle = colorClasses.active[typeColor];
  } else if (status === "unlocked") {
    colorStyle = colorClasses.unlocked[typeColor];
  } else {
    colorStyle = "bg-zinc-950/40 border-zinc-800/80 text-zinc-700 opacity-50 shadow-inner"; // Locked minimalist look
  }

  // Bubble style matches the outer ring
  const bubbleBg = "bg-black/90 backdrop-blur-sm";
  const bubbleBorder = isDraft ? "border-[#0ea5e9]" : (isBaseFilled || isRoot ? colorClasses.active[typeColor].split(' ')[1] : "border-zinc-700");
  const bubbleText = (isDraft || isBaseFilled || isRoot) ? "text-white drop-shadow-md" : "text-zinc-500";

  return (
    <div 
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none flex flex-col items-center",
        status === "locked" ? "z-10" : "z-20 hover:z-[60]"
      )}
      style={{ top: `${position.y}px`, left: `calc(50% + ${position.x}px)` }}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      onMouseEnter={() => { if (status !== "locked") highlightPath(node.id); }}
      onMouseLeave={() => highlightPath(null)}
    >
      <div className="relative flex justify-center items-center">

        {/* Main Node Icon Circle */}
        <div 
          className={cn(
            "node-circle rounded-full flex items-center justify-center transition-all duration-150 border-[2px]",
            !isDraft && status !== "locked" && "group-hover:scale-110",
            isRoot ? "w-[60px] h-[60px]" : "w-12 h-12",
            colorStyle
          )}
        >
          <span className={cn(
              "material-symbols-outlined pointer-events-none drop-shadow-md text-2xl"
          )}>
            {status === "locked" ? "lock" : icon}
          </span>
        </div>

        {/* Cyberpunk Rank Bubble (0/5) */}
        {!isRoot && (
           <div className={cn(
             "absolute -bottom-3 translate-y-1 px-2 py-0.5 rounded-full border-[2px] text-[10px] font-black tracking-widest pointer-events-none z-30",
             bubbleBg, bubbleBorder, bubbleText,
             "shadow-md",
             status !== "locked" && "group-hover:scale-110 transition-transform"
           )}>
             {currentLevel}/{maxLevel}
           </div>
        )}
      </div>

      {/* Tooltip Hover Overlay */}
      {status !== "locked" && (
        <div className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 bg-black/90 border border-zinc-800 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]"
        )}>
          {/* Optional Video Thumbnail */}
          {node.video && (
            <div className="w-full h-32 mb-3 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 shadow-inner">
              <video 
                src={node.video} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-80"
              />
            </div>
          )}

          <div className="flex justify-between items-start mb-2 mt-1">
            <h5 className={cn(
              "font-bold text-base tracking-wide", 
              isDraft ? "text-[#0ea5e9]" : (isBaseFilled || isRoot ? colorClasses.active[typeColor].split(' ')[2] : "text-white")
            )}>{title}</h5>
            <span className="bg-zinc-900 text-zinc-400 text-[9px] font-bold px-2 py-1 rounded border border-zinc-800">Pts: {cost}</span>
          </div>
          <p className="text-zinc-400 text-xs mb-3 font-medium bg-zinc-950/50 p-2 rounded border border-zinc-800/50">{description}</p>
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
            <span>Level: {currentLevel}/{maxLevel}</span>
            {currentLevel >= maxLevel && <span className={cn("tracking-widest", isDraft ? "text-[#0ea5e9]" : "text-[#4ade80]")}>MAXED</span>}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black border-b border-r border-zinc-800 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
