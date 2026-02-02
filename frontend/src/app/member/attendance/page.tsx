'use client';

import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, Spinner, Badge } from '@/components/ui';
import { membersAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store';
import type { Attendance } from '@/types';

export default function AttendancePage() {
    const { user } = useAuthStore();
    const [attendance, setAttendance] = useState<Attendance[]>([]);
    const [loading, setLoading] = useState(true);

    const stats = {
        total: attendance.length,
        thisMonth: attendance.filter(a => new Date(a.checkInTime).getMonth() === new Date().getMonth()).length,
        avgDuration: attendance.length > 0
            ? Math.round(attendance.reduce((acc, curr) => {
                if (!curr.checkOutTime) return acc;
                return acc + (new Date(curr.checkOutTime).getTime() - new Date(curr.checkInTime).getTime()) / (1000 * 60);
            }, 0) / attendance.length)
            : 0
    };

    useEffect(() => {
        const fetchAttendance = async () => {
            if (user?.member?.id) {
                try {
                    const res = await membersAPI.getById(user.member.id);
                    setAttendance(res.data.data.attendance || []);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchAttendance();
    }, [user]);

    return (
        <div className="space-y-16 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Activity Pulse</p>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        ATTENDANCE <span className="text-cyan-400">RECORD</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest mt-6">Track your biological synchronization consistency</p>
                </div>
            </div>

            {/* Matrix Metrics Segment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    { label: "Total Sessions", value: stats.total, icon: CheckCircle, color: "indigo" },
                    { label: "This Month", value: stats.thisMonth, icon: CalendarIcon, color: "indigo" },
                    { label: "Avg. Intensity", value: `${stats.avgDuration} MINS`, icon: Clock, color: "indigo" }
                ].map((stat, i) => (
                    <Card key={i} variant="default" className="flex items-center gap-6 p-8 rounded-[2.5rem] bg-white/[0.01] border-white/5 group hover:bg-white/[0.03] hover:border-cyan-400/20 transition-all duration-500">
                        <div className="h-16 w-16 bg-[#0D0D0D] border border-white/5 rounded-2xl flex items-center justify-center text-zinc-700 group-hover:text-cyan-400 transition-all shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                            <stat.icon size={28} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-white tracking-tighter uppercase mt-1">{stat.value}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Visitation Flux List */}
            <Card variant="default" className="rounded-[3rem] p-10 bg-[#080808] border-white/5 flex flex-col">
                <div className="flex items-center justify-between mb-12">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-4">
                            Recent Visitation Flux
                        </h3>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Site entry sequence logs</p>
                    </div>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
                ) : attendance.length === 0 ? (
                    <div className="py-20 text-center bg-[#0D0D0D] rounded-3xl border border-white/5 border-dashed">
                        <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No activity detected in the archives</p>
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
                        {attendance.map((record) => {
                            const duration = record.checkOutTime
                                ? Math.round((new Date(record.checkOutTime).getTime() - new Date(record.checkInTime).getTime()) / (1000 * 60))
                                : null;

                            return (
                                <div key={record.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[#0D0D0D] border border-white/5 rounded-[2rem] group hover:border-cyan-400/20 transition-all gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-[#050505] border border-white/5 flex flex-col items-center justify-center group-hover:bg-white/5 transition-colors">
                                            <span className="text-xl font-black text-white tracking-tighter">
                                                {new Date(record.checkInTime).getDate()}
                                            </span>
                                            <span className="text-[7px] font-black text-zinc-600 uppercase">EVENT</span>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">{formatDate(record.checkInTime)}</p>
                                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-2">
                                                {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                {' — '}
                                                {record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'SESSION ONGOING'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Duration</p>
                                            <p className="text-sm font-black text-white uppercase tracking-widest mt-1">
                                                {duration ? `${duration} MINS` : <span className="text-cyan-400 animate-pulse">ACTIVE</span>}
                                            </p>
                                        </div>
                                        <div className="w-px h-10 bg-white/5 hidden sm:block" />
                                        <Badge variant="info" className="bg-white/5 text-[8px] font-black text-zinc-600 border-white/10 px-4 py-2 rounded-xl uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                                            {record.method} GATEWAY
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
