'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CreditCard,
    Calendar,
    Dumbbell,
    TrendingUp,
    ImageIcon,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Bell,
    QrCode,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '@/store';
import { settingsAPI } from '@/lib/api';
import { Avatar, Button, Badge, BrandLogo } from '@/components/ui';
import { getInitials, getDaysRemaining } from '@/lib/utils';

const memberNavItems = [
    { href: '/member', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/member/membership', label: 'Membership', icon: CreditCard },
    { href: '/member/attendance', label: 'Attendance', icon: Calendar },
    { href: '/member/workouts', label: 'Workouts', icon: Dumbbell },
    { href: '/member/progress', label: 'Progress', icon: TrendingUp },
    { href: '/member/gallery', label: 'Gallery', icon: ImageIcon },
];

export default function MemberLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAuthenticated, isLoading } = useAuthStore();
    const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
    const [showUserMenu, setShowUserMenu] = useState(false);
    // Auth check
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        } else if (!isLoading && user?.role === 'ADMIN') {
            router.push('/admin');
        }
    }, [isLoading, isAuthenticated, user, router]);

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    }, [pathname, setSidebarOpen]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (isLoading || !isAuthenticated || user?.role !== 'MEMBER') {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/5 border-t-cyan-400" />
            </div>
        );
    }

    const membership = user.member?.memberships?.[0];
    const daysRemaining = membership ? getDaysRemaining(membership.endDate) : 0;

    return (
        <div className="min-h-screen bg-[#050505]">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full w-72 bg-[#080808]/60 backdrop-blur-2xl border-r border-white/5 z-50 transform transition-transform duration-500 ease-[0.16, 1, 0.3, 1] lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo Section */}
                <div className="h-20 md:h-32 flex items-center justify-between px-8 border-b border-white/5">
                    <Link href="/member" className="flex items-center gap-4">
                        <BrandLogo variant="default" />
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-zinc-600 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Membership Status */}
                {membership && (
                    <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                        <div className="bg-[#0D0D0D] border border-white/5 rounded-3xl p-5 group hover:border-cyan-400/20 transition-all duration-500">
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-3">{membership.plan?.name}</p>
                            <div className="flex items-center justify-between">
                                <Badge variant="info" className="bg-cyan-400/10 text-cyan-400 border-cyan-400/20 text-[8px] font-black tracking-widest px-3 py-1.5 rounded-xl">
                                    {membership.status}
                                </Badge>
                                <span className="text-[10px] text-white font-black uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                                    {daysRemaining}D REMAINING
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation Links */}
                <nav className="p-6 space-y-2 mt-4">
                    {memberNavItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/member' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                    ? 'bg-white/5 text-white border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.2)]'
                                    : 'text-zinc-500 hover:text-white hover:bg-white/[0.02]'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-white/5 bg-black/20 backdrop-blur-xl">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-zinc-600 hover:text-rose-400 hover:bg-rose-400/5 transition-all duration-300 group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>
                    </button>
                    <div className="mt-6 text-center">
                        <p className="text-[8px] font-black text-zinc-800 uppercase tracking-[0.4em]">© 2026 ULIFTS GYM</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="lg:pl-72">
                {/* Unified Top Header */}
                <header className="sticky top-0 z-30 h-20 md:h-32 bg-[#050505]/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-zinc-500 hover:text-white transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="space-y-1">
                            <h1 className="text-xl font-black text-white uppercase tracking-tighter hidden sm:block">
                                WELCOME, <span className="text-cyan-400">{user?.fullName?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em] hidden sm:block">Logged in successfully</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* QR Access */}
                        <Link
                            href="/member/qr"
                            className="h-12 w-12 flex items-center justify-center text-zinc-500 hover:text-cyan-400 hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 group"
                        >
                            <QrCode size={20} className="group-hover:scale-110 transition-transform" />
                        </Link>

                        {/* Notifications */}
                        <button className="relative h-12 w-12 flex items-center justify-center text-zinc-500 hover:text-cyan-400 hover:bg-white/5 border border-white/5 rounded-2xl transition-all duration-300 group">
                            <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#050505]" />
                        </button>

                        <div className="w-px h-8 bg-white/5 mx-2" />

                        {/* User Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-4 bg-[#0D0D0D] border border-white/5 hover:border-cyan-400/20 rounded-2xl pl-2 pr-5 py-2 transition-all duration-500 group"
                            >
                                <div className="p-0.5 rounded-xl border border-white/10 group-hover:border-cyan-400/30 transition-colors">
                                    <Avatar
                                        src={user?.profilePhoto}
                                        fallback={getInitials(user?.fullName || 'M')}
                                        className="h-10 w-10 rounded-[10px]"
                                    />
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest">{user?.fullName}</p>
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">{user?.member?.memberId}</p>
                                </div>
                                <ChevronDown size={14} className="text-zinc-600 group-hover:text-cyan-400 transition-colors" />
                            </button>

                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-4 w-60 bg-[#0D0D0D] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden z-50 p-2"
                                    >
                                        <Link
                                            href="/member/profile"
                                            className="flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black text-zinc-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                                        >
                                            My Profile
                                        </Link>
                                        <div className="h-px bg-white/5 mx-4 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-[10px] font-black text-rose-500 hover:bg-rose-500/5 transition-all uppercase tracking-widest"
                                        >
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 lg:p-12 max-w-[1600px] mx-auto min-h-[calc(100vh-6rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}

