'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Filter, Search as SearchIcon } from 'lucide-react';
import { Card, Button, Badge, StatCard, EmptyState } from '@/components/ui';

export default function AttendancePage() {
    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                        Activity <span className="text-cyan-400 glow-text">Logs</span>
                    </h1>
                    <p className="text-zinc-500 mt-3 font-medium tracking-widest uppercase text-[10px]">
                        Monitor <span className="text-white">Athlete Presence</span> & Real-time gym flux.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="secondary" className="group h-14 rounded-2xl px-6 border-white/5">
                        <Filter size={20} className="mr-3 group-hover:text-cyan-400 transition-colors" />
                        Sort Matrix
                    </Button>
                    <Button className="h-14 px-8 rounded-2xl group">
                        Manual Induction
                    </Button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Morning Flux" value="42" icon={<Users size={20} />} color="indigo" />
                <StatCard title="Midday Flux" value="28" icon={<Users size={20} />} color="mint" />
                <StatCard title="Peak Flux" value="65" icon={<Users size={20} />} color="amber" />
                <StatCard title="Max Intensity" value="6PM" icon={<Calendar size={20} />} color="indigo" />
            </div>

            {/* Content Area */}
            <Card variant="default" className="min-h-[600px] flex flex-col justify-center items-center border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                <EmptyState
                    icon={<Calendar size={64} className="text-zinc-800" />}
                    title="Logs Dormant"
                    description="Our biometric scanners are ready. Once athletes start checking in, logs will appear here in real-time."
                    action={
                        <Button variant="secondary" className="mt-6 rounded-xl">
                            Verify Hardware Sync
                        </Button>
                    }
                />
            </Card>
        </div>
    );
}
