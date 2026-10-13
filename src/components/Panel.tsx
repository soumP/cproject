import Link from "next/link";
import type { Panel as PanelData } from "@/content/types";
import { getFramework } from "@/content/frameworks";
import { Avatar, personas } from "./Persona";
import { Visual } from "./Visual";

export function Panel({ panel }: { panel: PanelData }) {
  const { speaker, text, visual, callout } = panel;
  const framework = callout?.framework ? getFramework(callout.framework) : undefined;

  return (
    <div className={`panel panel-${speaker}`}>
      {speaker === "narrator" ? (
        <p className="caption">{text}</p>
      ) : (
        <div className="speech">
          <div className="speech-who">
            <Avatar speaker={speaker} />
            <span className="speech-name">
              {personas[speaker].name}
              <small>{personas[speaker].role}</small>
            </span>
          </div>
          <p className="bubble">{text}</p>
        </div>
      )}
      {visual && <Visual visual={visual} />}
      {callout && (
        <aside className="callout">
          <span aria-hidden="true">✎</span>{" "}
          {framework ? <Link href={`/frameworks/${framework.slug}`}>{callout.label}</Link> : callout.label}
        </aside>
      )}
    </div>
  );
}

export function PanelStrip({ panels }: { panels: PanelData[] }) {
  return (
    <div className="strip">
      {panels.map((p, i) => (
        <Panel key={i} panel={p} />
      ))}
    </div>
  );
}
