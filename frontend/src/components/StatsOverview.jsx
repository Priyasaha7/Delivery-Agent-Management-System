import React from 'react';
import { Users, UserCheck, UserX, MapPin } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const cards = [
    {
      title: 'Total Agents',
      value: stats ? stats.total : '-',
      icon: Users,
      bgColor: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100'
    },
    {
      title: 'Active Agents',
      value: stats ? stats.active : '-',
      icon: UserCheck,
      bgColor: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100'
    },
    {
      title: 'Inactive Agents',
      value: stats ? stats.inactive : '-',
      icon: UserX,
      bgColor: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100'
    },
    {
      title: 'Service Areas',
      value: stats ? stats.areas : '-',
      icon: MapPin,
      bgColor: 'bg-purple-50 text-purple-600',
      borderColor: 'border-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div
            key={index}
            className={`bg-white rounded-xl border ${card.borderColor} p-5 shadow-sm flex items-center justify-between`}
          >
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{card.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${card.bgColor}`}>
              <IconComponent className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
