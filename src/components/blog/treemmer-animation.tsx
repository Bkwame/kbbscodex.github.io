/**
 * Step-by-step animation of Treemmer's pruning loop on a small 8-leaf tree.
 * The pruning steps are computed here with the rule described in the paper
 * (Menardo et al. 2018), so every distance and tree length shown is real arithmetic.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

type NodeId = string;
interface TreeNode {
  id: NodeId;
  parent: NodeId | null;
  children: NodeId[];
  len: number;
  leaf: boolean;
}
type Tree = Record<NodeId, TreeNode>;

// Rooted toy tree. Branch lengths are substitutions per site (made up for the demo).
const INITIAL: [NodeId, NodeId | null, number, boolean][] = [
  ["root", null, 0, false],
  ["n1", "root", 0.2, false],
  ["n2", "n1", 0.3, false],
  ["A", "n2", 0.05, true],
  ["B", "n2", 0.07, true],
  ["C", "n1", 0.45, true],
  ["n3", "root", 0.25, false],
  ["n4", "n3", 0.25, false],
  ["D", "n4", 0.1, true],
  ["E", "n4", 0.12, true],
  ["n5", "n3", 0.15, false],
  ["F", "n5", 0.3, true],
  ["n6", "n5", 0.2, false],
  ["G", "n6", 0.04, true],
  ["H", "n6", 0.06, true],
];
const LEAF_ORDER = ["A", "B", "C", "D", "E", "F", "G", "H"];
// Treemmer drops one leaf of the closest pair at random; these are the coin flips for the demo.
const DROP_CHOICE: Record<string, NodeId> = { "G-H": "H", "A-B": "B", "D-E": "D", "F-G": "G" };
const STOP_AT = 4;

function buildTree(): Tree {
  const t: Tree = {};
  for (const [id, parent, len, leaf] of INITIAL) t[id] = { id, parent, children: [], len, leaf };
  for (const [id, parent] of INITIAL) if (parent) t[parent].children.push(id);
  return t;
}
const clone = (t: Tree): Tree =>
  Object.fromEntries(Object.entries(t).map(([k, v]) => [k, { ...v, children: [...v.children] }]));
const leaves = (t: Tree) => LEAF_ORDER.filter((id) => t[id]);
const treeLength = (t: Tree) => Object.values(t).reduce((s, n) => s + n.len, 0);
const r2 = (x: number) => Math.round(x * 100) / 100;

function pathLength(t: Tree, a: NodeId, b: NodeId): number {
  const up = new Map<NodeId, number>();
  let cur: NodeId | null = a;
  let d = 0;
  while (cur) {
    up.set(cur, d);
    d += t[cur].len;
    cur = t[cur].parent;
  }
  cur = b;
  d = 0;
  while (cur && !up.has(cur)) {
    d += t[cur].len;
    cur = t[cur].parent;
  }
  return d + (cur ? up.get(cur)! : 0);
}

interface Pair {
  a: NodeId;
  b: NodeId;
  d: number;
}
// Neighbours as described in the paper: sister leaves (one node apart); if a leaf has none,
// the leaves two nodes away, inside its sister clade.
function candidatePairs(t: Tree): Pair[] {
  const seen = new Set<string>();
  const out: Pair[] = [];
  const add = (a: NodeId, b: NodeId) => {
    const [x, y] = [a, b].sort((p, q) => LEAF_ORDER.indexOf(p) - LEAF_ORDER.indexOf(q));
    const key = `${x}-${y}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ a: x, b: y, d: r2(pathLength(t, x, y)) });
  };
  for (const leaf of leaves(t)) {
    const parent = t[t[leaf].parent!];
    const sisters = parent.children.filter((c) => c !== leaf);
    const sisterLeaves = sisters.filter((c) => t[c].leaf);
    if (sisterLeaves.length) sisterLeaves.forEach((s) => add(leaf, s));
    else
      sisters.forEach((s) =>
        t[s].children.filter((c) => t[c].leaf).forEach((c) => add(leaf, c)),
      );
  }
  return out.sort((p, q) => p.d - q.d);
}

/** Remove a leaf and collapse its parent if it is left with one child. Returns the merged child. */
function prune(t: Tree, leaf: NodeId): { merged?: NodeId; mergedFrom?: [number, number] } {
  const p = t[t[leaf].parent!];
  p.children = p.children.filter((c) => c !== leaf);
  delete t[leaf];
  if (p.children.length === 1 && p.parent) {
    const only = t[p.children[0]];
    const gp = t[p.parent];
    const before: [number, number] = [r2(only.len), r2(p.len)];
    only.len = only.len + p.len;
    only.parent = gp.id;
    gp.children = gp.children.map((c) => (c === p.id ? only.id : c));
    delete t[p.id];
    return { merged: only.id, mergedFrom: before };
  }
  return {};
}

