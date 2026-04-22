import React from "react";
import { cn } from "../lib/utils";

export default function TalentPath({ path, isUnlocked, svgCenterX = 450 }) {
  // SVG coordinates: Use provided center (defaults to 450 for legacy, but we pass 0 now)
  const centerX = svgCenterX;
  
  // Calculate proper SVG points
  const p1x = centerX + path.startX;
  const p1y = path.startY;
  const p2x = centerX + path.endX;
  const p2y = path.endY;

  // Cubic Bezier curve control points
  // We want the lines to flow upwards, so control points pull vertically.
  // The offset calculates how much curve it has based on Y diff
  const offset = Math.abs(p2y - p1y) * 0.6;
  
  const cp1x = p1x;
  const cp1y = p1y - offset;
  
  const cp2x = p2x;
  const cp2y = p2y + offset;

  // Path string
  const dPath = `M ${p1x} ${p1y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2x} ${p2y}`;

  // Color mapping based on node branch
  const colorMap = {
    yellow: "rgba(234, 179, 8, 1)",  // #eab308
    green: "rgba(34, 197, 94, 1)",   // #22c55e
    red: "rgba(239, 68, 68, 1)"      // #ef4444
  };
  
  const dimColorMap = {
    yellow: "rgba(255, 255, 255, 0.08)",
    green: "rgba(255, 255, 255, 0.08)",
    red: "rgba(255, 255, 255, 0.08)" 
  };

  const activeColor = colorMap[path.color] || "rgba(56,224,123,1)";
  const inactiveColor = dimColorMap[path.color] || "rgba(255,255,255,0.08)";

  return (
    <path 
      d={dPath} 
      fill="none" 
      strokeWidth={isUnlocked ? "6" : "3"}
      className={cn(
        "transition-all duration-500 ease-in-out",
        isUnlocked && path.color === 'yellow' && "drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]",
        isUnlocked && path.color === 'green' && "drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]",
        isUnlocked && path.color === 'red' && "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]",
      )}
      strokeLinecap="round"
      stroke={isUnlocked ? activeColor : inactiveColor}
    />
  );
}
