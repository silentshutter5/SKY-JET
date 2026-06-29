import { useState } from "react";
import { Users, ShieldCheck, AlertTriangle, TrendingUp, TrendingDown, Clock, Accessibility } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const checkpointData = [
  { name: "Checkpoint Alpha", lanes: 8, open: 6, waitMin: 12, pax: 1240, capacity: 1800, alerts: 0 },
  { name: "Checkpoint Bravo", lanes: 6, open: 4, waitMin: 28, pax: 980, capacity: 1200, alerts: 1 },
  { name: "Checkpoint Charlie", lanes: 4, open: 4, waitMin: 7, pax: 430, capacity: 900, alerts: 0 },
  { name: "International", lanes: 10, open: 7, waitMin: 19, pax: 2100, capacity: 2500, alerts: 0 },
];

const flowTimeline = [
  { time: "06:00", security: 320, boarding: 180, arrivals: 95 },
  { time: "07:00", security: 890, boarding: 640, arrivals: 210 },
  { time: "08:00", security: 1240, boarding: 920, arrivals: 480 },
  { time: "09:00", security: 980, boarding: 1100, arrivals: 720 },
  { time: "10:00", security: 750, boarding: 890, arrivals: 650 },
  { time: "11:00", security: 620, boarding: 710, arrivals: 540 },
  { time: "12:00", security: 810, boarding: 580, arrivals: 490 },
  { time: "13:00", security: 1100, boarding: 820, arrivals: 380 },
  { time: "14:00", security: 1450, boarding: 1200, arrivals: 320 },
];

const terminalOccupancy = [
  { name: "Terminal A", value: 78 },
  { name: "Terminal B", value: 64 },
  { name: "Terminal C", value: 91 },
  { name: "Terminal D", value: 42 },
];

const aidData = [
  { name: "Wheelchair", count: 23, color: "#38bdf8" },
  { name: "Vision", count: 8, color: "#a78bfa" },
  { name: "Medical", count: 12, color: "#34d399" },
  { name: "Unaccomp. Minor", count: 5, color: "#f59e0b" },
];

const COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#f59e0b"];

function WaitBar({ pct, label }: { pct: number; label: string }) {
  const color = pct < 50 ? "bg-emerald-400" : pct < 75 ? "bg-amber-400" : "bg-red-400";
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1">
        <span>{label}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{pct}%</span>
      </div>
      <div className="h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function PassengerFlow() {
  const [activeTerminal, setActiveTerminal] = useState("All");

  const totalPax = checkpointData.reduce((a, c) => a + c.pax, 0);
  const avgWait = Math.round(checkpointData.reduce((a, c) => a + c.waitMin, 0) / checkpointData.length);

  return (
    <div className="space-y-4">
      {/* KPI bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "In Terminal Now", value: totalPax.toLocaleString(), icon: <Users size={16} />, color: "text-sky-400", delta: "+420", up: true },
          { label: "Avg Wait (Security)", value: `${avgWait} min`, icon: <Clock size={16} />, color: "text-amber-400", delta: "+4 min", up: false },
          { label: "Accessibility Requests", value: "48", icon: <Accessibility size={16} />, color: "text-violet-400", delta: "12 pending", up: true },
          { label: "Security Incidents", value: "2", icon: <ShieldCheck size={16} />, color: "text-emerald-400", delta: "-1 vs yesterday", up: true },
        ].map(k => (
          <div key={k.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <span className={k.color}>{k.icon}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-xs uppercase tracking-widest">{k.label}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-2xl text-foreground">{k.value}</div>
            <div className={`flex items-center gap-1 text-xs mt-1 ${k.up ? "text-emerald-400" : "text-red-400"}`}>
              {k.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {k.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Flow timeline — 2 cols */}
        <div className="xl:col-span-2 bg-card border border-border rounded-lg p-5">
          <h3 className="text-foreground tracking-wide mb-4">Passenger Flow — Today</h3>
          <div className="flex items-center gap-5 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-sky-400 inline-block" />Security Processed</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-400 inline-block" />Boarding</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block" />Arrivals</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={flowTimeline}>
              <CartesianGrid key="grid" strokeDasharray="3 3" stroke="rgba(56,189,248,0.08)" />
              <XAxis key="xaxis" dataKey="time" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <YAxis key="yaxis" tick={{ fill: "#64748b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
              <Tooltip key="tooltip" contentStyle={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 6, color: "#e2e8f0", fontSize: 12 }} />
              <Line key="line-security" type="monotone" dataKey="security" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line key="line-boarding" type="monotone" dataKey="boarding" stroke="#a78bfa" strokeWidth={2} dot={false} />
              <Line key="line-arrivals" type="monotone" dataKey="arrivals" stroke="#34d399" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Terminal occupancy donut */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-foreground tracking-wide mb-2">Terminal Occupancy</h3>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie key="pie" data={terminalOccupancy} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {terminalOccupancy.map((entry, i) => (
                  <Cell key={`cell-${entry.name}`} fill={COLORS[i]} fillOpacity={0.85} />
                ))}
              </Pie>
              <Tooltip key="tooltip" contentStyle={{ background: "#0f1629", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 6, color: "#e2e8f0", fontSize: 12 }} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            {terminalOccupancy.map((t, i) => (
              <div key={t.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: COLORS[i] }} />
                {t.name}: <span style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-foreground ml-0.5">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Security checkpoints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checkpointData.map(cp => {
          const waitPct = Math.round((cp.waitMin / 40) * 100);
          const paxPct = Math.round((cp.pax / cp.capacity) * 100);
          return (
            <div key={cp.name} className={`bg-card border rounded-lg p-5 ${cp.alerts > 0 ? "border-amber-400/30" : "border-border"}`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-foreground">{cp.name}</h4>
                {cp.alerts > 0 && (
                  <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    <AlertTriangle size={11} /> {cp.alerts} alert
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "Open Lanes", val: `${cp.open}/${cp.lanes}` },
                  { label: "Wait Time", val: `${cp.waitMin} min` },
                  { label: "Pax/hr", val: cp.pax.toLocaleString() },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-base text-foreground">{m.val}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <WaitBar pct={waitPct} label="Wait load" />
                <WaitBar pct={paxPct} label="Capacity" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Accessibility requests */}
      <div className="bg-card border border-border rounded-lg p-5">
        <h3 className="text-foreground tracking-wide mb-4">Accessibility & Special Assistance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {aidData.map(a => (
            <div key={a.name} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${a.color}18`, border: `1px solid ${a.color}30` }}>
                <Accessibility size={18} style={{ color: a.color }} />
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", color: a.color }} className="text-lg">{a.count}</div>
                <div className="text-xs text-muted-foreground">{a.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
