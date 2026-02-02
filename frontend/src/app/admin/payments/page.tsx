'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ArrowUpRight, ArrowDownRight, Download, Filter, Search as SearchIcon, Plus, Trash2, X, Check, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

import { Card, Button, Badge, StatCard, Spinner, EmptyState } from '@/components/ui';
import { paymentsAPI, membersAPI, plansAPI } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Payment, Member, MembershipPlan } from '@/types';

// --- Types & Schemas ---

const transactionSchema = z.object({
    memberId: z.string().min(1, 'Member is required'),
    planId: z.string().min(1, 'Plan is required'),
    paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER']),
    notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function PaymentsPage() {
    // --- State ---
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [showRecordModal, setShowRecordModal] = useState(false);

    // Stats State (Mocked for now, can be computed from real data)
    const stats = {
        totalRevenue: payments.reduce((acc, p) => acc + Number(p.amount), 0),
        pending: 0, // In this system, we mostly record completed payments
        refunds: 0,
        avgCheck: payments.length > 0 ? payments.reduce((acc, p) => acc + Number(p.amount), 0) / payments.length : 0
    };

    // --- Fetch Data ---
    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await paymentsAPI.getAll();
            setPayments(response.data.data.payments);
        } catch (error) {
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // --- Handlers ---
    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(payments.map(p => p.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} transaction(s)? This cannot be undone.`)) return;

        try {
            await Promise.all(Array.from(selectedIds).map(id => paymentsAPI.delete(id)));
            toast.success('Transactions deleted successfully');
            setSelectedIds(new Set());
            fetchPayments();
        } catch (error) {
            toast.error('Failed to delete transactions');
        }
    };

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                        Gym <span className="text-cyan-400 glow-text">Payments</span>
                    </h1>
                    <p className="text-zinc-500 mt-3 font-medium tracking-widest uppercase text-[10px]">
                        Monitor <span className="text-white">Revenue</span> & Transaction history.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="secondary" className="group hidden sm:flex h-14 rounded-2xl px-6">
                        <Download size={20} className="mr-3 group-hover:text-cyan-400 transition-colors" />
                        Export CSV
                    </Button>
                    <Button onClick={() => setShowRecordModal(true)} className="h-14 px-8 rounded-2xl group">
                        <Plus size={20} className="mr-3 group-hover:rotate-90 transition-transform duration-500" />
                        Record Payment
                    </Button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} icon={<CreditCard size={20} />} color="mint" />
                <StatCard title="Pending" value={formatCurrency(stats.pending)} icon={<CreditCard size={20} />} color="indigo" />
                <StatCard title="Refunds" value={formatCurrency(stats.refunds)} icon={<ArrowDownRight size={20} />} color="rose" />
                <StatCard title="Average Payment" value={formatCurrency(stats.avgCheck)} icon={<ArrowUpRight size={20} />} color="amber" />
            </div>

            {/* Content Area */}
            <Card variant="default" className="overflow-hidden min-h-[600px] flex flex-col p-0 bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-xl">
                <div className="p-10 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/[0.01]">
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                        <h2 className="text-2xl font-black text-white tracking-tight">Transaction History</h2>
                        {selectedIds.size > 0 && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleDeleteSelected}
                                className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                            >
                                <Trash2 size={14} /> Delete ({selectedIds.size})
                            </motion.button>
                        )}
                    </div>
                    <div className="flex items-center gap-4 bg-[#0D0D0D] rounded-2xl px-6 py-4 border border-white/5 w-full sm:w-80 focus-within:border-cyan-400/50 focus-within:ring-4 focus-within:ring-cyan-400/5 transition-all duration-300">
                        <SearchIcon size={18} className="text-zinc-600" />
                        <input type="text" placeholder="Search transactions..." className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-700 w-full font-medium" />
                    </div>
                </div>

                <div className="overflow-x-auto flex-1 custom-scrollbar">
                    {loading ? (
                        <div className="h-96 flex items-center justify-center">
                            <Spinner size="lg" />
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="h-96 flex items-center justify-center">
                            <EmptyState
                                title="No Transactions"
                                description="No payments have been recorded yet."
                                icon={<CreditCard size={64} className="text-zinc-800" />}
                            />
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="w-20 px-10 py-6">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={payments.length > 0 && selectedIds.size === payments.length}
                                            className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-cyan-400 focus:ring-0 cursor-pointer transition-all checked:bg-cyan-400 checked:border-cyan-400"
                                        />
                                    </th>
                                    <th className="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Invoice No.</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Member Name</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Amount</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Payment Date</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-center">Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-10 py-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(payment.id)}
                                                onChange={() => handleSelectRow(payment.id)}
                                                className="w-5 h-5 rounded-lg border-white/10 bg-white/5 text-cyan-400 focus:ring-0 cursor-pointer transition-all checked:bg-cyan-400 checked:border-cyan-400"
                                            />
                                        </td>
                                        <td className="px-6 py-6 font-mono text-zinc-600 text-[10px] font-bold group-hover:text-zinc-400 transition-colors">
                                            {payment.invoiceNumber}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors">{payment.member?.user?.fullName || 'UNKNOWN'}</span>
                                                <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest mt-1">{payment.member?.memberId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <Badge variant={payment.status === 'COMPLETED' ? 'success' : 'warning'} className="lowercase text-[8px] px-3">
                                                {payment.status.toLowerCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <span className="text-base font-black text-white tabular-nums">{formatCurrency(Number(payment.amount))}</span>
                                        </td>
                                        <td className="px-6 py-6 text-[10px] font-bold text-zinc-600 uppercase tracking-widest tabular-nums">
                                            {formatDate(payment.createdAt)}
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <button className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl text-zinc-600 hover:text-white hover:bg-white/10 transition-all mx-auto">
                                                <ArrowUpRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            {/* Record Transaction Modal */}
            <RecordTransactionModal
                isOpen={showRecordModal}
                onClose={() => setShowRecordModal(false)}
                onSuccess={() => {
                    fetchPayments();
                    setShowRecordModal(false);
                }}
            />
        </div>
    );
}

// --- Record Transaction Modal Component ---

function RecordTransactionModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
    const [members, setMembers] = useState<Member[]>([]);
    const [plans, setPlans] = useState<MembershipPlan[]>([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue } = useForm<TransactionFormValues>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            paymentMethod: 'CASH'
        }
    });

    useEffect(() => {
        if (isOpen) {
            const loadData = async () => {
                const [mRes, pRes] = await Promise.all([membersAPI.getAll({ limit: 100 }), plansAPI.getAll()]);
                setMembers(mRes.data.data.members || []);
                setPlans(pRes.data.data || []);
            };
            loadData();
        }
    }, [isOpen]);

    const onSubmit = async (data: TransactionFormValues) => {
        try {
            await paymentsAPI.createManual(data);
            toast.success('Payment recorded');
            onSuccess();
        } catch (error) {
            toast.error('Failed to record');
        }
    };

    const selectedPlanId = watch('planId');
    const selectedPlan = plans.find(p => p.id === selectedPlanId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[#050505] w-full max-w-xl rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">RECORD PAYMENT</h2>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">MANUAL PAYMENT ENTRY</p>
                    </div>
                    <button onClick={onClose} className="p-4 bg-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Member</label>
                            <select {...register('memberId')} className="w-full h-14 px-6 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white appearance-none focus:outline-none focus:border-cyan-400/50 transition-all duration-300">
                                <option value="">-- SELECT MEMBER --</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.user?.fullName} ({m.memberId})</option>
                                ))}
                            </select>
                            {errors.memberId && <span className="text-rose-500 text-[10px] font-bold uppercase block mt-1 ml-1">{errors.memberId.message}</span>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Membership Plan</label>
                            <select {...register('planId')} className="w-full h-14 px-6 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white appearance-none focus:outline-none focus:border-cyan-400/50 transition-all duration-300">
                                <option value="">-- SELECT PLAN --</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.finalPrice)}</option>
                                ))}
                            </select>
                            {errors.planId && <span className="text-rose-500 text-[10px] font-bold uppercase block mt-1 ml-1">{errors.planId.message}</span>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Payment Method</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['CASH', 'UPI', 'BANK_TRANSFER'].map(method => (
                                    <label key={method} className="cursor-pointer">
                                        <input type="radio" value={method} {...register('paymentMethod')} className="peer sr-only" />
                                        <div className="h-12 flex items-center justify-center rounded-2xl border border-white/5 bg-[#0D0D0D] peer-checked:bg-white peer-checked:text-black peer-checked:border-white transition-all text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
                                            {method.split('_')[0]}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {selectedPlan && (
                            <div className="bg-cyan-400/5 border border-cyan-400/20 rounded-3xl p-8 flex flex-col items-center">
                                <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-2">Amount</span>
                                <span className="text-4xl font-black text-white tracking-tighter tabular-nums">{formatCurrency(selectedPlan.finalPrice)}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="w-1/3 h-14 rounded-2xl">Abort</Button>
                        <Button type="submit" disabled={isSubmitting} className="w-2/3 h-14 rounded-2xl">
                            {isSubmitting ? <Spinner size="sm" /> : 'RECORD PAYMENT'}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
