'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    MoreVertical,
    Shield,
    Users,
    Activity,
    Dumbbell,
    X,
    Check,
    ChevronDown,
    Save,
    Calendar,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';
import { Button, Card, Input, Badge, Avatar, Spinner, EmptyState, StatCard } from '@/components/ui';
import { membersAPI, plansAPI } from '@/lib/api';
import { formatDate, getInitials, getDaysRemaining, cn, formatCurrency } from '@/lib/utils';
import type { Member, MembershipPlan } from '@/types';
import toast from 'react-hot-toast';

// --- Validation Schemas ---
const memberSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Must be a valid 10-digit number'),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    height: z.string().optional(),
    weight: z.string().optional(),
    fitnessGoal: z.string().optional(),
    emergencyContact: z.string().optional(),
    planId: z.string().min(1, 'Please select a membership plan'),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function MembersPage() {
    // --- State ---
    const [members, setMembers] = useState<Member[]>([]);
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'EXPIRED' | 'FROZEN'>('ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    // --- Data Fetching ---
    const fetchMembers = async () => {
        setLoading(true);
        try {
            const response = await membersAPI.getAll({ search, page, limit: 10 });
            let filteredMembers = response.data.data.members;

            if (statusFilter !== 'ALL') {
                filteredMembers = filteredMembers.filter((m: Member) => {
                    const status = m.memberships?.[0]?.status || 'EXPIRED';
                    return status === statusFilter;
                });
            }

            setMembers(filteredMembers);
            setTotalPages(response.data.data.pagination.totalPages);
        } catch (error) {
            toast.error('Failed to load roster');
        } finally {
            setLoading(false);
        }
    };

    const fetchPlans = async () => {
        try {
            const response = await plansAPI.getAll();
            setPlans(response.data.data.filter((p: MembershipPlan) => p.isActive));
        } catch (error) {
            console.error('Failed to load plans');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [search, page, statusFilter]);

    useEffect(() => {
        fetchPlans();
    }, []);

    // --- Actions ---
    const handleDelete = async (id: string) => {
        if (!confirm('This action cannot be undone. Archive this athlete?')) return;
        try {
            await membersAPI.delete(id);
            toast.success('Archived athlete successfully');
            fetchMembers();
        } catch (error) {
            toast.error('Failed to archive');
        }
    };

    const handleView = async (id: string) => {
        try {
            const response = await membersAPI.getById(id);
            setSelectedMember(response.data.data);
            setShowViewModal(true);
        } catch (error) {
            toast.error('Could not fetch details');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                        Gym <span className="text-cyan-400 glow-text">Members</span>
                    </h1>
                    <p className="text-zinc-500 font-medium tracking-widest uppercase text-[10px] max-w-xl">
                        Manage your gym <span className="text-white">Members</span> & their membership status.
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="h-14 px-10 rounded-2xl group"
                >
                    <Plus size={20} className="mr-3 group-hover:rotate-90 transition-transform duration-500" />
                    Add Member
                </Button>
            </div>

            {/* --- Stats Row --- */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Members" value={members.length} icon={<Users size={20} />} color="indigo" />
                <StatCard title="Active Now" value="12" icon={<Activity size={20} />} color="mint" />
                <StatCard title="Workouts Today" value="3" icon={<Dumbbell size={20} />} color="indigo" />
                <StatCard title="Attendance" value="5" icon={<Shield size={20} />} color="amber" />
            </div>

            {/* --- Controls & Filter Bar --- */}
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 rounded-[2.5rem] flex flex-col md:flex-row gap-6 items-center shadow-xl">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search members..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#0D0D0D] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/5 transition-all duration-300 placeholder:text-zinc-700 font-medium"
                    />
                </div>

                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scroll-hide">
                    {(['ALL', 'ACTIVE', 'EXPIRED', 'FROZEN'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                statusFilter === status
                                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                    : "bg-white/5 text-zinc-500 border-white/5 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Data Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full h-96 flex items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : members.length === 0 ? (
                    <div className="col-span-full flex items-center justify-center">
                        <EmptyState
                            icon={<Users size={64} className="text-zinc-800" />}
                            title="No Members Found"
                            description="No members match the current filters."
                            action={<Button variant="secondary" onClick={() => { setSearch(''); setStatusFilter('ALL') }} className="mt-4 rounded-xl">Reset Filters</Button>}
                        />
                    </div>
                ) : (
                    members.map((member, i) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            onView={() => handleView(member.id)}
                            onDelete={() => handleDelete(member.id)}
                            index={i}
                        />
                    ))
                )}
            </div>

            {/* --- Modals --- */}
            <AddMemberModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                plans={plans}
                onSuccess={() => {
                    fetchMembers();
                    setShowAddModal(false);
                }}
            />

            {selectedMember && (
                <ViewMemberModal
                    isOpen={showViewModal}
                    onClose={() => setShowViewModal(false)}
                    member={selectedMember}
                />
            )}
        </div>
    );
}

// --- Sub-components for cleaner file ---

function MemberCard({ member, onView, onDelete, index }: { member: Member, onView: () => void, onDelete: () => void, index: number }) {
    const activePlan = member.memberships?.[0];
    const status = activePlan?.status || 'INACTIVE';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 hover:border-cyan-400/30 transition-all duration-500 flex flex-col justify-between h-full overflow-hidden shadow-xl"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Header */}
            <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-5">
                    <Avatar
                        src={member.user?.profilePhoto}
                        fallback={getInitials(member.user?.fullName || '?')}
                        size="md"
                        className="rounded-2xl shadow-xl shadow-black group-hover:scale-105 transition-transform duration-500 sm:size-lg"
                    />
                    <div>
                        <h3 className="text-white font-black text-xl leading-tight group-hover:text-cyan-400 transition-colors truncate max-w-[150px]">
                            {member.user?.fullName}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                            <Badge variant={status === 'ACTIVE' ? 'success' : status === 'EXPIRED' ? 'danger' : 'default'} className="lowercase text-[8px] px-2 py-0.5">
                                {status.toLowerCase()}
                            </Badge>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                {member.memberId}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button onClick={onView} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl text-zinc-600 hover:text-white hover:bg-white/10 transition-all">
                        <Eye size={18} />
                    </button>
                    <button onClick={onDelete} className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-xl text-zinc-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all">
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                <div className="bg-white/[0.02] rounded-[1.5rem] p-5 border border-white/5">
                    <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1.5">Plan</p>
                    <p className="text-sm font-bold text-white truncate">{activePlan?.plan?.name || '--'}</p>
                </div>
                <div className="bg-white/[0.02] rounded-[1.5rem] p-5 border border-white/5">
                    <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1.5">Expires In</p>
                    <p className="text-sm font-black text-cyan-400 tabular-nums">
                        {activePlan ? `${getDaysRemaining(activePlan.endDate)}d` : '--'}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                    {member.fitnessGoal || 'FITNESS GOAL'}
                </span>
                <motion.button
                    whileHover={{ x: 3 }}
                    onClick={onView}
                    className="text-xs font-black text-white hover:text-cyan-400 flex items-center transition-colors uppercase tracking-widest"
                >
                    DETAILS <ArrowUpRight size={14} className="ml-2" />
                </motion.button>
            </div>
        </motion.div>
    );
}

function AddMemberModal({ isOpen, onClose, plans, onSuccess }: { isOpen: boolean, onClose: () => void, plans: MembershipPlan[], onSuccess: () => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<MemberFormValues>({
        resolver: zodResolver(memberSchema),
        defaultValues: {
            gender: 'MALE',
            dateOfBirth: ''
        }
    });

    const onSubmit = async (data: MemberFormValues) => {
        try {
            await membersAPI.create({
                ...data,
                height: data.height ? Number(data.height) : undefined,
                weight: data.weight ? Number(data.weight) : undefined,
            });
            toast.success('Induction successful');
            reset();
            onSuccess();
        } catch (error) {
            toast.error('Induction error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[#050505] w-full max-w-3xl rounded-[2.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
                <div className="p-6 md:p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">Add Member</h2>
                        <p className="text-zinc-600 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1">Basic Information</p>
                    </div>
                    <button onClick={onClose} className="p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl text-zinc-500 hover:text-white transition-colors"><X size={20} className="md:w-6 md:h-6" /></button>
                </div>

                <div className="overflow-y-auto p-6 md:p-10 custom-scrollbar scroll-hide">
                    <form id="add-member-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8 md:space-y-12">
                        <section>
                            <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <div className="w-8 h-[1px] bg-cyan-400/30" />
                                Member Identity
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input label="Full Name" placeholder="ex. JOHN DOE" {...register('fullName')} error={errors.fullName?.message} />
                                <Input type="date" label="Date of Birth" {...register('dateOfBirth')} error={errors.dateOfBirth?.message} />
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Gender</label>
                                    <select {...register('gender')} className="w-full px-5 py-3 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white appearance-none focus:outline-none focus:border-cyan-400/50 transition-all duration-300">
                                        <option value="MALE">MALE</option>
                                        <option value="FEMALE">FEMALE</option>
                                        <option value="OTHER">OTHER</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <div className="w-8 h-[1px] bg-indigo-400/30" />
                                Contact Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input label="Mobile Number" placeholder="10-DIGIT MOBILE" {...register('mobile')} error={errors.mobile?.message} />
                                <Input label="Email Address" placeholder="MEMBER@DOMAIN.COM" {...register('email')} error={errors.email?.message} />
                            </div>
                        </section>

                        <section>
                            <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <div className="w-8 h-[1px] bg-amber-400/30" />
                                Membership Plan
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {plans.map(plan => (
                                    <label key={plan.id} className="cursor-pointer relative group">
                                        <input type="radio" value={plan.id} {...register('planId')} className="peer sr-only" />
                                        <div className="p-6 rounded-[1.5rem] border border-white/5 bg-[#0D0D0D] peer-checked:bg-white/[0.04] peer-checked:border-cyan-400/50 transition-all hover:bg-white/[0.02]">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="font-black text-white text-sm tracking-tight">{plan.name}</span>
                                                <span className="text-[10px] text-cyan-400 font-bold uppercase">{formatCurrency(plan.finalPrice)}</span>
                                            </div>
                                            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{plan.durationDays} DAYS</div>
                                        </div>
                                        <div className="absolute top-4 right-4 opacity-0 peer-checked:opacity-100 transition-opacity">
                                            <div className="bg-cyan-400 rounded-lg p-1 shadow-[0_0_10px_rgba(45,212,191,0.5)]"><Check size={12} className="text-black font-black" /></div>
                                        </div>
                                    </label>
                                ))}
                                {errors.planId && <span className="text-rose-500 text-[10px] font-bold uppercase block mt-2 ml-1">{errors.planId.message}</span>}
                            </div>
                        </section>
                    </form>
                </div>

                <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-end gap-6">
                    <Button variant="ghost" onClick={onClose} className="px-8 h-14 rounded-2xl">Abort</Button>
                    <Button form="add-member-form" disabled={isSubmitting} className="px-10 h-14 rounded-2xl">
                        {isSubmitting ? <Spinner size="sm" /> : <>ADD MEMBER</>}
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

function ViewMemberModal({ isOpen, onClose, member }: { isOpen: boolean, onClose: () => void, member: Member }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl animate-in fade-in duration-400">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#050505] w-full max-w-4xl rounded-[2.5rem] md:rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden max-h-[95vh] md:max-h-[90vh] flex flex-col relative"
            >
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-cyan-400/5 to-transparent pointer-events-none" />

                <div className="p-6 md:p-12 relative z-10 flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 text-center md:text-left">
                        <Avatar
                            src={member.user?.profilePhoto}
                            fallback={getInitials(member.user?.fullName || '?')}
                            size="xl"
                            className="rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] scale-110 md:scale-125 border border-white/10"
                        />
                        <div className="md:ml-4">
                            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">{member.user?.fullName}</h1>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                                <Badge variant="default" className="bg-white/5 border-none font-black tracking-widest text-[9px]">{member.memberId}</Badge>
                                <Badge variant="success" className="px-3 md:px-4 py-1 text-[9px]">ACTIVE</Badge>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="absolute top-6 right-6 p-4 md:p-5 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl text-zinc-500 hover:text-white transition-all"><X size={24} className="md:w-7 md:h-7" /></button>
                </div>

                <div className="px-6 md:px-12 pb-10 md:pb-12 overflow-y-auto custom-scrollbar scroll-hide space-y-8 md:space-y-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                        {[
                            { label: 'Weight', value: member.weight ? `${member.weight} KG` : '--', icon: Dumbbell, color: 'indigo' },
                            { label: 'Height', value: member.height ? `${member.height} CM` : '--', icon: Activity, color: 'mint' },
                            { label: 'Goal', value: member.fitnessGoal || 'GENERAL', icon: TrendingUp, color: 'amber' },
                            { label: 'Joined', value: formatDate(member.joinDate).toUpperCase(), icon: Calendar, color: 'indigo' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white/[0.02] rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/5 group hover:bg-white/[0.04] transition-all">
                                <div className={cn(
                                    "flex items-center gap-3 mb-2 md:mb-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest",
                                    stat.color === 'indigo' && "text-indigo-400",
                                    stat.color === 'mint' && "text-cyan-400",
                                    stat.color === 'amber' && "text-amber-400"
                                )}>
                                    <stat.icon size={14} className="md:w-4 md:h-4" /> {stat.label}
                                </div>
                                <div className="text-xl md:text-2xl font-black text-white tracking-tight">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl">
                            <h3 className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 md:mb-8">Contact Details</h3>
                            <div className="space-y-6">
                                <InfoRow label="Mobile" value={member.user?.mobile} />
                                <InfoRow label="Email" value={member.user?.email} />
                                <InfoRow label="Date of Birth" value={formatDate(member.dateOfBirth)} />
                                <InfoRow label="Emergency Contact" value={member.emergencyContact} />
                            </div>
                        </div>
                        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-xl">
                            <h3 className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-6 md:mb-8">Membership</h3>
                            {member.memberships?.[0] ? (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-2">Current Plan</p>
                                            <h4 className="text-3xl font-black text-white tracking-tighter">{member.memberships[0].plan?.name}</h4>
                                        </div>
                                        <Badge variant="success" className="mb-1 px-4">VALID</Badge>
                                    </div>
                                    <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 text-center">Membership Expires On</p>
                                        <div className="text-xl font-black text-white text-center tracking-tight">{formatDate(member.memberships[0].endDate)}</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem]">
                                    <p className="text-zinc-700 text-xs font-black uppercase tracking-widest">No Active Plan</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-end mt-auto">
                    <Button variant="secondary" onClick={onClose} className="px-10 h-14 rounded-2xl">Close</Button>
                </div>
            </motion.div>
        </div>
    );
}

const InfoRow = ({ label, value }: { label: string, value?: string }) => (
    <div className="flex justify-between items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.01] px-2 transition-colors rounded-xl">
        <span className="text-zinc-600 text-xs font-bold uppercase tracking-widest">{label}</span>
        <span className="text-white font-black text-sm tracking-tight">{value || '--'}</span>
    </div>
);