type Phase = "start" | "scan" | "pick" | "prune" | "merge" | "end";
interface Frame {
  phase: Phase;
  tree: Tree;
  pairs: Pair[];
  best?: Pair;
  pruned?: NodeId;
  merged?: NodeId;
  L: number;
  caption: string;
}

function buildFrames(): { frames: Frame[]; L0: number } {
  let t = buildTree();
  const L0 = r2(treeLength(t));
  const frames: Frame[] = [
    {
      phase: "start",
      tree: t,
      pairs: [],
      L: L0,
      caption: `Start: 8 leaves. Add up every branch and the tree length is L = ${L0.toFixed(2)}, so RTL is 100%.`,
    },
  ];
  let iter = 0;
  while (leaves(t).length > STOP_AT) {
    iter += 1;
    const pairs = candidatePairs(t);
    const best = pairs[0];
    const drop = DROP_CHOICE[`${best.a}-${best.b}`] ?? best.b;
    const keep = drop === best.a ? best.b : best.a;
    const L = r2(treeLength(t));
    const cost = r2(t[drop].len);
    frames.push({
      phase: "scan",
      tree: t,
      pairs,
      L,
      caption: `Round ${iter}: list every leaf's close neighbours and how far apart they are (the sum of the branches between them).`,
    });
    frames.push({
      phase: "pick",
      tree: t,
      pairs,
      best,
      L,
      caption: `${best.a} and ${best.b} are the closest pair (${best.d.toFixed(2)}). They tell almost the same story, so one of them can go.`,
    });
    frames.push({
      phase: "prune",
      tree: t,
      pairs,
      best,
      pruned: drop,
      L,
      caption: `A coin flip picks ${drop}. Removing it costs only ${drop}'s own branch: ${cost.toFixed(2)}.`,
    });
    const next = clone(t);
    const { merged, mergedFrom } = prune(next, drop);
    const L2 = r2(treeLength(next));
    const mergeText =
      merged && mergedFrom
        ? `${keep}'s branch joins the one above it (${mergedFrom[0].toFixed(2)} + ${mergedFrom[1].toFixed(2)} = ${r2(mergedFrom[0] + mergedFrom[1]).toFixed(2)}), so no length is lost there. `
        : "";
    frames.push({
      phase: "merge",
      tree: next,
      pairs: [],
      merged,
      L: L2,
      caption: `${mergeText}L drops by exactly ${cost.toFixed(2)}: ${L.toFixed(2)} → ${L2.toFixed(2)}.`,
    });
    t = next;
  }
  const Lend = r2(treeLength(t));
  frames.push({
    phase: "end",
    tree: t,
    pairs: [],
    L: Lend,
    caption: `Stop at ${STOP_AT} leaves. Half the leaves are gone, but ${Math.round((Lend / L0) * 1000) / 10}% of the tree length is still there.`,
  });
  return { frames, L0 };
}

// ---------- layout ----------
const VB_W = 560;
const X0 = 22;
const X_SCALE = 420 / 0.7;
const Y0 = 22;
const DY = 32;
const STROKE = 2.5;

