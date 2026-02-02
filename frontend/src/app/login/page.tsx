'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Phone, Lock, Dumbbell } from 'lucide-react';
import { Button, Input, Card, BrandLogo } from '@/components/ui';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        mobile: '',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.mobile) {
            newErrors.mobile = 'Phone number is required';
        } else if (!/^(\+91)?[6-9]\d{9}$/.test(formData.mobile.replace(/\s/g, ''))) {
            newErrors.mobile = 'Enter a valid Indian phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const mobile = formData.mobile.startsWith('+91')
                ? formData.mobile
                : `+91${formData.mobile.replace(/\s/g, '')}`;

            const response = await authAPI.login({
                mobile,
                password: formData.password,
            });

            const { user, token } = response.data.data;
            setAuth(user, token);

            toast.success(`Welcome back, ${user.fullName}!`);

            // Redirect based on role
            if (user.role === 'ADMIN') {
                router.push('/admin');
            } else {
                router.push('/member');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* High-Performance Visual Overlays */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-[#050505] to-[#050505]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                {/* Logo Section */}
                <div className="flex justify-center mb-12 transform hover:scale-110 transition-transform duration-500">
                    <BrandLogo variant="large" className="scale-125" />
                </div>

                <Card variant="default" className="p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] backdrop-blur-3xl shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] mb-4">
                            Operational Entry
                        </h2>
                        <h3 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">
                            Access <span className="text-cyan-400">System</span>
                        </h3>
                        <p className="text-zinc-600 font-bold uppercase text-[8px] tracking-[0.2em] leading-relaxed max-w-[240px] mx-auto">
                            Secure terminal for <span className="text-white">Authorized</span> training subjects only.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                        <Input
                            label="IDENTIFIER (MOBILE)"
                            type="tel"
                            placeholder=""
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            error={errors.mobile}
                            icon={<Phone size={18} className="text-zinc-500" />}
                            className="bg-[#0D0D0D] border-white/5 focus:border-cyan-400/30 transition-all rounded-xl h-14"
                        />

                        <div className="relative group/pass">
                            <Input
                                label="CIPHER (PASSWORD)"
                                type={showPassword ? 'text' : 'password'}
                                placeholder=""
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                error={errors.password}
                                icon={<Lock size={18} className="text-zinc-500" />}
                                className="bg-[#0D0D0D] border-white/5 focus:border-cyan-400/30 transition-all rounded-xl h-14"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[2.4rem] text-zinc-600 hover:text-cyan-400 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-16 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-white text-black hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 transition-all mt-8"
                            size="lg"
                            loading={loading}
                        >
                            Execute Authentication
                        </Button>
                    </form>

                    <div className="mt-10 text-center pt-8 border-t border-white/5">
                        <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-widest">
                            No credentials detected?{' '} <br className="md:hidden" />
                            <Link href="/contact" className="text-cyan-400 hover:text-white transition-colors ml-1">
                                Reach Operations
                            </Link>
                        </p>
                    </div>
                </Card>

                {/* Footer Logistics */}
                <div className="mt-12 text-center">
                    <p className="text-zinc-800 font-black uppercase text-[8px] tracking-[0.4em]">
                        © 2026 NAIZEN SYSTEMS. ALL ARCHIVES SECURED.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

