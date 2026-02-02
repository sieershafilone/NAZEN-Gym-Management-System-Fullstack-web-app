'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ImageIcon, Plus, Grid, List, Camera } from 'lucide-react';
import { Card, Button, Badge, StatCard, EmptyState } from '@/components/ui';

export default function GalleryPage() {
    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                        Visual <span className="text-cyan-400 glow-text">Archive</span>
                    </h1>
                    <p className="text-zinc-500 mt-3 font-medium tracking-widest uppercase text-[10px]">
                        Curate your gym's <span className="text-white">Atmosphere</span> and transformation stories.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-[#0D0D0D] p-2 rounded-2xl border border-white/5">
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl bg-white/10">
                            <Grid size={18} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-white/5">
                            <List size={18} />
                        </Button>
                    </div>
                    <Button className="h-14 px-8 rounded-2xl group">
                        <Camera size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                        Infect Media
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <Card variant="default" className="min-h-[600px] border-white/5 rounded-[2.5rem] bg-white/[0.01] flex flex-col justify-center items-center">
                <EmptyState
                    icon={<ImageIcon size={64} className="text-zinc-800" />}
                    title="Vault Dormant"
                    description="Your high-resolution gym photos and transformation stories will be safely stored here."
                    action={
                        <Button variant="secondary" className="mt-6 px-10 rounded-xl">
                            Select Payload
                        </Button>
                    }
                />
            </Card>

            {/* Quick Stats (Bottom) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Media" value="0" icon={<ImageIcon size={20} />} color="indigo" />
                <StatCard title="Storage Used" value="0 MB" icon={<Grid size={20} />} color="mint" />
                <StatCard title="Last Upload" value="Never" icon={<Camera size={20} />} color="rose" />
            </div>
        </div>
    );
}
