import { useState, useEffect } from "react";
import {
  Plane, AlertTriangle, CheckCircle, Clock, Wind, Eye,
  Thermometer, Users, TrendingUp, TrendingDown, RefreshCw,
  Radio, Shield, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from "recharts";

const flightData = [
  { id: "AA-2341", origin: "JFK", dest: "LAX", status: "ON TIME", gate: "A12", dep: "14:30", arr: "18:45", aircraft: "B737" },
  { id: "UA-887", origin: "ORD", dest: "MIA", status: "DELAYED", gate: "B7", dep: "14:15", arr: "18:20", aircraft: "A320" },
  { id: "DL-1204", origin: "ATL", dest: "SEA", status: "BOARDING", gate: "C3", dep: "14:45", arr: "17:55", aircraft: "B757" },
  { id: "SW-5532", origin: "DEN", dest: "PHX", status: "ON TIME", gate: "D18", dep: "15:00", arr: "16:30", aircraft: "B737" },
  { id: "BA-294", origin: "LHR", dest: "BOS", status: "LANDED", gate: "E2", dep: "06:15", arr: "14:10", aircraft: "A380" },
  { id: "AA-901", origin: "DFW", dest: "JFK", status: "CANCELLED", gate: "A5", dep: "13:50", arr: "18:15", aircraft: "B777" },
  { id: "UA-442", origin: "SFO", dest: "ORD", status: "IN FLIGHT", gate: "B14", dep: "11:00", arr: "17:30", aircraft: "B787" },
  { id: "LH-456", origin: "FRA", dest: "JFK", status: "ON TIME", gate: "F1", dep: "08:20", arr: "11:45", aircraft: "A350" },
];

const trafficData = [
  { time: "06:00", departures: 12, arrivals: 8 },
  { time: "08:00", departures: 34, arrivals: 22 },
  { time: "10:00", departures: 28, arrivals: 41 },
  { time: "12:00", departures: 45, arrivals: 38 },
  { time: "14:00", departures: 52, arrivals: 47 },
  { time: "16:00", departures: 61, arrivals: 53 },
  { time: "18:00", departures: 48, arrivals: 66 },
  { time: "20:00", departures: 29, arrivals: 44 },
];

const statusColors: Record<string, string> = {
  "ON TIME": "text-emerald-400",
  "DELAYED": "text-amber-400",
  "BOARDING": "text-sky-400",
  "LANDED": "text-slate-400",
  "CANCELLED": "text-red-400",
  "IN FLIGHT": "text-violet-400",
};

const statusBg: Record<string, string> = {
  "ON TIME": "bg-emerald-400/10 border-emerald-400/30",
  "DELAYED": "bg-amber-400/10 border-amber-400/30",
  "BOARDING": "bg-sky-400/10 border-sky-400/30",
  "LANDED": "bg-slate-400/10 border-slate-400/30",
  "CANCELLED": "bg-red-400/10 border-red-400/30",
  "IN FLIGHT": "bg-violet-400/10 border-violet-400/30",
};

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-sky-400 tabular-nums">
      {time.toLocaleTimeString("en-US", { hour12: false })} UTC
    </span>
  );
}

export function OperationsDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const filtered = selectedStatus
    ? flightData.filter(f => f.status === selectedStatus)
    : flightData;

  const kpis = [
    { label: "Total Flights Today", value: "284", delta: "+12", up: true, icon: <Plane size={16} /> },
    { label: "On-Time Performance", value: "87.4%", delta: "+2.1%", up: true, icon: <CheckCircle size={16} /> },
    { label: "Active Delays", value: "23", delta: "+5", up: false, icon: <Clock size={16} /> },
    { label: "Passengers Today", value: "41,820", delta: "+3,200", up: true, icon: <Users size={16} /> },
    { label: "Fuel Alerts", value: "3", delta: "-1", up: true, icon: <Zap size={16} /> },
    { label: "ATC Comm Quality", value: "98.7%", delta: "stable", up: true, icon: <Radio size={16} /> },
  ];

  return (
    <div className="space-y-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="bg-card border border-border rounded-lg p-4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-muted-foreground">
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-xs uppercase tracking-widest">{k.label}</span>
              <span className="text-sky-400/60">{k.icon}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-2xl text-foreground">{k.value}</div>
            <div className={`flex items-center gap-1 text-xs ${k.up ? "text-emerald-400" : "text-red-400"}`}>
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {k.delta} vs yesterday
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-card border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground tracking-wide">Traffic Volume — Today</h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />Departures</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />Arrivals</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient key="grad-dep" id="ops-dep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient key="grad-arr" id="ops-arr" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(56,189,248,0.08)" />
              <XAxis key="xaxis" dataKey="time" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 6, color: "#e2e8f0", fontSize: 12 }} />
              <Area key="area-dep" type="monotone" dataKey="departures" stroke="#38bdf8" strokeWidth={2} fill="url(#ops-dep)" />
              <Area key="area-arr" type="monotone" dataKey="arrivals" stroke="#a78bfa" strokeWidth={2} fill="url(#ops-arr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weather */}
        <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-4">
          <h3 className="text-foreground tracking-wide">Weather Conditions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Visibility", value: "9.2 mi", icon: <Eye size={14} />, ok: true },
              { label: "Wind", value: "14 kt NW", icon: <Wind size={14} />, ok: true },
              { label: "Temp", value: "62°F", icon: <Thermometer size={14} />, ok: true },
              { label: "Ceiling", value: "3,200 ft", icon: <Shield size={14} />, ok: false },
            ].map(w => (
              <div key={w.label} className="bg-muted/40 rounded-md p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <span className={w.ok ? "text-sky-400" : "text-amber-400"}>{w.icon}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-xs uppercase tracking-wider">{w.label}</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className={`text-base ${w.ok ? "text-foreground" : "text-amber-400"}`}>{w.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-md px-3 py-2">
              <AlertTriangle size={13} />
              Low ceiling advisory — ILS approaches in effect
            </div>
          </div>
        </div>
      </div>

      {/* Flight table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-foreground tracking-wide">Live Flight Board</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {["ON TIME", "DELAYED", "BOARDING", "IN FLIGHT", "LANDED", "CANCELLED"].map(s => (
              <button
                key={s}
                onClick={() => setSelectedStatus(selectedStatus === s ? null : s)}
                className={`text-xs px-2 py-1 rounded border transition-all cursor-pointer ${selectedStatus === s ? statusBg[s] + " " + statusColors[s] : "border-border text-muted-foreground hover:border-sky-400/30"}`}
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {s}
              </button>
            ))}
            <button className="text-muted-foreground hover:text-sky-400 transition-colors cursor-pointer">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {["Flight", "Route", "Status", "Gate", "Departure", "Arrival", "Aircraft"].map(h => (
                  <th key={h} className="text-left text-xs uppercase tracking-widest px-4 py-2 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((f, i) => (
                <tr key={f.id} className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? "" : "bg-muted/5"}`}>
                  <td className="px-4 py-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <span className="text-sky-400">{f.id}</span>
                  </td>
                  <td className="px-4 py-3 text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    {f.origin} → {f.dest}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded border ${statusBg[f.status]} ${statusColors[f.status]}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{f.gate}</td>
                  <td className="px-4 py-3 text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{f.dep}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{f.arr}</td>
                  <td className="px-4 py-3 text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{f.aircraft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
