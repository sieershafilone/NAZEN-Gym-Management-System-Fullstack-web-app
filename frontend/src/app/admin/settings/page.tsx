'use client';

import React from 'react';
import { authAPI, settingsAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Globe, Save } from 'lucide-react';
import { Card, Button, Input, Select } from '@/components/ui';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = React.useState('General Profile');
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);

    // Password update state
    const [passwordData, setPasswordData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [updatingPassword, setUpdatingPassword] = React.useState(false);

    // Mobile update state
    const [mobileData, setMobileData] = React.useState({
        currentMobile: '',
        newMobile: ''
    });
    const [updatingMobile, setUpdatingMobile] = React.useState(false);

    const [formData, setFormData] = React.useState({
        gymName: '',
        operationalEmail: '',
        primaryContact: '',
        timezone: 'IST',
        currencyUnit: 'INR',
        dateProtocol: 'DD/MM/YYYY',
    });

    // Notification settings state
    const [notifications, setNotifications] = React.useState({
        emailAlerts: true,
        smsAlerts: false,
        marketingEmails: false,
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch real user data
                const userResponse = await authAPI.getMe();
                if (userResponse.data.success) {
                    setMobileData(prev => ({
                        ...prev,
                        currentMobile: userResponse.data.data.mobile
                    }));
                }

                // Fetch real gym settings
                const settingsResponse = await settingsAPI.get();
                if (settingsResponse.data.success && settingsResponse.data.data) {
                    const data = settingsResponse.data.data;
                    setFormData({
                        gymName: data.gymName || '',
                        operationalEmail: data.email || '',
                        primaryContact: data.phone || '',
                        timezone: 'IST', // Assuming this isn't in DB yet or using default
                        currencyUnit: 'INR',
                        dateProtocol: 'DD/MM/YYYY',
                    });

                    if (data.notificationSettings) {
                        setNotifications({
                            emailAlerts: data.notificationSettings.emailAlerts ?? true,
                            smsAlerts: data.notificationSettings.smsAlerts ?? false,
                            marketingEmails: data.notificationSettings.marketingEmails ?? false,
                        });
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMobileData(prev => ({ ...prev, [name]: value }));
    };

    // ... (mobile and password update handlers omitted for brevity, they are unchanged)

    const handleUpdateMobile = async () => {
        if (!mobileData.newMobile) {
            toast.error('Please enter a new phone number');
            return;
        }

        if (mobileData.newMobile.length < 10) {
            toast.error('Please enter a valid phone number');
            return;
        }

        if (mobileData.newMobile === mobileData.currentMobile) {
            toast.error('New number must be different from current');
            return;
        }

        setUpdatingMobile(true);
        try {
            await authAPI.updateProfile({
                mobile: mobileData.newMobile
            });
            toast.success('Phone number updated successfully');
            setMobileData(prev => ({
                ...prev,
                currentMobile: prev.newMobile,
                newMobile: ''
            }));
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to update phone number';
            toast.error(message);
        } finally {
            setUpdatingMobile(false);
        }
    };

    const handleUpdateCredentials = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            toast.error('Please fill in all password fields');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setUpdatingPassword(true);
        try {
            await authAPI.updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success('Credentials updated successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Failed to update credentials';
            toast.error(message);
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await settingsAPI.update({
                gymName: formData.gymName,
                email: formData.operationalEmail,
                phone: formData.primaryContact,
                notificationSettings: notifications
            });
            toast.success('Settings saved successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { label: 'General Profile', icon: Globe },
        { label: 'Security & Access', icon: Shield },
        { label: 'Notification Matrix', icon: Bell },
        { label: 'System Prefs', icon: Settings },
    ];

    return (
        <div className="space-y-10 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <h1 className="text-5xl font-black text-white tracking-tighter sm:text-6xl">
                        System <span className="text-cyan-400 glow-text">Control</span>
                    </h1>
                    <p className="text-zinc-500 mt-3 font-medium tracking-widest uppercase text-[10px]">
                        Configure your gym's <span className="text-white">Digital Fingerprint</span> and preferences.
                    </p>
                </div>
                <Button
                    className="h-14 px-8 rounded-2xl group"
                    onClick={handleSave}
                    disabled={saving || loading}
                    loading={saving}
                >
                    <Save size={20} className="mr-3 group-hover:scale-110 transition-transform" />
                    Commit Protocols
                </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
                {/* Navigation Sidebar */}
                <div className="space-y-3">
                    {tabs.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => setActiveTab(item.label)}
                            className={`w-full flex items-center gap-5 px-8 py-5 rounded-[1.5rem] transition-all duration-500 border ${activeTab === item.label
                                ? 'bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)] scale-[1.02]'
                                : 'text-zinc-600 border-white/5 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={22} />
                            <span className="font-black text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Configuration Area */}
                <div className="lg:col-span-2 space-y-10">
                    {/* General Profile Section */}
                    {activeTab === 'General Profile' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <Card variant="default" className="space-y-12 p-12 border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                                <section>
                                    <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                        <div className="w-12 h-[1px] bg-cyan-400/30" />
                                        Identity Logic
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <Input
                                            label="Entity Name"
                                            name="gymName"
                                            value={formData.gymName}
                                            onChange={handleChange}
                                            placeholder="NAIZEN High Performance"
                                        />
                                        <Input
                                            label="Uplink Protocol"
                                            name="operationalEmail"
                                            value={formData.operationalEmail}
                                            onChange={handleChange}
                                            placeholder="hq@naizengym.com"
                                        />
                                        <Input
                                            label="Primary Link"
                                            name="primaryContact"
                                            value={formData.primaryContact}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                        />
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Temporal Zone</label>
                                            <select
                                                name="timezone"
                                                value={formData.timezone}
                                                onChange={handleChange}
                                                className="w-full h-14 px-6 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white appearance-none focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                                            >
                                                <option value="IST">(GMT+05:30) INDIA STANDARD TIME</option>
                                                <option value="UTC">(GMT+00:00) UNIVERSAL COORDINATED</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>

                                <section className="pt-12 border-t border-white/5">
                                    <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-4">
                                        <div className="w-12 h-[1px] bg-cyan-400/30" />
                                        Regional Parameters
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Value Metric</label>
                                            <select
                                                name="currencyUnit"
                                                value={formData.currencyUnit}
                                                onChange={handleChange}
                                                className="w-full h-14 px-6 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white appearance-none focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                                            >
                                                <option value="INR">INDIAN RUPEE (₹)</option>
                                                <option value="USD">US DOLLAR ($)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Chronology Format</label>
                                            <select
                                                name="dateProtocol"
                                                value={formData.dateProtocol}
                                                onChange={handleChange}
                                                className="w-full h-14 px-6 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white appearance-none focus:outline-none focus:border-cyan-400/50 transition-all duration-300"
                                            >
                                                <option value="DD/MM/YYYY">DD / MM / YYYY</option>
                                                <option value="MM/DD/YYYY">MM / DD / YYYY</option>
                                            </select>
                                        </div>
                                    </div>
                                </section>
                            </Card>
                        </motion.div>
                    )}

                    {/* Security Section */}
                    {activeTab === 'Security & Access' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            <Card variant="default" className="space-y-10 p-12 border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                                <h3 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">Command Clearance</h3>

                                <div className="space-y-8 pb-10 border-b border-white/5">
                                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Phone Link Update</h4>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <Input
                                            label="Current Uplink"
                                            value={mobileData.currentMobile}
                                            disabled
                                            className="opacity-30"
                                        />
                                        <Input
                                            label="New Uplink"
                                            name="newMobile"
                                            value={mobileData.newMobile}
                                            onChange={handleMobileChange}
                                            placeholder="+91..."
                                        />
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={handleUpdateMobile}
                                        loading={updatingMobile}
                                        disabled={updatingMobile || !mobileData.newMobile}
                                        className="h-12 rounded-xl px-10 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Warp Phone Number
                                    </Button>
                                </div>

                                <div className="space-y-8">
                                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Cipher Rotation</h4>
                                    <Input
                                        label="Current Cipher"
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="••••••••"
                                    />
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <Input
                                            label="New Cipher"
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                        />
                                        <Input
                                            label="Confirm Cipher"
                                            type="password"
                                            name="confirmNewPassword"
                                            value={passwordData.confirmNewPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                        onClick={handleUpdateCredentials}
                                        loading={updatingPassword}
                                        disabled={updatingPassword}
                                    >
                                        Recalibrate Credentials
                                    </Button>
                                </div>
                            </Card>

                            <Card variant="default" className="p-12 border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-10">Access History</h3>
                                <div className="space-y-4">
                                    {[
                                        { date: 'Today, 10:23 AM', ip: '192.168.1.1', device: 'Chrome / Windows', status: 'Injected' },
                                        { date: 'Yesterday, 8:45 PM', ip: '192.168.1.1', device: 'Chrome / Windows', status: 'Injected' },
                                        { date: 'Jan 15, 2:12 PM', ip: '142.25.12.5', device: 'Safari / iPhone', status: 'Rejected' },
                                    ].map((log, i) => (
                                        <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all">
                                            <div>
                                                <p className="text-sm font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{log.device}</p>
                                                <p className="text-[10px] text-zinc-600 font-bold mt-1 uppercase tracking-widest">{log.ip} • {log.date}</p>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'Injected' ? 'text-cyan-400 glow-text' : 'text-rose-500'}`}>{log.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Notifications Section */}
                    {activeTab === 'Notification Matrix' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <Card variant="default" className="p-12 border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                                <h3 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-10">Alert Configuration</h3>
                                <div className="space-y-6">
                                    {[
                                        { label: 'System Emails', desc: 'Receive daily summary reports via email', state: notifications.emailAlerts, key: 'emailAlerts' },
                                        { label: 'SMS Uplinks', desc: 'Urgent alerts for membership expiry/payments', state: notifications.smsAlerts, key: 'smsAlerts' },
                                        { label: 'Marketing Protocol', desc: 'Send automated promo campaigns to members', state: notifications.marketingEmails, key: 'marketingEmails' },
                                    ].map((item) => (
                                        <div key={item.key} className="flex items-center justify-between p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                            <div>
                                                <p className="font-black text-white uppercase text-xs tracking-widest mb-1">{item.label}</p>
                                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">{item.desc}</p>
                                            </div>
                                            <div
                                                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !item.state }))}
                                                className={`w-14 h-8 rounded-full p-1.5 cursor-pointer transition-all duration-500 ${item.state ? 'bg-cyan-400' : 'bg-white/5 border border-white/10'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-full shadow-2xl transform transition-transform duration-500 ${item.state ? 'translate-x-6 bg-black' : 'translate-x-0 bg-zinc-700'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* System Prefs Section */}
                    {activeTab === 'System Prefs' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <Card variant="default" className="p-12 border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-10">Data Retention</h3>
                                <div className="p-8 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-6 border-l-4 border-l-indigo-400">
                                    <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400"><Settings size={24} /></div>
                                    <div>
                                        <h4 className="font-black text-white text-sm uppercase tracking-widest">Automatic Archives</h4>
                                        <p className="text-[10px] text-indigo-200/40 mt-1 uppercase font-bold tracking-tight">System performs daily encrypted backups at 00:00 UTC.</p>
                                    </div>
                                </div>
                                <div className="space-y-6 mt-12">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-zinc-600">Core Volume</span>
                                        <span className="text-white">24.5 MB</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-zinc-600">Static Payload</span>
                                        <span className="text-white">1.2 GB / 50 GB</span>
                                    </div>
                                    <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden border border-white/5">
                                        <div className="bg-cyan-400 h-full w-[2%] glow-primary"></div>
                                    </div>
                                </div>
                            </Card>

                            <Card variant="default" className="p-12 flex items-center justify-between border-rose-500/20 bg-rose-500/5 rounded-[2.5rem]">
                                <div className="space-y-2">
                                    <h4 className="text-rose-500 font-black uppercase text-sm tracking-tighter">Nuclear Protocol</h4>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Permanently wipe all gym records and system data.</p>
                                </div>
                                <Button variant="secondary" className="h-12 px-8 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border-none text-[10px] font-black uppercase tracking-widest">
                                    Factory Reset
                                </Button>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

