'use client';

import { useAuthStore } from '@/store';
import { Card, Avatar, Badge, Button } from '@/components/ui';
import { getInitials } from '@/lib/utils';
import { Mail, Phone, Calendar, User, Ruler, Weight, Activity } from 'lucide-react';

export default function MemberProfilePage() {
    const { user } = useAuthStore();
    const member = user?.member;

    if (!user || !member) return null;

    return (
        <div className="max-w-5xl mx-auto space-y-16 animate-fade-in pb-20">
            {/* Profile Header */}
            <div className="relative">
                <div className="h-48 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-[#0D0D0D] to-[#050505] rounded-[3rem] border border-white/5" />
                <div className="absolute -bottom-16 left-12 flex items-end gap-8">
                    <div className="p-2 bg-[#050505] rounded-[2.5rem] shadow-2xl">
                        <div className="p-1 rounded-[2rem] bg-gradient-to-br from-cyan-400/50 to-transparent">
                            <Avatar
                                src={user.profilePhoto}
                                fallback={getInitials(user.fullName)}
                                className="w-32 h-32 rounded-[1.8rem] text-3xl font-black border-4 border-[#0D0D0D]"
                            />
                        </div>
                    </div>
                    <div className="pb-6">
                        <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">{user.fullName}</h1>
                        <p className="text-cyan-400 font-mono text-[10px] font-black uppercase tracking-[0.4em] mt-3">Member ID: {member.memberId}</p>
                    </div>
                </div>
                <div className="absolute top-8 right-8">
                    <Badge variant="info" className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20 text-[10px] font-black tracking-[0.2em] px-6 py-2.5 rounded-xl uppercase">
                        {member.memberships?.[0]?.status || 'UNKNOWN'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-12">
                <Card variant="default" className="lg:col-span-2 p-10 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border-white/10 group hover:bg-white/5 transition-all shadow-xl">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-cyan-400/10 rounded-xl text-cyan-400">
                            <User size={20} />
                        </div>
                        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Personal Information</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-[#0D0D0D] border border-white/5 rounded-2xl group/item hover:border-cyan-400/20 transition-all">
                                <Mail size={18} className="text-zinc-700 group-hover/item:text-cyan-400" />
                                <div>
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Email Address</p>
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest mt-1">{user.email || 'NOT SET'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 bg-[#0D0D0D] border border-white/5 rounded-2xl group/item hover:border-cyan-400/20 transition-all">
                                <Phone size={18} className="text-zinc-700 group-hover/item:text-cyan-400" />
                                <div>
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Phone Number</p>
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest mt-1">{user.mobile}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-6 p-6 bg-[#0D0D0D] border border-white/5 rounded-2xl group/item hover:border-cyan-400/20 transition-all">
                                <Calendar size={18} className="text-zinc-700 group-hover/item:text-cyan-400" />
                                <div>
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Date of Birth</p>
                                    <p className="text-[11px] font-black text-white uppercase tracking-widest mt-1">{member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase() : 'NOT SET'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card variant="default" className="p-10 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border-white/10 overflow-hidden shadow-xl">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-indigo-400/10 rounded-xl text-indigo-400">
                            <Activity size={20} />
                        </div>
                        <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em]">Body Measurements</h3>
                    </div>

                    <div className="space-y-8">
                        <div className="flex justify-between items-center p-6 bg-[#0D0D0D] border border-white/5 rounded-3xl group/metric hover:border-cyan-400/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl text-zinc-600 group-hover/metric:text-cyan-400 transition-colors">
                                    <Ruler size={18} />
                                </div>
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Height</span>
                            </div>
                            <p className="text-xl font-black text-white tracking-tighter tabular-nums">{member.height || '—'}<span className="text-[8px] ml-2 text-zinc-700">CM</span></p>
                        </div>

                        <div className="flex justify-between items-center p-6 bg-[#0D0D0D] border border-white/5 rounded-3xl group/metric hover:border-cyan-400/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl text-zinc-600 group-hover/metric:text-cyan-400 transition-colors">
                                    <Weight size={18} />
                                </div>
                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Weight</span>
                            </div>
                            <p className="text-xl font-black text-white tracking-tighter tabular-nums">{member.weight || '—'}<span className="text-[8px] ml-2 text-zinc-700">KG</span></p>
                        </div>
                    </div>

                    {member.fitnessGoal && (
                        <div className="mt-10 pt-10 border-t border-white/5">
                            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.4em] mb-4">Fitness Goal</p>
                            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-relaxed bg-white/5 p-6 rounded-2xl border border-white/5 border-dashed">
                                "{member.fitnessGoal}"
                            </p>
                        </div>
                    )}
                </Card>
            </div>

            <div className="flex justify-center pt-12">
                <Button variant="outline" className="h-16 px-12 rounded-2xl bg-white/5 border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all duration-500">
                    Edit Profile
                </Button>
            </div>
        </div>
    );
}

