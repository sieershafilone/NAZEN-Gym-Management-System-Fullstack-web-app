'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Plus, CheckCircle2, Trash2, Edit2, X, Save } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';

import { Card, Button, Badge, StatCard, Spinner, EmptyState, Input } from '@/components/ui';
import { plansAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import type { MembershipPlan } from '@/types';

// --- Schema ---
const planSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    durationDays: z.number().min(1, 'Duration must be at least 1 day'),
    basePrice: z.number().min(0, 'Price must be positive'),
    description: z.string().optional(),
    features: z.array(z.object({ value: z.string() })).optional(),
});

type PlanFormValues = z.infer<typeof planSchema>;

export default function PlansPage() {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await plansAPI.getAll();
            // Handle both structure types just in case: { data: [...] } or { data: { data: [...] } }
            const data = Array.isArray(res.data) ? res.data : (Array.isArray(res.data.data) ? res.data.data : []);
            setPlans(data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load plans');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this plan? Clients on this plan will NOT be affected, but new sales will stop.')) return;
        try {
            await plansAPI.delete(id);
            toast.success('Plan deleted successfully');
            fetchPlans();
        } catch (error) {
            toast.error('Failed to delete plan');
        }
    };

    const handleEdit = (plan: MembershipPlan) => {
        setEditingPlan(plan);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingPlan(null);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                        Membership <span className="text-cyan-400 glow-text">Plans</span>
                    </h1>
                    <p className="text-zinc-500 mt-3 font-medium tracking-widest uppercase text-[10px]">
                        Create and manage your <span className="text-white">Gym Plans</span>
                    </p>
                </div>
                <Button onClick={handleCreate} className="group rounded-2xl px-8 h-14">
                    <Plus size={20} className="mr-3 group-hover:rotate-90 transition-transform duration-500" />
                    Create New Plan
                </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Active Plans"
                    value={plans.length}
                    icon={<CreditCard size={24} />}
                    color="mint"
                />
                <StatCard
                    title="Avg Yield"
                    value={plans.length > 0 ? formatCurrency(plans.reduce((acc, p) => acc + Number(p.finalPrice || p.basePrice), 0) / plans.length) : '₹0'}
                    icon={<CreditCard size={24} />}
                    color="indigo"
                />
            </div>

            {/* Plans Grid */}
            {loading ? (
                <div className="h-96 flex items-center justify-center">
                    <Spinner size="lg" />
                </div>
            ) : plans.length === 0 ? (
                <div className="h-96 flex items-center justify-center">
                    <EmptyState
                        title="No Plans"
                        description="You haven't created any plans yet."
                        icon={<CreditCard size={64} className="text-zinc-800" />}
                        action={
                            <Button onClick={handleCreate} variant="outline" className="mt-8 rounded-2xl">
                                Create First Plan
                            </Button>
                        }
                    />
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full"
                        >
                            <Card variant="default" className="h-full flex flex-col p-10 bg-white/[0.03] backdrop-blur-3xl border-white/10 group overflow-hidden relative shadow-xl">
                                <div className="absolute -right-12 -top-12 w-48 h-48 bg-cyan-400/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="mb-6 md:mb-10 relative z-10">
                                    <h3 className="text-xl md:text-2xl font-black text-white mb-3 md:mb-4 tracking-tight group-hover:text-cyan-400 transition-colors uppercase">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tighter tabular-nums">
                                            {formatCurrency(plan.finalPrice || plan.basePrice)}
                                        </span>
                                        <span className="text-zinc-600 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
                                            / {plan.durationDays} Days
                                        </span>
                                    </div>
                                    <p className="text-zinc-500 text-[11px] md:text-xs mt-3 md:mt-4 font-medium leading-relaxed line-clamp-2 uppercase">
                                        {plan.description || "Core membership plan with standard facility privileges."}
                                    </p>
                                </div>

                                <div className="space-y-4 mb-12 flex-1 relative z-10">
                                    {plan.features && plan.features.slice(0, 5).map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-4 text-xs font-bold text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                            <div className="w-6 h-6 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-cyan-400/30">
                                                <CheckCircle2 size={14} className="text-cyan-400 shadow-[0_0_10px_rgba(45,212,191,0.3)]" />
                                            </div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-6 md:pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                                    <div className="flex flex-col items-center sm:items-start">
                                        <span className="text-white font-black text-[10px] md:text-xs tracking-tighter">ACTIVE</span>
                                        <span className="text-[8px] md:text-[10px] text-zinc-600 uppercase tracking-widest font-black">Ready for sale</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)} className="h-10 w-10 p-0 rounded-xl text-rose-500 hover:bg-rose-500/10">
                                            <Trash2 size={18} />
                                        </Button>
                                        <Button variant="secondary" size="sm" onClick={() => handleEdit(plan)} className="rounded-xl px-4 md:px-5 h-10 border-white/5 text-[10px] md:text-xs">
                                            <Edit2 size={16} className="mr-2" /> EDIT
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )
            }

            {/* Create/Edit Modal */}
            <PlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingPlan}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchPlans();
                }}
            />
        </div >
    );
}

