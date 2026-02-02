'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Scale, Activity } from 'lucide-react';
import { Card, Spinner, Badge } from '@/components/ui';
import { membersAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { formatDate } from '@/lib/utils';

export default function ProgressPage() {
    const { user } = useAuthStore();
    const [records, setRecords] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgress = async () => {
            if (user?.member?.id) {
                try {
                    const res = await membersAPI.getById(user.member.id);
                    setRecords(res.data.data.progressRecords || []);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProgress();
    }, [user]);

    if (loading) return <div className="flex justify-center p-12"><Spinner /></div>;

    const latest = records[0];
    const initial = records[records.length - 1];

    return (
        <div className="space-y-16 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.5em]">Biometric Feed</p>
                    <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
                        PERFORMANCE <span className="text-cyan-400">EVOLUTION</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase text-[9px] tracking-widest mt-6">Historical data of biological recomposition</p>
                </div>
            </div>

            {latest && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <Card variant="default" className="p-8 rounded-[2.5rem] bg-white/[0.01] border-white/5 group hover:border-cyan-400/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-cyan-400/10 rounded-xl text-cyan-400">
                                <Scale size={20} />
                            </div>
                            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Current Weight</h3>
                        </div>
                        <p className="text-5xl font-black text-white tracking-tighter tabular-nums">{latest.weight}<span className="text-xs font-black text-zinc-700 ml-2 uppercase tracking-widest">KG</span></p>
                        {initial && (
                            <p className={`text-[10px] mt-4 font-black uppercase tracking-widest ${latest.weight < initial.weight ? 'text-cyan-400' : 'text-zinc-600'}`}>
                                {latest.weight < initial.weight ? 'CALIBRATED —' : 'GAIN +'} {(Math.abs(latest.weight - initial.weight)).toFixed(1)} KG IN FLUX
                            </p>
                        )}
                    </Card>

                    <Card variant="default" className="p-8 rounded-[2.5rem] bg-white/[0.01] border-white/5 group hover:border-cyan-400/20 transition-all">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-400/10 rounded-xl text-indigo-400">
                                <Activity size={20} />
                            </div>
                            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Body Fat</h3>
                        </div>
                        <p className="text-5xl font-black text-white tracking-tighter tabular-nums">{latest.bodyFat}<span className="text-xs font-black text-zinc-700 ml-2 uppercase tracking-widest">%</span></p>
                        <p className="text-[10px] mt-4 font-black uppercase tracking-widest text-zinc-600">COMPOSITION METRIC</p>
                    </Card>
                </div>
            )}

            <Card variant="default" className="rounded-[3rem] p-10 bg-[#080808] border-white/5">
                <div className="flex items-center justify-between mb-12 border-b border-white/5 pb-10">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Historical Archives</h3>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em]">Sequential metric synchronization logs</p>
                    </div>
                </div>

                {records.length === 0 ? (
                    <div className="py-24 text-center bg-[#0D0D0D] rounded-3xl border border-white/5 border-dashed">
                        <TrendingUp size={48} className="mx-auto mb-6 text-zinc-800" />
                        <p className="text-zinc-600 font-black uppercase text-[10px] tracking-widest">No biometric data recorded</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto scrollbar-hide">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] border-b border-white/5">
                                    <th className="p-6">Date</th>
                                    <th className="p-6">Weight</th>
                                    <th className="p-6">Body Fat</th>
                                    <th className="p-6">Observations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.02]">
                                {records.map((record) => (
                                    <tr key={record.id} className="group hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6">
                                            <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none">{formatDate(record.recordedAt)}</p>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-lg font-black text-white tracking-tighter tabular-nums">{record.weight}<span className="text-[9px] text-zinc-600 ml-2">KG</span></p>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-lg font-black text-white tracking-tighter tabular-nums">{record.bodyFat}<span className="text-[9px] text-zinc-600 ml-2">%</span></p>
                                        </td>
                                        <td className="p-6">
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest max-w-xs">{record.notes || '—'}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
}
