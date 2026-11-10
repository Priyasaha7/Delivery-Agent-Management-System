import React from 'react';
import { Truck, Plus } from 'lucide-react';

export default function Navbar({ onOpenCreateModal }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                Delivery Agent Hub
              </h1>
              <p className="text-xs text-slate-500">Fleet & Personnel Management</p>
            </div>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Delivery Agent</span>
          </button>
        </div>
      </div>
    </header>
  );
}
