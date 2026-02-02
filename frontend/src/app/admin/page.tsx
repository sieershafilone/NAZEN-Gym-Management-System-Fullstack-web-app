'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Users,
    CreditCard,
    TrendingUp,
    UserCheck,
    Calendar,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight,
    Settings,
} from 'lucide-react';
import { Card, StatCard, Badge, Avatar, Spinner, Button } from '@/components/ui';
import { dashboardAPI } from '@/lib/api';
import { formatCurrency, formatDate, formatRelativeTime, getDaysRemaining, getInitials, cn } from '@/lib/utils';
import type { AdminDashboard } from '@/types';

export default function AdminDashboardPage() {
    const [data, setData] = useState<AdminDashboard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await dashboardAPI.getAdmin();
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

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                        Admin <span className="text-cyan-400 glow-text">Dashboard</span>
                    </h1>
                    <p className="text-zinc-500 mt-3 font-medium tracking-widest uppercase text-[10px]">
                        ULIFTS <span className="text-white">Management System</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-5 py-2.5 glass-card rounded-2xl flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">System Online</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Members"
                    value={data.members.total}
                    icon={<Users size={24} />}
                    color="amber"
                />
                <StatCard
                    title="Active Members"
                    value={data.members.active}
                    icon={<UserCheck size={24} />}
                    color="indigo"
                    trend={{ value: Math.round((data.members.active / Math.max(data.members.total, 1)) * 100), positive: true }}
                />
                <StatCard
                    title="Check-ins Today"
                    value={data.attendance.today}
                    icon={<Calendar size={24} />}
                    color="mint"
                />
                <StatCard
                    title="Monthly Revenue"
                    value={formatCurrency(data.revenue.thisMonth)}
                    icon={<CreditCard size={24} />}
                    color="indigo"
                    trend={{ value: Math.abs(data.revenue.growth), positive: data.revenue.growth > 0 }}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-10">
                {/* Recent Payments - 2/3 width on large screens */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-2"
                >
                    <div className="glass rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="p-6 md:p-10 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.01]">
                            <div className="text-center sm:text-left">
                                <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight uppercase">Payments</h2>
                                <p className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Latest Transactions</p>
                            </div>
                            <Link href="/admin/payments" className="w-full sm:w-auto">
                                <Button variant="secondary" size="sm" className="w-full rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest">View All</Button>
                            </Link>
                        </div>

                        <div className="p-4 md:p-6 overflow-x-auto custom-scrollbar scroll-hide">
                            <table className="w-full text-left border-separate border-spacing-y-2 md:border-spacing-y-3 min-w-[600px] md:min-w-0">
                                <thead>
                                    <tr>
                                        <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-widest font-black">Member</th>
                                        <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-widest font-black">Plan</th>
                                        <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-widest font-black">Amount</th>
                                        <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-widest font-black">Status</th>
                                        <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-widest font-black">Timeline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.recentPayments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="text-center py-16 text-zinc-600 font-bold tracking-widest uppercase text-xs">No entries.</td>
                                        </tr>
                                    ) : (
                                        data.recentPayments.map((payment) => (
                                            <tr key={payment.id} className="group hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 md:px-6 py-3 md:py-4 first:rounded-l-2xl border-y border-l border-white/5">
                                                    <div className="flex items-center gap-3 md:gap-4">
                                                        <Avatar
                                                            fallback={getInitials(payment.member?.user?.fullName || 'M')}
                                                            size="sm"
                                                            className="rounded-xl"
                                                        />
                                                        <span className="text-xs md:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate max-w-[100px] md:max-w-none">
                                                            {payment.member?.user?.fullName}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 border-y border-white/5">
                                                    <Badge variant="default" className="bg-white/5 border-none lowercase text-[8px] md:text-[10px]">
                                                        {payment.membership?.plan?.name}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 border-y border-white/5">
                                                    <span className="text-xs md:text-sm font-black text-white tracking-tight tabular-nums">
                                                        {formatCurrency(payment.amount)}
                                                    </span>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 border-y border-white/5">
                                                    <Badge variant="success" className="text-[8px] md:text-[10px]">Cleared</Badge>
                                                </td>
                                                <td className="px-4 md:px-6 py-3 md:py-4 last:rounded-r-2xl border-y border-r border-white/5">
                                                    <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-tighter whitespace-nowrap">
                                                        {formatRelativeTime(payment.createdAt)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* Sidebar Alerts - 1/3 width */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-8 md:mb-10">
                            <div>
                                <h2 className="text-lg md:text-xl font-bold text-white tracking-tight flex items-center gap-3 uppercase">
                                    <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">
                                        <AlertCircle size={18} />
                                    </div>
                                    Expiring
                                </h2>
                                <p className="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Renewal Watchlist</p>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl md:rounded-2xl bg-rose-500 font-black text-black text-sm">
                                {data.expiringMemberships.length}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {data.expiringMemberships.length === 0 ? (
                                <div className="text-center py-10 glass-card rounded-2xl">
                                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">All Clear</p>
                                </div>
                            ) : (
                                data.expiringMemberships.slice(0, 4).map((membership) => {
                                    const daysLeft = getDaysRemaining(membership.endDate);
                                    return (
                                        <div
                                            key={membership.id}
                                            className="group flex items-center justify-between p-5 glass-card rounded-2xl hover:border-rose-500/30 transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <Avatar
                                                    fallback={getInitials(membership.member?.user?.fullName || 'M')}
                                                    size="sm"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                                                        {membership.member?.user?.fullName}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">
                                                        {membership.member?.user?.mobile}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${daysLeft <= 3 ? 'bg-rose-500/10 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]' : 'bg-amber-500/10 text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.1)]'}`}>
                                                    {daysLeft}d
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Command Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Add Member', icon: Users, href: '/admin/members?action=add', color: 'mint' },
                            { label: 'Check-in Feed', icon: Calendar, href: '/admin/attendance', color: 'indigo' },
                            { label: 'Payments', icon: CreditCard, href: '/admin/payments?action=add', color: 'amber' },
                            { label: 'System', icon: Settings, href: '/admin/settings', color: 'indigo' },
                        ].map((action, i) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-3xl flex flex-col items-center gap-4 hover:bg-white/[0.05] transition-all group overflow-hidden shadow-xl"
                            >
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                                    action.color === 'mint' && "bg-cyan-400/10 text-cyan-400",
                                    action.color === 'indigo' && "bg-indigo-400/10 text-indigo-400",
                                    action.color === 'amber' && "bg-amber-400/10 text-amber-400"
                                )}>
                                    <action.icon size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

