import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import StatsOverview from './components/StatsOverview';
import AgentList from './components/AgentList';
import ServiceAreasView from './components/ServiceAreasView';
import AgentFormModal from './components/AgentFormModal';
import AgentDetailsModal from './components/AgentDetailsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import {
  fetchAgents,
  fetchStats,
  createAgent,
  updateAgent,
  deleteAgent
} from './services/api';
import { Plus, CheckCircle, AlertCircle, User } from 'lucide-react';

export default function App() {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: 'all', service_area: '' });
  const [currentTab, setCurrentTab] = useState('agents');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const [detailsAgent, setDetailsAgent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [deletingAgent, setDeletingAgent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState(null);
  const notifyTimerRef = useRef(null);

  // Global scroll lock preventing background from scrolling when ANY modal is open
  const isAnyModalOpen = isFormOpen || isDetailsOpen || Boolean(deletingAgent);

  useEffect(() => {
    if (isAnyModalOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isAnyModalOpen]);

  function showNotification(type, message) {
    if (notifyTimerRef.current) {
      clearTimeout(notifyTimerRef.current);
    }
    setNotification({ type, message });
    notifyTimerRef.current = setTimeout(() => {
      setNotification(null);
    }, 5000);
  }

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [agentRes, statsRes] = await Promise.all([
        fetchAgents(filters),
        fetchStats().catch(() => null)
      ]);
      setAgents(agentRes.data || []);
      setIsCached(Boolean(agentRes.cached));
      if (statsRes) setStats(statsRes);
    } catch (err) {
      showNotification('error', err.message || 'Failed to load delivery agents');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadData]);

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function handleOpenCreateModal() {
    setEditingAgent(null);
    setIsFormOpen(true);
  }

  function handleOpenEditModal(agent) {
    setEditingAgent(agent);
    setIsFormOpen(true);
  }

  function handleOpenDetailsModal(agent) {
    setDetailsAgent(agent);
    setIsDetailsOpen(true);
  }

  function handleOpenDeleteModal(agent) {
    setDeletingAgent(agent);
  }

  async function handleFormSubmit(formData) {
    if (editingAgent) {
      await updateAgent(editingAgent.id, formData);
      showNotification('success', `Agent "${formData.full_name}" updated successfully`);
    } else {
      await createAgent(formData);
      showNotification('success', `Agent "${formData.full_name}" registered successfully`);
    }
    await loadData();
  }

  async function handleToggleStatus(agent) {
    const nextStatus = agent.status === 'active' ? 'inactive' : 'active';
    try {
      await updateAgent(agent.id, { status: nextStatus });
      showNotification('success', `Agent "${agent.full_name}" is now ${nextStatus}`);
      await loadData();
    } catch (err) {
      showNotification('error', err.message || 'Failed to update status');
    }
  }

  async function handleConfirmDelete() {
    if (!deletingAgent) return;
    try {
      setIsDeleting(true);
      await deleteAgent(deletingAgent.id);
      showNotification('success', `Agent "${deletingAgent.full_name}" deleted successfully`);
      setDeletingAgent(null);
      await loadData();
    } catch (err) {
      showNotification('error', err.message || 'Failed to delete agent');
    } finally {
      setIsDeleting(false);
    }
  }

  const tabTitles = {
    agents: {
      breadcrumb: 'Delivery agents',
      title: 'Delivery Agent Hub',
      subtitle: 'Operations & Delivery Personnel Management',
    },
    areas: {
      breadcrumb: 'Service areas',
      title: 'Service Areas',
      subtitle: 'Regional fleet allocation & coverage',
    },
  };

  const activeTabMeta = tabTitles[currentTab] || tabTitles.agents;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex font-sans antialiased">
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      <main className="flex-1 min-w-0 py-7 px-8 lg:px-12 flex flex-col">
        {/* Top Header Breadcrumb & Admin Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-medium text-slate-400">
            <span>Dashboard</span>
            <span className="mx-2 text-slate-300">/</span>
            <span className="text-slate-600 font-semibold">{activeTabMeta.breadcrumb}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600">
              <User className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-semibold text-[#0b1e36]">Admin</span>
          </div>
        </div>

        {/* Title & Primary Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0b1e36]">
              {activeTabMeta.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeTabMeta.subtitle}
            </p>
          </div>

          {currentTab === 'agents' && (
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-1.5 bg-[#0b1e36] hover:bg-[#132f54] text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-sm transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Delivery Agent</span>
            </button>
          )}
        </div>

        {/* Notification Toast */}
        {notification && (
          <div
            className={`mb-5 p-3 rounded-xl flex items-center justify-between text-xs transition ${
              notification.type === 'success'
                ? 'bg-slate-100 text-slate-800 border border-slate-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-[#0b1e36] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-700 ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Dynamic Views */}
        {currentTab === 'agents' && (
          <>
            <StatsOverview
              stats={stats}
              currentStatus={filters.status}
              onSelectStatus={(status) => setFilters((prev) => ({ ...prev, status }))}
              onSelectAreasTab={() => setCurrentTab('areas')}
            />
            <AgentList
              agents={agents}
              loading={loading}
              filters={filters}
              onFilterChange={handleFilterChange}
              onView={handleOpenDetailsModal}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onToggleStatus={handleToggleStatus}
              isCached={isCached}
            />
          </>
        )}

        {currentTab === 'areas' && (
          <ServiceAreasView
            agents={agents}
            onNavigateToAgents={() => setCurrentTab('agents')}
          />
        )}
      </main>

      {/* Modals */}
      <AgentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingAgent={editingAgent}
      />

      <AgentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={(agent) => {
          setIsDetailsOpen(false);
          setEditingAgent(agent);
          setIsFormOpen(true);
        }}
        agent={detailsAgent}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingAgent)}
        onClose={() => setDeletingAgent(null)}
        onConfirm={handleConfirmDelete}
        agentName={deletingAgent ? deletingAgent.full_name : ''}
        isDeleting={isDeleting}
      />
    </div>
  );
}
