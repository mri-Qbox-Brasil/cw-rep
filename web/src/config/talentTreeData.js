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
    video: "https://www.w3schools.com/html/mov_bbb.mp4", // Exemplo de path de video
    position: { x: 0, y: 700 }, // Starting lower for infinite growth upwards
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
    position: { x: 0, y: 550 },
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
    position: { x: 0, y: 400 },
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
    position: { x: -80, y: 250 },
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
    position: { x: 80, y: 250 },
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
    position: { x: -180, y: 620 },
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
    position: { x: -300, y: 480 },
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
    position: { x: -140, y: 450 },
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
    position: { x: -400, y: 320 },
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
    position: { x: 180, y: 620 },
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
    position: { x: 300, y: 480 },
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
    position: { x: 140, y: 450 },
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
    position: { x: 400, y: 320 },
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
    let baseAngle = -90; // Upwards
    if (n.position.x < 0) baseAngle = -120; // Leaning left
    if (n.position.x > 0) baseAngle = -60; // Leaning right
    nodesMap.set(n.id, { ...n, connections: [...(n.connections || [])], growAngle: baseAngle });
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
        
        const newCost = currentNode.cost + parentCost;

        // Calculate Position based on Angle
        // We branch off to the left and right of the node's current `growAngle`
        const branchSpread = 35; // Expand 35 degrees left and right
        const distance = 130;    // Move 130px away

        const angleLeft = currentNode.growAngle - branchSpread;
        const angleRight = currentNode.growAngle + branchSpread;

        const radLeft = (angleLeft * Math.PI) / 180;
        const radRight = (angleRight * Math.PI) / 180;

        const posLeftX = currentNode.position.x + Math.cos(radLeft) * distance;
        const posLeftY = currentNode.position.y + Math.sin(radLeft) * distance;

        const posRightX = currentNode.position.x + Math.cos(radRight) * distance;
        const posRightY = currentNode.position.y + Math.sin(radRight) * distance;

        // Create Child 1 (Left Branch)
        const child1Id = `${currentNode.id}_fL`;
        const child1 = {
          id: child1Id,
          icon: "all_inclusive",
          title: `Trilha L do Infinito`,
          description: "Continuação profunda da sua maestria.",
          cost: newCost,
          maxLevel: 5,
          color: currentNode.color,
          size: "small",
          position: { x: posLeftX, y: posLeftY },
          growAngle: angleLeft, // Inherits the leaning angle
          connections: [],
          requires: [currentNode.id]
        };

        // Create Child 2 (Right Branch)
        const child2Id = `${currentNode.id}_fR`;
        const child2 = {
          id: child2Id,
          icon: "emergency",
          title: `Trilha R do Infinito`,
          description: "Despertando potenciais esquecidos.",
          cost: newCost,
          maxLevel: 5,
          color: currentNode.color,
          size: "small",
          position: { x: posRightX, y: posRightY },
          growAngle: angleRight, // Inherits the leaning angle
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
