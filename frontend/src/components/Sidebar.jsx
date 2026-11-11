import React from 'react';
import { LayoutDashboard, Truck, Map, Settings } from 'lucide-react';

export default function Sidebar({ currentTab = 'agents', onTabChange }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'agents', label: 'Delivery agents', icon: Truck },
    { id: 'areas', label: 'Service areas', icon: Map },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-stone-50 border-r border-stone-200/80 flex flex-col py-6 px-4 select-none shrink-0">
      <div className="mb-8 px-3">
        <div className="w-10 h-10 rounded-full border border-stone-300 bg-white flex items-center justify-center font-semibold text-stone-800 text-sm shadow-sm">
          DA
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === currentTab;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange && onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                isActive
                  ? 'text-stone-900 bg-stone-200/60 font-semibold'
                  : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/70'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-stone-900 rounded-r" />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-stone-900 stroke-[2.2]' : 'text-stone-400 stroke-[1.8]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
