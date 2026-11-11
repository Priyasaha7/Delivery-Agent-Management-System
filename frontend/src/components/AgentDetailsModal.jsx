import React, { useEffect } from 'react';
import { X, Phone, Mail, MapPin, Calendar, Clock, Edit2 } from 'lucide-react';

export default function AgentDetailsModal({ agent, isOpen, onClose, onEdit }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div>
            <span className="font-mono text-xs text-slate-500 font-medium">
              {formattedId}
            </span>
            <h2 className="text-xl font-bold text-[#0b1e36] mt-1">{agent.full_name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Status
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-[#0b1e36] text-white'
                  : 'border border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-slate-400'}`}
              />
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center gap-3 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-400 w-24">Phone:</span>
              <a href={`tel:${agent.phone}`} className="font-medium text-slate-900 hover:underline">
                {agent.phone}
              </a>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-400 w-24">Email:</span>
              <a href={`mailto:${agent.email}`} className="font-medium text-slate-900 hover:underline truncate">
                {agent.email}
              </a>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-400 w-24">Service Area:</span>
              <span className="font-medium text-slate-900">{agent.service_area}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-400 w-24">Created:</span>
              <span className="text-slate-600">{formatDate(agent.created_at)}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="font-medium text-slate-400 w-24">Updated:</span>
              <span className="text-slate-600">{formatDate(agent.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-5 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onEdit(agent);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#0b1e36] hover:bg-[#132f54] rounded-lg shadow-sm transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Agent
          </button>
        </div>
      </div>
    </div>
  );
}
