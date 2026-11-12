import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Box, Cpu, Bell, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useOnboarding } from '@/features/onboarding/useOnboarding';
import { useDeviceStore } from '@/lib/store/useDeviceStore';

const NAV = [
  { to: '/overview', label: 'Overview', icon: LayoutDashboard },
  { to: '/twin',     label: '3D Twin',  icon: Box },
  { to: '/devices',  label: 'Devices',  icon: Cpu },
  { to: '/alerts',   label: 'Alerts',   icon: Bell },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const alerts = useDeviceStore((s) => s.alerts);
  const unread = alerts.filter((a) => !a.acknowledged).length;

  // Smart Engine: trigger onboarding untuk user baru
  useOnboarding();

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`${sidebarOpen ? 'w-60' : 'w-0'} transition-all duration-200 bg-bg-panel border-r border-border flex-shrink-0 overflow-hidden`}
      >
        <div className="p-4 border-b border-border">
          <h1 className="text-accent font-semibold text-lg tracking-tight">
            ⚡ AIoT DC
          </h1>
          <p className="text-xs text-slate-500 mt-1">Data Center Monitoring</p>
        </div>
        <nav className="p-2">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              data-tour={to.replace('/', '')}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-slate-400 hover:bg-border/40 hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              {to === '/alerts' && unread > 0 && (
                <span className="ml-auto bg-danger text-white text-xs px-1.5 py-0.5 rounded-full">
                  {unread}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-bg-panel">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 rounded hover:bg-border/40"
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </button>
          <span className="text-sm text-slate-400">Live Monitoring</span>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-slate-400">Connected</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
