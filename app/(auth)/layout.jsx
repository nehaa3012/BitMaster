
import React from 'react';

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020617]">
            {/* Dynamic Background Blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[140px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[140px] animate-pulse delay-700" />

            {/* Animated Light Trails */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent transform -rotate-12 blur-[1px]" />
                <div className="absolute top-3/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent transform rotate-12 blur-[1px]" />
            </div>

            {/* Subtle Grid Pattern Overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.05]"
                style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Auth Card Container with Glassmorphism */}
            <div className="relative z-10 w-full max-w-md p-6">
                <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] p-1 flex justify-center items-center overflow-hidden transition-all duration-500 hover:border-white/[0.15]">
                    <div className="w-full h-full p-1 ring-1 ring-inset ring-white/[0.05] rounded-[2.4rem]">
                        {children}
                    </div>
                </div>

                {/* Modern Footer Branding */}
                <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">
                            Secure Authentication • LeetCode Master
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
