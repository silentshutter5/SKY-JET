import { useState } from "react";
import { Plane, Users, Wrench, Clock, CheckCircle, AlertCircle, XCircle, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type GateStatus = "ACTIVE" | "BOARDING" | "MAINTENANCE" | "AVAILABLE" | "DELAYED";

interface Gate {
  id: string;
  terminal: string;
  flight: string | null;
  airline: string | null;
  aircraft: string | null;
  destination: string | null;
  depTime: string | null;
  passengers: number | null;
  status: GateStatus;
  agent: string;
  turnaround: number | null;
}

const gates: Gate[] = [
  { id: "A1", terminal: "A", flight: "AA-2341", airline: "American", aircraft: "B737-800", destination: "LAX", depTime: "14:30", passengers: 162, status: "BOARDING", agent: "Rivera, M.", turnaround: 45 },
  { id: "A2", terminal: "A", flight: null, airline: null, aircraft: null, destination: null, depTime: null, passengers: null, status: "AVAILABLE", agent: "—", turnaround: null },
  { id: "A3", terminal: "A", flight: "UA-887", airline: "United", aircraft: "A320", destination: "MIA", depTime: "14:15", passengers: 148, status: "DELAYED", agent: "Chen, L.", turnaround: 60 },
  { id: "A4", terminal: "A", flight: "DL-903", airline: "Delta", aircraft: "B757", destination: "ATL", depTime: "15:20", passengers: 183, status: "ACTIVE", agent: "Park, S.", turnaround: 38 },
  { id: "B1", terminal: "B", flight: null, airline: null, aircraft: null, destination: null, depTime: null, passengers: null, status: "MAINTENANCE", agent: "Tech: Johnson", turnaround: null },
  { id: "B2", terminal: "B", flight: "SW-5532", airline: "Southwest", aircraft: "B737-700", destination: "PHX", depTime: "15:00", passengers: 137, status: "ACTIVE", agent: "Martinez, K.", turnaround: 32 },
  { id: "B3", terminal: "B", flight: "DL-1204", airline: "Delta", aircraft: "B757-200", destination: "SEA", depTime: "14:45", passengers: 192, status: "BOARDING", agent: "Kim, J.", turnaround: 52 },
  { id: "B4", terminal: "B", flight: null, airline: null, aircraft: null, destination: null, depTime: null, passengers: null, status: "AVAILABLE", agent: "—", turnaround: null },
  { id: "C1", terminal: "C", flight: "BA-294", airline: "British Airways", aircraft: "A380", destination: "LHR", depTime: "16:00", passengers: 412, status: "ACTIVE", agent: "Thompson, R.", turnaround: 90 },
  { id: "C2", terminal: "C", flight: "LH-456", airline: "Lufthansa", aircraft: "A350", destination: "FRA", depTime: "17:30", passengers: 290, status: "AVAILABLE", agent: "Williams, P.", turnaround: null },
  { id: "C3", terminal: "C", flight: "AA-1102", airline: "American", aircraft: "B777", destination: "DFW", depTime: "16:45", passengers: 289, status: "DELAYED", agent: "Santos, A.", turnaround: 75 },
  { id: "D1", terminal: "D", flight: null, airline: null, aircraft: null, destination: null, depTime: null, passengers: null, status: "MAINTENANCE", agent: "Tech: Anderson", turnaround: null },
];

const statusConfig: Record<GateStatus, { color: string; bg: string; icon: JSX.Element; dot: string }> = {
  ACTIVE:      { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/25", icon: <CheckCircle size={13} />, dot: "bg-emerald-400" },
  BOARDING:    { color: "text-sky-400",     bg: "bg-sky-400/10 border-sky-400/25",         icon: <Users size={13} />,       dot: "bg-sky-400" },
  MAINTENANCE: { color: "text-amber-400",  bg: "bg-amber-400/10 border-amber-400/25",     icon: <Wrench size={13} />,      dot: "bg-amber-400" },
  AVAILABLE:   { color: "text-slate-400",  bg: "bg-slate-400/10 border-slate-400/25",     icon: <CheckCircle size={13} />, dot: "bg-slate-600" },
  DELAYED:     { color: "text-red-400",    bg: "bg-red-400/10 border-red-400/25",          icon: <AlertCircle size={13} />, dot: "bg-red-400" },
};

const turnaroundData = [
  { terminal: "A", avg: 44 },
  { terminal: "B", avg: 38 },
  { terminal: "C", avg: 78 },
  { terminal: "D", avg: 0 },
];

export function GateManagement() {
  const [selectedTerminal, setSelectedTerminal] = useState<string>("ALL");
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);

  const terminals = ["ALL", "A", "B", "C", "D"];
  const filtered = selectedTerminal === "ALL" ? gates : gates.filter(g => g.terminal === selectedTerminal);

  const counts = {
    active: gates.filter(g => g.status === "ACTIVE").length,
    boarding: gates.filter(g => g.status === "BOARDING").length,
    delayed: gates.filter(g => g.status === "DELAYED").length,
    maintenance: gates.filter(g => g.status === "MAINTENANCE").length,
    available: gates.filter(g => g.status === "AVAILABLE").length,
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Main panel */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Summary row */}
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: "Active", count: counts.active, cls: "text-emerald-400" },
            { label: "Boarding", count: counts.boarding, cls: "text-sky-400" },
            { label: "Delayed", count: counts.delayed, cls: "text-red-400" },
            { label: "Maintenance", count: counts.maintenance, cls: "text-amber-400" },
            { label: "Available", count: counts.available, cls: "text-slate-400" },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg px-4 py-3 text-center">
              <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className={`text-2xl ${s.cls}`}>{s.count}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Terminal tabs */}
        <div className="flex items-center gap-2">
          {terminals.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTerminal(t)}
              className={`px-4 py-1.5 rounded text-sm transition-all cursor-pointer border ${selectedTerminal === t ? "bg-sky-400/15 border-sky-400/40 text-sky-400" : "border-border text-muted-foreground hover:text-foreground"}`}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {t === "ALL" ? "All Terminals" : `Terminal ${t}`}
            </button>
          ))}
        </div>

        {/* Gate grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(gate => {
            const cfg = statusConfig[gate.status];
            return (
              <button
                key={gate.id}
                onClick={() => setSelectedGate(gate)}
                className={`bg-card border rounded-lg p-4 text-left hover:border-sky-400/30 transition-all cursor-pointer ${selectedGate?.id === gate.id ? "border-sky-400/60 ring-1 ring-sky-400/20" : "border-border"}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-foreground">Gate {gate.id}</span>
                  <span className={`w-2 h-2 rounded-full ${cfg.dot} ${gate.status === "BOARDING" ? "animate-pulse" : ""}`} />
                </div>
                <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border mb-2 ${cfg.bg} ${cfg.color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  {cfg.icon} {gate.status}
                </div>
                {gate.flight ? (
                  <>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-xs text-sky-400 mt-1">{gate.flight}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{gate.airline} → {gate.destination}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <Clock size={11} /> {gate.depTime}
                      {gate.passengers && <span className="ml-2"><Users size={11} className="inline mr-0.5" />{gate.passengers} pax</span>}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground mt-2">
                    {gate.status === "MAINTENANCE" ? "Under maintenance" : "No flight assigned"}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Turnaround chart */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-foreground tracking-wide mb-4">Avg. Turnaround Time by Terminal (min)</h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={turnaroundData} barSize={40}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(56,189,248,0.08)" vertical={false} />
              <XAxis key="xaxis" dataKey="terminal" tick={{ fill: "#64748b", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fill: "#64748b", fontSize: 12, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 6, color: "#e2e8f0", fontSize: 12 }} />
              <Bar key="bar-avg" dataKey="avg" fill="#38bdf8" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail panel */}
      <div className="w-72 shrink-0">
        {selectedGate ? (
          <div className="bg-card border border-sky-400/20 rounded-lg p-5 sticky top-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground">Gate {selectedGate.id} Detail</h3>
              <button onClick={() => setSelectedGate(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <XCircle size={16} />
              </button>
            </div>
            <div className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded border mb-4 ${statusConfig[selectedGate.status].bg} ${statusConfig[selectedGate.status].color}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {statusConfig[selectedGate.status].icon} {selectedGate.status}
            </div>

            <div className="space-y-3 text-sm">
              {[
                { label: "Terminal", val: selectedGate.terminal },
                { label: "Flight", val: selectedGate.flight ?? "—" },
                { label: "Airline", val: selectedGate.airline ?? "—" },
                { label: "Aircraft", val: selectedGate.aircraft ?? "—" },
                { label: "Destination", val: selectedGate.destination ?? "—" },
                { label: "Departure", val: selectedGate.depTime ?? "—" },
                { label: "Passengers", val: selectedGate.passengers ? `${selectedGate.passengers} pax` : "—" },
                { label: "Gate Agent", val: selectedGate.agent },
                { label: "Turnaround", val: selectedGate.turnaround ? `${selectedGate.turnaround} min` : "—" },
              ].map(row => (
                <div key={row.label} className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-muted-foreground text-xs">{row.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-foreground text-xs">{row.val}</span>
                </div>
              ))}
            </div>

            {selectedGate.status === "DELAYED" && (
              <div className="mt-4 flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-md px-3 py-2">
                <AlertCircle size={13} />
                Delay notification sent to passengers
              </div>
            )}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center h-48">
            <Plane size={24} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">Select a gate to view details</p>
          </div>
        )}
      </div>
    </div>
  );
}
