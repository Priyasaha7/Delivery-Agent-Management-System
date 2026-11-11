import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import StatsOverview from './components/StatsOverview';
import AgentList from './components/AgentList';
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
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [currentTab, setCurrentTab] = useState('agents');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const [detailsAgent, setDetailsAgent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [deletingAgent, setDeletingAgent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState(null);
  const notifyTimerRef = useRef(null);

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

  return (
    <div className="min-h-screen bg-[#f8f8f7] text-stone-900 flex font-sans antialiased">
      <Sidebar currentTab={currentTab} onTabChange={setCurrentTab} />

      <main className="flex-1 min-w-0 py-7 px-8 lg:px-12 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="text-xs font-medium text-stone-400">
            <span>Fleet</span>
            <span className="mx-2 text-stone-300">/</span>
            <span className="text-stone-600">Delivery agents</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-stone-300 overflow-hidden flex items-center justify-center text-xs font-semibold text-stone-700">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
                alt="Admin avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <span className="text-xs font-semibold text-stone-800">Admin</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              Delivery Agent Hub
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Fleet & Personnel Management
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-1.5 bg-[#0f172a] hover:bg-stone-800 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Delivery Agent</span>
          </button>
        </div>

        {notification && (
          <div
            className={`mb-5 p-3 rounded-xl flex items-center justify-between text-xs transition ${
              notification.type === 'success'
                ? 'bg-stone-100 text-stone-800 border border-stone-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-stone-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-stone-400 hover:text-stone-700 ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        <StatsOverview stats={stats} />

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
      </main>

      <AgentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        editingAgent={editingAgent}
      />

      <AgentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={handleOpenEditModal}
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
