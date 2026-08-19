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
  Sliders,
  UserCheck,
  PlusCircle,
  Phone,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';
import { useAuthStore } from '../../stores/useAuthStore';

export function PersistentSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const setCameraMode = useCityStore((state) => state.setCameraMode);
  const setReportModalOpen = useCityStore((state) => state.setReportModalOpen);
  const { user, toggleRole } = useAuthStore();

  const adminNavItems = [
    { path: '/command', label: 'COMMAND CENTER', icon: LayoutDashboard, camera: 'CITY_OVERVIEW' as const },
    { path: '/incidents', label: 'INCIDENTS QUEUE', icon: AlertTriangle, camera: 'INCIDENT_FOCUS' as const },
    { path: '/resources', label: 'FLEET MANAGEMENT', icon: Truck, camera: 'RESOURCE_FOCUS' as const },
    { path: '/dispatch', label: 'TACTICAL DISPATCH', icon: Navigation, camera: 'DISPATCH_VIEW' as const },
    { path: '/risk', label: 'PREDICTIVE RISK', icon: TrendingUp, camera: 'RISK_VIEW' as const },
    { path: '/intelligence', label: 'SIGNAL FUSION', icon: Radio, camera: 'CITY_OVERVIEW' as const },
    { path: '/optimization', label: 'OPTIMIZATION SOLVER', icon: Zap, camera: 'DISPATCH_VIEW' as const },
    { path: '/analytics', label: 'SYSTEM ANALYTICS', icon: BarChart3, camera: 'CITY_OVERVIEW' as const },
    { path: '/simulation', label: 'SIMULATION LAB', icon: Sliders, camera: 'CITY_OVERVIEW' as const },
    { path: '/user-dashboard', label: 'USER PORTAL VIEW', icon: UserCheck, camera: 'CITY_OVERVIEW' as const }
  ];

  const userNavItems = [
    { path: '/user-dashboard', label: 'CITIZEN PORTAL', icon: UserCheck, camera: 'CITY_OVERVIEW' as const },
    { path: 'ACTION_REPORT', label: 'REPORT AN INCIDENT', icon: PlusCircle, camera: 'CITY_OVERVIEW' as const },
    { path: '/incidents', label: 'PUBLIC INCIDENTS', icon: AlertTriangle, camera: 'INCIDENT_FOCUS' as const },
    { path: '/risk', label: 'CITY RISK MAP', icon: TrendingUp, camera: 'RISK_VIEW' as const }
  ];

  const userRole = user?.role || 'USER';
  const currentNavItems = userRole === 'ADMIN' ? adminNavItems : userNavItems;

  const handleNav = (item: typeof adminNavItems[0]) => {
    if (item.path === 'ACTION_REPORT') {
      setReportModalOpen(true);
      return;
    }
    navigate(item.path);
    setCameraMode(item.camera);
  };

  return (
    <aside className="w-56 bg-white border-r border-slate-200 flex flex-col justify-between select-none z-30 shrink-0 font-mono text-xs shadow-sm">
      {/* Navigation List */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] text-orange-600 font-bold tracking-widest border-b border-slate-200 mb-2 uppercase flex items-center justify-between">
          <span>{userRole === 'ADMIN' ? 'ADMIN WORKSPACES' : 'CITIZEN PORTAL'}</span>
          <span className="text-[9px] bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded font-extrabold">{userRole}</span>
        </div>

        {currentNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/command' && item.path !== 'ACTION_REPORT' && location.pathname.startsWith(item.path));

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

      {/* Footer Branding & Role Switcher */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-slate-600 font-bold">Active Profile:</span>
          <button 
            onClick={toggleRole}
            className="text-orange-600 hover:text-orange-800 font-bold flex items-center gap-1 underline"
          >
            <RefreshCw className="w-3 h-3" />
            Switch
          </button>
        </div>
        <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px] space-y-0.5">
          <div className="font-bold text-slate-900 truncate">{user?.name || 'Alex Mercer'}</div>
          <div className="text-slate-500 text-[9px] truncate">{user?.department || 'Resident Citizen'}</div>
        </div>
        <div className="text-[9px] text-slate-400 font-bold text-center">
          AI CITY GUARDIAN v1.0
        </div>
      </div>
    </aside>
  );
}
