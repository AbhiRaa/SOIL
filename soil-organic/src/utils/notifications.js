import React, { useState, useEffect } from 'react';

function Notification({ message, duration = 3000, onClose, type = 'success' }) {
    const [visible, setVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true);
            setIsLeaving(false);
            
            const timer = setTimeout(() => {
                setIsLeaving(true);
                setTimeout(() => {
                    setVisible(false);
                    if (onClose) onClose();
                }, 300); // Wait for exit animation
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [message, duration, onClose]);

    if (!visible) return null;

    // Determine styling based on type
    const getTypeStyles = () => {
        switch (type) {
            case 'error':
                return {
                    bgGradient: 'from-red-500/90 to-red-600/90',
                    borderColor: 'border-red-400/30',
                    icon: '❌',
                    glow: 'shadow-red-500/20'
                };
            case 'warning':
                return {
                    bgGradient: 'from-orange-500/90 to-orange-600/90',
                    borderColor: 'border-orange-400/30',
                    icon: '⚠️',
                    glow: 'shadow-orange-500/20'
                };
            case 'info':
                return {
                    bgGradient: 'from-blue-500/90 to-blue-600/90',
                    borderColor: 'border-blue-400/30',
                    icon: 'ℹ️',
                    glow: 'shadow-blue-500/20'
                };
            case 'success':
            default:
                return {
                    bgGradient: 'from-green-500/90 to-green-600/90',
                    borderColor: 'border-green-400/30',
                    icon: '✅',
                    glow: 'shadow-green-500/20'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className={`fixed top-4 right-4 z-[110] ${isLeaving ? 'animate-slide-up' : 'animate-slide-down'}`}>
            {/* Backdrop blur for better visibility */}
            <div className="absolute inset-0 backdrop-blur-xl rounded-2xl"></div>
            
            {/* Main notification container */}
            <div className={`relative bg-gradient-to-r ${styles.bgGradient} backdrop-blur-md border ${styles.borderColor} rounded-2xl shadow-2xl ${styles.glow} overflow-hidden`}>
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-2 -left-2 w-20 h-20 bg-white rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white rounded-full blur-xl animate-pulse animation-delay-500"></div>
                </div>
                
                {/* Content */}
                <div className="relative px-6 py-4 flex items-center gap-4">
                    {/* Icon with animated background */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse"></div>
                        <div className="relative w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                            <span className="text-xl">{styles.icon}</span>
                        </div>
                    </div>
                    
                    {/* Message */}
                    <div className="flex-1 pr-2">
                        <p className="text-white font-medium text-base leading-tight">
                            {message}
                        </p>
                    </div>
                    
                    {/* Close button */}
                    <button 
                        onClick={() => {
                            setIsLeaving(true);
                            setTimeout(() => {
                                setVisible(false);
                                if (onClose) onClose();
                            }, 300);
                        }}
                        className="text-white/60 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-lg"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div 
                        className="h-full bg-white/30 origin-left animate-progress"
                        style={{ animationDuration: `${duration}ms` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default Notification;