interface Geom {
  x1: number; // parent x
  x2: number; // node x
  y: number;
  vy1?: number; // vertical connector span (internal nodes)
  vy2?: number;
}
function layout(t: Tree): Record<NodeId, Geom> {
  const g: Record<NodeId, Geom> = {};
  const depth = (id: NodeId): number => (t[id].parent ? depth(t[id].parent!) + t[id].len : 0);
  const yOf = (id: NodeId): number =>
    t[id].leaf
      ? Y0 + LEAF_ORDER.indexOf(id) * DY
      : (yOf(t[id].children[0]) + yOf(t[id].children[t[id].children.length - 1])) / 2;
  for (const id of Object.keys(t)) {
    const n = t[id];
    const x2 = X0 + depth(id) * X_SCALE;
    const x1 = n.parent ? X0 + depth(n.parent) * X_SCALE : x2 - 10;
    const geom: Geom = { x1, x2, y: yOf(id) };
    if (!n.leaf) {
      geom.vy1 = yOf(n.children[0]);
      geom.vy2 = yOf(n.children[n.children.length - 1]);
    }
    g[id] = geom;
  }
  return g;
}

const ALL_IDS = INITIAL.map(([id]) => id);

export function TreemmerAnimation() {
  const { frames, L0 } = useMemo(buildFrames, []);
  const geoms = useMemo(() => {
    // carry the last known geometry forward for nodes that have been removed, so they can fade
    const out: Record<NodeId, Geom & { alive: boolean }>[] = [];
    let last: Record<NodeId, Geom> = {};
    for (const f of frames) {
      const cur = layout(f.tree);
      last = { ...last, ...cur };
      out.push(
        Object.fromEntries(ALL_IDS.map((id) => [id, { ...last[id], alive: Boolean(cur[id]) }])),
      );
    }
    return out;
  }, [frames]);

  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const userTouched = useRef(false);

  // autoplay once visible, unless the reader prefers reduced motion
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (userTouched.current) return;
        setPlaying(entry.isIntersecting);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const f = frames[i];
    const delay = f.phase === "scan" ? 3200 : f.phase === "end" ? 5000 : f.phase === "start" ? 3000 : 2600;
    const id = window.setTimeout(() => setI((k) => (k + 1) % frames.length), delay);
    return () => window.clearTimeout(id);
  }, [playing, i, frames]);

  const f = frames[i];
  const g = geoms[i];
  const rtl = f.L / L0;
  const nLeaves = leaves(f.tree).length;
  const go = (k: number) => {
    userTouched.current = true;
    setPlaying(false);
    setI(Math.max(0, Math.min(frames.length - 1, k)));
  };

  const isBest = (id: NodeId) => f.best && (f.best.a === id || f.best.b === id);
  const leafColor = (id: NodeId) =>
    f.pruned === id ? "var(--destructive)" : isBest(id) ? "var(--primary)" : "var(--ink)";
  const branchColor = (id: NodeId) =>
    f.pruned === id
      ? "var(--destructive)"
      : f.merged === id
        ? "var(--primary)"
        : isBest(id) && (f.phase === "pick" || f.phase === "prune")
          ? "var(--primary)"
          : "var(--muted-foreground)";
  const trans = "x 0.7s ease, y 0.7s ease, width 0.7s ease, height 0.7s ease, opacity 0.6s ease, fill 0.3s ease";

  return (
    <figure
      ref={rootRef}
      className="my-8 rounded-lg border border-border bg-card p-4 font-sans sm:p-5"
      style={{ "--fig-w": "min(100cqi, 46rem)" } as React.CSSProperties}
      aria-label="Animation of Treemmer pruning an eight-leaf tree"
    >
      <div className="mb-2 flex items-baseline justify-between gap-3 text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-widest">Treemmer, step by step</span>
        <span className="font-mono">
          frame {i + 1}/{frames.length}
        </span>
      </div>

      <svg viewBox={`0 0 ${VB_W} ${Y0 * 2 + DY * 7}`} className="block h-auto w-full" role="img"
        aria-label={f.caption}>
        {ALL_IDS.map((id) => {
          const n = g[id];
          if (!n) return null;
          if (id === "root")
            return n.vy1 !== undefined && n.vy2 !== undefined ? (
              <rect
                key={id}
                x={n.x2 - STROKE / 2}
                y={n.vy1 - STROKE / 2}
                width={STROKE}
                height={n.vy2 - n.vy1 + STROKE}
                style={{ y: n.vy1 - STROKE / 2, height: n.vy2 - n.vy1 + STROKE, transition: trans }}
                fill="var(--muted-foreground)"
              />
            ) : null;
          const opacity = n.alive && f.pruned !== id ? 1 : f.pruned === id ? 0.9 : 0;
          return (
            <g key={id}>
              <rect
                x={n.x1}
                y={n.y - STROKE / 2}
                width={Math.max(0, n.x2 - n.x1)}
                height={STROKE}
                style={{ x: n.x1, y: n.y - STROKE / 2, width: Math.max(0, n.x2 - n.x1), height: STROKE, transition: trans, opacity: n.alive ? 1 : 0 }}
                fill={branchColor(id)}
                strokeDasharray={f.pruned === id ? "4 3" : undefined}
              />
              {n.vy1 !== undefined && n.vy2 !== undefined && (
                <rect
                  x={n.x2 - STROKE / 2}
                  y={n.vy1 - STROKE / 2}
                  width={STROKE}
                  height={n.vy2 - n.vy1 + STROKE}
                  style={{ x: n.x2 - STROKE / 2, y: n.vy1 - STROKE / 2, width: STROKE, height: n.vy2 - n.vy1 + STROKE, transition: trans, opacity: n.alive ? 1 : 0 }}
                  fill="var(--muted-foreground)"
                />
              )}
              {INITIAL.find((r) => r[0] === id)?.[3] && (
                <g
                  style={{ transform: `translate(${n.x2}px, ${n.y}px)`, transition: "transform 0.7s ease, opacity 0.6s ease", opacity }}
                >
                  <circle r={5} fill={leafColor(id)} style={{ transition: "fill 0.3s ease" }} />
                  <text x={10} y={4} fontSize={13} fontWeight={600} fill={leafColor(id)}>
                    {id}
                  </text>
                  <text x={24} y={4} fontSize={11} fill="var(--muted-foreground)">
                    {f.tree[id] ? f.tree[id].len.toFixed(2) : ""}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        <rect x={X0 - 10} y={g.root.y - STROKE / 2} width={10} height={STROKE} fill="var(--muted-foreground)" />
      </svg>

      <div className="mt-3 min-h-[2.25rem]">
        {f.pairs.length > 0 ? (
          <div className="flex flex-wrap gap-1.5" aria-label="Candidate neighbour pairs">
            {f.pairs.map((p) => {
              const best = f.best && p.a === f.best.a && p.b === f.best.b;
              return (
                <span
                  key={`${p.a}-${p.b}`}
                  className={
                    "rounded-full border px-2 py-0.5 font-mono text-xs transition-colors " +
                    (best
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-muted-foreground")
                  }
                >
                  {p.a}-{p.b} {p.d.toFixed(2)}
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Leaf labels show each leaf's own (terminal) branch length.
          </p>
        )}
      </div>

      <div className="mt-3">
        <div className="mb-1 flex justify-between font-mono text-xs text-muted-foreground">
          <span>
            {nLeaves} leaves · L = {f.L.toFixed(2)}
          </span>
          <span className="text-ink">RTL {(rtl * 100).toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${rtl * 100}%`, transition: "width 0.7s ease" }}
          />
        </div>
      </div>

      <figcaption aria-live="polite" className="mt-3 min-h-[3rem] text-sm leading-relaxed text-ink">
        {f.caption}
      </figcaption>

      <div className="mt-3 flex items-center gap-1.5">
        {[
          { label: "Restart", icon: RotateCcw, onClick: () => go(0) },
          { label: "Previous step", icon: SkipBack, onClick: () => go(i - 1) },
          {
            label: playing ? "Pause" : "Play",
            icon: playing ? Pause : Play,
            onClick: () => {
              userTouched.current = true;
              if (!playing && i === frames.length - 1) setI(0);
              setPlaying(!playing);
            },
          },
          { label: "Next step", icon: SkipForward, onClick: () => go(i + 1) },
        ].map(({ label, icon: Icon, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">
          Toy tree with illustrative branch lengths.
        </span>
      </div>
    </figure>
  );
}

export default TreemmerAnimation;
