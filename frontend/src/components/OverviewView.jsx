import React from 'react';
import { Truck, CheckCircle2, AlertCircle, MapPin, ArrowRight } from 'lucide-react';

export default function OverviewView({ stats, agents, onNavigateToAgents }) {
  const total = stats ? stats.total : 0;
  const active = stats ? stats.active : 0;
  const inactive = stats ? stats.inactive : 0;
  const activePercent = total > 0 ? Math.round((active / total) * 100) : 0;

  // Group agents by area
  const areaCounts = {};
  agents.forEach((a) => {
    areaCounts[a.service_area] = (areaCounts[a.service_area] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Fleet Availability
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-[#0b1e36]">{activePercent}%</span>
            <span className="text-xs text-slate-500">active now</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-[#0b1e36] h-full rounded-full transition-all duration-500"
              style={{ width: `${activePercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 mt-2.5">
            <span>{active} Active</span>
            <span>{inactive} Inactive</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            System Operational Health
          </p>
          <div className="mt-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">PostgreSQL DB:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Redis Cache:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active (300s TTL)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">API Gateway:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Healthy
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Fleet Management
            </p>
            <p className="text-sm font-semibold text-[#0b1e36] mt-2">
              {total} Total Delivery Agents Registered
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Manage personnel, update operational zones, and review agent statuses.
            </p>
          </div>
          <button
            onClick={onNavigateToAgents}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#0b1e36] hover:text-[#132f54]"
          >
            <span>Go to Agents List</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <h3 className="text-sm font-bold text-[#0b1e36] mb-4">
          Active Coverage by Service Zone
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(areaCounts).map(([area, count]) => (
            <div
              key={area}
              className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-medium text-slate-800">{area}</span>
              </div>
              <span className="text-xs font-bold text-[#0b1e36] px-2 py-0.5 rounded-full bg-white border border-slate-200">
                {count} {count === 1 ? 'agent' : 'agents'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
