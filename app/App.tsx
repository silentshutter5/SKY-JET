import { useState } from "react";
import { Plane, LayoutGrid, Users, Bell, Radio, ChevronRight, Wifi, Database, Activity } from "lucide-react";
import { OperationsDashboard } from "./components/OperationsDashboard";
import { GateManagement } from "./components/GateManagement";
import { PassengerFlow } from "./components/PassengerFlow";
import { AlertsControl } from "./components/AlertsControl";

type Tab = "operations" | "gates" | "passengers" | "alerts";

const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: "operations", label: "Operations Overview", icon: <LayoutGrid size={16} /> },
  { id: "gates",      label: "Gate Management",     icon: <Plane size={16} /> },
  { id: "passengers", label: "Passenger Flow",       icon: <Users size={16} /> },
  { id: "alerts",     label: "Alerts & Incidents",   icon: <Bell size={16} />, badge: 4 },
];

function SystemStatus() {
  return (
    <div className="flex items-center gap-4 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {[
        { label: "ATC",     icon: <Radio size={11} /> },
        { label: "FIDS",    icon: <Database size={11} /> },
        { label: "Network", icon: <Wifi size={11} /> },
        { label: "Radar",   icon: <Activity size={11} /> },
      ].map(s => (
        <div key={s.label} className="flex items-center gap-1.5 text-muted-foreground">
          <span className="text-emerald-400">{s.icon}</span>
          {s.label}
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
        </div>
      ))}
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useState(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t as unknown as number);
  });
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }} className="text-right">
      <div className="text-sky-400 tabular-nums">
        {time.toLocaleTimeString("en-US", { hour12: false })}
      </div>
      <div className="text-xs text-muted-foreground">
        {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} · UTC−5
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("operations");

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header
        className="border-b border-border sticky top-0 z-50"
        style={{ background: "rgba(15,22,41,0.9)", backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.3)" }}
            >
              <Plane size={16} className="text-sky-400" />
            </div>
            <div>
              <div className="text-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                KORD — O'Hare International
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <ChevronRight size={10} /> Airport Operations Control Center
              </div>
            </div>
          </div>
          <SystemStatus />
          <LiveClock />
        </div>

        <div className="flex items-center px-6" style={{ borderTop: "1px solid rgba(56,189,248,0.08)" }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "border-sky-400 text-sky-400"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.badge !== undefined && (
                <span
                  className="ml-1 text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    background: "rgba(248,113,113,0.12)",
                    color: "#f87171",
                    border: "1px solid rgba(248,113,113,0.25)",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="p-6 max-w-[1600px] mx-auto pb-14">
        {activeTab === "operations" && <OperationsDashboard />}
        {activeTab === "gates"      && <GateManagement />}
        {activeTab === "passengers" && <PassengerFlow />}
        {activeTab === "alerts"     && <AlertsControl />}
      </main>

      <footer
        className="fixed bottom-0 left-0 right-0 px-6 py-1.5 flex items-center justify-between text-xs text-muted-foreground"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          borderTop: "1px solid rgba(56,189,248,0.1)",
          background: "rgba(8,13,26,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Systems Nominal
          </span>
          <span>284 flights today · 41,820 passengers</span>
        </div>
        <div className="flex items-center gap-4">
          <span>ATIS: Info KILO</span>
          <span>Active runway: 28L / 10R</span>
          <span>v4.2.1 · AOCC</span>
        </div>
      </footer>
    </div>
  );
}
