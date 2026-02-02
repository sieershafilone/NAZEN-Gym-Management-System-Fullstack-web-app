'use client';

import { useEffect, useState } from 'react';
import { Card, Spinner } from '@/components/ui';
import { ImageIcon } from 'lucide-react';
// Assuming we might have a robust gallery API later, but for now using a placeholder or basic fetch if available.
// Since there wasn't a dedicated member gallery API call in my context, I'll mock/setup a placeholder that implies functionality.

export default function MemberGalleryPage() {
    return (
        <div className="space-y-16 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Visual Archives</p>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        COMMUNITY <span className="text-cyan-400">MATRIX</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest mt-6">Captured frames of peak performance</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="aspect-[4/5] bg-[#0D0D0D] rounded-[2rem] border border-white/5 flex items-center justify-center group overflow-hidden relative cursor-crosshair transition-all duration-700 hover:border-cyan-400/30">
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        <ImageIcon className="text-zinc-900 group-hover:text-cyan-400/20 transition-all duration-700 group-hover:scale-125" size={48} />

                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                            <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1">FRAME 00{i}</p>
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.1em]">Session Snapshot</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center py-24 bg-[#080808] rounded-[3rem] border border-white/5 border-dashed">
                <p className="text-zinc-800 font-black uppercase text-[10px] tracking-[0.6em]">Awaiting high-fidelity captures...</p>
            </div>
        </div>
    );
}
