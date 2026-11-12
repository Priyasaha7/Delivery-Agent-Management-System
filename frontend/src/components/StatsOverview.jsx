import React from 'react';

export default function StatsOverview({ stats, currentStatus = 'all', onSelectStatus }) {
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
      onClick: null,
      isActive: false
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 py-3 sm:py-4 mb-5 select-none">
      {items.map((item, index) => {
        const isClickable = Boolean(item.onClick);
        return (
          <div
            key={item.label}
            onClick={item.onClick || undefined}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            className={`p-3 sm:p-1 rounded-lg transition-all ${
              index !== 0 ? 'md:border-l md:border-slate-200 md:pl-6' : ''
            } ${isClickable ? 'cursor-pointer hover:opacity-85' : 'cursor-default'}`}
          >
            <div className="flex items-center gap-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                {item.label}
              </p>
              {item.isActive && item.id !== 'all' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b1e36]" />
              )}
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-[#0b1e36] mt-1">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
