import type { Visual as VisualData } from "@/content/types";

function Chart({ label, points, markAt, markLabel }: Extract<VisualData, { kind: "chart" }>) {
  const w = 320;
  const h = 120;
  const pad = 10;
  const min = Math.min(...points) - 2;
  const max = Math.max(...points) + 2;
  const x = (i: number) => pad + (i / (points.length - 1)) * (w - pad * 2);
  const y = (v: number) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);
  const path = points.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  return (
    <figure className="viz viz-chart">
      <figcaption>{label}</figcaption>
      <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label}>
        <path d={path} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
        {markAt !== undefined && (
          <g>
            <line x1={x(markAt)} x2={x(markAt)} y1={pad} y2={h - pad} stroke="var(--danger)" strokeDasharray="4 3" />
            <circle cx={x(markAt)} cy={y(points[markAt])} r="4.5" fill="var(--danger)" />
            {markLabel && (
              <text x={x(markAt) - 6} y={pad + 10} textAnchor="end" className="viz-mark">
                {markLabel}
              </text>
            )}
          </g>
        )}
      </svg>
    </figure>
  );
}

export function Visual({ visual }: { visual: VisualData }) {
  switch (visual.kind) {
    case "metric":
      return (
        <div className="viz viz-metric">
          <span className="viz-metric-label">{visual.label}</span>
          <span className="viz-metric-value">{visual.value}</span>
          {visual.delta && <span className={`viz-metric-delta trend-${visual.trend ?? "flat"}`}>{visual.delta}</span>}
        </div>
      );
    case "chart":
      return <Chart {...visual} />;
    case "screen":
      return (
        <div className="viz viz-screen" aria-label={`App screen: ${visual.title}`}>
          <div className="viz-screen-notch" />
          <strong>{visual.title}</strong>
          {visual.lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      );
    case "list":
      return (
        <div className="viz viz-list">
          {visual.title && <strong>{visual.title}</strong>}
          <ul>
            {visual.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      );
    case "table":
      return (
        <div className="viz viz-table">
          <table>
            <thead>
              <tr>
                {visual.columns.map((c, i) => (
                  <th key={i}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visual.rows.map((row, r) => (
                <tr key={r} className={r === visual.highlightRow ? "is-highlight" : undefined}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "tree":
      return (
        <div className="viz viz-tree">
          <div className="viz-tree-root">{visual.root}</div>
          <div className="viz-tree-branches">
            {visual.branches.map((b) => (
              <div key={b.label} className="viz-tree-branch">
                <div className="viz-tree-label">{b.label}</div>
                <ul>
                  {b.leaves.map((leaf) => (
                    <li key={leaf}>{leaf}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
  }
}
