'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    CreditCard,
    Dumbbell,
    TrendingUp,
    Clock,
    Target,
    ArrowRight,
    Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Card, StatCard, Badge, Spinner } from '@/components/ui';
import { dashboardAPI } from '@/lib/api';
import { formatCurrency, formatDate, getDaysRemaining, formatRelativeTime } from '@/lib/utils';
import type { MemberDashboard } from '@/types';

export default function MemberDashboardPage() {
    const [data, setData] = useState<MemberDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await dashboardAPI.getMember();
                setData(response.data.data);
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-zinc-500">Failed to load dashboard data</p>
            </div>
        );
    }

    const membership = data.membership;
    const daysRemaining = membership ? getDaysRemaining(membership.endDate) : 0;

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Membership Status Segment */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <Card variant="default" className="relative overflow-hidden rounded-[3rem] p-10 bg-white/[0.03] backdrop-blur-3xl border-white/10 group hover:border-cyan-400/20 transition-all duration-700 shadow-2xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Membership Status</p>
                            <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                {membership?.plan?.name || 'No Active Plan'}
                            </h2>
                            {membership && (
                                <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest mt-4">
                                    Active Until <span className="text-white">{formatDate(membership.endDate)}</span>
                                </p>
                            )}
                        </div>

                        {membership && (
                            <div className="flex items-center gap-10 bg-[#0D0D0D] p-8 rounded-[2rem] border border-white/5 group-hover:border-cyan-400/20 transition-all duration-500">
                                <div className="text-center">
                                    <p className="text-5xl font-black text-cyan-400 tracking-tighter tabular-nums">{daysRemaining}</p>
                                    <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mt-2">Days Left</p>
                                </div>
                                <div className="h-16 w-px bg-white/5" />
                                <div className="text-center">
                                    <Badge
                                        variant="info"
                                        className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20 text-[10px] font-black tracking-widest px-8 py-3 rounded-2xl uppercase"
                                    >
                                        {membership.status}
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Membership Progress */}
                    {membership && (
                        <div className="mt-12 space-y-3">
                            <div className="flex items-center justify-between text-[8px] font-black text-zinc-600 tracking-widest uppercase">
                                <span>Membership Progress</span>
                                <span className="text-cyan-400">{Math.round((daysRemaining / membership.plan!.durationDays) * 100)}% Used</span>
                            </div>
                            <div className="h-4 bg-[#0D0D0D] rounded-full overflow-hidden border border-white/5 p-1">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${Math.min(100, (daysRemaining / membership.plan!.durationDays) * 100)}%`,
                                    }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                />
                            </div>
                        </div>
                    )}
                </Card>
            </motion.div>

            {/* Metrics Cluster */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Recent Visits", value: data.attendance.thisMonth, icon: Calendar, color: "indigo" },
                    { title: "Body Weight", value: data.progress[0]?.weight ? `${data.progress[0].weight} KG` : 'N/A', icon: TrendingUp, color: "mint" },
                    { title: "Workout Plan", value: data.workout?.workoutPlan?.name || 'NONE', icon: Dumbbell, color: "amber" },
                    { title: "Total Payments", value: formatCurrency(data.payments.reduce((acc, p) => acc + Number(p.amount), 0)), icon: CreditCard, color: "indigo" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                    >
                        <StatCard
                            title={stat.title}
                            value={stat.value}
                            icon={<stat.icon size={22} />}
                            color={stat.color as any}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Dashboard Sections */}
            <div className="grid lg:grid-cols-2 gap-10">
                {/* Workout Plan */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card variant="default" className="rounded-[2.5rem] p-10 bg-white/[0.03] backdrop-blur-3xl border-white/10 group hover:border-cyan-400/20 transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    <div className="p-2 bg-cyan-400/10 rounded-xl text-cyan-400">
                                        <Dumbbell size={20} />
                                    </div>
                                    Workout Plan
                                </h3>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest pl-11">Your assigned workout</p>
                            </div>
                            <Link href="/member/workouts" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all">
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        {data.workout ? (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between bg-[#0D0D0D] p-6 rounded-2xl border border-white/5 group-hover:border-cyan-400/20 transition-all">
                                    <div>
                                        <p className="text-lg font-black text-white uppercase tracking-tight">{data.workout.workoutPlan?.name}</p>
                                        <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{data.workout.workoutPlan?.type} WORKOUT</p>
                                    </div>
                                    <Badge variant="info" className="bg-white/5 text-[8px] font-black border-white/10 px-4 py-2 rounded-xl">
                                        {data.workout.workoutPlan?.daysPerWeek} DAYS/WEEK
                                    </Badge>
                                </div>
                                <Link
                                    href="/member/workouts"
                                    className="flex items-center justify-center gap-3 w-full h-16 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-cyan-400 transition-all duration-300"
                                >
                                    VIEW WORKOUT
                                    <Zap size={16} className="fill-current" />
                                </Link>
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-[#0D0D0D] rounded-3xl border border-white/5 border-dashed">
                                <Target className="w-16 h-16 text-zinc-800 mx-auto mb-6 animate-pulse" />
                                <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No workout plan assigned</p>
                                <p className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest mt-2">Ask for a plan at the gym</p>
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Attendance History */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card variant="default" className="rounded-[2.5rem] p-10 bg-white/[0.03] backdrop-blur-3xl border-white/10 group hover:border-cyan-400/20 transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-10">
                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    <div className="p-2 bg-rose-400/10 rounded-xl text-rose-400">
                                        <Clock size={20} />
                                    </div>
                                    Attendance History
                                </h3>
                                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest pl-11">Your recent check-ins</p>
                            </div>
                            <Link href="/member/attendance" className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-all">
                                <ArrowRight size={18} />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {data.attendance.recent.length === 0 ? (
                                <div className="text-center py-10 bg-[#0D0D0D] rounded-3xl border border-white/5 border-dashed">
                                    <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No entry logs found</p>
                                </div>
                            ) : (
                                data.attendance.recent.slice(0, 5).map((record) => (
                                    <div
                                        key={record.id}
                                        className="flex items-center justify-between p-5 bg-[#0D0D0D] border border-white/5 rounded-2xl group/item hover:border-cyan-400/20 transition-all"
                                    >
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-widest">{formatDate(record.checkInTime)}</p>
                                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                                                {new Date(record.checkInTime).toLocaleTimeString('en-IN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                                {record.checkOutTime &&
                                                    ` — ${new Date(record.checkOutTime).toLocaleTimeString('en-IN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}`}
                                            </p>
                                        </div>
                                        <Badge variant="info" className="bg-white/5 text-[7px] font-black border-white/10 px-3 py-1 rounded-lg uppercase tracking-widest group-hover/item:text-cyan-400 transition-colors">
                                            {record.method} Access
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Weight Progress */}
            {data.progress.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Card variant="default" className="rounded-[3rem] p-10 bg-white/[0.03] backdrop-blur-3xl border-white/10 group hover:border-cyan-400/20 transition-all overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                                    <div className="p-3 bg-emerald-400/10 rounded-2xl text-emerald-400">
                                        <TrendingUp size={24} />
                                    </div>
                                    Weight Tracker
                                </h3>
                                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] pl-16">Track your weight progress</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-12 overflow-x-auto pb-6 relative z-10 scrollbar-hide">
                            {data.progress.slice(0, 6).reverse().map((record, index) => (
                                <div key={record.id} className="flex flex-col items-center min-w-[120px] group/flux">
                                    <div className="w-24 h-24 rounded-[2rem] bg-[#0D0D0D] border border-white/5 flex flex-col items-center justify-center mb-6 group-hover/flux:border-emerald-400/30 group-hover/flux:scale-110 transition-all duration-500">
                                        <span className="text-2xl font-black text-white tracking-tighter tabular-nums">{record.weight}</span>
                                        <span className="text-[7px] text-zinc-700 font-black uppercase tracking-widest mt-1">KG</span>
                                    </div>
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] group-hover/flux:text-white transition-colors">{formatDate(record.recordedAt)}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