// --- Plan Modal Component ---

function PlanModal({ isOpen, onClose, initialData, onSuccess }: {
    isOpen: boolean;
    onClose: () => void;
    initialData: MembershipPlan | null;
    onSuccess: () => void;
}) {
    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PlanFormValues>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            name: '',
            durationDays: 30,
            basePrice: 0,
            description: '',
            features: [{ value: 'Gym Access' }, { value: 'Locker Access' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "features"
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                reset({
                    name: initialData.name,
                    durationDays: initialData.durationDays,
                    basePrice: initialData.basePrice,
                    description: initialData.description || '',
                    features: initialData.features?.map(f => ({ value: f })) || []
                });
            } else {
                reset({
                    name: '',
                    durationDays: 30,
                    basePrice: 0,
                    description: '',
                    features: [{ value: 'Gym Access' }]
                });
            }
        }
    }, [isOpen, initialData, reset]);

    const onSubmit = async (data: PlanFormValues) => {
        try {
            const formattedData = {
                ...data,
                features: data.features?.map(f => f.value).filter(Boolean) || []
            };

            if (initialData) {
                await plansAPI.update(initialData.id, formattedData);
                toast.success('Plan updated');
            } else {
                await plansAPI.create(formattedData);
                toast.success('Plan created');
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error('Update failed');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[#050505] w-full max-w-xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-[2.5rem] md:rounded-[3rem] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)] flex flex-col mb-4"
            >
                <div className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01] sticky top-0 z-10 backdrop-blur-3xl">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">{initialData ? 'Edit Plan' : 'New Plan'}</h2>
                        <p className="text-zinc-600 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Plan Details</p>
                    </div>
                    <button onClick={onClose} className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-zinc-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10 space-y-8 md:space-y-10">
                    <div className="space-y-8">
                        <Input
                            label="Plan Name"
                            placeholder="e.g. Gold Annual"
                            {...register('name')}
                            error={errors.name?.message}
                        />

                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                type="number"
                                label="Duration (Days)"
                                {...register('durationDays', { valueAsNumber: true })}
                                error={errors.durationDays?.message}
                            />
                            <Input
                                type="number"
                                label="Price (₹)"
                                {...register('basePrice', { valueAsNumber: true })}
                                error={errors.basePrice?.message}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Description</label>
                            <textarea
                                className="w-full px-6 py-4 bg-[#0D0D0D] border border-white/5 rounded-3xl text-white placeholder-zinc-700 focus:outline-none focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/5 transition-all duration-300 resize-none h-32 text-sm"
                                placeholder="Define the core value proposition..."
                                {...register('description')}
                            ></textarea>
                            {errors.description && <p className="mt-2 text-xs text-rose-500 ml-1">{errors.description.message}</p>}
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-3 ml-1">Plan Features</label>
                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3">
                                        <div className="flex-1 relative group">
                                            <input
                                                {...register(`features.${index}.value`)}
                                                className="w-full px-6 py-3 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white text-sm focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                                                placeholder="Feature capability"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-3 bg-white/5 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all h-12 w-12 flex items-center justify-center border border-white/5"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                                <Button type="button" variant="secondary" onClick={() => append({ value: '' })} className="w-full h-12 rounded-2xl border-dashed border-2 border-white/5 hover:border-cyan-400/30">
                                    <Plus size={16} className="mr-2" /> Inject Feature
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="w-1/3 h-14 rounded-2xl text-zinc-500">Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="w-2/3 h-14 rounded-2xl">
                            {isSubmitting ? <Spinner size="sm" /> : (initialData ? 'SAVE CHANGES' : 'CREATE PLAN')}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

