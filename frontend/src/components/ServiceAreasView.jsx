import React, { useState } from 'react';
import { MapPin, Search, Users, CheckCircle2 } from 'lucide-react';

export default function ServiceAreasView({ agents, onNavigateToAgents }) {
  const [search, setSearch] = useState('');

  // Group agents by service area
  const areasMap = {};
  agents.forEach((agent) => {
    const area = agent.service_area || 'Unassigned';
    if (!areasMap[area]) {
      areasMap[area] = [];
    }
    areasMap[area].push(agent);
  });

  const areaList = Object.entries(areasMap)
    .filter(([areaName]) => areaName.toLowerCase().includes(search.toLowerCase()))
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-sm font-bold text-[#0b1e36]">
              Regional Distribution ({areaList.length} Zones)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Overview of all delivery agents grouped by assigned operational territory.
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search zones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0b1e36]"
            />
          </div>
        </div>

        {areaList.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">
            No service zones matching your search.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areaList.map(([areaName, agentList]) => {
              const activeCount = agentList.filter((a) => a.status === 'active').length;

              return (
                <div
                  key={areaName}
                  className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0b1e36]/10 flex items-center justify-center text-[#0b1e36]">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-[#0b1e36]">{areaName}</h4>
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {agentList.length} {agentList.length === 1 ? 'Agent' : 'Agents'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2 font-medium">
                      <span>Assigned Agents:</span>
                      <span className="text-emerald-700">{activeCount} Active</span>
                    </div>

                    <div className="space-y-1.5">
                      {agentList.map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center justify-between py-1 px-2 rounded-md bg-white border border-slate-100 text-xs"
                        >
                          <span className="font-medium text-slate-800 truncate max-w-[140px]">
                            {agent.full_name}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              agent.status === 'active'
                                ? 'bg-[#0b1e36] text-white'
                                : 'border border-slate-200 text-slate-600 bg-slate-50'
                            }`}
                          >
                            {agent.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
