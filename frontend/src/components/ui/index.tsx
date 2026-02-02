'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px] sm:text-xs rounded-full';

        const variants = {
            primary: 'bg-gradient-to-r from-cyan-400 to-indigo-500 text-black hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] hover:scale-[1.02] active:scale-[0.98]',
            secondary: 'bg-white/5 backdrop-blur-md text-white hover:bg-white/10 border border-white/10',
            outline: 'border-2 border-white/10 text-white hover:border-cyan-400/50 hover:text-cyan-400',
            ghost: 'text-zinc-400 hover:text-white hover:bg-white/5',
            danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20',
        };

        const sizes = {
            sm: 'px-4 py-2',
            md: 'px-6 py-3',
            lg: 'px-8 py-4',
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);
Button.displayName = 'Button';

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={cn(
                            'w-full px-5 py-3 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white placeholder-zinc-600',
                            'focus:outline-none focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/5',
                            'transition-all duration-300',
                            icon && 'pl-12',
                            error && 'border-red-500/50 focus:ring-red-500/10',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-2 text-xs text-red-500 ml-1">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

// Select Component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, options, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 ml-1">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    className={cn(
                        'w-full px-5 py-3 bg-[#0D0D0D] border border-white/5 rounded-2xl text-white appearance-none cursor-pointer',
                        'focus:outline-none focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/5',
                        'transition-all duration-300',
                        error && 'border-red-500/50 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="bg-[#0D0D0D]">
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="mt-2 text-xs text-red-500 ml-1">{error}</p>}
            </div>
        );
    }
);
Select.displayName = 'Select';

// Card Component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glow?: boolean;
    variant?: 'default' | 'glass' | 'outline';
    title?: string;
    icon?: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover, glow, variant = 'default', title, icon, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-3xl p-8 transition-all duration-500',
                    variant === 'default' && 'bg-[#0D0D0D] border border-white/5',
                    variant === 'glass' && 'glass',
                    variant === 'outline' && 'bg-transparent border-2 border-dashed border-white/10',
                    hover && 'hover:bg-[#121212] hover:border-white/10',
                    glow && 'hover:shadow-[0_0_50px_rgba(45,212,191,0.05)]',
                    className
                )}
                {...props}
            >
                {(title || icon) && (
                    <div className="flex items-center gap-4 mb-8">
                        {icon && <div className="p-3 bg-white/5 rounded-2xl text-cyan-400">{icon}</div>}
                        {title && <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>}
                    </div>
                )}
                {children}
            </div>
        );
    }
);
Card.displayName = 'Card';

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({
    className,
    variant = 'default',
    children,
    ...props
}) => {
    const variants = {
        default: 'bg-white/5 text-zinc-400 border border-white/10',
        success: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20',
        warning: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
        danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
        info: 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
        outline: 'bg-transparent text-zinc-300 border border-white/20',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

// Avatar Component
interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({
    className,
    src,
    alt,
    fallback,
    size = 'md',
    ...props
}) => {
    const sizes = {
        sm: 'w-8 h-8 text-[10px]',
        md: 'w-10 h-10 text-xs',
        lg: 'w-12 h-12 text-sm',
        xl: 'w-16 h-16 text-base',
    };

    return (
        <div
            className={cn(
                'relative rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-black overflow-hidden shadow-lg',
                sizes[size],
                className
            )}
            {...props}
        >
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                fallback
            )}
        </div>
    );
};

// Spinner Component
interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 'md' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-2 border-white/10 border-t-cyan-400',
                sizes[size],
                className
            )}
        />
    );
};

// Loading Overlay
export const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-6">
                <Spinner size="lg" />
                {message && <p className="text-zinc-500 font-medium tracking-widest uppercase text-xs">{message}</p>}
            </div>
        </div>
    );
};

// Empty State
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center glass-card rounded-[3rem]">
            {icon && <div className="p-5 bg-white/5 rounded-3xl text-zinc-600 mb-6">{icon}</div>}
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            {description && <p className="text-zinc-500 mb-8 max-w-sm mx-auto">{description}</p>}
            {action}
        </div>
    );
};

// Stat Card
interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: { value: number; positive: boolean };
    className?: string;
    color?: 'mint' | 'indigo' | 'rose' | 'amber';
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    trend,
    className,
    color = 'mint'
}) => {
    const colors = {
        mint: 'text-cyan-400 bg-cyan-400/10 blur-cyan-400/10 shadow-cyan-400/5',
        indigo: 'text-indigo-400 bg-indigo-400/10 blur-indigo-400/10 shadow-indigo-400/5',
        rose: 'text-rose-400 bg-rose-400/10 blur-rose-400/10 shadow-rose-400/5',
        amber: 'text-amber-400 bg-amber-400/10 blur-amber-400/10 shadow-amber-400/5',
    };

    return (
        <Card variant="default" className={cn('relative group overflow-hidden border-white/5', className)} hover glow>
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-20 ${colors[color].split(' ')[1]}`} />

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-6">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title}</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums">{value}</h3>
                    {trend && (
                        <div className={cn('inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black',
                            trend.positive ? 'bg-cyan-400/10 text-cyan-400' : 'bg-rose-500/10 text-rose-500')}>
                            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
                        </div>
                    )}
                </div>
                {icon && (
                    <div className={cn('p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl', colors[color].split(' ')[0], 'bg-white/5 border border-white/10')}>
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
};

export * from './BrandLogo';
