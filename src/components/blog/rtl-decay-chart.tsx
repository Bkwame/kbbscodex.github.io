/**
 * RTL decay for the two datasets in Menardo et al. (2018), drawn from the decay files
 * shipped in the Treemmer repository. x is normalised to "% of leaves removed" so a
 * 10,303-leaf tree and a 2,079-leaf tree can share one axis.
 */
import { useMemo, useRef, useState } from "react";
import { FLU_DECAY, FLU_LEAVES, MTB_DECAY, MTB_LEAVES } from "./rtl-decay-data";

const W = 600;
const H = 330;
const M = { top: 34, right: 16, bottom: 44, left: 48 };
const IW = W - M.left - M.right;
const IH = H - M.top - M.bottom;
const sx = (pct: number) => M.left + (pct / 100) * IW;
const sy = (rtl: number) => M.top + (1 - rtl) * IH;
const path = (pts: [number, number][]) =>
  pts.map(([x, y], k) => `${k ? "L" : "M"}${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join("");

const SERIES = [
  {
    key: "mtb",
    name: "M. tuberculosis",
    color: "var(--series-1)",
    data: MTB_DECAY,
    leaves: MTB_LEAVES,
  },
  {
    key: "flu",
    name: "Influenza A (H3N2)",
    color: "var(--series-2)",
    data: FLU_DECAY,
    leaves: FLU_LEAVES,
  },
] as const;

// points called out in the text
const MARKS = [
  { series: 0, pct: 52.2, rtl: 0.95, label: "RTL 0.95 with 52% of genomes removed", dx: -6, dy: -14, anchor: "middle" },
  { series: 1, pct: 88.0, rtl: 0.353, label: "250 leaves left: 35% kept", dx: -10, dy: 20, anchor: "end" },
] as const;

function valueAt(data: readonly [number, number][], pct: number) {
  let best = data[0];
  for (const p of data) if (Math.abs(p[0] - pct) < Math.abs(best[0] - pct)) best = p;
  return best;
}

export function RtlDecayChart() {
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const paths = useMemo(() => SERIES.map((s) => path(s.data as [number, number][])), []);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const pct = ((x - M.left) / IW) * 100;
    setHover(pct < 0 || pct > 100 ? null : Math.round(pct * 2) / 2);
  };

  const tip =
    hover === null
      ? null
      : SERIES.map((s) => {
          const [, rtl] = valueAt(s.data, hover);
          return { name: s.name, color: s.color, rtl, left: Math.round(s.leaves * (1 - hover / 100)) };
        });
  const tipLeft = hover !== null && hover > 60;

  return (
    <figure className="my-8 rounded-lg border border-border bg-card p-4 font-sans sm:p-5">
      <div className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        RTL decay, real data from the paper
      </div>
      <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground" aria-hidden>
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <span className="inline-block h-0.5 w-4 rounded" style={{ background: s.color }} />
            {s.key === "mtb" ? <em>M. tuberculosis</em> : s.name}
          </span>
        ))}
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full touch-none"
          role="img"
          aria-label="Relative tree length against percent of leaves removed. The tuberculosis curve stays near 100% until about half the leaves are removed; the influenza curve falls steadily from the start."
          onPointerMove={onMove}
          onPointerDown={onMove}
          onPointerLeave={() => setHover(null)}
        >
          {[0, 0.25, 0.5, 0.75, 1].map((v) => (
            <g key={v}>
              <line x1={M.left} x2={W - M.right} y1={sy(v)} y2={sy(v)} stroke="var(--border)" strokeWidth={1} />
              <text x={M.left - 8} y={sy(v) + 4} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">
                {v * 100}%
              </text>
            </g>
          ))}
          {[0, 25, 50, 75, 100].map((v) => (
            <text key={v} x={sx(v)} y={H - M.bottom + 18} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
              {v}%
            </text>
          ))}
          <text x={M.left + IW / 2} y={H - 6} textAnchor="middle" fontSize={11.5} fill="var(--muted-foreground)">
            Leaves removed
          </text>
          <text
            transform={`translate(12 ${M.top + IH / 2}) rotate(-90)`}
            textAnchor="middle"
            fontSize={11.5}
            fill="var(--muted-foreground)"
          >
            Tree length kept (RTL)
          </text>

          {SERIES.map((s, k) => (
            <path key={s.key} d={paths[k]} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
          ))}

          {/* direct labels */}
          <text x={sx(79)} y={sy(0.86)} fontSize={12} fontWeight={600} fill="var(--ink)">
            <tspan fontStyle="italic">M. tuberculosis</tspan>
          </text>
          <text x={sx(26)} y={sy(0.72)} fontSize={12} fontWeight={600} fill="var(--ink)">
            Influenza A (H3N2)
          </text>

          {MARKS.map((m) => (
            <g key={m.label}>
              <circle cx={sx(m.pct)} cy={sy(m.rtl)} r={5} fill={SERIES[m.series].color} stroke="var(--card)" strokeWidth={2} />
              <text
                x={sx(m.pct) + m.dx}
                y={sy(m.rtl) + m.dy}
                textAnchor={m.anchor}
                fontSize={11.5}
                fill="var(--ink)"
              >
                {m.label}
              </text>
            </g>
          ))}

          {hover !== null && (
            <g pointerEvents="none">
              <line x1={sx(hover)} x2={sx(hover)} y1={M.top} y2={M.top + IH} stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3 3" />
              {SERIES.map((s) => (
                <circle key={s.key} cx={sx(hover)} cy={sy(valueAt(s.data, hover)[1])} r={4.5} fill={s.color} stroke="var(--card)" strokeWidth={2} />
              ))}
            </g>
          )}
        </svg>

        {tip && hover !== null && (
          <div
            className="pointer-events-none absolute top-2 rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-sm"
            style={tipLeft ? { left: `calc(${(sx(hover) / W) * 100}% - 12px)`, transform: "translateX(-100%)" } : { left: `calc(${(sx(hover) / W) * 100}% + 12px)` }}
          >
            <div className="mb-1 font-mono text-muted-foreground">{hover}% of leaves removed</div>
            {tip.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-ink">
                <span className="inline-block h-2 w-2 rounded-full" style={{ background: t.color }} />
                <span>{t.name}</span>
                <span className="ml-auto pl-3 font-mono">{(t.rtl * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <details className="mt-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer select-none">Show as a table</summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr>
              <th className="py-1 pr-3 font-medium">Leaves removed</th>
              {SERIES.map((s) => (
                <th key={s.key} className="py-1 pr-3 font-medium">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono">
            {[25, 50, 75, 90].map((p) => (
              <tr key={p}>
                <td className="py-1 pr-3">{p}%</td>
                {SERIES.map((s) => (
                  <td key={s.key} className="py-1 pr-3">
                    {(valueAt(s.data, p)[1] * 100).toFixed(1)}%
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <figcaption className="mt-2 text-xs leading-relaxed text-muted-foreground">
        One run at resolution 1, from the decay files in the{" "}
        <a href="https://github.com/fmenardo/Treemmer" target="_blank" rel="noreferrer">
          Treemmer repository
        </a>
        . Hover or tap the chart to read values.
      </figcaption>
    </figure>
  );
}

export default RtlDecayChart;
