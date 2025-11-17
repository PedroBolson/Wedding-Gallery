import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface UserState {
    user: User | null;
    setUser: (user: User | null) => void;
    isAuthenticated: boolean;
}

const FALLBACK_ROLE: User['role'] = 'convidado';

const withUserDefaults = (user: User | null): User | null => {
    if (!user) return null;
    const safeUser = user as User & {
        role?: User['role'];
        nickname?: User['nickname'];
        photoCount?: User['photoCount'];
        lastUploadAt?: User['lastUploadAt'];
    };

    return {
        ...safeUser,
        role: safeUser.role ?? FALLBACK_ROLE,
        nickname: safeUser.nickname ?? undefined,
        photoCount: safeUser.photoCount ?? 0,
        lastUploadAt: safeUser.lastUploadAt ?? null,
    };
};

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) =>
                set({
                    user: withUserDefaults(user),
                    isAuthenticated: !!user,
                }),
        }),
        {
            name: 'wedding-user-storage',
        }
    )
);
