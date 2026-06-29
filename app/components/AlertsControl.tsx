import { useState } from "react";
import { AlertTriangle, Flame, Zap, ShieldAlert, Radio, CheckCircle, Clock, ChevronDown, ChevronUp, XCircle, Bell, BellOff } from "lucide-react";

type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type Category = "SECURITY" | "FIRE" | "POWER" | "ATC" | "MEDICAL" | "WEATHER";

interface Alert {
  id: string;
  severity: Severity;
  category: Category;
  title: string;
  description: string;
  location: string;
  time: string;
  assignee: string | null;
  acknowledged: boolean;
}

const ALERTS: Alert[] = [
  { id: "ALT-0041", severity: "CRITICAL", category: "SECURITY", title: "Unattended bag — Concourse B", description: "Unattended baggage reported near Gate B7. TSA K-9 unit dispatched. Area cleared of civilians.", location: "Concourse B, Gate B7", time: "14:02", assignee: "Officer Diaz", acknowledged: false },
  { id: "ALT-0040", severity: "HIGH", category: "FIRE", title: "Smoke detector triggered — Kitchen 3A", description: "Smoke alarm activated in Food Court kitchen unit 3A. Fire suppression system engaged. Crew responding.", location: "Terminal A, Level 2", time: "13:58", assignee: "Station 7 Fire", acknowledged: true },
  { id: "ALT-0039", severity: "HIGH", category: "ATC", title: "Communication loss — Flight UA-887", description: "Intermittent radio contact with UA-887 for 4 minutes. Contact re-established. Monitoring closely.", location: "ATC Tower", time: "13:51", assignee: "Controller Brooks", acknowledged: true },
  { id: "ALT-0038", severity: "MEDIUM", category: "POWER", title: "UPS battery low — Server Room B2", description: "Uninterruptible power supply below 20% threshold. Generator standby activated.", location: "IT Infrastructure B2", time: "13:40", assignee: "Facilities Mgmt.", acknowledged: false },
  { id: "ALT-0037", severity: "MEDIUM", category: "WEATHER", title: "Wind shear advisory in effect", description: "Pilot reports of wind shear on approach to Runway 28L. Advisory issued to all inbound traffic.", location: "Runway 28L", time: "13:35", assignee: "Meteorology", acknowledged: true },
  { id: "ALT-0036", severity: "MEDIUM", category: "MEDICAL", title: "Passenger medical — Gate C2", description: "Passenger reported chest discomfort at Gate C2. EMT responding. Flight held for 15 minutes.", location: "Terminal C, Gate C2", time: "13:22", assignee: "EMT Unit 4", acknowledged: true },
  { id: "ALT-0035", severity: "LOW", category: "SECURITY", title: "CCTV offline — Parking Garage P2", description: "Camera feed lost for section P2-D. Maintenance ticket logged. Manual patrol assigned.", location: "Parking Garage P2", time: "12:55", assignee: "Maintenance", acknowledged: true },
  { id: "ALT-0034", severity: "LOW", category: "POWER", title: "Lighting outage — Jetway A4", description: "Overhead lighting at Jetway A4 not responding. Emergency lighting operational. Scheduled for repair.", location: "Jetway A4", time: "12:30", assignee: "Facilities", acknowledged: false },
];

