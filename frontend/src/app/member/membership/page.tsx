'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Calendar, Shield } from 'lucide-react';
import { Card, Badge, Spinner } from '@/components/ui';
import { useAuthStore } from '@/store';
import { formatDate, formatCurrency, getDaysRemaining } from '@/lib/utils';
import { paymentsAPI } from '@/lib/api';
import type { Payment } from '@/types';

export default function MembershipPage() {
    const { user } = useAuthStore();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    const membership = user?.member?.memberships?.[0];
    const daysRemaining = membership ? getDaysRemaining(membership.endDate) : 0;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await paymentsAPI.getMyPayments();
                setPayments(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (!membership) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[70vh] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-500/5 via-transparent to-transparent" />
                <div className="relative z-10 space-y-8 max-w-lg">
                    <div className="w-24 h-24 bg-[#0D0D0D] border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                        <Shield size={40} className="text-zinc-800" />
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black text-white tracking-tighter uppercase">No Active <span className="text-rose-500">Membership</span></h2>
                        <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-[0.2em] leading-relaxed">
                            Your membership has <span className="text-white">Expired</span> or is not yet active. <br />
                            Please contact the <span className="text-white">Gym Staff</span> for support.
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
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Membership Status</p>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        MY <span className="text-cyan-400">PLAN</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest mt-6">View your plan details and payment history</p>
                </div>
            </div>

            {/* Membership Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card variant="default" className="p-0 overflow-hidden relative group rounded-[3rem] border-white/10 bg-white/[0.03] backdrop-blur-3xl transition-all duration-700 shadow-xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-50 transition-opacity" />

                    <div className="p-10 relative z-10">
                        <div className="flex justify-between items-start mb-12">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Plan Name</h3>
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{membership.plan?.name}</h2>
                            </div>
                            <Badge variant="info" className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20 text-[10px] font-black tracking-widest px-6 py-2.5 rounded-xl uppercase">
                                {membership.status}
                            </Badge>
                        </div>

                        <div className="space-y-10 mb-12">
                            <div className="flex items-center gap-6 bg-[#0D0D0D] p-6 rounded-[2rem] border border-white/5">
                                <div className="h-12 w-12 bg-cyan-400/10 rounded-2xl flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                    <Calendar size={22} />
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Valid Until</p>
                                    <p className="text-sm font-black text-white uppercase tracking-widest mt-1">ACTIVE UNTIL {formatDate(membership.endDate)}</p>
                                </div>
                            </div>

                            <div className="bg-[#0D0D0D] rounded-[2.5rem] p-8 border border-white/5 transition-all group/progress">
                                <div className="flex justify-between items-end mb-6">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Days Left</span>
                                    <span className="text-4xl font-black text-white tracking-tighter tabular-nums">{daysRemaining}D</span>
                                </div>
                                <div className="h-4 bg-[#050505] rounded-full overflow-hidden border border-white/5 p-1">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (daysRemaining / (membership.plan?.durationDays || 30)) * 100)}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {membership.plan?.features?.map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5 group/feat hover:border-cyan-400/20 transition-all">
                                    <div className="h-2 w-2 rounded-full bg-cyan-400/40 group-hover/feat:bg-cyan-400 transition-all" />
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover/feat:text-white transition-colors">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Payment History */}
                <Card variant="default" className="rounded-[3rem] p-10 bg-white/[0.03] backdrop-blur-3xl border-white/10 overflow-hidden flex flex-col shadow-xl">
                    <div className="flex items-center justify-between mb-12">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                                <div className="p-3 bg-amber-400/10 rounded-2xl text-amber-400">
                                    <CreditCard size={24} />
                                </div>
                                Recent Payments
                            </h3>
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] pl-16">View your subscription payments</p>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
                        {loading ? (
                            <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
                        ) : payments.length === 0 ? (
                            <div className="py-20 text-center bg-[#0D0D0D] rounded-3xl border border-white/5 border-dashed">
                                <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No payments recorded</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {payments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-6 bg-[#0D0D0D] border border-white/5 rounded-[2rem] group/log hover:border-cyan-400/20 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-white/5 flex items-center justify-center text-zinc-700 group-hover/log:text-cyan-400 transition-all">
                                                <CreditCard size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[11px] font-black text-white uppercase tracking-widest">{payment.membership?.plan?.name || 'MANUAL PAYMENT'}</p>
                                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1 mt-1.5">{formatDate(payment.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-white tracking-tighter">{formatCurrency(Number(payment.amount))}</p>
                                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] mt-1.5 inline-block ${payment.status === 'COMPLETED' ? 'text-cyan-400' : 'text-amber-400'}`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
