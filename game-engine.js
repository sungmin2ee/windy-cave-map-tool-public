// Board rules shared by the editor Playtest and the standalone puzzle.
export function createGameEngine(getProject) {
  const SPAWNER_ID = "spawner";

  const DDUNG_PANELS = {
    "ddung-attack-row": ["Q", "가로 공격 패널", "↔", "panel-attack"],
    "ddung-attack-column": ["A", "세로 공격 패널", "↕", "panel-attack"],
    "ddung-attack-cross": ["Z", "십자 공격 패널", "✚", "panel-attack"],
    "ddung-attack-turn": ["Y", "회전 공격 패널", "⟳", "panel-turn"],
    "ddung-fire-up": ["1", "위쪽 불꽃 패널", "↑", "panel-fire"],
    "ddung-fire-right": ["2", "오른쪽 불꽃 패널", "→", "panel-fire"],
    "ddung-fire-down": ["3", "아래쪽 불꽃 패널", "↓", "panel-fire"],
    "ddung-fire-left": ["4", "왼쪽 불꽃 패널", "←", "panel-fire"],
    "ddung-fire-single": ["r", "한 칸 불꽃 패널", "↑", "panel-fire-single"],
    "ddung-feng-horizontal": ["?", "가로 Feng", "↔", "ddung-feng"],
    "ddung-feng-vertical": ["a", "세로 Feng", "↕", "ddung-feng"],
    "ddung-feng-large-row": ["(", "큰 가로 Feng", "↔", "ddung-feng"],
    "ddung-feng-large-column": ["b", "큰 세로 Feng", "↕", "ddung-feng"],
  };

  const DDUNG_JAM_COLORS = {
    "ddung-jam-blue": "blue", "ddung-jam-green": "green", "ddung-jam-orange": "orange",
    "ddung-jam-pink": "red", "ddung-jam-purple": "purple", "ddung-jam-yellow": "yellow",
  };

  const DDUNG_PANEL_TILES = {
    M: "ddung-bomb-panel", J: "ddung-chocolate", k: "ddung-jam-yellow", l: "ddung-jam-blue",
    m: "ddung-jam-orange", n: "ddung-jam-green", o: "ddung-jam-pink", p: "ddung-jam-purple",
  };

  const DDUNG_SOLID_PANELS = new Set(Object.values(DDUNG_PANEL_TILES));

  const DEFAULT_TERRAIN_RULES = {
    "ddung-bomb-panel": { blocksFlow: true, reaction: "splash", durability: 6 },
    ...Object.fromEntries(Object.keys(DDUNG_JAM_COLORS).map((id) => [id, { blocksFlow: true, reaction: "none", durability: 3 }])),
    "ddung-chocolate": { blocksFlow: true, reaction: "splash", durability: 1 },
    floor: { blocksFlow: false, reaction: "none", durability: 1 },
    wall: { blocksFlow: true, reaction: "none", durability: 1 },
    ice: { blocksFlow: false, reaction: "adjacent", durability: 2 },
    pit: { blocksFlow: true, reaction: "none", durability: 1 },
    conveyor: { blocksFlow: false, reaction: "none", durability: 1 },
    "ddung-web": { blocksSwap: true, blocksFlow: false, reaction: "under", durability: 1 },
    "ddung-dust": { blocksFlow: false, reaction: "adjacent", durability: 1 },
    "ddung-oak": { blocksFlow: true, reaction: "adjacent", durability: 2 },
    "ddung-stone": { blocksFlow: false, reaction: "under", durability: 1 },
    "ddung-stone-thick": { blocksFlow: false, reaction: "under", durability: 2 },
    "ddung-water": { blocksFlow: false, reaction: "under", durability: 1 },
    "ddung-frost": { locksBlock: true, blocksFlow: false, reaction: "splash", durability: 3 },
    "ddung-ice": { locksBlock: true, blocksFlow: false, reaction: "splash", durability: 2 },
    "ddung-heather-small": { locksBlock: true, blocksFlow: false, reaction: "splash", durability: 1 },
    "ddung-heather-large": { locksBlock: true, blocksFlow: false, reaction: "splash", durability: 15 },
    "ddung-jelly": { blocksFlow: false, reaction: "under", durability: 1 },
  };

  const deepCopy = (value) => JSON.parse(JSON.stringify(value));

  const clampNumber = (value, fallback, min = 0, max = 999) => {
    const number = Number(value);
    return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
  };

  function isDdungSource(source) {
    return /^DDUNG MapInfo\b/.test(String(source?.format || ""));
  }

  function ddungObjectiveType(objective) {
    const match = /^ddung-target-\d+-(\d+)$/.exec(objective.id);
    return match ? Number(match[1]) : null;
  }

  function ddungUsesBoardCount(type) {
    return type >= 7 && type <= 37 && type !== 11 && type !== 12;
  }

  function ddungGoalLimitation(cave, objective) {
    if (!isDdungSource(cave.externalSource)) return null;
    const type = ddungObjectiveType(objective);
    if (type == null) return null;
    if (type >= 1 && type <= 6) {
      const specialColors = cave.externalSource.specialColors;
      if (!Array.isArray(specialColors)) return "원본 JSON을 다시 가져와 특수 블록 목표 여부를 확인하세요.";
      return null;
    }
    if (type === 11 || type === 12) return null;
    if (type === 9 && objective.targetId !== "ddung-dust-piece") return "먼지 목표를 판정하려면 원본 JSON을 다시 가져오세요.";
    if (type === 36) return ddungJellyCells(cave).size ? null : "원본 젤리 그룹 좌표가 필요합니다.";
    if (type === 7) return cave.externalSource.boxLayoutParsed ? null : "철 상자 배치를 확인하려면 원본 JSON을 다시 가져오세요.";
    if ([8, 9, 10, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37].includes(type)) return null;
    return "원본 전용 오브젝트 동작";
  }

  function matchesObjectiveAsset(objective, id) {
    return id === objective.targetId || (objective.layer === "gimmick" && (ddungGimmickBase(id) === objective.targetId ||
        objective.targetId === "ddung-feng" && id?.startsWith("ddung-feng-"))) ||
      (objective.layer === "terrain" && objective.targetId === "ddung-oak" && id === "ddung-frost") ||
      (objective.layer === "terrain" && objective.targetId === "ddung-stone" && id === "ddung-stone-thick") || (objective.layer === "gimmick" &&
      objective.targetId === "ddung-box" && ddungObjectiveType(objective) === 7 && id === "ddung-iron-box");
  }

  function countObjectiveAssets(cave, objective) {
    if (objective.layer === "terrain" && objective.targetId === "ddung-jelly") {
      const cells = ddungJellyCells(cave);
      if (cells.size) return new Set([...cells].filter(([index]) => cave.layers.terrain[index] === "ddung-jelly")
        .map(([, cell]) => cell.group)).size;
    }
    return cave.layers[objective.layer].filter((id, index) => matchesObjectiveAsset(objective, id) &&
      (id !== "ddung-heather-large" || heatherGroup(cave, index)[0] === index) &&
      (objective.layer !== "gimmick" || ddungGimmickGroup(cave, index)[0] === index)).length;
  }

  function resolvedObjectiveCount(cave, objective) {
    return objective.countMode === "auto-map" ? countObjectiveAssets(cave, objective) : objective.count;
  }

  function isExcluded(cave, index) {
    return cave.excludedCells?.includes(index) ?? false;
  }

  function seededRandom(seedText) {
    let hash = 1779033703 ^ seedText.length;
    for (let i = 0; i < seedText.length; i += 1) {
      hash = Math.imul(hash ^ seedText.charCodeAt(i), 3432918353);
      hash = hash << 13 | hash >>> 19;
    }
    return randomFromHash(hash);
  }

  function randomFromHash(hash) {
    const random = () => {
      hash = Math.imul(hash ^ hash >>> 16, 2246822507);
      hash = Math.imul(hash ^ hash >>> 13, 3266489909);
      const value = (hash ^= hash >>> 16) >>> 0;
      return value / 4294967296;
    };
    random.copy = () => randomFromHash(hash);
    return random;
  }

  function placeGenerationSpawners(cave) {
    const gimmicks = cave.layers.gimmick;
    for (const [index, id] of gimmicks.entries()) if (id === SPAWNER_ID) gimmicks[index] = null;
    cave.generatedSpawnerOverlaps = [];
    const directions = ddungCellGravities(cave);
    const sources = directions ? localSpawnEdges(cave, directions, true)
      : gravityLines(cave).map((line) => line.slice().reverse().find((cell) => !isBarrier(cave, cell)));
    for (const index of sources) {
      if (index === undefined) continue;
      if (!gimmicks[index]) gimmicks[index] = SPAWNER_ID;
      else cave.generatedSpawnerOverlaps.push(index);
    }
  }

  function usesDdungGeneration(cave) {
    if (cave.externalSource) return isDdungSource(cave.externalSource);
    const imported = getProject().caves.filter((level) => level.externalSource);
    return imported.length > 0 && imported.every((level) => isDdungSource(level.externalSource)) &&
      cave.usableBlocks.every((id) => DDUNG_COLOR_IDS.includes(id));
  }

  function blockMatchKey(cave, index) {
    const color = cave.layers.block[index];
    return isDdungSource(cave.externalSource) && String(cave.playtestPieces?.[index]?.type) === "6"
      ? `seal:${color}` : color;
  }

  function findMatches(cave, runs, protectedCells) {
    const matches = new Set();
    const blocks = cave.layers.block.map((color, index) =>
      color && color !== "ddung-dust-piece" && !isDdungTreasure(color) && !protectedCells?.has(index) && !isBarrier(cave, index) ? blockMatchKey(cave, index) : null);
    for (let y = 0; y < cave.height; y += 1) {
      let start = 0;
      for (let x = 1; x <= cave.width; x += 1) {
        const current = x < cave.width ? blocks[y * cave.width + x] : null;
        const first = blocks[y * cave.width + start];
        if (current === first && first) continue;
        if (first && x - start >= 3) {
          const cells = runs ? [] : null;
          for (let fill = start; fill < x; fill += 1) {
            const index = y * cave.width + fill;
            matches.add(index);
            cells?.push(index);
          }
          if (runs) runs.push({ axis: "horizontal", cells });
        }
        start = x;
      }
    }
    for (let x = 0; x < cave.width; x += 1) {
      let start = 0;
      for (let y = 1; y <= cave.height; y += 1) {
        const current = y < cave.height ? blocks[y * cave.width + x] : null;
        const first = blocks[start * cave.width + x];
        if (current === first && first) continue;
        if (first && y - start >= 3) {
          const cells = runs ? [] : null;
          for (let fill = start; fill < y; fill += 1) {
            const index = fill * cave.width + x;
            matches.add(index);
            cells?.push(index);
          }
          if (runs) runs.push({ axis: "vertical", cells });
        }
        start = y;
      }
    }
    if (allowsSquareMatches(cave)) {
      for (let y = 0; y < cave.height - 1; y += 1) {
        for (let x = 0; x < cave.width - 1; x += 1) {
          const topLeft = y * cave.width + x;
          const color = blocks[topLeft];
          if (!color) continue;
          const cells = [topLeft, topLeft + 1, topLeft + cave.width, topLeft + cave.width + 1];
          if (!cells.every((index) => blocks[index] === color)) continue;
          cells.forEach((index) => matches.add(index));
          runs?.push({ axis: "square", cells });
        }
      }
    }
    for (const shape of getProject()?.specialPieceRules?.customShapes || []) {
      for (const [index, color] of blocks.entries()) {
        if (!color) continue;
        const [dx, dy] = shape.cells[0];
        const cells = customMatchCells(blocks, cave, shape.cells, index % cave.width - dx,
          Math.floor(index / cave.width) - dy, color);
        if (!cells) continue;
        for (const cell of cells) matches.add(cell);
        runs?.push({ axis: "custom", cells, type: shape.type });
      }
    }
    return matches;
  }

  function customMatchCells(blocks, cave, offsets, x, y, color, placedIndex = -1) {
    const cells = [];
    for (const [dx, dy] of offsets) {
      const col = x + dx;
      const row = y + dy;
      if (col < 0 || col >= cave.width || row < 0 || row >= cave.height) return null;
      const index = row * cave.width + col;
      if (index !== placedIndex && blocks[index] !== color) return null;
      cells.push(index);
    }
    return cells;
  }

  function neighborsOf(cave, index) {
    const x = index % cave.width;
    const neighbors = [];
    if (x > 0) neighbors.push(index - 1);
    if (x < cave.width - 1) neighbors.push(index + 1);
    if (index >= cave.width) neighbors.push(index - cave.width);
    if (index + cave.width < cave.width * cave.height) neighbors.push(index + cave.width);
    return neighbors;
  }

  function createObjectiveProgress(cave) {
    return cave.objectives.map((objective) => ({
      id: objective.id,
      current: 0,
      target: resolvedObjectiveCount(cave, objective),
    }));
  }

  function advanceObjectives(state, layer, targetId, amount = 1) {
    state.cave.objectives.forEach((objective, index) => {
      if (objective.layer !== layer || !matchesObjectiveAsset(objective, targetId)) return;
      const progress = state.objectiveProgress[index];
      progress.current = Math.min(progress.target, progress.current + amount);
    });
  }

  function clearConditionMet(state) {
    if (state.scoreTarget !== null) return state.blocksRemoved * state.pointsPerBlock >= state.scoreTarget;
    return !state.goalLimitations.some(Boolean) && state.objectiveProgress.length > 0 &&
      state.objectiveProgress.every((progress, index) => {
        const objective = state.cave.objectives[index];
        if (isDdungSource(state.cave.externalSource) && ddungUsesBoardCount(ddungObjectiveType(objective)) &&
            objective.countMode === "auto-map") return countObjectiveAssets(state.cave, objective) === 0;
        return progress.current >= progress.target;
      });
  }

  const GRAVITY_VECTORS = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };

  const DDUNG_GRAVITY = { 0: "up", 1: "down", 2: "left", 3: "right" };

  function ddungCellGravities(cave) {
    const raw = cave.externalSource?.rawMap;
    if (!isDdungSource(cave.externalSource) || Number(raw?.size) !== cave.width || cave.height !== cave.width ||
        typeof raw.gravitys !== "string" || raw.gravitys.length !== cave.width * cave.height) return null;
    const directions = Array.from({ length: cave.width * cave.height }, (_, index) => {
      const offset = (cave.height - 1 - Math.floor(index / cave.width)) * cave.width + index % cave.width;
      return DDUNG_GRAVITY[raw.gravitys[offset]] || cave.gravity;
    });
    return directions.some((direction) => direction !== cave.gravity) ? directions : null;
  }

  function offsetCell(cave, index, dx, dy) {
    const x = index % cave.width + dx;
    const y = Math.floor(index / cave.width) + dy;
    return x >= 0 && x < cave.width && y >= 0 && y < cave.height ? y * cave.width + x : -1;
  }

  function localSpawnEdges(cave, directions, skipBarriers = false) {
    return directions.flatMap((direction, index) => {
      if (isBarrier(cave, index)) return [];
      const [dx, dy] = GRAVITY_VECTORS[direction];
      let upstream = offsetCell(cave, index, -dx, -dy);
      while (skipBarriers && upstream >= 0 && isBarrier(cave, upstream)) {
        upstream = offsetCell(cave, upstream, -dx, -dy);
      }
      return upstream < 0 ? [index] : [];
    });
  }

  function gravityLines(cave) {
    const lines = [];
    if (cave.gravity === "down" || cave.gravity === "up") {
      for (let x = 0; x < cave.width; x += 1) {
        const line = [];
        if (cave.gravity === "down") for (let y = cave.height - 1; y >= 0; y -= 1) line.push(y * cave.width + x);
        else for (let y = 0; y < cave.height; y += 1) line.push(y * cave.width + x);
        lines.push(line);
      }
    } else {
      for (let y = 0; y < cave.height; y += 1) {
        const line = [];
        if (cave.gravity === "right") for (let x = cave.width - 1; x >= 0; x -= 1) line.push(y * cave.width + x);
        else for (let x = 0; x < cave.width; x += 1) line.push(y * cave.width + x);
        lines.push(line);
      }
    }
    return lines;
  }

  function ddungBoxDurability(cave, index) {
    const id = cave.layers.gimmick[index];
    return id === "ddung-iron-box" || id === "ddung-box" ? 3 : 0;
  }

  function isSwapBlocked(cave, index) {
    return isBarrier(cave, index) || Boolean(cave.terrainRules?.[cave.layers.terrain[index]]?.blocksSwap);
  }

  const DDUNG_GIMMICK_HITS = Object.freeze({
    "ddung-mouse-panel": 4, "ddung-dungs": 4, "ddung-bulldozer": 4, "ddung-mayor-small": 2,
    "ddung-mayor-large": 15, "ddung-spider-cave": 6, "ddung-bee": 7, "ddung-feng": 4,
    "ddung-octo": 1, "ddung-bee-up": 3, "arrow-up": 5, "arrow-down": 5,
  });

  function isDdungSmallMayor(cave, index) {
    return cave.layers.gimmick[index] === "ddung-mayor-small";
  }

  function ddungPanelId(tile) {
    return Object.keys(DDUNG_PANELS).find((id) => DDUNG_PANELS[id][0] === tile);
  }

  function ddungGimmickBase(id) {
    return id?.replace(/:part[0-3]$/, "") ?? id;
  }

  function ddungGimmickTile(cave, index) {
    const id = ddungGimmickBase(cave.layers.gimmick[index]);
    const tile = ddungCellSource(cave, index)?.tile;
    return DDUNG_PANELS[id]?.[0] ?? (id === "ddung-feng" && !"?()[]abcde".includes(tile ?? "!") ? "?" : tile);
  }

  function ddungGimmickGroup(cave, index) {
    const id = cave.layers.gimmick[index];
    const part = /^(ddung-(?:mayor-large|feng-large-row|feng-large-column)):part([0-3])$/.exec(id ?? "");
    if (part) {
      const offset = Number(part[2]);
      const anchor = index - offset % 2 - (offset >= 2 ? cave.width : 0);
      const cells = [anchor, anchor + 1, anchor + cave.width, anchor + cave.width + 1];
      return anchor >= 0 && anchor % cave.width < cave.width - 1 && cells.every((cell, position) =>
        cave.layers.gimmick[cell] === `${part[1]}:part${position}`) ? cells : [index];
    }
    const tile = ddungCellSource(cave, index)?.tile;
    const pattern = id === "ddung-mayor-large" ? "ghij" :
      id === "ddung-feng" && tile && "()[]bcde".includes(tile) ? ("()[]".includes(tile) ? "()[]" : "bcde") : "";
    const offset = tile && pattern ? pattern.indexOf(tile) : -1;
    if (offset < 0) return [index];
    const anchor = index - (offset % 2) - (offset >= 2 ? cave.width : 0);
    const cells = [anchor, anchor + 1, anchor + cave.width, anchor + cave.width + 1];
    return anchor >= 0 && anchor % cave.width < cave.width - 1 && cells.every((cell, position) =>
      cave.layers.gimmick[cell] === id && !isExcluded(cave, cell) && ddungCellSource(cave, cell)?.tile === pattern[position]) ? cells : [index];
  }

  function ddungGimmickDurability(cave, index) {
    const id = ddungGimmickBase(cave.layers.gimmick[index]);
    const tile = ddungGimmickTile(cave, index);
    if (DDUNG_PANELS[id] && "AQZY1234r".includes(tile)) return tile === "r" ? 2 : 5;
    if (id === "ddung-feng-horizontal" || id === "ddung-feng-vertical") return 4;
    if (id === "ddung-feng-large-row" || id === "ddung-feng-large-column") return 7;
    if (id === "switch" && isDdungSource(cave.externalSource)) {
      if (tile === "r") return 2;
      if (tile && "YZ1234".includes(tile)) return 5;
    }
    if (id === "ddung-octo" && tile && "⑵⑶⑷⑸⑹".includes(tile)) return "⑵⑶⑷⑸⑹".indexOf(tile) + 1;
    if (id === "ddung-feng" && ddungGimmickGroup(cave, index).length > 1) return 7;
    return Object.hasOwn(DDUNG_GIMMICK_HITS, id) ? DDUNG_GIMMICK_HITS[id] : 0;
  }

  function isDdungGimmickBarrier(cave, index) {
    return ddungGimmickDurability(cave, index) > 0;
  }

  function ddungPanelAttack(cave, index, tile, horizontal) {
    const row = [[-1, 0], [1, 0]];
    const column = [[0, -1], [0, 1]];
    const rays = ({
      Q: row, A: column, Z: [...row, ...column], Y: horizontal ? row : column,
      1: [[-1,-1],[0,-1],[1,-1]], 2: [[1,-1],[1,0],[1,1]],
      3: [[-1,1],[0,1],[1,1]], 4: [[-1,-1],[-1,0],[-1,1]], r: [[0,-1]],
      "?": row, "(": row, a: column, b: column,
    })[tile] ?? [];
    const hits = new Set();
    const origins = ddungGimmickGroup(cave, index);
    for (const origin of origins) {
      for (const [dx, dy] of rays) {
        const maxDistance = tile === "r" ? 1 : Math.max(cave.width, cave.height);
        for (let step = 1; step <= maxDistance; step++) {
          const x = origin % cave.width + dx * step;
          const y = Math.floor(origin / cave.width) + dy * step;
          if (x < 0 || x >= cave.width || y < 0 || y >= cave.height) break;
          const cell = y * cave.width + x;
          if (!isExcluded(cave, cell) && !origins.includes(cell)) hits.add(cell);
        }
      }
    }
    return hits;
  }

  function ddungGimmickAttack(cave, index, id) {
    if (id !== "ddung-dungs" && id !== "ddung-bulldozer") return [];
    const x = index % cave.width;
    const start = index - x;
    const direction = x < (cave.width <= 8 ? 4 : 5) ? 1 : -1;
    const step = direction * (id === "ddung-dungs" ? 2 : 1);
    const hits = [];
    for (let col = x + step; col >= 0 && col < cave.width; col += step) {
      if (!isExcluded(cave, start + col)) hits.push(start + col);
    }
    return hits;
  }

  function isBarrier(cave, index) {
    if (index < 0 || index >= cave.width * cave.height || isExcluded(cave, index)) return true;
    if (ddungBoxDurability(cave, index) || isDdungGimmickBarrier(cave, index) ||
        cave.gimmickRules?.[cave.layers.gimmick[index]]?.blocksFlow) return true;
    const terrainId = cave.layers.terrain[index];
    const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
    return DDUNG_SOLID_PANELS.has(terrainId) || Boolean(rule?.blocksFlow || rule?.locksBlock);
  }

  function ddungWarpRoutes(cave) {
    const source = cave.externalSource;
    if (!isDdungSource(source) || cave.width !== Number(source.rawMap?.size) || cave.height !== cave.width) return new Map();
    const hasMarker = (index, id) => cave.layers.gimmick[index] === id || ddungMarkersAt(cave, index).includes(id);
    const routes = new Map();
    for (const group of ddungPositionGroups(source.rawMap.warps, 4)) {
      if (!/^\d{4}$/.test(group)) continue;
      const [x1, y1, x2, y2] = [...group].map(Number);
      const entry = ddungGridIndex(cave.width, x1, y1);
      const exit = ddungGridIndex(cave.width, x2, y2);
      if (entry < 0 || exit < 0 || entry === exit || routes.has(exit)) continue;
      if (hasMarker(entry, "teleport-a") && hasMarker(exit, "teleport-b")) routes.set(exit, entry);
    }
    return routes;
  }

  function settleStraight(cave, trackMove, warpRoutes) {
    const pieces = cave.playtestPieces;
    for (const line of gravityLines(cave)) {
      let segment = [];
      const settle = () => {
        const values = segment.filter((index) => cave.layers.block[index])
          .map((index) => ({ index, block: cave.layers.block[index], piece: pieces?.[index] }));
        if (trackMove) {
          values.forEach(({ index }, position) => {
            if (index !== segment[position]) trackMove(index, segment[position]);
          });
        }
        segment.forEach((index, position) => {
          cave.layers.block[index] = values[position]?.block ?? null;
          if (pieces) pieces[index] = values[position]?.piece ?? null;
        });
        segment = [];
      };
      for (const index of line) {
        if (isBarrier(cave, index)) settle();
        else {
          segment.push(index);
          if (warpRoutes.has(index)) settle();
        }
      }
      settle();
    }
  }

  function flowOffsets(cave, state, gravity = cave.gravity) {
    const directions = {
      down: [[-1, 1], [1, 1]],
      up: [[-1, -1], [1, -1]],
      left: [[-1, -1], [-1, 1]],
      right: [[1, -1], [1, 1]],
    };
    const [first, second] = directions[gravity];
    if (cave.flowRule === "none") return [];
    if (cave.flowRule === "right-first") return [second, first];
    if (cave.flowRule === "alternate") {
      const reverse = state.flowTurn % 2 === 1;
      state.flowTurn += 1;
      return reverse ? [second, first] : [first, second];
    }
    if (cave.flowRule === "seeded-random") return state.random() < 0.5 ? [first, second] : [second, first];
    return [first, second];
  }

  function settleCellGravity(cave, state, trackMove, warpRoutes, directions) {
    const order = gravityLines(cave).flat();
    const visited = new Map();
    const blocks = cave.layers.block;
    let moves = 0;
    for (let pass = 0; pass < blocks.length; pass++) {
      let changed = false;
      for (const target of order) {
        if (blocks[target] || isBarrier(cave, target)) continue;
        const [dx, dy] = GRAVITY_VECTORS[directions[target]];
        const upstream = offsetCell(cave, target, -dx, -dy);
        const warp = warpRoutes.get(target);
        let donors = [warp ?? upstream];
        if (warp === undefined && upstream >= 0 && isBarrier(cave, upstream) && state && cave.flowRule !== "none") {
          donors = flowOffsets(cave, state, directions[target]).map(([x, y]) => offsetCell(cave, target, -x, -y));
        }
        const donor = donors.find((index) => index >= 0 && blocks[index] &&
          !isBarrier(cave, index) && !visited.get(index)?.has(target));
        if (donor === undefined) continue;
        const path = visited.get(donor) ?? new Set([donor]);
        path.add(target);
        visited.delete(donor);
        visited.set(target, path);
        trackMove?.(donor, target);
        swapPlaytestBlocks(cave, donor, target);
        moves += 1;
        changed = true;
      }
      if (!changed) break;
    }
    return moves;
  }

  function applyGravity(cave, state, trackMove) {
    const warpRoutes = ddungWarpRoutes(cave);
    const directions = ddungCellGravities(cave);
    if (directions) return settleCellGravity(cave, state, trackMove, warpRoutes, directions);
    settleStraight(cave, trackMove, warpRoutes);
    if (!state) return 0;
    const [directX, directY] = GRAVITY_VECTORS[cave.gravity];
    let flowMoves = 0;
    for (let pass = 0; pass < cave.width * cave.height * 4; pass += 1) {
      let moved = false;
      for (const [exit, entry] of warpRoutes) {
        if (cave.layers.block[exit] || !cave.layers.block[entry] || isBarrier(cave, entry) || isBarrier(cave, exit)) continue;
        trackMove?.(entry, exit);
        swapPlaytestBlocks(cave, entry, exit);
        moved = true;
        flowMoves += 1;
      }
      const order = cave.flowRule === "none" ? [] : gravityLines(cave).flat();
      for (const index of order) {
        if (!cave.layers.block[index]) continue;
        const x = index % cave.width;
        const y = Math.floor(index / cave.width);
        const nextX = x + directX;
        const nextY = y + directY;
        if (nextX < 0 || nextX >= cave.width || nextY < 0 || nextY >= cave.height) continue;
        const directIndex = nextY * cave.width + nextX;
        const blockedAhead = isBarrier(cave, directIndex);
        const upstreamIndex = index - (directY * cave.width + directX);
        if (!blockedAhead && !neighborsOf(cave, index).some((side) =>
          side !== directIndex && side !== upstreamIndex && isBarrier(cave, side))) continue;
        const offsets = flowOffsets(cave, state);
        for (const [offsetX, offsetY] of offsets) {
          const targetX = x + offsetX;
          const targetY = y + offsetY;
          if (targetX < 0 || targetX >= cave.width || targetY < 0 || targetY >= cave.height) continue;
          const targetIndex = targetY * cave.width + targetX;
          if (isBarrier(cave, targetIndex) || warpRoutes.has(targetIndex) || cave.layers.block[targetIndex]) continue;
          const targetUpstream = (targetY - directY) * cave.width + targetX - directX;
          // A gap below a barrier can receive a block from the neighboring lane.
          if (!blockedAhead && !isBarrier(cave, targetUpstream)) continue;
          trackMove?.(index, targetIndex);
          swapPlaytestBlocks(cave, targetIndex, index);
          flowMoves += 1;
          moved = true;
          break;
        }
      }
      if (!moved) break;
      settleStraight(cave, trackMove, warpRoutes);
    }
    return flowMoves;
  }

  function chooseRefillColor(state, colors) {
    const mode = state.cave.levelSettings?.spawnMode ?? 1;
    if (mode === 0) return colors[Math.floor(state.random() * colors.length)];
    const weights = colors.map((color) => blockWeight(state.cave, color));
    const total = weights.reduce((sum, weight) => sum + weight, 0);
    if (!total) return null;
    const offsets = state.spawnOffsets ??= {};
    const roll = Math.floor(state.random() * 100);
    let lower = 0;
    let selected = -1;
    for (const [index, color] of colors.entries()) {
      const upper = lower + weights[index] * 100 / total + (mode === 2 ? offsets[color] || 0 : 0);
      if (roll >= lower && roll < upper) {
        selected = index;
        break;
      }
      lower = upper;
    }
    // DDUNG falls back to the first color without adjusting probabilities.
    if (selected < 0) return colors[0];
    if (mode === 2) {
      for (const [index, color] of colors.entries()) {
        offsets[color] = (offsets[color] || 0) + (index === selected ? 1 - colors.length : 1);
      }
    }
    return colors[selected];
  }

  function isDdungTreasure(id) {
    return id === "ddung-treasure-1" || id === "ddung-treasure-2";
  }

  function chooseDdungTreasure(state) {
    if (!state.treasureGoals.length) return null;
    const blocks = state.cave.layers.block;
    const onBoard = blocks.filter(isDdungTreasure);
    if (onBoard.length >= 2) return null;
    const eligible = state.treasureGoals.filter(({ index, targetId }) => {
      const progress = state.objectiveProgress[index];
      return progress.current + onBoard.filter((id) => id === targetId).length < progress.target;
    });
    if (!eligible.length) return null;
    const chances = [0, 0, 50, 50, 100];
    if (state.treasureRandom() * 100 >= chances[Math.min(state.treasureMisses++, chances.length - 1)]) return null;
    state.treasureMisses = 0;
    return eligible[Math.floor(state.treasureRandom() * eligible.length)].targetId;
  }

  function ddungMarkersAt(cave, index) {
    const rawSize = Number(cave.externalSource?.rawMap?.size);
    const original = cave.width === rawSize && cave.height === rawSize
      ? cave.externalSource?.overlappingMarkers?.[index] ?? [] : [];
    if (!Array.isArray(cave.generatedSpawnerOverlaps)) return original;
    const markers = original.filter((id) => id !== SPAWNER_ID);
    if (cave.generatedSpawnerOverlaps.includes(index)) markers.push(SPAWNER_ID);
    return markers;
  }

  function collectDdungTreasure(state) {
    if (!state.treasureGoals.length) return 0;
    const { cave } = state;
    const isExit = (id, index) => id === "exit" || ddungMarkersAt(cave, index).includes("exit");
    const explicit = cave.layers.gimmick.some(isExit);
    const edge = explicit ? null : new Set(gravityLines(cave).map((line) => line[0]));
    let collected = 0;
    cave.layers.block.forEach((id, index) => {
      if (!isDdungTreasure(id)) return;
      const atExit = explicit ? isExit(cave.layers.gimmick[index], index) : edge.has(index);
      if (!atExit) return;
      advanceObjectives(state, "item", id);
      cave.layers.block[index] = null;
      collected += 1;
    });
    return collected;
  }

  function spawnPlaytestBlock(state, index, color) {
    const { cave } = state;
    cave.layers.block[index] = color;
    if (state.sealRandom && cave.externalSource.specialColors.includes(color) && state.sealRandom() < 0.5) {
      cave.playtestPieces[index] = { type: "6", color, name: "봉인 블록", symbol: "✚" };
    }
  }

  function refillBlocks(state, origins, trackMove) {
    const { cave } = state;
    const colors = cave.usableBlocks;
    if (!colors.length) return;
    if (Array.isArray(cave.generatedSpawnerOverlaps)) placeGenerationSpawners(cave);
    const spawners = cave.layers.gimmick.flatMap((id, index) =>
      id === SPAWNER_ID || ddungMarkersAt(cave, index).includes(SPAWNER_ID) ? [index] : []);
    const sourceSet = new Set(spawners);
    const directions = ddungCellGravities(cave);
    const sources = Array.isArray(cave.generatedSpawnerOverlaps) ? spawners
      : directions ? [...new Set([...spawners, ...localSpawnEdges(cave, directions)])]
      : isDdungSource(cave.externalSource) ? gravityLines(cave).flatMap((line) => {
          const marked = line.filter((index) => sourceSet.has(index));
          return marked.length ? marked : [line.at(-1)];
        }) : spawners.length ? spawners : null;
    if (!sources) {
      cave.layers.block.forEach((block, index) => {
        if (block || isBarrier(cave, index)) return;
        spawnPlaytestBlock(state, index, chooseRefillColor(state, colors));
        if (cave.layers.block[index]) origins?.set(index, { from: index, spawned: true });
      });
      return;
    }
    // Each pass inserts only at the sources, then moves the new blocks with normal gravity.
    for (let pass = 0; pass < cave.layers.block.length; pass += 1) {
      let spawned = false;
      for (const index of sources) {
        if (cave.layers.block[index] || isBarrier(cave, index)) continue;
        const block = chooseDdungTreasure(state) ?? chooseRefillColor(state, colors);
        if (!block) continue;
        spawnPlaytestBlock(state, index, block);
        origins?.set(index, { from: index, spawned: true });
        spawned = true;
      }
      if (!spawned) break;
      applyGravity(cave, state, trackMove);
      collectDdungTreasure(state);
    }
  }

  function heatherGroup(cave, index) {
    const tile = ddungCellSource(cave, index)?.tile;
    const offset = { t: 0, u: 1, v: cave.width, w: cave.width + 1 }[tile];
    if (offset === undefined) return [index];
    const anchor = index - offset;
    const group = [anchor, anchor + 1, anchor + cave.width, anchor + cave.width + 1];
    return anchor % cave.width < cave.width - 1 &&
      group.every((cell, position) => !isExcluded(cave, cell) &&
        cave.layers.terrain[cell] === "ddung-heather-large" && ddungCellSource(cave, cell)?.tile === "tuvw"[position])
      ? group : [index];
  }

  function ddungJellyCells(cave) {
    const raw = cave.externalSource?.rawMap;
    const size = Number(raw?.size);
    const cells = new Map();
    if (!isDdungSource(cave.externalSource) || !size || !cave.width) return cells;
    for (const token of ddungPositionGroups(raw.jellys, 5)) {
      const x = Number(token[0]);
      const y = Number(token[1]);
      const durability = Number(token[2]);
      if (x < size && y < size && x < cave.width && y < cave.height && durability > 0) {
        cells.set(y * cave.width + x, { group: token.slice(3), durability });
      }
    }
    return cells;
  }

  function terrainDurabilityAt(cave, index, rule, jellyCells) {
    if (cave.layers.terrain[index] === "ddung-jelly") {
      const member = (jellyCells ?? ddungJellyCells(cave)).get(index);
      if (member) return member.durability;
    }
    if (cave.layers.terrain[index] === "ddung-frost" && rule.durability === DEFAULT_TERRAIN_RULES["ddung-frost"].durability) {
      const tile = ddungCellSource(cave, index)?.tile;
      const variant = tile ? "⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥".indexOf(tile) : -1;
      if (variant >= 0) return variant % 5 + 1;
    }
    return rule.durability;
  }

  function* terrainHitResults(state, matches, forcedTerrain, removedBlocks, bombPanelIndex, specialHits = new Set()) {
    const cave = state.cave;
    const damagedGroups = new Set();
    const jellyCells = state.ddungJellyCells;
    for (let index = 0; index < cave.layers.terrain.length; index += 1) {
      if (isExcluded(cave, index)) continue;
      const terrainId = cave.layers.terrain[index];
      if (Object.hasOwn(DDUNG_JAM_COLORS, terrainId)) continue;
      const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
      const group = terrainId === "ddung-heather-large" ? heatherGroup(cave, index) : [index];
      const anchor = group[0];
      if (damagedGroups.has(anchor)) continue;
      const forced = group.some((cell) => forcedTerrain.has(cell));
      if (!forced && (!rule || rule.reaction === "none")) continue;
      const direct = group.filter((cell) => rule?.reaction !== "adjacent-only" && matches.has(cell));
      const adjacent = rule?.reaction === "adjacent-only" || rule?.reaction === "splash"
        ? group.flatMap((cell) => neighborsOf(cave, cell).filter((neighbor) => removedBlocks.has(neighbor)))
        : rule?.reaction === "adjacent" && !direct.length
          ? neighborsOf(cave, index).filter((neighbor) => matches.has(neighbor)) : [];
      const damage = direct.length + (rule?.reaction === "adjacent" ? Number(adjacent.length > 0) : adjacent.length);
      if (!damage && !forced) continue;
      damagedGroups.add(anchor);
      const remaining = Math.max(1, (rule ? terrainDurabilityAt(cave, anchor, rule, jellyCells) : 1) - (state.terrainHits[anchor] || 0));
      const bomb = terrainId === "ddung-bomb-panel";
      // A blast can reach one obstacle through several cells; it only damages it once per wave.
      const specialDamage = forced || direct.some((cell) => specialHits.has(cell)) ||
        adjacent.some((cell) => specialHits.has(cell));
      const amount = Math.min(specialDamage ? 1 : damage, bomb && index !== bombPanelIndex ? remaining - 1 : remaining);
      if (amount > 0) yield { index: anchor, terrainId, group, amount, broken: amount === remaining };
    }
  }

  function damageTerrainFromMatches(state, matches, forcedTerrain = new Set(), removedBlocks = new Set(), bombPanelIndex, heatherAttacks, specialHits) {
    let damaged = 0;
    const brokenDetails = [];
    for (const hit of terrainHitResults(state, matches, forcedTerrain, removedBlocks, bombPanelIndex, specialHits)) {
      if (heatherAttacks && hit.terrainId === "ddung-heather-large" && hit.group.length === 4) {
        if (hit.broken) heatherAttacks.delete(hit.index);
        else heatherAttacks.set(hit.index, (heatherAttacks.get(hit.index) || 0) + hit.amount);
      }
      damaged += 1;
      if (hit.broken) {
        brokenDetails.push({ index: hit.index, terrainId: hit.terrainId, group: hit.group });
        if (hit.terrainId === "ddung-chocolate") state.chocolateRemoved = true;
        for (const cell of hit.group) state.cave.layers.terrain[cell] = null;
        state.terrainHits[hit.index] = 0;
      } else {
        state.terrainHits[hit.index] += hit.amount;
      }
    }
    return { damaged, broken: brokenDetails.length, brokenDetails };
  }

  function* gimmickHitResults(state, matches, removedBlocks, specialHits = new Set()) {
    const { cave } = state;
    for (const [index, storedId] of cave.layers.gimmick.entries()) {
      const id = ddungGimmickBase(storedId);
      if (!id || isExcluded(cave, index) || state.activatedGimmicks.has(index)) continue;
      const boxDurability = ddungBoxDurability(cave, index);
      const originId = state.gimmickOrigins.get(index);
      const rule = cave.gimmickRules?.[id];
      const ddungDurability = ddungGimmickDurability(cave, index);
      const group = ddungDurability ? ddungGimmickGroup(cave, index) : [index];
      if (group[0] !== index) continue;
      const tile = ddungDurability ? ddungGimmickTile(cave, index) : null;
      const reusable = Boolean(DDUNG_PANELS[id] && "AQZY1234r".includes(tile));
      const durability = boxDurability || ddungDurability || rule?.durability || (originId ? 1 : 0);
      if (isDdungSource(cave.externalSource) && !durability) continue;
      const nearbyHits = durability ? removedBlocks : matches;
      const reaction = isDdungSmallMayor(cave, index) ? "adjacent" :
        boxDurability || ddungDurability ? "either" : rule?.reaction ?? "either";
      if ((reaction !== "adjacent" && group.some((cell) => matches.has(cell))) ||
          (reaction !== "direct" && group.some((cell) => neighborsOf(cave, cell).some((neighbor) => nearbyHits.has(neighbor))))) {
        const amount = id === "ddung-mouse-panel" && ddungDurability && matches.has(index) && !specialHits.has(index)
          ? Math.max(1, durability - state.gimmickHits[index]) : 1;
        const exhausted = durability > 0 && state.gimmickHits[index] + amount >= durability;
        const replacement = exhausted ? (boxDurability && id === "ddung-iron-box" ? "ddung-box" : ddungDurability ? null : rule?.nextId) : null;
        yield { index, id, originId, durability, amount, replacement, group, tile, reusable,
          broken: !durability || (exhausted && !replacement) };
      }
    }
  }

  function applyHeatherCounterattacks(state, attacks, captureFrame) {
    if (!attacks.size) return;
    const { cave } = state;
    const { terrain, block, gimmick, item } = cave.layers;
    const protectedSpawnBand = (index) => {
      const x = index % cave.width;
      const y = Math.floor(index / cave.width);
      const nativeY = cave.height - 1 - y;
      if (cave.gravity === "down") return y === x % 2;
      if (cave.gravity === "up") return nativeY === x % 2;
      if (cave.gravity === "left") return x === cave.width - 1 - nativeY % 2;
      return x === nativeY % 2;
    };
    const targets = block.flatMap((id, index) =>
      !isBarrier(cave, index) && !protectedSpawnBand(index) && (!terrain[index] || terrain[index] === "floor") &&
      (!gimmick[index] || gimmick[index] === SPAWNER_ID) && !item[index] && !cave.playtestPieces[index] &&
      id !== "ddung-dust-piece" && !isDdungTreasure(id) ? [index] : []);
    for (const [anchor, count] of attacks) {
      if (terrain[anchor] !== "ddung-heather-large") continue;
      for (let attack = 0; attack < count && targets.length; attack++) {
        const [index] = targets.splice(Math.floor(state.gimmickRandom() * targets.length), 1);
        terrain[index] = "ddung-heather-small";
        block[index] = null;
        state.terrainHits[index] = 0;
        for (const [goal, objective] of cave.objectives.entries()) {
          if (objective.layer === "terrain" && objective.targetId === "ddung-heather-small" &&
              ddungObjectiveType(objective) === 34 && objective.countMode === "auto-map") {
            state.objectiveProgress[goal].target += 1;
          }
        }
        captureFrame?.("큰 헤더 반격 · 작은 헤더 생성", [anchor, index], "match");
      }
    }
  }

  function resolveMatches(state, captureFrame, activation = [], preferred = [], combo = null) {
    let runs = [];
    let matches = findMatches(state.cave, runs);
    activation.forEach((index) => matches.add(index));
    let cascade = 0;
    let removed = 0;
    let terrainDamaged = 0;
    let terrainBroken = 0;
    let flowMoves = 0;
    const newPieces = new Set();
    const heatherAttacks = new Map();
    let protectedCells = new Set();
    let comboPending = combo;
    while (matches.size && cascade < 20) {
      const expanded = comboPending ?? expandSpecialHits(state, matches, protectedCells, state.beeRandom);
      const created = comboPending ? new Map() : createdSpecials(state.cave, runs, preferred, matches);
      const triggered = [...expanded.hits].some((index) => !isBarrier(state.cave, index) && specialEffect(state.cave, state.cave.playtestPieces[index]));
      matches = expanded.hits;
      const highlighted = new Set([...matches, ...expanded.targetedTerrain]);

      // A blast can break an obstacle without clearing the piece it was protecting.
      const clearableCells = [...matches].filter((index) => !isBarrier(state.cave, index) &&
        !isDdungTreasure(state.cave.layers.block[index]));
      if (isDdungSource(state.cave.externalSource)) {
        for (const index of clearableCells) {
          if (String(state.cave.playtestPieces[index]?.type) === "6") {
            // Keep the unsealed block through this cascade, including any gravity movement.
            created.set(index, { unsealed: true });
          }
        }
      }
      const removedBlocks = new Set(clearableCells.filter((index) => state.cave.layers.block[index] && !created.has(index)));
      const burst = captureFrame && [...removedBlocks].map((index) => ({ index, block: state.cave.layers.block[index] }));
      captureFrame?.(comboPending?.label ?? (triggered ? "특수 피스 폭발" : "매치"), [...highlighted], "match", 360, [], null, burst);
      const splashBlocks = expanded.directOnly ? new Set() : removedBlocks;
      const terrainResult = damageTerrainFromMatches(
        state, matches, expanded.targetedTerrain, splashBlocks, expanded.bombPanelIndex, heatherAttacks, expanded.specialHits);
      terrainDamaged += terrainResult.damaged;
      terrainBroken += terrainResult.broken;
      const jellyCells = state.ddungJellyCells;
      const clearedJellyGroups = new Set();
      for (const { index, terrainId, group } of terrainResult.brokenDetails) {
        if (terrainId === "ddung-heather-large") captureFrame?.("큰 헤더 제거", group, "match");
        const jelly = terrainId === "ddung-jelly" ? jellyCells.get(index) : null;
        if (jelly) clearedJellyGroups.add(jelly.group);
        else advanceObjectives(state, "terrain", terrainId);
      }
      for (const [index, member] of jellyCells) {
        if (state.cave.layers.terrain[index] === "ddung-jelly") clearedJellyGroups.delete(member.group);
      }
      for (const group of clearedJellyGroups) advanceObjectives(state, "terrain", "ddung-jelly");
      const convertedBoxes = [];
      const gimmickAttack = new Set();
      for (const { index, id, originId, durability, amount, replacement, broken, group, tile, reusable } of gimmickHitResults(state, matches, splashBlocks, expanded.specialHits)) {
        if (durability) {
          state.gimmickHits[index] += amount;
          if ((tile === "Y" && reusable) || id === "ddung-bee-up") state.turnPanelsHit.add(index);
          if (reusable) {
            if (broken) {
              ddungPanelAttack(state.cave, index, tile, !state.verticalPanels.has(index)).forEach((cell) => gimmickAttack.add(cell));
              state.gimmickHits[index] = 0;
            }
            continue;
          }
          if (id === "ddung-mayor-large" && ddungGimmickDurability(state.cave, index) && !broken) {
            const { cave } = state;
            const candidates = cave.layers.block.flatMap((block, cell) => block && !removedBlocks.has(cell) &&
              !cave.playtestPieces[cell] && !isDdungTreasure(block) && !cave.layers.gimmick[cell] && cave.layers.terrain[cell] === "floor" ? [cell] : []);
            if (candidates.length) {
              const destination = candidates[Math.floor(state.gimmickRandom() * candidates.length)];
              cave.layers.gimmick[destination] = "ddung-mayor-small";
              cave.layers.block[destination] = null;
              cave.objectives.forEach((objective, goal) => {
                if (objective.layer === "gimmick" && objective.targetId === "ddung-mayor-small" &&
                    objective.countMode === "auto-map") state.objectiveProgress[goal].target++;
              });
            }
          }
          if (id === "ddung-mouse-panel" && isDdungGimmickBarrier(state.cave, index) && !broken) {
            const { cave } = state;
            const candidates = cave.layers.terrain.flatMap((terrain, cell) =>
              cell !== index && !cave.layers.gimmick[cell] && (!terrain || terrain === "floor") &&
              !isExcluded(cave, cell) && !cave.playtestPieces[cell] &&
              !isDdungTreasure(cave.layers.block[cell]) && cave.layers.block[cell] !== "ddung-dust-piece" &&
              !matches.has(cell) ? [cell] : []);
            if (candidates.length) {
              const destination = candidates[Math.floor(state.gimmickRandom() * candidates.length)];
              cave.layers.gimmick[index] = null;
              cave.layers.gimmick[destination] = id;
              cave.layers.block[destination] = null;
              state.gimmickHits[destination] = state.gimmickHits[index];
              state.gimmickHits[index] = 0;
            }
            continue;
          }
          if (replacement) {
            state.cave.layers.gimmick[index] = replacement;
            state.gimmickHits[index] = 0;
            if (id === "ddung-iron-box") convertedBoxes.push(index);
            else if (!originId) state.gimmickOrigins.set(index, id);
            continue;
          }
          if (!broken) continue;
          if (id === "ddung-octo") captureFrame?.("얼음 속 가방 수집", [index], "match");
          if (isDdungGimmickBarrier(state.cave, index)) {
            ddungGimmickAttack(state.cave, index, id).forEach((cell) => gimmickAttack.add(cell));
          }
          if (["ddung-feng", "ddung-feng-horizontal", "ddung-feng-vertical", "ddung-feng-large-row", "ddung-feng-large-column"].includes(id) && tile) ddungPanelAttack(state.cave, index, tile, true).forEach((cell) => gimmickAttack.add(cell));
          for (const cell of group) {
            state.cave.layers.gimmick[cell] = null;
            state.gimmickHits[cell] = 0;
          }
          if (id === "ddung-spider-cave") {
            const { cave } = state;
            let added = 0;
            const x = index % cave.width;
            const y = Math.floor(index / cave.width);
            for (let row = Math.max(0, y - 1); row <= Math.min(cave.height - 1, y + 1); row++) {
              for (let col = Math.max(0, x - 1); col <= Math.min(cave.width - 1, x + 1); col++) {
                const cell = row * cave.width + col;
                if (isExcluded(cave, cell) || cave.layers.gimmick[cell] || cave.layers.terrain[cell] !== "floor") continue;
                cave.layers.terrain[cell] = "ddung-web";
                added++;
              }
            }
            cave.objectives.forEach((objective, goal) => {
              if (objective.layer === "terrain" && objective.targetId === "ddung-web") state.objectiveProgress[goal].target += added;
            });
          }
        } else {
          state.activatedGimmicks.add(index);
        }
        advanceObjectives(state, "gimmick", originId ?? id);
        state.gimmickOrigins.delete(index);
      }
      clearableCells.forEach((index) => {
        const blockId = state.cave.layers.block[index];
        if (blockId && !created.has(index)) {
          advanceObjectives(state, "block", blockId);
          removed += 1;
        }
        const itemId = state.cave.layers.item[index];
        if (itemId) {
          advanceObjectives(state, "item", itemId);
          state.cave.layers.item[index] = null;
        }
        state.cave.playtestPieces[index] = created.get(index) ?? null;
        if (!created.has(index)) state.cave.layers.block[index] = null;
      });
      if (convertedBoxes.length) captureFrame?.("철 상자 → 일반 상자", convertedBoxes, "match");
      for (const piece of created.values()) newPieces.add(piece);
      const newSpecialCells = [...created].filter(([, piece]) => !piece.unsealed).map(([index]) => index);
      captureFrame?.(newSpecialCells.length ? "특수 피스 생성" : "매치 결과", newSpecialCells.length ? newSpecialCells : [...matches], "match");
      comboPending = null;
      if (gimmickAttack.size && cascade < 19) {
        captureFrame?.("기믹 발동", [...gimmickAttack], "match");
        matches = gimmickAttack;
        runs = [];
        preferred = [];
        state.cave.playtestPieces.forEach((piece, index) => {
          if (newPieces.has(piece)) {
            protectedCells.add(index);
            matches.delete(index);
          }
        });
        if (matches.size) {
          cascade += 1;
          continue;
        }
      }
      const origins = captureFrame ? new Map() : null;
      const trackMove = origins ? (from, to) => {
        const origin = origins.get(from) ?? { from };
        origins.delete(from);
        origins.set(to, origin);
      } : undefined;
      const captureMovement = (label, kind) => {
        const motions = [...origins].flatMap(([to, origin]) => state.cave.layers.block[to] ? [{ ...origin, to }] : []);
        if (motions.length) captureFrame(label, motions.map(({ to }) => to), kind, 450, motions);
        origins.clear();
      };
      flowMoves += applyGravity(state.cave, state, trackMove);
      if (origins) captureMovement("블록 낙하", "fall");
      collectDdungTreasure(state);
      refillBlocks(state, origins, trackMove);
      if (origins) captureMovement("새 블록 채우기", "refill");
      cascade += 1;
      runs = [];
      preferred = [];
      protectedCells = new Set();
      if (newPieces.size) {
        state.cave.playtestPieces.forEach((piece, index) => {
          if (newPieces.has(piece)) protectedCells.add(index);
        });
      }
      matches = findMatches(state.cave, runs, protectedCells);
      while (!matches.size && consumeDdungJam(state, protectedCells, captureFrame)) {
        applyGravity(state.cave, state);
        collectDdungTreasure(state);
        refillBlocks(state);
        matches = findMatches(state.cave, runs, protectedCells);
      }
    }
    if (isDdungSource(state.cave.externalSource)) {
      state.cave.playtestPieces.forEach((piece, index) => {
        if (piece?.unsealed) state.cave.playtestPieces[index] = null;
      });
    }
    applyHeatherCounterattacks(state, heatherAttacks, captureFrame);
    state.blocksRemoved += removed;
    return { cascade, removed, terrainDamaged, terrainBroken, flowMoves, capped: matches.size > 0 };
  }

  function hasPossibleSwap(cave) {
    const blocks = cave.layers.block;
    for (let index = 0; index < blocks.length; index += 1) {
      if (!blocks[index] || isSwapBlocked(cave, index)) continue;
      const x = index % cave.width;
      const candidates = [];
      if (x < cave.width - 1) candidates.push(index + 1);
      if (index + cave.width < blocks.length) candidates.push(index + cave.width);
      for (const other of candidates) {
        if (!blocks[other] || blocks[other] === blocks[index] || isSwapBlocked(cave, other)) continue;
        [blocks[index], blocks[other]] = [blocks[other], blocks[index]];
        const matches = findMatches(cave);
        const possible = matches.has(index) || matches.has(other);
        [blocks[index], blocks[other]] = [blocks[other], blocks[index]];
        if (possible) return true;
      }
    }
    return false;
  }

  function remainingObjectiveCount(state, objective, index) {
    if (state.goalLimitations[index]) return 0;
    if (isDdungSource(state.cave.externalSource) && ddungUsesBoardCount(ddungObjectiveType(objective)) &&
        objective.countMode === "auto-map") return countObjectiveAssets(state.cave, objective);
    const progress = state.objectiveProgress[index];
    return Math.max(0, progress.target - progress.current);
  }

  function scoreAutoMove(state, { hits, targetedTerrain, bombPanelIndex, specialHits }, goals, created = new Map()) {
    const { cave } = state;
    const clearableCells = [...hits].filter((index) => !isBarrier(cave, index) && !isDdungTreasure(cave.layers.block[index]));
    const removedBlocks = new Set(clearableCells.filter((index) => cave.layers.block[index] && !created.has(index) &&
      blockMatchKey(cave, index) === cave.layers.block[index]));
    if (state.scoreTarget !== null) return { progress: removedBlocks.size, damage: 0, hitCount: hits.size };
    const terrain = goals.some(({ objective }) => objective.layer === "terrain")
      ? [...terrainHitResults(state, hits, targetedTerrain, removedBlocks, bombPanelIndex, specialHits)] : [];
    const gimmicks = goals.some(({ objective }) => objective.layer === "gimmick")
      ? [...gimmickHitResults(state, hits, removedBlocks, specialHits)] : [];
    let progress = 0;
    let damage = 0;
    for (const { objective, remaining } of goals) {
      const matchesId = (id) => id && matchesObjectiveAsset(objective, id);
      const { layer } = objective;
      if (layer === "terrain" || layer === "gimmick") {
        const relevant = layer === "terrain" ? terrain.filter((hit) => matchesId(hit.terrainId))
          : gimmicks.filter((hit) => matchesId(hit.originId ?? hit.id));
        const jellyCells = objective.targetId === "ddung-jelly" ? state.ddungJellyCells : null;
        const brokenCells = new Set(relevant.filter(({ broken }) => broken).map(({ index }) => index));
        const brokenGroups = new Set();
        if (jellyCells?.size) {
          for (const [index, cell] of jellyCells) if (brokenCells.has(index)) brokenGroups.add(cell.group);
          for (const [index, cell] of jellyCells) {
            if (cave.layers.terrain[index] === "ddung-jelly" && !brokenCells.has(index)) brokenGroups.delete(cell.group);
          }
        }
        const countsAsClear = (hit) => hit.broken && !jellyCells?.has(hit.index);
        const cleared = relevant.filter(countsAsClear).length + brokenGroups.size;
        progress += Math.min(remaining, cleared);
        if (cleared < remaining) {
          const damaged = relevant.filter((hit) => !countsAsClear(hit) &&
            !brokenGroups.has(jellyCells?.get(hit.index)?.group)).map((hit) => hit.amount ?? 1).sort((a, b) => b - a);
          damage += damaged.slice(0, remaining - cleared).reduce((total, amount) => total + amount, 0);
        }
      } else if (layer === "block" || layer === "item") {
        const cells = layer === "block" ? [...removedBlocks] : clearableCells;
        const count = cells.filter((index) => matchesId(cave.layers[layer][index])).length;
        progress += Math.min(remaining, count);
        if (layer === "block" && count < remaining) {
          damage += clearableCells.filter((index) => matchesId(cave.layers.block[index]) &&
            blockMatchKey(cave, index) !== cave.layers.block[index]).length;
        }
      }
    }
    return { progress, damage, hitCount: new Set([...hits, ...targetedTerrain]).size };
  }

  function listPossibleSwaps(state, firstOnly = false, goals = []) {
    const cave = state.cave;
    const blocks = cave.layers.block;
    const candidates = [];
    for (let first = 0; first < blocks.length; first += 1) {
      if (!blocks[first] || isSwapBlocked(cave, first)) continue;
      const x = first % cave.width;
      const others = [];
      if (x < cave.width - 1) others.push(first + 1);
      if (first + cave.width < blocks.length) others.push(first + cave.width);
      for (const second of others) {
        if (canCombineSpecials(cave, first, second)) {
          const action = { first, second, combo: true };
          if (firstOnly) return [action];
          candidates.push({ ...action, score: scoreAutoMove(state, specialComboHits(state, first, second, state.beeRandom.copy()), goals) });
          continue;
        }
        if (!blocks[second] || blockMatchKey(cave, first) === blockMatchKey(cave, second) || isSwapBlocked(cave, second)) continue;
        swapPlaytestBlocks(cave, first, second);
        const runs = firstOnly ? undefined : [];
        const matches = findMatches(cave, runs);
        const valid = matches.has(first) || matches.has(second);
        if (valid && !firstOnly) {
          const expanded = expandSpecialHits(state, matches, new Set(), state.beeRandom.copy());
          const created = createdSpecials(cave, runs, [second, first], matches);
          candidates.push({ first, second, score: scoreAutoMove(state, expanded, goals, created) });
        }
        swapPlaytestBlocks(cave, first, second);
        if (valid && firstOnly) return [{ first, second }];
      }
    }
    return candidates;
  }

  const SPECIAL_EFFECTS = {
    row: "가로 한 줄", column: "세로 한 줄", area: "주변 3×3", cross: "가로·세로 십자", color: "같은 색 전체",
    target: "목표 타일 1회 타격",
    fish: "벌 · 목표 한 칸 타격",
  };

  const SCRIPT_EFFECT_LABEL = "직접 작성한 스크립트";

  const MAX_EFFECT_SCRIPT_LENGTH = 4000;

  const effectScriptCache = new Map();

  function parseEffectScript(source) {
    if (typeof source !== "string" || source.length > MAX_EFFECT_SCRIPT_LENGTH) {
      throw new Error("스크립트는 4,000자 이내로 입력하세요.");
    }
    let commands;
    try { commands = JSON.parse(source); }
    catch { throw new Error("스크립트를 JSON 배열로 입력하세요. 따옴표와 쉼표를 확인하세요."); }
    if (!Array.isArray(commands) || commands.length < 1 || commands.length > 16) {
      throw new Error("스크립트에는 명령을 1~16개 넣으세요.");
    }
    return commands.map((command, index) => {
      const fail = (message) => { throw new Error((index + 1) + "번째 명령: " + message); };
      const op = command?.op;
      if (typeof op !== "string" || !(Object.hasOwn(SPECIAL_EFFECTS, op) || op === "offsets")) {
        fail("지원 명령은 row, column, cross, area, color, target, fish, offsets입니다.");
      }
      const keys = op === "area" ? ["op", "radius"] : op === "offsets" ? ["op", "cells"] : ["op"];
      if (Object.keys(command).some((key) => !keys.includes(key))) fail("지원하지 않는 옵션이 있습니다.");
      if (op === "area" && Object.hasOwn(command, "radius") &&
          (!Number.isInteger(command.radius) || command.radius < 1 || command.radius > 5)) {
        fail("radius는 1~5 사이의 정수여야 합니다.");
      }
      if (op === "offsets" && (!Array.isArray(command.cells) || command.cells.length < 1 || command.cells.length > 64 ||
          !command.cells.every((pair) => Array.isArray(pair) && pair.length === 2 &&
            pair.every((value) => Number.isInteger(value) && Math.abs(value) <= 19)))) {
        fail("cells에 [가로, 세로] 정수 좌표를 1~64개 입력하세요. 각 값은 -19~19입니다.");
      }
      return command;
    });
  }

  function getEffectCommands(source) {
    if (typeof source !== "string" || source.length > MAX_EFFECT_SCRIPT_LENGTH) return null;
    if (!effectScriptCache.has(source)) {
      let commands = null;
      try { commands = parseEffectScript(source); } catch { /* Invalid imported effects stay inactive. */ }
      if (effectScriptCache.size >= 64) effectScriptCache.clear();
      effectScriptCache.set(source, commands);
    }
    return effectScriptCache.get(source);
  }

  function specialEffectLabel(effect) {
    return effect === "script" ? SCRIPT_EFFECT_LABEL : SPECIAL_EFFECTS[effect];
  }

  const DEFAULT_SPECIAL_EFFECTS = Object.freeze({ horizontal: "row", vertical: "column", bomb: "area", rainbow: "color", bee: "target" });

  const DDUNG_SPECIAL_EFFECTS = Object.freeze({ 1: "row", 2: "column", 3: "area", 5: "color", 8: "fish" });

  function specialEffect(cave, piece) {
    if (!piece || piece.unsealed) return null;
    const id = String(piece.type);
    const declared = projectSpecialDefinition(cave, id);
    if (declared?.effect === "none") return null;
    if (declared?.effect === "script") return getEffectCommands(declared.effectScript) ? "script" : null;
    if (Object.hasOwn(SPECIAL_EFFECTS, declared?.effect)) return declared.effect;
    if (isDdungSource(cave.externalSource) && Object.hasOwn(DDUNG_SPECIAL_EFFECTS, id)) return DDUNG_SPECIAL_EFFECTS[id];
    return Object.hasOwn(DEFAULT_SPECIAL_EFFECTS, id) ? DEFAULT_SPECIAL_EFFECTS[id] : null;
  }

  function findRemainingTerrainTarget(state, origin, selected) {
    const { cave } = state;
    const remaining = cave.objectives.filter((objective, index) => {
      return objective.layer === "terrain" && remainingObjectiveCount(state, objective, index) > 0;
    });
    const x = origin % cave.width;
    const y = Math.floor(origin / cave.width);
    let nearest = -1;
    let distance = Infinity;
    for (const [index, terrainId] of cave.layers.terrain.entries()) {
      if (!terrainId || selected.has(index) || isExcluded(cave, index)) continue;
      if (cave.terrainRules?.[terrainId]?.reaction === "adjacent-only") continue;
      if (!remaining.some((objective) => matchesObjectiveAsset(objective, terrainId))) continue;
      const steps = Math.abs(index % cave.width - x) + Math.abs(Math.floor(index / cave.width) - y);
      if (steps >= distance) continue;
      nearest = index;
      distance = steps;
    }
    return nearest;
  }

  function findBeeTarget(state, hits, protectedCells, random) {
    const { cave } = state;
    const goals = cave.objectives.filter((objective, index) => {
      return remainingObjectiveCount(state, objective, index) > 0;
    });
    const targets = [];
    const fallback = [];
    for (let index = 0; index < cave.layers.block.length; index += 1) {
      if (hits.has(index) || protectedCells.has(index) || isExcluded(cave, index)) continue;
      if (goals.some((objective) => {
        const id = cave.layers[objective.layer][index];
        return id && matchesObjectiveAsset(objective, id);
      })) targets.push(index);
      else if (cave.layers.block[index] && !isBarrier(cave, index)) fallback.push(index);
    }
    const candidates = targets.length ? targets : fallback;
    return candidates.length ? candidates[Math.floor(random() * candidates.length)] : -1;
  }

  function canCombineSpecials(cave, first, second) {
    if (!neighborsOf(cave, first).includes(second)) return false;
    const pair = [first, second];
    if (pair.some((index) => !cave.layers.block[index] || isSwapBlocked(cave, index))) return false;
    const custom = configuredCombo(cave, first, second);
    if (custom) return custom !== "disabled";
    const effects = pair.map((index) => specialEffect(cave, cave.playtestPieces[index]));
    return effects.every(Boolean) || (effects.includes("color") && pair.some((index) =>
      !cave.playtestPieces[index] && cave.layers.block[index] !== "ddung-dust-piece"));
  }

  function specialComboHits(state, first, second, random = () => 0.5) {
    const { cave } = state;
    const pair = [first, second];
    const effects = pair.map((index) => specialEffect(cave, cave.playtestPieces[index]));
    const lines = effects.filter((effect) => effect === "row" || effect === "column");
    const bombs = effects.filter((effect) => effect === "area").length;
    const bees = effects.filter((effect) => effect === "fish" || effect === "target").length;
    const colors = effects.filter((effect) => effect === "color").length;
    const hits = new Set(pair);
    const commands = new Map();
    const skip = new Set(pair);
    const addShape = (origin, shape, radius = 0) => {
      for (let index = 0; index < cave.layers.block.length; index += 1) {
        if (isExcluded(cave, index)) continue;
        const dx = Math.abs(index % cave.width - origin % cave.width);
        const dy = Math.abs(Math.floor(index / cave.width) - Math.floor(origin / cave.width));
        if ((shape === "row" && dy <= radius) || (shape === "column" && dx <= radius) ||
            (shape === "cross" && (dx <= radius || dy <= radius)) ||
            (shape === "area" && dx <= radius && dy <= radius)) hits.add(index);
      }
    };
    let label;
    const custom = configuredCombo(cave, first, second);
    if (custom) {
      if (custom === "both") skip.clear();
      else if (custom === "board") {
        cave.layers.block.forEach((_, index) => { if (!isExcluded(cave, index)) hits.add(index); });
      } else if (custom === "wide-cross") addShape(second, "cross", 1);
      else if (custom === "large-area") addShape(second, "area", 2);
      else if (custom === "target" || custom === "fish") {
        skip.delete(second);
        commands.set(second, [{ op: custom }]);
      } else addShape(second, custom, custom === "area" ? 1 : 0);
      label = PROJECT_COMBO_EFFECTS[custom];
      return { ...expandSpecialHits(state, hits, new Set(), random, skip, commands, true), label };
    }
    if (colors === 2) {
      cave.layers.block.forEach((_, index) => { if (!isExcluded(cave, index)) hits.add(index); });
      label = "보드 전체 타격";
    } else if (colors && (lines.length || bombs || bees)) {
      const partner = pair[effects[0] === "color" ? 1 : 0];
      const color = cave.layers.block[partner];
      const converted = cave.layers.block.flatMap((block, index) =>
        block === color && !skip.has(index) && !isSwapBlocked(cave, index) ? [index] : []);
      for (const [order, index] of converted.entries()) {
        hits.add(index);
        commands.set(index, [{ op: bombs ? "area" : bees ? "fish" : order % 2 ? "column" : "row" }]);
      }
      label = "같은 색을 특수 피스로 바꿔 연쇄 발동";
    } else if (colors && effects.includes(null)) {
      const partner = pair[effects[0] === "color" ? 1 : 0];
      const color = cave.layers.block[partner];
      cave.layers.block.forEach((block, index) => {
        if (block === color && !isSwapBlocked(cave, index)) hits.add(index);
      });
      label = "선택한 블록과 같은 색 제거";
    } else if (bees && (lines.length || bombs || bees === 2)) {
      const count = bees === 2 ? 3 : 1;
      for (let flight = 0; flight < count; flight += 1) {
        const target = findBeeTarget(state, hits, new Set(), random);
        if (target < 0) break;
        hits.add(target);
        if (lines.length || bombs) addShape(target, lines[0] ?? "area", bombs ? 1 : 0);
      }
      label = bees === 2 ? "벌 3마리 출격" : lines.length ? "벌이 목표에서 줄 폭발" : "벌이 목표에서 폭탄 발동";
    } else if (bombs === 2) {
      pair.forEach((index) => addShape(index, "area", 2));
      label = "두 위치에서 5×5 폭발";
    } else if (lines.length && bombs) {
      addShape(second, "cross", 1);
      label = "가로 3줄·세로 3줄 타격";
    } else if (lines.length === 2) {
      addShape(second, "cross");
      label = "가로·세로 십자 타격";
    } else {
      skip.clear();
      label = "두 특수 효과 동시 발동";
    }
    return { ...expandSpecialHits(state, hits, new Set(), random, skip, commands, true), label };
  }

  function expandSpecialHits(state, matches, protectedCells = new Set(), beeRandom = () => 0.5, skip = new Set(), overrides = new Map(), initialBlast = false) {
    const { cave } = state;
    const hits = new Set(matches);
    const targetedTerrain = new Set();
    const specialHits = initialBlast ? new Set(hits) : new Set();
    const addSpecialHit = (index) => { hits.add(index); specialHits.add(index); };
    for (const index of hits) {
      if (skip.has(index) || isBarrier(cave, index)) continue;
      const override = overrides.get(index);
      const effect = specialEffect(cave, cave.playtestPieces[index]);
      if (!effect && !override) continue;
      specialHits.add(index);
      const x = index % cave.width;
      const y = Math.floor(index / cave.width);
      const color = cave.layers.block[index];
      const definition = effect === "script" && projectSpecialDefinition(cave, String(cave.playtestPieces[index].type));
      const commands = override ?? (effect === "script" ? getEffectCommands(definition.effectScript) : [{ op: effect }]);
      for (const { op, radius = 1, cells } of commands) {
        if (op === "fish") {
          const target = findBeeTarget(state, hits, protectedCells, beeRandom);
          if (target >= 0) addSpecialHit(target);
          continue;
        }
        if (op === "target") {
          const target = findRemainingTerrainTarget(state, index, targetedTerrain);
          if (target >= 0) targetedTerrain.add(target);
          continue;
        }
        if (op === "offsets") {
          for (const [dx, dy] of cells) {
            const targetX = x + dx;
            const targetY = y + dy;
            if (targetX < 0 || targetX >= cave.width || targetY < 0 || targetY >= cave.height) continue;
            const other = targetY * cave.width + targetX;
            if (!isExcluded(cave, other) && !protectedCells.has(other)) addSpecialHit(other);
          }
          continue;
        }
        for (let other = 0; other < cave.layers.block.length; other += 1) {
          const dx = Math.abs(other % cave.width - x);
          const dy = Math.abs(Math.floor(other / cave.width) - y);
          const affected = (op === "row" && dy === 0) || (op === "column" && dx === 0) ||
            (op === "cross" && (dx === 0 || dy === 0)) || (op === "area" && dx <= radius && dy <= radius) ||
            (op === "color" && color && cave.layers.block[other] === color);
          if (affected && !isExcluded(cave, other) && !protectedCells.has(other)) addSpecialHit(other);
        }
      }
    }
    return { hits, targetedTerrain, specialHits };
  }

  function createdSpecials(cave, runs, preferred, hits) {
    const result = new Map();
    if (!cave.specialMatches) return result;
    const reserved = new Set();
    const create = (cells, shape, candidates = cells, customType = null) => {
      const generation = getProject()?.specialPieceRules?.generation;
      const type = shape === "custom" ? customType
        : Object.hasOwn(generation || {}, shape) ? generation[shape] : SPECIAL_MATCH_SHAPES[shape][1];
      if (cells.some((index) => reserved.has(index))) return;
      if (!type) {
        if (shape === "custom") cells.forEach((cell) => reserved.add(cell));
        return;
      }
      const index = [...preferred.filter((index) => candidates.includes(index)), ...candidates]
        .find((index) => !cave.playtestPieces[index] && hits.has(index));
      if (index === undefined) return;
      const definition = projectSpecialDefinition(cave, type) || EDITABLE_INITIAL_PIECES.find((entry) => entry.id === type);
      result.set(index, { type, name: definition?.name || type, symbol: definition?.symbol || "✦" });
      cells.forEach((cell) => reserved.add(cell));
    };
    for (const { axis, cells, type } of runs) {
      if (axis === "custom") create(cells, axis, cells, type);
    }
    for (const { axis, cells } of runs) {
      if (axis !== "custom" && cells.length >= 5) create(cells, "five", [cells[Math.floor(cells.length / 2)], ...cells]);
    }
    const vertical = new Map();
    runs.filter(({ axis }) => axis === "vertical").forEach((run) =>
      run.cells.forEach((index) => vertical.set(index, run.cells)));
    for (const { cells, axis } of runs) {
      if (axis !== "horizontal") continue;
      const center = cells.find((index) => vertical.has(index));
      if (center === undefined) continue;
      const upright = vertical.get(center);
      const atEnd = (line) => center === line[0] || center === line.at(-1);
      const ends = Number(atEnd(cells)) + Number(atEnd(upright));
      create([...cells, ...upright], ["cross", "tee", "ell"][ends], [center]);
    }
    for (const { cells, axis } of runs) {
      if (axis === "custom") continue;
      if (axis === "square") create(cells, "square");
      else if (cells.length === 4) create(cells, axis, [cells[1], ...cells]);
    }
    return result;
  }

  function swapPlaytestBlocks(cave, first, second) {
    const blocks = cave.layers.block;
    const pieces = cave.playtestPieces;
    [blocks[first], blocks[second]] = [blocks[second], blocks[first]];
    [pieces[first], pieces[second]] = [pieces[second], pieces[first]];
  }

  function findPlayableAction(state) {
    const { cave } = state;
    const panel = cave.layers.terrain.findIndex((_, index) => bombPanelReady(state, index));
    if (panel >= 0) return { first: panel, bombPanel: true };
    const special = cave.playtestPieces.findIndex((piece, index) =>
      cave.layers.block[index] && !isBarrier(cave, index) && specialEffect(cave, piece));
    return special >= 0 ? { first: special } : listPossibleSwaps(state, true)[0];
  }

  function ensurePlayableBoard(state, captureFrame) {
    if (findPlayableAction(state)) return;
    const { cave } = state;
    const blocks = cave.layers.block;
    const slots = blocks.flatMap((color, index) =>
      color && color !== "ddung-dust-piece" && !isDdungTreasure(color) && !cave.playtestPieces[index] && !isSwapBlocked(cave, index) ? [index] : []);
    const original = slots.map((index) => blocks[index]);
    if (slots.length >= 4 && new Set(original).size >= 2) {
      for (let attempt = 0; attempt < 80; attempt += 1) {
        const shuffled = [...original];
        for (let index = shuffled.length - 1; index > 0; index -= 1) {
          const other = Math.floor(state.shuffleRandom() * (index + 1));
          [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
        }
        slots.forEach((slot, index) => { blocks[slot] = shuffled[index]; });
        if (findMatches(cave).size || !listPossibleSwaps(state, true).length) continue;
        state.shuffleCount += 1;
        state.message += " · 가능한 교환이 없어 보드를 섞었습니다.";
        captureFrame?.("보드 셔플", slots, "swap", 350);
        return;
      }
      slots.forEach((slot, index) => { blocks[slot] = original[index]; });
    }
    state.status = "stuck";
    state.message = "셔플로 가능한 교환을 만들 수 없습니다.";
  }

  function chooseAutoAction(state) {
    const cave = state.cave;
    const goals = state.scoreTarget === null ? cave.objectives.map((objective, index) => ({
      objective, remaining: remainingObjectiveCount(state, objective, index),
    })).filter(({ remaining }) => remaining > 0) : [];
    const candidates = listPossibleSwaps(state, false, goals);
    cave.layers.terrain.forEach((_, index) => {
      if (!bombPanelReady(state, index)) return;
      const hits = bombPanelHits(state, index, state.beeRandom.copy());
      candidates.push({ first: index, bombPanel: true, score: scoreAutoMove(state, hits, goals) });
    });
    const runs = [];
    const existingMatches = findMatches(cave, runs);
    cave.playtestPieces.forEach((piece, index) => {
      if (!specialEffect(cave, piece) || isBarrier(cave, index)) return;
      const matches = new Set([...existingMatches, index]);
      const expanded = expandSpecialHits(state, matches, new Set(), state.beeRandom.copy());
      const created = createdSpecials(cave, runs, [], matches);
      candidates.push({ first: index, score: scoreAutoMove(state, expanded, goals, created) });
    });
    let best = [];
    for (const candidate of candidates) {
      const previous = best[0]?.score;
      const { progress, damage, hitCount } = candidate.score;
      const comparison = previous ? progress - previous.progress || damage - previous.damage || hitCount - previous.hitCount : 1;
      if (comparison > 0) best = [candidate];
      else if (comparison === 0) best.push(candidate);
    }
    return best.length ? best[Math.floor(state.random() * best.length)] : null;
  }

  function spreadDdungChocolate(state, captureFrame) {
    if (state.chocolateRemoved) return;
    const { cave } = state;
    const { terrain, block, gimmick, item } = cave.layers;
    const candidates = new Set();
    terrain.forEach((id, index) => {
      if (id !== "ddung-chocolate") return;
      for (const cell of neighborsOf(cave, index)) {
        if ((terrain[cell] && terrain[cell] !== "floor") ||
            (gimmick[cell] && gimmick[cell] !== SPAWNER_ID) || item[cell] ||
            isBarrier(cave, cell) || cave.playtestPieces[cell] || isDdungTreasure(block[cell])) continue;
        candidates.add(cell);
      }
    });
    if (!candidates.size) return;
    const index = [...candidates][Math.floor(state.gimmickRandom() * candidates.size)];
    terrain[index] = "ddung-chocolate";
    block[index] = null;
    state.terrainHits[index] = 0;
    for (const [goal, objective] of cave.objectives.entries()) {
      if (objective.layer === "terrain" && objective.targetId === "ddung-chocolate" &&
          ddungUsesBoardCount(ddungObjectiveType(objective)) && objective.countMode === "auto-map") {
        state.objectiveProgress[goal].target += 1;
      }
    }
    captureFrame?.("초콜릿 확산", [index], "match");
  }

  function bombPanelReady(state, index) {
    const { cave, terrainHits } = state;
    return cave.layers.terrain[index] === "ddung-bomb-panel" && !isExcluded(cave, index) &&
      terrainHits[index] >= cave.terrainRules["ddung-bomb-panel"].durability - 1;
  }

  function bombPanelHits(state, index, random) {
    const { cave } = state;
    const x = index % cave.width;
    const y = Math.floor(index / cave.width);
    const hits = new Set();
    for (let row = Math.max(0, y - 1); row <= Math.min(cave.height - 1, y + 1); row++) {
      for (let col = Math.max(0, x - 1); col <= Math.min(cave.width - 1, x + 1); col++) {
        const cell = row * cave.width + col;
        if (!isExcluded(cave, cell)) hits.add(cell);
      }
    }
    const expanded = expandSpecialHits(state, hits, new Set(), random);
    hits.forEach((cell) => expanded.specialHits.add(cell));
    expanded.targetedTerrain.add(index);
    return { ...expanded, bombPanelIndex: index, label: "폭탄 패널 폭발" };
  }

  function consumeDdungJam(state, protectedCells, captureFrame) {
    const { cave } = state;
    const { terrain, block, item, gimmick } = cave.layers;
    const consumed = [];
    const changed = [];
    for (const [index, id] of terrain.entries()) {
      const color = DDUNG_JAM_COLORS[id];
      const above = index - cave.width;
      if (!color || isExcluded(cave, index) || above < 0 || protectedCells.has(above) ||
          block[above] !== color || item[above] || (gimmick[above] && gimmick[above] !== SPAWNER_ID) ||
          (terrain[above] && terrain[above] !== "floor") || isBarrier(cave, above)) continue;
      block[above] = null;
      cave.playtestPieces[above] = null;
      advanceObjectives(state, "block", color);
      consumed.push(above);
      changed.push(index);
      if (++state.terrainHits[index] >= cave.terrainRules[id].durability) {
        terrain[index] = null;
        state.terrainHits[index] = 0;
        advanceObjectives(state, "terrain", id);
      }
    }
    if (consumed.length) captureFrame?.("잼이 같은 색 블록을 받음", [...consumed, ...changed], "match");
    return consumed.length;
  }

  function ddungTurnEvents(cave) {
    const raw = isDdungSource(cave.externalSource) ? cave.externalSource.rawMap : null;
    const enabled = (flag) => flag === true || (typeof flag === "string" && flag.trim().toLowerCase() === "true");
    return { mouse: enabled(raw?.mouse), spider: enabled(raw?.spider) };
  }

  function runDdungTurnEvent(state, captureFrame) {
    const { cave, movesLeft, ddungEvents, ddungEventRandom } = state;
    const movesUsed = cave.moveLimit - movesLeft;
    if (movesUsed <= 0) return;
    const pick = (cells) => cells.splice(Math.floor(ddungEventRandom() * cells.length), 1)[0];
    const available = (index) => cave.layers.block[index] && !isBarrier(cave, index);
    if (ddungEvents.mouse && movesUsed % 4 === 0) {
      const start = Math.floor(ddungEventRandom() * cave.height) * cave.width;
      const row = Array.from({ length: cave.width }, (_, col) => start + col).filter(available);
      const motions = [];
      while (row.length > 1) {
        const first = pick(row);
        const second = pick(row);
        motions.push({ from: first, to: second }, { from: second, to: first });
      }
      const affected = motions.map(({ to }) => to);
      captureFrame?.("쥐 등장 · 교환할 블록", affected, "swap", 550);
      for (let pair = 0; pair < motions.length; pair += 2) {
        const { from, to } = motions[pair];
        swapPlaytestBlocks(cave, from, to);
      }
      captureFrame?.("쥐 등장 · 한 행의 블록 교환", affected, "swap", 900, motions, { type: "mouse", index: start });
      if (motions.length) resolveMatches(state, captureFrame);
    } else if (ddungEvents.spider && movesUsed % 4 === 2) {
      const cells = cave.layers.block.flatMap((id, index) => available(index) &&
        !cave.playtestPieces[index] && !isDdungTreasure(id) && id !== "ddung-dust-piece" ? [index] : []);
      if (cells.length < 2) return;
      const target = pick(cells);
      captureFrame?.("거미 등장 · 블록을 가져갑니다", [target], "swap", 1150, [], { type: "spider", index: target });
      const hits = new Set([target]);
      resolveMatches(state, captureFrame, [target], [], {
        hits, targetedTerrain: new Set(), directOnly: true, label: "거미가 가져간 칸",
      });
    }
  }

  function playSimulationTurn(state, action, captureFrame) {
    if (!action) {
      state.status = "stuck";
      state.message = "가능한 교환이나 특수 피스 발동이 없습니다.";
      return;
    }
    const { first, second } = action;
    const cave = state.cave;
    if (action.bombPanel) {
      if (!bombPanelReady(state, first)) return;
      const explosion = bombPanelHits(state, first, state.beeRandom);
      resolveMatches(state, captureFrame, [first], [], explosion);
      state.message = explosion.label;
      if (clearConditionMet(state)) state.status = "won";
      else ensurePlayableBoard(state, captureFrame);
      return;
    }
    if (action.combo && !canCombineSpecials(cave, first, second)) return;
    const combo = action.combo ? specialComboHits(state, first, second, state.beeRandom) : null;
    const activation = second === undefined;
    if (combo) {
      captureFrame?.("특수 피스 조합", [first, second], "swap", 250);
    } else if (activation) {
      captureFrame?.("특수 피스 발동", [first], "match");
    } else {
      swapPlaytestBlocks(cave, first, second);
      const motions = [{ from: first, to: second }, { from: second, to: first }];
      captureFrame?.("블록 교환", [first, second], "swap", 400, motions);
      if (action.invalid) {
        swapPlaytestBlocks(cave, first, second);
        captureFrame?.("매치 없음 · 원래 위치로 복귀", [first, second], "swap", 400, motions);
        state.message = "매치가 만들어지지 않아 교환을 되돌렸습니다.";
        return;
      }
    }
    state.movesLeft -= 1;
    state.chocolateRemoved = false;
    const resolved = resolveMatches(state, captureFrame, combo ? [first, second] : activation ? [first] : [], activation || combo ? [] : [second, first], combo);
    state.message = (combo ? combo.label + " · " : "") + resolved.removed + "개 제거 · " + resolved.cascade + "연쇄 · Terrain " + resolved.terrainBroken + "개 파괴";
    for (const [index, id] of cave.layers.gimmick.entries()) {
      if (id !== "ddung-attack-turn" || state.turnPanelsHit.has(index)) continue;
      if (state.verticalPanels.has(index)) state.verticalPanels.delete(index);
      else state.verticalPanels.add(index);
    }
    if (cave.layers.gimmick.includes("ddung-bee-up")) {
      const bees = cave.layers.gimmick.flatMap((id, index) => id === "ddung-bee-up" ? [index] : []);
      for (const index of bees) {
        if (state.turnPanelsHit.has(index)) continue;
        const next = index - cave.width;
        if (next < 0) {
          state.status = "lost";
          state.message = "Bee Up이 보드 위쪽에 도달했습니다.";
          state.turnPanelsHit.clear();
          return;
        }
        if (cave.layers.terrain[next] !== "floor" || !cave.layers.block[next] ||
            cave.layers.gimmick[next] || isBarrier(cave, next)) continue;
        cave.layers.gimmick[index] = null;
        cave.layers.gimmick[next] = "ddung-bee-up";
        state.gimmickHits[next] = state.gimmickHits[index];
        state.gimmickHits[index] = 0;
        swapPlaytestBlocks(cave, index, next);
        captureFrame?.("Bee Up 이동", [index, next], "fall");
      }
    }
    state.turnPanelsHit.clear();
    if (clearConditionMet(state)) state.status = "won";
    else if (!state.movesLeft) state.status = "lost";
    else {
      spreadDdungChocolate(state, captureFrame);
      runDdungTurnEvent(state, captureFrame);
      if (clearConditionMet(state)) state.status = "won";
      else ensurePlayableBoard(state, captureFrame);
    }
  }

  function createPlayState(cave, seedSuffix, manual = false, { scoreTarget = cave.scoreTarget ?? null, pointsPerBlock = cave.pointsPerBlock ?? 100 } = {}) {
    const copy = deepCopy(cave);
    copy.layers.block.forEach((id, index) => {
      const item = copy.layers.item[index];
      if (usesDdungGeneration(copy) && isDdungTreasure(item)) {
        copy.layers.block[index] = item;
        copy.layers.item[index] = null;
      }
      if (id && (DDUNG_SOLID_PANELS.has(copy.layers.terrain[index]) ||
          ddungBoxDurability(copy, index) || isDdungGimmickBarrier(copy, index) ||
          copy.gimmickRules?.[copy.layers.gimmick[index]]?.blocksFlow)) copy.layers.block[index] = null;
    });
    copy.playtestPieces = copy.layers.block.map((block, index) => {
      const piece = block ? initialPieceAt(copy, index) : null;
      return piece && (!piece.color || piece.color === block) ? piece : null;
    });
    const state = {
      cave: copy,
      movesLeft: copy.moveLimit,
      blocksRemoved: 0,
      scoreTarget,
      pointsPerBlock,
      paused: manual,
      selectedIndex: null,
      status: "playing",
      message: manual ? "교환할 인접 블록 두 개를 클릭하세요." : "자동 플레이를 시작합니다.",
      random: seededRandom(`${copy.randomSeed}|${seedSuffix}`),
      shuffleRandom: seededRandom(`${copy.randomSeed}|${seedSuffix}|shuffle`),
      shuffleCount: 0,
      sealRandom: isDdungSource(copy.externalSource) && copy.externalSource.specialColors?.length
        ? seededRandom(`${copy.randomSeed}|${seedSuffix}|seals`) : null,
      beeRandom: seededRandom(`${copy.randomSeed}|${seedSuffix}|bee`),
      treasureRandom: seededRandom(`${copy.randomSeed}|${seedSuffix}|treasure`),
      gimmickRandom: seededRandom(`${copy.randomSeed}|${seedSuffix}|gimmick`),
      ddungEvents: ddungTurnEvents(copy),
      ddungEventRandom: seededRandom(`${copy.randomSeed}|${seedSuffix}|ddung-events`),
      treasureMisses: 0,
      treasureGoals: copy.objectives.flatMap((objective, index) =>
        usesDdungGeneration(copy) && objective.layer === "item" && isDdungTreasure(objective.targetId)
          ? [{ index, targetId: objective.targetId }] : []),
      terrainHits: Array(copy.width * copy.height).fill(0),
      ddungJellyCells: ddungJellyCells(copy),
      gimmickHits: Array(copy.width * copy.height).fill(0),
      gimmickOrigins: new Map(),
      verticalPanels: new Set(),
      turnPanelsHit: new Set(),
      activatedGimmicks: new Set(),
      objectiveProgress: createObjectiveProgress(copy),
      goalLimitations: copy.objectives.map((objective) => ddungGoalLimitation(copy, objective)),
      flowTurn: 0,
    };
    if (state.sealRandom) {
      copy.layers.block.forEach((color, index) => {
        if (color && !copy.playtestPieces[index] && !isBarrier(copy, index)) spawnPlaytestBlock(state, index, color);
      });
    }
    if ((isDdungSource(copy.externalSource) || (copy.layers.gimmick.includes(SPAWNER_ID) || copy.generatedSpawnerOverlaps?.length)) &&
        copy.layers.block.some((block, index) => !block && !isBarrier(copy, index))) {
      applyGravity(copy, state);
      collectDdungTreasure(state);
      refillBlocks(state);
    }
    if (collectDdungTreasure(state)) refillBlocks(state);
    while (!findMatches(copy).size && consumeDdungJam(state, new Set())) {
      applyGravity(copy, state);
      collectDdungTreasure(state);
      refillBlocks(state);
    }
    if (clearConditionMet(state)) state.status = "won";
    else ensurePlayableBoard(state);
    return state;
  }

  function runAutoGame(cave, runIndex) {
    const state = createPlayState(cave, `batch-${runIndex}`);
    if (state.goalLimitations.some(Boolean)) return { status: "unsupported", moves: 0, runIndex };
    while (state.status === "playing") playSimulationTurn(state, chooseAutoAction(state));
    return { status: state.status, moves: cave.moveLimit - state.movesLeft, shuffles: state.shuffleCount, runIndex };
  }

  const DDUNG_COLOR_IDS = ["yellow", "blue", "orange", "green", "red", "purple"];

  const DDUNG_BLOCK_CHARACTERS = {
    yellow: "ㄵㄶㄷㄸㄹ⒰",
    blue: "ㄺㄻㄼㄽㄾ⒱",
    orange: "ㄿㅀㅁㅂㅃ⒲",
    green: "ㅄㅅㅆㅇㅈ⒳",
    red: "ㅉㅊㅋㅌㅍ⒴",
    purple: "ㅎㅏㅐㅑㅒ⒵",
  };

  function ddungGridIndex(size, x, y) {
    return x >= 0 && x < size && y >= 0 && y < size ? y * size + x : -1;
  }

  function ddungPositionGroups(value, chunkSize) {
    const text = String(value || "");
    const groups = [];
    for (let start = 0; start + chunkSize <= text.length; start += chunkSize) groups.push(text.slice(start, start + chunkSize));
    return groups;
  }

  function blockWeight(cave, id) {
    return cave.blockWeights && Object.hasOwn(cave.blockWeights, id) ? cave.blockWeights[id] : 1;
  }

  function ddungCellSource(cave, index) {
    const raw = cave.externalSource?.rawMap;
    if (!raw) return null;
    const size = clampNumber(raw.size, 9, 4, 20);
    const x = index % cave.width;
    const y = size - 1 - Math.floor(index / cave.width);
    if (x >= size || y < 0) return null;
    const offset = y * size + x;
    return { raw, x, y, tile: String(raw.tiles || "")[offset], gravity: String(raw.gravitys || "")[offset] };
  }

  const DDUNG_PIECE_ICONS = Object.freeze({ 1: "◆", 2: "▲", 3: "■", 5: "✦", 6: "✚", 8: "🐝" });

  function ddungInitialPiece(tile, waterColor, waterType) {
    if (!tile) return null;
    const randomTypes = { "ㄱ": 1, "ㄲ": 2, "ㄳ": 3, "ㄴ": 5, "⑴": 8 };
    if (Object.hasOwn(randomTypes, tile)) return { type: randomTypes[tile], color: tile === "ㄴ" ? "yellow" : undefined };
    for (const [color, tokens] of Object.entries(DDUNG_BLOCK_CHARACTERS)) {
      const variant = tokens.indexOf(tile);
      if (variant >= 0) return { color, type: variant === 5 ? 8 : variant === 4 ? 6 : variant };
    }
    if (waterColor === 7) return { type: ({ 1: 1, 2: 2, 3: 3, 5: 8 })[waterType] || 0,
      color: waterType === 6 ? "yellow" : undefined };
    const color = DDUNG_COLOR_IDS[waterColor - 1];
    if (color) return { color, type: ({ 1: 1, 2: 2, 3: 3, 4: 6, 5: 8 })[waterType] || 0 };
    return null;
  }

  function initialPieceAt(cave, index) {
    const type = cave.initialPieceTypes?.[index];
    if (cave.initialPieceTypes && Object.hasOwn(cave.initialPieceTypes, index) && type == null) return null;
    if (type) {
      const declared = cave.initialPieceDefinitions?.find((entry) => entry.id === type);
      return { type, symbol: declared?.symbol || "✦", name: declared?.name };
    }
    const source = ddungCellSource(cave, index);
    if (!source || !cave.layers.block[index]) return null;
    const water = ddungPositionGroups(source.raw.watercolors, 4).find((group) =>
      Number(group[0]) === source.x && Number(group[1]) === Math.floor(index / cave.width));
    const original = ddungInitialPiece(source.tile, Number(water?.[2]), Number(water?.[3]));
    const symbol = DDUNG_PIECE_ICONS[original?.type];
    return symbol ? { ...original, color: original.color || cave.layers.block[index], symbol, ...(original.type === 8 ? { name: "벌" } : {}) } : null;
  }

  const EDITABLE_INITIAL_PIECES = [
    { id: "horizontal", name: "가로", symbol: "↔" },
    { id: "vertical", name: "세로", symbol: "↕" },
    { id: "bomb", name: "폭탄", symbol: "✹" },
    { id: "bee", name: "벌", symbol: "◆" },
    { id: "rainbow", name: "오색", symbol: "✦" },
  ];

  const SPECIAL_MATCH_SHAPES = {
    horizontal: ["가로 4개", "horizontal"], vertical: ["세로 4개", "vertical"],
    five: ["직선 5개 이상", "rainbow"], square: ["2×2", "bee"],
    tee: ["T자", "bomb"], ell: ["L자", "bomb"], cross: ["십자", "bomb"],
  };

  const PROJECT_COMBO_EFFECTS = {
    both: "두 피스 각각 발동", row: "가로 한 줄", column: "세로 한 줄",
    cross: "가로·세로 십자", "wide-cross": "가로 3줄·세로 3줄", area: "주변 3×3",
    "large-area": "주변 5×5", target: "목표 타일 1회 타격", fish: "벌 · 목표 한 칸 타격",
    board: "보드 전체 타격", disabled: "조합 사용 안 함",
  };

  function allowsSquareMatches(cave) {
    return getProject()?.specialPieceRules?.allowSquare ?? cave.specialMatches;
  }

  function projectSpecialDefinition(cave, id) {
    const local = cave.initialPieceDefinitions?.find((entry) => entry.id === id);
    if (local) return local;
    for (const level of getProject()?.caves || []) {
      const definition = level.initialPieceDefinitions?.find((entry) => entry.id === id);
      if (definition) return definition;
    }
    return null;
  }

  function configuredCombo(cave, first, second) {
    const a = cave.playtestPieces[first]?.type;
    const b = cave.playtestPieces[second]?.type;
    if (!a || !b) return null;
    return getProject()?.specialPieceRules?.combos.find((rule) =>
      (rule.first === String(a) && rule.second === String(b)) ||
      (rule.first === String(b) && rule.second === String(a)))?.effect ?? null;
  }

  return {
    SPAWNER_ID,
    DDUNG_PANELS,
    DDUNG_JAM_COLORS,
    DDUNG_PANEL_TILES,
    DDUNG_SOLID_PANELS,
    DEFAULT_TERRAIN_RULES,
    deepCopy,
    clampNumber,
    isDdungSource,
    ddungObjectiveType,
    ddungUsesBoardCount,
    ddungGoalLimitation,
    matchesObjectiveAsset,
    countObjectiveAssets,
    resolvedObjectiveCount,
    isExcluded,
    seededRandom,
    placeGenerationSpawners,
    usesDdungGeneration,
    findMatches,
    customMatchCells,
    neighborsOf,
    ddungCellGravities,
    ddungBoxDurability,
    isSwapBlocked,
    ddungPanelId,
    ddungGimmickBase,
    ddungGimmickGroup,
    ddungGimmickDurability,
    isDdungGimmickBarrier,
    isBarrier,
    isDdungTreasure,
    ddungMarkersAt,
    heatherGroup,
    ddungJellyCells,
    terrainDurabilityAt,
    hasPossibleSwap,
    SPECIAL_EFFECTS,
    SCRIPT_EFFECT_LABEL,
    parseEffectScript,
    specialEffectLabel,
    specialEffect,
    canCombineSpecials,
    swapPlaytestBlocks,
    findPlayableAction,
    chooseAutoAction,
    bombPanelReady,
    ddungTurnEvents,
    playSimulationTurn,
    createPlayState,
    runAutoGame,
    DDUNG_COLOR_IDS,
    DDUNG_BLOCK_CHARACTERS,
    ddungGridIndex,
    ddungPositionGroups,
    blockWeight,
    ddungCellSource,
    ddungInitialPiece,
    initialPieceAt,
    EDITABLE_INITIAL_PIECES,
    SPECIAL_MATCH_SHAPES,
    PROJECT_COMBO_EFFECTS,
    allowsSquareMatches,
  };
}
