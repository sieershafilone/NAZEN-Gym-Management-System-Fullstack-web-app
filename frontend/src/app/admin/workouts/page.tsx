'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Plus, Terminal, Target, Zap } from 'lucide-react';
import { Card, Button, Badge, StatCard } from '@/components/ui';

export default function WorkoutsPage() {
    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                        Training <span className="text-cyan-400 glow-text">Matrix</span>
                    </h1>
                    <p className="text-zinc-500 mt-3 font-medium tracking-widest uppercase text-[10px]">
                        Engineer and assign <span className="text-white">High-Performance</span> workout protocols.
                    </p>
                </div>
                <Button className="h-14 px-8 rounded-2xl group">
                    <Plus size={20} className="mr-3 group-hover:rotate-90 transition-transform duration-500" />
                    New Protocol
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Protocols" value="24" icon={<Dumbbell size={20} />} color="indigo" />
                <StatCard title="Active Assigns" value="184" icon={<Target size={20} />} color="mint" />
                <StatCard title="New This Week" value="5" icon={<Plus size={20} />} color="amber" />
                <StatCard title="Avg Intensity" value="8.5" icon={<Zap size={20} />} color="indigo" />
            </div>

            {/* Protocols Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { name: 'Hypertrophy Max', exercises: 12, level: 'Advanced', color: 'indigo' },
                    { name: 'Strength Core', exercises: 8, level: 'Intermediate', color: 'mint' },
                    { name: 'Endurance Pro', exercises: 15, level: 'Elite', color: 'amber' },
                ].map((plan, i) => (
                    <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                    >
                        <Card variant="default" className="group p-8 rounded-[2.5rem] border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500">
                            <div className="flex items-start justify-between mb-8">
                                <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-[#0D0D0D] border border-white/5 text-white group-hover:text-cyan-400 group-hover:border-cyan-400/30 transition-all duration-500">
                                    <Dumbbell size={28} />
                                </div>
                                <Badge variant="info" className="px-5 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest border-white/10 bg-white/5 text-zinc-400">
                                    {plan.level}
                                </Badge>
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-cyan-400 transition-colors uppercase">{plan.name}</h3>
                            <p className="text-[10px] text-zinc-600 mb-8 font-bold uppercase tracking-widest leading-relaxed">Systematic approach to {plan.name.toLowerCase()} goals.</p>

                            <div className="flex items-center gap-8 py-6 border-y border-white/5 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-white tabular-nums">{plan.exercises}</span>
                                    <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-black mt-1">Exercises</span>
                                </div>
                                <div className="w-px h-10 bg-white/5" />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black text-white tabular-nums">45m</span>
                                    <span className="text-[8px] text-zinc-600 uppercase tracking-widest font-black mt-1">Duration</span>
                                </div>
                            </div>

                            <Button variant="secondary" className="w-full h-14 rounded-2xl group/btn bg-white/5 border-white/5 hover:bg-white hover:text-black transition-all duration-500">
                                <span className="text-[10px] font-black uppercase tracking-widest">Load Script</span>
                                <Terminal size={18} className="ml-3 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
