export default function Loading() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="relative">
                    <div className="animate-spin rounded-full h-20 w-20 border-2 border-white/5 border-t-cyan-400" />
                    <div className="absolute inset-0 blur-xl bg-cyan-400/20 animate-pulse rounded-full" />
                </div>
                <div className="text-center space-y-2">
                    <p className="text-white text-[10px] animate-pulse uppercase tracking-[0.6em] font-black">ULIFTS</p>
                    <p className="text-zinc-600 text-[8px] uppercase tracking-[0.3em] font-bold">Synchronizing...</p>
                </div>
            </div>
        </div>
    );
}
