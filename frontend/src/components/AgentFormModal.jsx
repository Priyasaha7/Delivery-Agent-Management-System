import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

const INITIAL_FORM = {
  full_name: '',
  phone: '',
  email: '',
  service_area: '',
  status: 'active'
};

export default function AgentFormModal({ isOpen, onClose, onSubmit, editingAgent }) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingAgent) {
      setFormData({
        full_name: editingAgent.full_name || '',
        phone: editingAgent.phone || '',
        email: editingAgent.email || '',
        service_area: editingAgent.service_area || '',
        status: editingAgent.status || 'active'
      });
    } else {
      setFormData(INITIAL_FORM);
    }
    setError(null);
  }, [editingAgent, isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('A valid email address is required');
      return;
    }
    if (!formData.service_area.trim()) {
      setError('Service area is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200/80">
        <div className="flex justify-between items-center pb-4 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900">
            {editingAgent ? 'Edit Delivery Agent' : 'Create New Delivery Agent'}
          </h2>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="e.g. Rahul Verma"
              className="w-full px-3 py-2 text-sm border border-stone-300/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-900"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3 py-2 text-sm border border-stone-300/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rahul.verma@example.com"
                className="w-full px-3 py-2 text-sm border border-stone-300/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Service Area / Region <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="service_area"
              value={formData.service_area}
              onChange={handleChange}
              placeholder="e.g. North Delhi"
              className="w-full px-3 py-2 text-sm border border-stone-300/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1">
              Status <span className="text-rose-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-stone-300/80 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-400 text-stone-900 bg-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-stone-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editingAgent ? 'Save Changes' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