const severityConfig: Record<Severity, { color: string; bg: string; border: string; glow: string }> = {
  CRITICAL: { color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/40",    glow: "shadow-[0_0_12px_rgba(248,113,113,0.2)]" },
  HIGH:     { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/40", glow: "shadow-[0_0_8px_rgba(251,146,60,0.15)]" },
  MEDIUM:   { color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/40",  glow: "" },
  LOW:      { color: "text-slate-400",  bg: "bg-slate-400/10",  border: "border-slate-400/25",  glow: "" },
};

const categoryIcon: Record<Category, JSX.Element> = {
  SECURITY: <ShieldAlert size={14} />,
  FIRE:     <Flame size={14} />,
  POWER:    <Zap size={14} />,
  ATC:      <Radio size={14} />,
  MEDICAL:  <CheckCircle size={14} />,
  WEATHER:  <AlertTriangle size={14} />,
};

const categoryColor: Record<Category, string> = {
  SECURITY: "text-red-400",
  FIRE:     "text-orange-400",
  POWER:    "text-yellow-400",
  ATC:      "text-sky-400",
  MEDICAL:  "text-emerald-400",
  WEATHER:  "text-violet-400",
};

export function AlertsControl() {
  const [alerts, setAlerts] = useState(ALERTS);
  const [expandedId, setExpandedId] = useState<string | null>("ALT-0041");
  const [filterSev, setFilterSev] = useState<Severity | "ALL">("ALL");
  const [filterAck, setFilterAck] = useState<"ALL" | "PENDING" | "ACKNOWLEDGED">("ALL");
  const [silenced, setSilenced] = useState(false);

  const filtered = alerts.filter(a => {
    const sevMatch = filterSev === "ALL" || a.severity === filterSev;
    const ackMatch = filterAck === "ALL" || (filterAck === "PENDING" ? !a.acknowledged : a.acknowledged);
    return sevMatch && ackMatch;
  });

  const critical = alerts.filter(a => a.severity === "CRITICAL" && !a.acknowledged).length;
  const high = alerts.filter(a => a.severity === "HIGH" && !a.acknowledged).length;
  const pending = alerts.filter(a => !a.acknowledged).length;

  function acknowledge(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }

  function dismiss(id: string) {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-red-400/10 border border-red-400/30 rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(248,113,113,0.12)]">
          <div className="text-xs text-red-300/70 uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Critical — Unacked</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className={`text-3xl text-red-400 ${critical > 0 ? "animate-pulse" : ""}`}>{critical}</div>
        </div>
        <div className="bg-orange-400/8 border border-orange-400/25 rounded-lg px-4 py-3">
          <div className="text-xs text-orange-300/70 uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>High — Unacked</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-3xl text-orange-400">{high}</div>
        </div>
        <div className="bg-card border border-border rounded-lg px-4 py-3">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Total Pending</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-3xl text-foreground">{pending}</div>
        </div>
        <div className="bg-card border border-border rounded-lg px-4 py-3 flex flex-col justify-between">
          <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>Alarm Tone</div>
          <button
            onClick={() => setSilenced(s => !s)}
            className={`flex items-center gap-2 text-sm transition-colors cursor-pointer ${silenced ? "text-muted-foreground" : "text-amber-400"}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {silenced ? <BellOff size={16} /> : <Bell size={16} />}
            {silenced ? "SILENCED" : "ACTIVE"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">Severity:</span>
        {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterSev(s)}
            className={`text-xs px-2.5 py-1 rounded border transition-all cursor-pointer ${filterSev === s ? (s === "ALL" ? "bg-sky-400/15 border-sky-400/40 text-sky-400" : `${severityConfig[s as Severity]?.bg ?? ""} ${severityConfig[s as Severity]?.border ?? ""} ${severityConfig[s as Severity]?.color ?? ""}`) : "border-border text-muted-foreground"}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {s}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-4 mr-1">Status:</span>
        {(["ALL", "PENDING", "ACKNOWLEDGED"] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterAck(s)}
            className={`text-xs px-2.5 py-1 rounded border transition-all cursor-pointer ${filterAck === s ? "bg-sky-400/15 border-sky-400/40 text-sky-400" : "border-border text-muted-foreground"}`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Alert list */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <CheckCircle size={28} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-foreground">No alerts matching current filters</p>
          </div>
        )}
        {filtered.map(alert => {
          const cfg = severityConfig[alert.severity];
          const expanded = expandedId === alert.id;
          return (
            <div
              key={alert.id}
              className={`border rounded-lg overflow-hidden transition-all ${cfg.border} ${cfg.glow} ${alert.acknowledged ? "opacity-60" : ""}`}
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/2 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : alert.id)}
              >
                {/* Severity indicator */}
                <div className={`w-1 h-8 rounded-full shrink-0 ${alert.severity === "CRITICAL" ? "bg-red-400 animate-pulse" : alert.severity === "HIGH" ? "bg-orange-400" : alert.severity === "MEDIUM" ? "bg-amber-400" : "bg-slate-500"}`} />

                <div className={`flex items-center gap-1.5 text-xs shrink-0 ${categoryColor[alert.category]}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {categoryIcon[alert.category]}
                  {alert.category}
                </div>

                <div className={`text-xs px-2 py-0.5 rounded border shrink-0 ${cfg.bg} ${cfg.border} ${cfg.color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {alert.severity}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-foreground text-sm truncate">{alert.title}</div>
                  <div className="text-muted-foreground text-xs">{alert.location}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={11} /> {alert.time}
                  </span>
                  {alert.acknowledged ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      <CheckCircle size={12} /> ACK
                    </span>
                  ) : (
                    <span className="text-xs text-amber-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>PENDING</span>
                  )}
                  {expanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                </div>
              </button>

              {expanded && (
                <div className="px-4 pb-4 bg-black/10 border-t border-border/40">
                  <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                          { label: "Alert ID", val: alert.id },
                          { label: "Assigned To", val: alert.assignee ?? "Unassigned" },
                          { label: "Location", val: alert.location },
                          { label: "Time", val: alert.time },
                        ].map(row => (
                          <div key={row.label}>
                            <span className="text-muted-foreground">{row.label}: </span>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-foreground">{row.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-end">
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledge(alert.id)}
                          className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-emerald-400/15 border border-emerald-400/30 text-emerald-400 rounded hover:bg-emerald-400/25 transition-colors cursor-pointer"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          <CheckCircle size={13} /> Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => dismiss(alert.id)}
                        className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 bg-slate-400/10 border border-slate-400/20 text-slate-400 rounded hover:bg-slate-400/20 transition-colors cursor-pointer"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        <XCircle size={13} /> Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
