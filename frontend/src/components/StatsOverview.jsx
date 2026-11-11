import React from 'react';

export default function StatsOverview({ stats }) {
  const items = [
    { label: 'TOTAL AGENTS', value: stats ? stats.total : 0 },
    { label: 'ACTIVE AGENTS', value: stats ? stats.active : 0 },
    { label: 'INACTIVE AGENTS', value: stats ? stats.inactive : 0 },
    { label: 'SERVICE AREAS', value: stats ? stats.areas : 0 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4 mb-6">
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`${index !== 0 ? 'md:border-l md:border-stone-200/80 md:pl-6' : ''}`}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            {item.label}
          </p>
          <p className="text-3xl font-bold text-stone-900 mt-1">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
