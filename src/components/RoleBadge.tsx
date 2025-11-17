import { HeartHandshake, KeyRound, UserRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { UserRole } from '../types';

const roleConfig: Record<UserRole, { label: string; icon: LucideIcon; className: string }> = {
    convidado: {
        label: 'Convidado(a)',
        icon: UserRound,
        className: 'bg-[#fff1ed] text-[#c96a59]',
    },
    noivo: {
        label: 'Noivos',
        icon: HeartHandshake,
        className: 'bg-[#fef4d9] text-[#b78035]',
    },
    autorizado: {
        label: 'Autorizado(a)',
        icon: KeyRound,
        className: 'bg-[#edf7f2] text-[#2d6a48]',
    },
};

interface RoleBadgeProps {
    role: UserRole;
    size?: 'sm' | 'md';
}

export const RoleBadge = ({ role, size = 'md' }: RoleBadgeProps) => {
    const config = roleConfig[role] || roleConfig.convidado;
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full ${config.className} ${
                size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm'
            } font-medium`}
        >
            <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
            {role === 'noivo' ? 'Noivos' : config.label}
        </span>
    );
};
