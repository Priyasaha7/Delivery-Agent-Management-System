import React from 'react';
import { X, Phone, Mail, MapPin, Calendar, CheckCircle2, Clock, Edit2 } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
              Agent ID #{agent.id}
            </span>
            <h2 className="text-2xl font-bold text-slate-800 mt-2">{agent.full_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <span className="text-sm font-medium text-slate-600">Current Status</span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                agent.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  agent.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {agent.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-500 w-28">Phone:</span>
              <a href={`tel:${agent.phone}`} className="text-indigo-600 hover:underline">
                {agent.phone}
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-500 w-28">Email:</span>
              <a href={`mailto:${agent.email}`} className="text-indigo-600 hover:underline truncate">
                {agent.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-500 w-28">Service Area:</span>
              <span className="font-medium text-slate-900">{agent.service_area}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-500 w-28">Registered:</span>
              <span className="text-slate-600">{formatDate(agent.created_at)}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-500 w-28">Last Updated:</span>
              <span className="text-slate-600">{formatDate(agent.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(agent);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
          >
            <Edit2 className="w-4 h-4" />
            Edit Agent
          </button>
        </div>
      </div>
    </div>
  );
}
