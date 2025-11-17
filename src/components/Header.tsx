import { motion } from 'framer-motion';
import { Camera, LogOut, Upload, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { RoleBadge } from './RoleBadge';
import { deleteCookie, GUEST_COOKIE_KEY } from '../utils/cookies';

interface HeaderProps {
    onUploadClick: () => void;
    photoCount: number;
}

export const Header = ({ onUploadClick, photoCount }: HeaderProps) => {
    const { user, setUser } = useUserStore();
    const displayName = user?.nickname || user?.name || '';
    const initials =
        displayName
            .split(' ')
            .map((part) => part.charAt(0))
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'M&P';

    const handleLogout = () => {
        if (confirm('Tem certeza que deseja sair do álbum?')) {
            setUser(null);
            deleteCookie(GUEST_COOKIE_KEY);
        }
    };

    return (
        <motion.header
            className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-[0_20px_80px_rgba(255,143,119,0.15)]"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 110, damping: 18 }}
        >
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex h-16 w-16 items-center justify-center">
                        <img
                            src="/Logo casamento_V1.png"
                            alt="Monograma Marina & Pedro"
                            className="h-14 w-14 object-contain"
                            loading="lazy"
                        />
                        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#ec6f72]" />
                    </div>
                    <div>
                        <p className="text-[13px] uppercase tracking-[0.3em] text-[#c46b58]">
                            Marina & Pedro
                        </p>
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fff2ee] px-3 py-1 text-xs text-[#c46b58]">
                            <Camera className="h-3.5 w-3.5" />
                            {photoCount} fotos
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {user && (
                        <div className="hidden flex-col items-end text-right sm:flex">
                            <span className="text-sm font-semibold text-[#2f3430]">
                                {displayName}
                            </span>
                            <RoleBadge role={user.role} size="sm" />
                        </div>
                    )}

                    <motion.button
                        onClick={onUploadClick}
                        className="inline-flex items-center gap-1 rounded-2xl border border-[#f7cfc0] bg-white px-3 py-2 text-sm font-semibold text-[#c46b58] shadow-sm hover:bg-[#fff5ef] sm:gap-2 sm:px-4 sm:py-2.5"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Upload className="h-5 w-5 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">Enviar fotos</span>
                    </motion.button>

                    <div className="flex items-center gap-2 rounded-2xl border border-[#f7d7cc] bg-white/70 px-3 py-2 shadow-inner">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffe8df] text-[#cf6f5c] font-semibold">
                            {initials}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-xl p-2 text-[#7e8b82] transition hover:bg-[#f6ded6]"
                            title="Sair"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};
