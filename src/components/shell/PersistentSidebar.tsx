import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Truck, 
  Navigation, 
  TrendingUp, 
  Radio, 
  Zap, 
  BarChart3, 
  Sliders 
} from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function PersistentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const setCameraMode = useCityStore((state) => state.setCameraMode);

  const navItems = [
    { path: '/command', label: 'COMMAND CENTER', icon: LayoutDashboard, camera: 'CITY_OVERVIEW' as const },
    { path: '/incidents', label: 'INCIDENTS QUEUE', icon: AlertTriangle, camera: 'INCIDENT_FOCUS' as const },
    { path: '/resources', label: 'FLEET MANAGEMENT', icon: Truck, camera: 'RESOURCE_FOCUS' as const },
    { path: '/dispatch', label: 'TACTICAL DISPATCH', icon: Navigation, camera: 'DISPATCH_VIEW' as const },
    { path: '/risk', label: 'PREDICTIVE RISK', icon: TrendingUp, camera: 'RISK_VIEW' as const },
    { path: '/intelligence', label: 'SIGNAL FUSION', icon: Radio, camera: 'CITY_OVERVIEW' as const },
    { path: '/optimization', label: 'OPTIMIZATION SOLVER', icon: Zap, camera: 'DISPATCH_VIEW' as const },
    { path: '/analytics', label: 'SYSTEM ANALYTICS', icon: BarChart3, camera: 'CITY_OVERVIEW' as const },
    { path: '/simulation', label: 'SIMULATION LAB', icon: Sliders, camera: 'CITY_OVERVIEW' as const }
  ];

  const handleNav = (item: typeof navItems[0]) => {
    navigate(item.path);
    setCameraMode(item.camera);
  };

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col justify-between select-none z-30 shrink-0 font-mono text-xs shadow-sm">
      {/* Navigation List */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] text-orange-600 font-bold tracking-widest border-b border-slate-200 mb-2 uppercase">
          OPERATIONAL WORKSPACES
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/command' && location.pathname.startsWith(item.path));

          return (
            <button
              key={item.path}
              onClick={() => handleNav(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                isActive
                  ? 'bg-orange-500 text-white border border-orange-500 shadow-md font-bold'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span className="text-[11px] tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Branding */}
      <div className="p-4 border-t border-slate-200 text-[9px] font-mono space-y-1">
        <div className="font-bold text-slate-900">AI CITY GUARDIAN v1.0</div>
        <div className="text-orange-600 font-bold">SIMULATION / SYNTHETIC DATA</div>
      </div>
    </aside>
  );
}
