import React from 'react';
import { Truck, Map } from 'lucide-react';

export default function Sidebar({ currentTab = 'agents', onTabChange }) {
  const navItems = [
    { id: 'agents', label: 'Delivery agents', icon: Truck },
    { id: 'areas', label: 'Service areas', icon: Map },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200/80 flex flex-col py-6 px-3 select-none shrink-0 sticky top-0 h-screen">
      <div className="mb-8 px-3">
        <div className="w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center font-bold text-[#0b1e36] text-sm shadow-xs">
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                isActive
                  ? 'text-[#0b1e36] bg-slate-100 font-semibold'
                  : 'text-slate-500 hover:text-[#0b1e36] hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#0b1e36] rounded-r" />
              )}
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#0b1e36] stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
