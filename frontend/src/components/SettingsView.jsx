import React from 'react';
import { Database, Zap, Server, ShieldCheck, Check } from 'lucide-react';

export default function SettingsView({ isCached }) {
  return (
    <div className="space-y-5 max-w-4xl">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <h3 className="text-sm font-bold text-[#0b1e36] mb-1">
          System & Architecture Settings
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Delivery Agent Hub configuration, database connections, and cache policies.
        </p>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#0b1e36] text-white flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Primary Database</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  PostgreSQL 15 (ACID)
                </span>
              </div>
              <p className="text-slate-500 mt-1 leading-relaxed">
                Persistent storage managing delivery agents with unique email constraints, status validation checks, and indexed search attributes.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#0b1e36] text-white flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">In-Memory Cache Layer</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Redis (ioredis)
                </span>
              </div>
              <p className="text-slate-500 mt-1 leading-relaxed">
                Caches read queries (`agents:list*` with 300s TTL, `agent:id` with 600s TTL). Invalidation triggers automatically whenever an agent is created, updated, or deleted.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-lg bg-[#0b1e36] text-white flex items-center justify-center shrink-0">
              <Server className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Backend API Gateway</span>
                <span className="text-[11px] font-semibold text-slate-700 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  Node.js / Express
                </span>
              </div>
              <p className="text-slate-500 mt-1 leading-relaxed">
                RESTful API providing CRUD endpoints, graceful cache degradation, and strict input validation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
