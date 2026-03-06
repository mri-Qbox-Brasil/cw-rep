import React, { useState, useRef, useEffect } from "react";
import { cn } from "../lib/utils";

// Mapping colors for branch types
const colorClasses = {
  active: {
    yellow: "bg-[#eab308] border-[#fde047] text-black shadow-[0_0_20px_rgba(234,179,8,0.8)]",
    green: "bg-[#22c55e] border-[#4ade80] text-black shadow-[0_0_20px_rgba(34,197,94,0.8)]",
    red: "bg-[#ef4444] border-[#f87171] text-black shadow-[0_0_20px_rgba(239,68,68,0.8)]",
    default: "bg-primary border-white text-black shadow-[0_0_25px_rgba(56,224,123,0.8)]"
  },
  unlocked: {
    yellow: "bg-slate-900 border-[#eab308] text-[#eab308] shadow-[0_0_15px_rgba(234,179,8,0.3)]",
    green: "bg-slate-900 border-[#22c55e] text-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    red: "bg-slate-900 border-[#ef4444] text-[#ef4444] shadow-[0_0_15px_rgba(239,68,68,0.3)]",
    default: "bg-slate-900 border-primary text-primary shadow-[0_0_15px_rgba(56,224,123,0.3)]"
  },
  fillStroke: {
    yellow: "rgba(234,179,8,0.9)",
    green: "rgba(34,197,94,0.9)",
    red: "rgba(239,68,68,0.9)",
    default: "rgba(56,224,123,0.9)"
  }
};

export default function TalentNode({ node, status, currentLevel = 0, onPurchase, highlightPath }) {
  const { id, icon, title, description, cost, maxLevel, bonus, position, isRoot, color } = node;
  const [fillProgress, setFillProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const requestRef = useRef();
  const startTimeRef = useRef();

  const HOLD_DURATION = 500; // 0.5s for snappy purchase

  const startFill = () => {
    // Only allow fill if unlocked and not max level
    if (status === "locked" || currentLevel >= maxLevel) return;
    setIsPressing(true);
    startTimeRef.current = performance.now();
    requestRef.current = requestAnimationFrame(updateFill);
    highlightPath(node.id);
  };

  const cancelFill = () => {
    setIsPressing(false);
    setFillProgress(0);
    cancelAnimationFrame(requestRef.current);
    highlightPath(null);
  };

  const updateFill = (timestamp) => {
    if (!startTimeRef.current) return;
    const elapsed = timestamp - startTimeRef.current;
    
    if (elapsed >= HOLD_DURATION) {
      setFillProgress(100);
      setIsPressing(false);
      onPurchase(node); // Trigger purchase for 1 rank point
    } else {
      setFillProgress((elapsed / HOLD_DURATION) * 100);
      requestRef.current = requestAnimationFrame(updateFill);
    }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const radius = isRoot ? 34 : 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fillProgress / 100) * circumference;

  const typeColor = color || "default";
  
  // A node is visually "Active" (filled) if it has at least 1 point
  const isFilled = currentLevel > 0;
  const colorStyle = isFilled ? colorClasses.active[typeColor] : (status === "unlocked" ? colorClasses.unlocked[typeColor] : "bg-slate-800 border-slate-600 text-slate-500 opacity-60 grayscale");
  const strokeColor = colorClasses.fillStroke[typeColor];

  // For the cyberpunk bubble logic
  const bubbleBg = isFilled ? colorClasses.active[typeColor].split(' ')[0] : "bg-slate-900";
  const bubbleBorder = isFilled ? "border-black" : (status === "unlocked" ? colorClasses.unlocked[typeColor].split(' ')[1] : "border-slate-600");
  const bubbleText = isFilled ? "text-black font-black" : (status === "unlocked" ? colorClasses.unlocked[typeColor].split(' ')[2] : "text-slate-500");

  return (
    <div 
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group select-none flex flex-col items-center",
        status === "locked" ? "z-10" : "z-20 hover:z-[60]"
      )}
      style={{ top: `${position.y}px`, left: `calc(50% + ${position.x}px)` }}
      onMouseDown={startFill}
      onMouseUp={cancelFill}
      onMouseLeave={cancelFill}
      onTouchStart={startFill}
      onTouchEnd={cancelFill}
    >
      <div className="relative flex justify-center items-center">
        {/* Fill Animation Ring */}
        {isPressing && (
           <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius + 4}
                fill="none"
                stroke={strokeColor}
                strokeWidth="6"
                strokeDasharray={circumference + 25} // approx adj
                strokeDashoffset={strokeDashoffset + 25}
                strokeLinecap="round"
                className="transition-all duration-75"
              />
           </svg>
        )}

        {/* Main Node Icon Circle */}
        <div 
          className={cn(
            "rounded-full flex items-center justify-center transition-transform border-[3px]",
            !isPressing && "group-hover:scale-110",
            isPressing && "scale-95 brightness-110",
            isRoot ? "w-[68px] h-[68px]" : "w-14 h-14",
            colorStyle
          )}
        >
          <span className={cn(
              "material-symbols-outlined pointer-events-none",
              isRoot ? "text-4xl" : "text-3xl",
              status === "locked" ? "opacity-70" : ""
          )}>
            {status === "locked" ? "lock" : icon}
          </span>
        </div>

        {/* Cyberpunk Rank Bubble (0/5) */}
        {!isRoot && (
           <div className={cn(
             "absolute -bottom-4 translate-y-1 px-2 py-0.5 rounded-full border-[2px] text-xs font-bold tracking-widest bg-slate-900 pointer-events-none z-30",
             bubbleBg, bubbleBorder, bubbleText,
             "shadow-md",
             !isPressing && "group-hover:scale-110 transition-transform"
           )}>
             {currentLevel}/{maxLevel}
           </div>
        )}
      </div>

      {/* Tooltip Hover Overlay */}
      {status !== "locked" && (
        <div className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-64 bg-slate-900/95 border border-slate-700 rounded-lg p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]",
          isPressing && "opacity-100" // Keep visible while pressing
        )}>
          {/* Optional Video Thumbnail */}
          {node.video && (
            <div className="w-full h-32 mb-3 bg-black rounded overflow-hidden border border-slate-700 shadow-inner">
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
            <h5 className={cn("font-bold text-base tracking-wide", colorClasses.unlocked[typeColor].split(' ')[2])}>{title}</h5>
            <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-700">Pts: {cost}</span>
          </div>
          <p className="text-slate-300 text-sm mb-3">{description}</p>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Level: {currentLevel}/{maxLevel}</span>
            {currentLevel >= maxLevel && <span className="text-[#22c55e]">MAXED</span>}
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-b border-r border-slate-700 rotate-45"></div>
        </div>
      )}
    </div>
  );
}
