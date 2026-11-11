import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';

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
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'desc' });

  // Get distinct service areas for the zone dropdown filter
  const distinctAreas = useMemo(() => {
    const set = new Set();
    agents.forEach((a) => {
      if (a.service_area && a.service_area.trim()) {
        set.add(a.service_area.trim());
      }
    });
    return Array.from(set).sort();
  }, [agents]);

  function handleSort(key) {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }

  const sortedAgents = useMemo(() => {
    return [...agents].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (sortConfig.key === 'id') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA || '').toLowerCase();
        valB = String(valB || '').toLowerCase();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [agents, sortConfig]);

  function exportCSV() {
    if (!agents || agents.length === 0) return;
    const headers = ['Agent ID', 'Full Name', 'Phone', 'Email', 'Service Area', 'Status', 'Registered At'];
    const rows = sortedAgents.map((a) => [
      `#${String(a.id).padStart(3, '0')}`,
      `"${(a.full_name || '').replace(/"/g, '""')}"`,
      `"${a.phone || ''}"`,
      `"${a.email || ''}"`,
      `"${(a.service_area || '').replace(/"/g, '""')}"`,
      `"${a.status || ''}"`,
      `"${a.created_at || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `delivery_agents_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function renderSortIcon(columnKey) {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#0b1e36]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#0b1e36]" />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-5">
      {/* Top Filter and Actions Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-5">
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

        <div className="flex flex-wrap items-center gap-2.5">
          {isCached && (
            <span
              title="Served from Redis In-Memory Cache"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg select-none"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>Redis Cache</span>
            </span>
          )}

          {/* Area Filter */}
          <div className="relative">
            <select
              value={filters.service_area || ''}
              onChange={(e) => onFilterChange('service_area', e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0b1e36] cursor-pointer"
            >
              <option value="">Zone: All areas</option>
              {distinctAreas.map((area) => (
                <option key={area} value={area}>
                  Zone: {area}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              ▾
            </span>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="appearance-none bg-white border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0b1e36] cursor-pointer"
            >
              <option value="all">Status: All agents</option>
              <option value="active">Status: Active</option>
              <option value="inactive">Status: Inactive</option>
            </select>
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              ▾
            </span>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={exportCSV}
            disabled={sortedAgents.length === 0}
            title="Export agents list to CSV file"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 rounded-lg transition disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#f1f5f9] text-slate-600 text-[11px] uppercase tracking-wider font-semibold rounded-lg select-none">
              <th
                onClick={() => handleSort('id')}
                className="py-3 px-4 first:rounded-l-lg cursor-pointer hover:text-[#0b1e36] group"
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>ID</span>
                  {renderSortIcon('id')}
                </div>
              </th>

              <th
                onClick={() => handleSort('full_name')}
                className="py-3 px-4 cursor-pointer hover:text-[#0b1e36] group"
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>Agent Name</span>
                  {renderSortIcon('full_name')}
                </div>
              </th>

              <th className="py-3 px-4">Contact Details</th>

              <th
                onClick={() => handleSort('service_area')}
                className="py-3 px-4 cursor-pointer hover:text-[#0b1e36] group"
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>Service Area</span>
                  {renderSortIcon('service_area')}
                </div>
              </th>

              <th
                onClick={() => handleSort('status')}
                className="py-3 px-4 cursor-pointer hover:text-[#0b1e36] group"
              >
                <div className="inline-flex items-center gap-1.5">
                  <span>Status</span>
                  {renderSortIcon('status')}
                </div>
              </th>

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
            ) : sortedAgents.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 text-xs">
                  No delivery agents found matching your criteria.
                </td>
              </tr>
            ) : (
              sortedAgents.map((agent) => {
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
                          className="hover:text-[#0b1e36] p-1 rounded transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4 stroke-[1.8]" />
                        </button>
                        <button
                          onClick={() => onEdit(agent)}
                          title="Edit agent"
                          className="hover:text-[#0b1e36] p-1 rounded transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4 stroke-[1.8]" />
                        </button>
                        <button
                          onClick={() => onDelete(agent)}
                          title="Delete agent"
                          className="hover:text-rose-600 p-1 rounded transition cursor-pointer"
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
        <span>
          Showing 1–{sortedAgents.length} of {sortedAgents.length} agents
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
