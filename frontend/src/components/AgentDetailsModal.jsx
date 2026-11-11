import React from 'react';
import { X, Phone, Mail, MapPin, Calendar, Clock, Edit2 } from 'lucide-react';

export default function AgentDetailsModal({ agent, isOpen, onClose, onEdit }) {
  if (!isOpen || !agent) return null;

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const formattedId = `#${String(agent.id).padStart(3, '0')}`;
  const isActive = agent.status === 'active';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200/80">
        <div className="flex justify-between items-start pb-4 border-b border-stone-100">
          <div>
            <span className="font-mono text-xs text-stone-500 font-medium">
              {formattedId}
            </span>
            <h2 className="text-xl font-bold text-stone-900 mt-1">{agent.full_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Status
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-stone-900 text-white'
                  : 'border border-stone-300 text-stone-700 bg-white'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-stone-400'}`}
              />
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center gap-3 text-stone-700">
              <Phone className="w-4 h-4 text-stone-400" />
              <span className="font-medium text-stone-400 w-24">Phone:</span>
              <a href={`tel:${agent.phone}`} className="font-medium text-stone-900 hover:underline">
                {agent.phone}
              </a>
            </div>

            <div className="flex items-center gap-3 text-stone-700">
              <Mail className="w-4 h-4 text-stone-400" />
              <span className="font-medium text-stone-400 w-24">Email:</span>
              <a href={`mailto:${agent.email}`} className="font-medium text-stone-900 hover:underline truncate">
                {agent.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-stone-700">
              <MapPin className="w-4 h-4 text-stone-400" />
              <span className="font-medium text-stone-400 w-24">Service Area:</span>
              <span className="font-medium text-stone-900">{agent.service_area}</span>
            </div>

            <div className="flex items-center gap-3 text-stone-700">
              <Calendar className="w-4 h-4 text-stone-400" />
              <span className="font-medium text-stone-400 w-24">Created:</span>
              <span className="text-stone-600">{formatDate(agent.created_at)}</span>
            </div>

            <div className="flex items-center gap-3 text-stone-700">
              <Clock className="w-4 h-4 text-stone-400" />
              <span className="font-medium text-stone-400 w-24">Updated:</span>
              <span className="text-stone-600">{formatDate(agent.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-5 border-t border-stone-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(agent);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Agent
          </button>
        </div>
      </div>
    </div>
  );
}
