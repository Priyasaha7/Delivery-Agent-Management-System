import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, agentName, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200/80">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-rose-50 rounded-xl text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">Delete Delivery Agent</h3>
            <p className="text-xs text-stone-400">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed mb-6">
          Are you sure you want to remove <strong className="text-stone-900">{agentName}</strong> from the system?
        </p>

        <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
