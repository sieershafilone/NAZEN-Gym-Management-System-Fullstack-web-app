'use client';

import { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';
import { Card, Spinner } from '@/components/ui';
import { useAuthStore } from '@/store';
import { membersAPI } from '@/lib/api';

export default function QRPage() {
    const { user } = useAuthStore();
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQR = async () => {
            if (user?.member?.id) {
                try {
                    const res = await membersAPI.getQR(user.member.id);
                    setQrCode(res.data.data.qrCode);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchQR();
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />

            <Card variant="default" className="max-w-md w-full p-12 text-center flex flex-col items-center gap-10 rounded-[3rem] bg-white/[0.03] border-white/10 relative z-10 backdrop-blur-3xl group hover:border-cyan-400/20 transition-all duration-700 shadow-xl">
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Member Pass</p>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">CHECK-IN <span className="text-cyan-400">QR</span></h1>
                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.2em]">ULIFTS Gym Access</p>
                </div>

                <div className="relative group/qr">
                    <div className="absolute -inset-4 bg-cyan-400/10 rounded-[2.5rem] blur-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-700" />
                    <div className="bg-white p-6 rounded-[2.5rem] relative z-10 shadow-[0_0_40px_rgba(34,211,238,0.1)] group-hover/qr:shadow-[0_0_60px_rgba(34,211,238,0.2)] transition-all">
                        {loading ? (
                            <div className="w-56 h-56 flex items-center justify-center">
                                <Spinner size="lg" />
                            </div>
                        ) : qrCode ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={qrCode} alt="Your QR Code" className="w-56 h-56 mix-blend-multiply" />
                        ) : (
                            <div className="w-56 h-56 flex items-center justify-center bg-zinc-50 rounded-3xl">
                                <QrCode size={56} className="text-zinc-200" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl px-6 py-3">
                        <p className="font-mono text-[11px] font-black text-white tracking-[0.3em]">{user?.member?.memberId}</p>
                    </div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-relaxed">
                        Present this QR code to the <span className="text-white">Scanner</span> <br />
                        Scan at the front desk for entry.
                    </p>
                </div>
            </Card>
        </div>
    );
}

