export const baseTreeNodes = [
  // --- ROOT / MOBILITY (Yellow) ---
  {
    id: "root",
    isRoot: true,
    icon: "moving",
    title: "Agilidade Base",
    description: "Ponto de partida. Melhora a movimentação geral.",
    cost: 0,
    maxLevel: 1,
    color: "yellow",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    position: { x: 0, y: 0 }, // Center
    connections: ["mob_1", "cond_1", "surv_1"]
  },
  {
    id: "mob_1",
    icon: "sprint",
    title: "Corrida Tática",
    description: "Aumenta a velocidade de corrida.",
    cost: 1,
    maxLevel: 5,
    color: "yellow",
    position: { x: 0, y: -180 }, // Straight Up
    connections: ["mob_2"],
    requires: ["root"]
  },
  {
    id: "mob_2",
    icon: "directions_run",
    title: "Parkour",
    description: "Escalada mais rápida.",
    cost: 2,
    maxLevel: 5,
    color: "yellow",
    position: { x: 0, y: -350 },
    connections: ["mob_3", "mob_4"],
    requires: ["mob_1"]
  },
  {
    id: "mob_3",
    icon: "speed",
    title: "Reflexos Rápidos",
    description: "Esquiva aprimorada.",
    cost: 3,
    maxLevel: 5,
    color: "yellow",
    position: { x: -120, y: -480 },
    connections: [],
    requires: ["mob_2"]
  },
  {
    id: "mob_4",
    icon: "airline_stops",
    title: "Impulso Horizontal",
    description: "Salto em distância maior.",
    cost: 3,
    maxLevel: 5,
    color: "yellow",
    position: { x: 120, y: -480 },
    connections: [],
    requires: ["mob_2"]
  },

  // --- CONDITIONING (Green) - Left Branch ---
  {
    id: "cond_1",
    icon: "eco",
    title: "Respiração Focada",
    description: "Regeneração de fôlego 20% mais rápida.",
    cost: 1,
    maxLevel: 5,
    color: "green",
    position: { x: -160, y: 80 }, // Going Bottom Left
    connections: ["cond_2", "cond_3"],
    requires: ["root"]
  },
  {
    id: "cond_2",
    icon: "fitness_center",
    title: "Força Bruta",
    description: "Capacidade de carga aumentada.",
    cost: 2,
    maxLevel: 5,
    color: "green",
    position: { x: -320, y: 150 },
    connections: ["cond_4"],
    requires: ["cond_1"]
  },
  {
    id: "cond_3",
    icon: "health_and_safety",
    title: "Vitalidade",
    description: "Aumenta a vida máxima.",
    cost: 2,
    maxLevel: 5,
    color: "green",
    position: { x: -250, y: 280 },
    connections: [],
    requires: ["cond_1"]
  },
  {
    id: "cond_4",
    icon: "monitor_heart",
    title: "Metabolismo Muta",
    description: "Regeneração de vida passiva.",
    cost: 3,
    maxLevel: 5,
    color: "green",
    position: { x: -480, y: 200 },
    connections: [],
    requires: ["cond_2"]
  },

  // --- SURVIVAL (Red) - Right Branch ---
  {
    id: "surv_1",
    icon: "keyboard_double_arrow_right",
    title: "Avanço Preciso",
    description: "Reduz dano por queda.",
    cost: 1,
    maxLevel: 5,
    color: "red",
    position: { x: 160, y: 80 }, // Going Bottom Right
    connections: ["surv_2", "surv_3"],
    requires: ["root"]
  },
  {
    id: "surv_2",
    icon: "medical_services",
    title: "Primeiros Socorros",
    description: "Bandagens curam mais rápido.",
    cost: 2,
    maxLevel: 5,
    color: "red",
    position: { x: 320, y: 150 },
    connections: ["surv_4"],
    requires: ["surv_1"]
  },
  {
    id: "surv_3",
    icon: "build_circle",
    title: "Reparo Rápido",
    description: "Conserto de colete com menor tempo.",
    cost: 2,
    maxLevel: 5,
    color: "red",
    position: { x: 250, y: 280 },
    connections: [],
    requires: ["surv_1"]
  },
  {
    id: "surv_4",
    icon: "healing",
    title: "Adrenalina",
    description: "Ao sofrer dano grave, ganha velocidade extra.",
    cost: 3,
    maxLevel: 5,
    color: "red",
    position: { x: 480, y: 200 },
    connections: [],
    requires: ["surv_2"]
  }
];

export const categories = [
  { id: "conditioning", label: "Conditioning", icon: "eco", active: true, colorClass: "text-[#22c55e]" },
  { id: "mobility", label: "Mobility", icon: "moving", active: false, colorClass: "text-[#eab308]" },
  { id: "survival", label: "Survival", icon: "healing", active: false, colorClass: "text-[#ef4444]" },
];

/**
 * Procedural Tree Generation:
 * If a node is a "Leaf" (has no connections) and is MAX LEVEL, it spawns Fibonacci children.
 */
