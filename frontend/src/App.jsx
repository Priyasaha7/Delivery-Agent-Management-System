import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
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
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function App() {
  const [agents, setAgents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [filters, setFilters] = useState({ search: '', status: 'all' });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  const [detailsAgent, setDetailsAgent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [deletingAgent, setDeletingAgent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState(null);

  function showNotification(type, message) {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
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
      showNotification(
        'success',
        `Agent "${agent.full_name}" is now ${nextStatus}`
      );
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar onOpenCreateModal={handleOpenCreateModal} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center justify-between text-sm shadow-sm transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-xs font-semibold underline hover:opacity-75"
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

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        Delivery Agent Management System • Node.js, Express, PostgreSQL, Redis, React
      </footer>

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
