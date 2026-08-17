import React from 'react';
import { 
  LayoutDashboard, 
  Flame, 
  Truck, 
  Map, 
  BarChart3, 
  Cpu 
} from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function NavigationSidebar() {
  const { activeView, setActiveView, setCameraMode } = useCityStore();

  const navItems = [
    { id: 'COMMAND_CENTER' as const, label: 'COMMAND CENTER', icon: LayoutDashboard, camera: 'CITY_OVERVIEW' as const },
    { id: 'INCIDENTS' as const, label: 'INCIDENTS', icon: Flame, camera: 'INCIDENT_FOCUS' as const },
    { id: 'RESOURCES' as const, label: 'RESOURCES', icon: Truck, camera: 'RESOURCE_FOCUS' as const },
    { id: 'RISK_MAP' as const, label: 'RISK MAP', icon: Map, camera: 'RISK_VIEW' as const },
    { id: 'ANALYTICS' as const, label: 'ANALYTICS', icon: BarChart3, camera: 'COMMAND_VIEW' as const },
    { id: 'SIMULATION' as const, label: 'SIMULATION', icon: Cpu, camera: 'DISPATCH_VIEW' as const },
  ];

  return (
    <aside className="fixed left-4 top-24 bottom-20 z-40 pointer-events-none flex flex-col justify-center">
      <div className="pointer-events-auto flex flex-col gap-2 glass-panel p-2 rounded-2xl border border-cyan-500/20 shadow-2xl backdrop-blur-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setCameraMode(item.camera);
              }}
              title={item.label}
              className={`group relative p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 scale-105'
                  : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-5 h-5" />

              {/* Tooltip on Hover */}
              <span className="absolute left-14 px-2.5 py-1 rounded-md bg-slate-950 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 shadow-xl">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
