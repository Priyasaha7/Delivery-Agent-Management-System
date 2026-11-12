import React from 'react';
import { Truck } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-60 bg-white border-r border-slate-200/80 flex-col py-6 px-3 select-none shrink-0 sticky top-0 h-screen">
      <div className="mb-8 px-3">
        <div className="w-10 h-10 rounded-full border border-slate-300 bg-white flex items-center justify-center font-bold text-[#0b1e36] text-sm shadow-xs">
          DA
        </div>
      </div>

      <nav className="space-y-1">
        <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#0b1e36] bg-slate-100 relative">
          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#0b1e36] rounded-r" />
          <Truck className="w-4 h-4 text-[#0b1e36] stroke-[2.2]" />
          <span>Delivery agents</span>
        </div>
      </nav>
    </aside>
  );
}