export function buildDynamicTree(baseNodes, unlockedLevels) {
  const nodesMap = new Map();
  
  // Assign a base "angle" to root nodes so their spawned children know which direction to grow
  baseNodes.forEach(n => {
    let baseAngle = -90; // Default upwards
    if (n.position.x !== 0 || n.position.y !== 0) {
      baseAngle = (Math.atan2(n.position.y, n.position.x) * 180) / Math.PI;
    }
    nodesMap.set(n.id, { 
       ...n, 
       connections: [...(n.connections || [])], 
       growAngle: baseAngle, 
       depth: 1, 
       spread: 45 // Initial wide spread for base node leaves
    });
  });

  const getLevel = (id) => unlockedLevels[id] || 0;
  let processQueue = [...nodesMap.values()];
  
  while (processQueue.length > 0) {
    const currentNode = processQueue.shift();
    
    if (!currentNode.connections || currentNode.connections.length === 0) {
      const currentLvl = getLevel(currentNode.id);
      
      if (currentLvl >= currentNode.maxLevel) {
        let parentCost = 1; 
        if (currentNode.requires && currentNode.requires.length > 0) {
            const parent = nodesMap.get(currentNode.requires[0]);
            if (parent) parentCost = parent.cost;
        }
        
        // We will define a function to find a clear spot by pushing the angle outward
        const minDistance = 140; // Collision Radius
        const findFreePosition = (baseAngle, searchDirection, dist, allPlacedSpreads) => {
          let currentIterAngle = baseAngle;
          let iterations = 0;
          let foundFreeX = 0;
          let foundFreeY = 0;

          while (iterations < 20) {
             const rAngle = (currentIterAngle * Math.PI) / 180;
             const tx = currentNode.position.x + Math.cos(rAngle) * dist;
             const ty = currentNode.position.y + Math.sin(rAngle) * dist;

             // Collision Check against all known nodes
             let hasCollision = false;
             for (const node of nodesMap.values()) {
                 const dx = node.position.x - tx;
                 const dy = node.position.y - ty;
                 if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
                    hasCollision = true;
                    break;
                 }
             }
             
             if (!hasCollision) {
               foundFreeX = tx;
               foundFreeY = ty;
               break;
             }

             // Push angle further away if collided
             // Search direction is +1 (turn right) or -1 (turn left)
             currentIterAngle += (15 * searchDirection); 
             iterations++;
          }
          
          return { x: foundFreeX, y: foundFreeY, finalAngle: currentIterAngle };
        };

        const depth = currentNode.depth || 1;
        const currentSpread = currentNode.spread || 45;

        let nextSpread = currentSpread * 0.85; 
        if (nextSpread < 20) nextSpread = 20;
         
        const distance = 160 + (depth * 45); 

        // Base Target Angles
        const angleLeft = currentNode.growAngle - currentSpread;
        const angleRight = currentNode.growAngle + currentSpread;

        const radLeftBase = (angleLeft * Math.PI) / 180;
        const radRightBase = (angleRight * Math.PI) / 180;

        let posLeftX = currentNode.position.x + Math.cos(radLeftBase) * distance;
        let posLeftY = currentNode.position.y + Math.sin(radLeftBase) * distance;

        let posRightX = currentNode.position.x + Math.cos(radRightBase) * distance;
        let posRightY = currentNode.position.y + Math.sin(radRightBase) * distance;

        // Radial outward Repulsion influence mapping
        let repelLeft = (Math.atan2(posLeftY, posLeftX) * 180) / Math.PI;
        let repelRight = (Math.atan2(posRightY, posRightX) * 180) / Math.PI;

        let mixedGrowAngleLeft = (angleLeft * 0.4) + (repelLeft * 0.6);
        let mixedGrowAngleRight = (angleRight * 0.4) + (repelRight * 0.6);

        // Run Collision Resolver
        // Left Branch: we search 'inward/outward' (searchDirection = -1 ensures it pushes left further left if blocked)
        const solverL = findFreePosition(mixedGrowAngleLeft, -1, distance);
        const solverR = findFreePosition(mixedGrowAngleRight, 1, distance);

        // Create Child 1 (Left Branch)
        const child1Id = `${currentNode.id}_fL`;
        const child1 = {
          id: child1Id,
          icon: "all_inclusive",
          title: `Trilha L${depth} Infinito`,
          description: "Continuação profunda da sua maestria.",
          cost: newCost,
          maxLevel: 5,
          color: currentNode.color,
          position: { x: solverL.x, y: solverL.y },
          growAngle: solverL.finalAngle, 
          depth: depth + 1,
          spread: nextSpread,
          connections: [],
          requires: [currentNode.id]
        };

        // Create Child 2 (Right Branch)
        const child2Id = `${currentNode.id}_fR`;
        const child2 = {
          id: child2Id,
          icon: "emergency",
          title: `Trilha R${depth} Infinito`,
          description: "Despertando potenciais esquecidos.",
          cost: newCost,
          maxLevel: 5,
          color: currentNode.color,
          position: { x: solverR.x, y: solverR.y },
          growAngle: solverR.finalAngle, 
          depth: depth + 1,
          spread: nextSpread,
          connections: [],
          requires: [currentNode.id]
        };

        currentNode.connections.push(child1Id, child2Id);

        nodesMap.set(child1Id, child1);
        nodesMap.set(child2Id, child2);

        processQueue.push(child1, child2);
      }
    }
  }

  const generatedNodes = Array.from(nodesMap.values());

  // Re-build paths array from the dynamically generated nodes
  const generatedPaths = generatedNodes.flatMap(sourceNode => 
    (sourceNode.connections || []).map(targetId => {
      const targetNode = nodesMap.get(targetId);
      return {
        id: `${sourceNode.id}-${targetNode.id}`,
        sourceId: sourceNode.id,
        targetId: targetNode.id,
        color: targetNode.color,
        startX: sourceNode.position.x,
        startY: sourceNode.position.y, 
        endX: targetNode.position.x,
        endY: targetNode.position.y,
      };
    })
  );

  return { nodes: generatedNodes, paths: generatedPaths };
}
