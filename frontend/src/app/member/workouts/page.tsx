'use client';

import { useEffect, useState } from 'react';
import { Dumbbell, Play, Timer, Activity } from 'lucide-react';
import { Card, Spinner, Badge } from '@/components/ui';
import { membersAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import type { WorkoutPlan } from '@/types';

export default function WorkoutsPage() {
    const { user } = useAuthStore();
    const [plan, setPlan] = useState<WorkoutPlan | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlan = async () => {
            if (user?.member?.id) {
                try {
                    const res = await membersAPI.getById(user.member.id);
                    // Assuming the API returns memberWorkouts and we take the active one
                    const activeWorkout = res.data.data.memberWorkouts?.find((mw: any) => mw.isActive)?.workoutPlan;
                    setPlan(activeWorkout || null);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchPlan();
    }, [user]);

    if (loading) return <div className="flex justify-center p-12"><Spinner /></div>;

    if (!plan) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
                <div className="relative z-10 space-y-8 max-w-lg">
                    <div className="w-24 h-24 bg-[#0D0D0D] border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                        <Dumbbell size={40} className="text-zinc-800" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Protocol <span className="text-cyan-400">Offline</span></h2>
                        <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-[0.2em] leading-relaxed">
                            Your performance matrix hasn't been calibrated yet. <br />
                            Contact the <span className="text-white">Floor Operations</span> for system deployment.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-16 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Active Deployment</p>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        MY <span className="text-cyan-400">PROGRAM</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-6">
                        <Badge variant="info" className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20 text-[9px] font-black tracking-widest px-4 py-2 rounded-xl">
                            {plan.name}
                        </Badge>
                        <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">{plan.daysPerWeek} DAYS / CYCLE</span>
                    </div>
                </div>

                <div className="flex items-center gap-6 bg-[#0D0D0D] p-6 rounded-3xl border border-white/5">
                    <div className="h-10 w-10 bg-cyan-400/10 rounded-xl flex items-center justify-center text-cyan-400">
                        <Activity size={20} />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Protocol Status</p>
                        <p className="text-[11px] font-black text-white uppercase tracking-widest mt-0.5">NOMINAL</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {plan.exercises?.map((day: any, i: number) => (
                    <Card key={i} variant="default" className="flex flex-col h-full rounded-[2.5rem] p-10 bg-white/[0.01] border-white/5 group hover:bg-white/[0.03] hover:border-cyan-400/20 transition-all duration-700">
                        <div className="flex justify-between items-start mb-10">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{day.day}</h3>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Execution Sequence</p>
                            </div>
                            <div className="p-4 bg-[#0D0D0D] border border-white/5 rounded-2xl text-zinc-700 group-hover:text-cyan-400 transition-colors">
                                <Dumbbell size={20} />
                            </div>
                        </div>

                        <div className="space-y-4 flex-1">
                            {day.exercises.map((ex: any, j: number) => (
                                <div key={j} className="flex items-center gap-5 p-5 bg-[#0D0D0D] border border-white/5 rounded-2xl group/item hover:bg-white/[0.02] hover:border-cyan-400/10 transition-all">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400/40 group-hover/item:bg-cyan-400 shrink-0 transition-all" />
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black text-white uppercase tracking-tight">{ex.name}</p>
                                        <div className="flex gap-4 text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1.5">
                                            <span>{ex.sets} SETS</span>
                                            <span className="text-zinc-800 opacity-30">×</span>
                                            <span>{ex.reps} REPS</span>
                                        </div>
                                    </div>
                                    {ex.muscle && (
                                        <Badge className="bg-white/5 text-[7px] font-black text-zinc-500 uppercase tracking-widest border-white/10 px-3 py-1 rounded-lg">
                                            {ex.muscle}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-white/5">
                            <button className="w-full h-14 bg-white text-black hover:bg-cyan-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3">
                                <Play size={14} className="fill-current" /> Engage Session
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
