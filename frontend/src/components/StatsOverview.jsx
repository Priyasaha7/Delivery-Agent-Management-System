import React from 'react';

export default function StatsOverview({ stats, currentStatus = 'all', onSelectStatus, onSelectAreasTab }) {
  const items = [
    {
      id: 'all',
      label: 'TOTAL AGENTS',
      value: stats ? stats.total : 0,
      onClick: () => onSelectStatus && onSelectStatus('all'),
      isActive: currentStatus === 'all'
    },
    {
      id: 'active',
      label: 'ACTIVE AGENTS',
      value: stats ? stats.active : 0,
      onClick: () => onSelectStatus && onSelectStatus('active'),
      isActive: currentStatus === 'active'
    },
    {
      id: 'inactive',
      label: 'INACTIVE AGENTS',
      value: stats ? stats.inactive : 0,
      onClick: () => onSelectStatus && onSelectStatus('inactive'),
      isActive: currentStatus === 'inactive'
    },
    {
      id: 'areas',
      label: 'SERVICE AREAS',
      value: stats ? stats.areas : 0,
      onClick: () => onSelectAreasTab && onSelectAreasTab(),
      isActive: false
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 mb-6 select-none">
      {items.map((item, index) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          title={item.id !== 'areas' ? `Click to filter by ${item.label.toLowerCase()}` : 'Click to view service zones'}
          className={`text-left group transition-all p-1 rounded-lg ${
            index !== 0 ? 'md:border-l md:border-slate-200 md:pl-6' : ''
          } hover:opacity-80 cursor-pointer`}
        >
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 group-hover:text-[#0b1e36]">
              {item.label}
            </p>
            {item.isActive && item.id !== 'all' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#0b1e36]" />
            )}
          </div>
          <p className="text-3xl font-bold text-[#0b1e36] mt-1 group-hover:translate-x-0.5 transition-transform">
            {item.value}
          </p>
        </button>
      ))}
    </div>
  );
}
