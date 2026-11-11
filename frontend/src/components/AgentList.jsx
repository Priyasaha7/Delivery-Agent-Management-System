import React from 'react';
import { Search, Eye, Edit2, Trash2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AgentList({
  agents,
  loading,
  filters,
  onFilterChange,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  isCached
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or area..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0b1e36] focus:border-[#0b1e36] bg-white text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#0b1e36] cursor-pointer"
            >
              <option value="all">Status: All agents</option>
              <option value="active">Status: Active</option>
              <option value="inactive">Status: Inactive</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              ▾
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f1f5f9] text-slate-600 text-[11px] uppercase tracking-wider font-semibold rounded-lg">
              <th className="py-3 px-4 first:rounded-l-lg">ID</th>
              <th className="py-3 px-4">Agent Name</th>
              <th className="py-3 px-4">Contact Details</th>
              <th className="py-3 px-4">Service Area</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right last:rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 text-xs">
                  Loading delivery agents...
                </td>
              </tr>
            ) : agents.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 text-xs">
                  No delivery agents found matching your criteria.
                </td>
              </tr>
            ) : (
              agents.map((agent) => {
                const formattedId = `#${String(agent.id).padStart(3, '0')}`;
                const isActive = agent.status === 'active';

                return (
                  <tr key={agent.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4 font-mono text-xs text-slate-500">
                      {formattedId}
                    </td>

                    <td className="py-4 px-4 font-semibold text-[#0b1e36]">
                      {agent.full_name}
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-medium text-xs text-slate-900">{agent.phone}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{agent.email}</div>
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-700">
                      <div className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{agent.service_area}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => onToggleStatus(agent)}
                        title="Click to toggle status"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                          isActive
                            ? 'bg-[#0b1e36] text-white hover:bg-[#132f54]'
                            : 'border border-slate-300 text-slate-700 bg-white hover:bg-slate-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isActive ? 'bg-white' : 'bg-slate-400'
                          }`}
                        />
                        {isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center justify-end gap-2 text-slate-400">
                        <button
                          onClick={() => onView(agent)}
                          title="View details"
                          className="hover:text-[#0b1e36] p-1 rounded transition"
                        >
                          <Eye className="w-4 h-4 stroke-[1.8]" />
                        </button>
                        <button
                          onClick={() => onEdit(agent)}
                          title="Edit agent"
                          className="hover:text-[#0b1e36] p-1 rounded transition"
                        >
                          <Edit2 className="w-4 h-4 stroke-[1.8]" />
                        </button>
                        <button
                          onClick={() => onDelete(agent)}
                          title="Delete agent"
                          className="hover:text-rose-600 p-1 rounded transition"
                        >
                          <Trash2 className="w-4 h-4 stroke-[1.8]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
        <span>
          Showing 1–{agents.length} of {agents.length} agents
        </span>

        <div className="flex items-center gap-1">
          <button
            disabled
            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled
            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
